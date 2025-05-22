import type{ PluginContext } from '../../framework';
import { loadDiscordConfig, loadCommands, loadEvents, loadContextMenus } from './loader.js';
import { getClient, sendToChannel } from './client.js';
import { REST, Routes } from 'discord.js';
import { Permissions } from './types.js';
export { Intents, GatewayIntentBits } from './types.js';
export type { DiscordContext, CommandOptions } from './types.js';
export { sendToChannel } from './client.js';

// Command registration helper
export function Command(options: import('./types.js').CommandOptions) {
  return function (target: any) {
    target.commandOptions = options;
  };
}

// Discord option type mapping (string to number)
const OptionTypeMap: Record<string, number> = {
  subcommand: 1,
  subcommand_group: 2,
  string: 3,
  integer: 4,
  boolean: 5,
  user: 6,
  channel: 7,
  role: 8,
  mentionable: 9,
  number: 10,
  attachment: 11,
};

function resolveOptionType(type: string | number): number {
  if (typeof type === 'number') return type;
  return OptionTypeMap[type] ?? 3; // default to string if unknown
}

function mapOptions(options?: any[]): any[] {
  if (!options) return [];
  return options.map(opt => ({
    ...opt,
    type: resolveOptionType(opt.type),
    options: opt.options ? mapOptions(opt.options) : undefined,
  }));
}

function commandToAPI(cmd: any) {
  return {
    name: cmd.name,
    description: cmd.handler.commandOptions?.description || 'No description',
    type: 1, // 1 = ChatInput (slash command)
    options: mapOptions(cmd.handler.commandOptions?.options),
  };
}

function commandsEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;
  const sort = (arr: any[]) => arr.slice().sort((x, y) => x.name.localeCompare(y.name));
  const aSorted = sort(a);
  const bSorted = sort(b);
  for (let i = 0; i < aSorted.length; i++) {
    if (
      aSorted[i].name !== bSorted[i].name ||
      aSorted[i].description !== bSorted[i].description
    ) {
      return false;
    }
  }
  return true;
}

export async function discordPlugin(ctx: PluginContext) {
  const config = await loadDiscordConfig();
  const client = getClient(config);
  // Load commands
  const commands = await loadCommands();
  if (commands.length) {
    console.log(`[Breeze Discord] Registered commands:`);
    for (const cmd of commands) {
      const group = cmd.group ? `[${cmd.group}]` : '';
      console.log(`  /${cmd.name} ${group} (${cmd.rel})`);
    }
  } else {
    console.log('[Breeze Discord] No commands registered.');
  }
  // Auto-register commands with Discord
  const commandData = commands.map(commandToAPI);
  const rest = new REST({ version: '10' }).setToken(config.token);
  let current: any[] = [];
  try {
    current = (await rest.get(
      Routes.applicationCommands(config.clientId)
    )) as any[];
  } catch (e) {
    console.error('[Breeze Discord] Failed to fetch current commands:', e);
  }
  if (commandsEqual(commandData, current)) {
    console.log('[Breeze Discord] No command changes detected. Skipping Discord registration.');
  } else {
    try {
      console.log(`[Breeze Discord] Registering ${commandData.length} commands with Discord...`);
      await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commandData }
      );
      console.log('[Breeze Discord] Successfully registered commands with Discord!');
    } catch (error) {
      console.error('[Breeze Discord] Failed to register commands with Discord:', error);
    }
  }
  // Load events
  const events = await loadEvents();
  if (events.length) {
    console.log(`[Breeze Discord] Registered events:`);
    for (const evt of events) {
      console.log(`  ${evt.name} (${evt.file})`);
    }
    // Attach event handlers to client
    for (const evt of events) {
      client.on(evt.name, (...args: any[]) => evt.handler(client, ...args));
    }
  } else {
    console.log('[Breeze Discord] No events registered.');
  }
  // Load context menus
  const contextMenus = await loadContextMenus();
  if (contextMenus.length) {
    console.log(`[Breeze Discord] Registered context menus:`);
    for (const ctxm of contextMenus) {
      const type = ctxm.type ? `[${ctxm.type}]` : '';
      console.log(`  ${ctxm.name} ${type} (${ctxm.file})`);
    }
  } else {
    console.log('[Breeze Discord] No context menus registered.');
  }
  // Build command map
  const commandMap = new Map<string, any>();
  for (const cmd of commands) {
    commandMap.set(cmd.name, cmd.handler);
  }

  // Attach interactionCreate event
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const handler = commandMap.get(interaction.commandName);
    if (!handler) return;
    // Build options object from interaction.options
    const optionsObj: Record<string, any> = {};
    if (interaction.options && Array.isArray(handler.commandOptions?.options)) {
      for (const opt of handler.commandOptions.options) {
        const val = interaction.options.get(opt.name)?.value;
        if (val !== undefined) optionsObj[opt.name] = val;
      }
    }
    // Build context
    const ctx = {
      client,
      interaction,
      options: optionsObj,
      reply: (data: any) => interaction.reply(data),
      defer: () => interaction.deferReply(),
      followUp: (data: any) => interaction.followUp(data),
    };
    try {
      // Permission check (if defined)
      const perms = handler.commandOptions?.permissions;
      if (perms) {
        const member = interaction.member as any;
        const required = Array.isArray(perms) ? perms : [perms];
        // Only check if member.permissions is a PermissionsBitField
        const hasPerms = member?.permissions && typeof member.permissions.has === 'function';
        const missing = hasPerms
          ? required.filter((perm: string) => !member.permissions.has(Permissions[perm as keyof typeof Permissions]))
          : required;
        if (missing.length > 0) {
          await interaction.reply({ content: `You lack the required permissions: ${missing.join(', ')}`, ephemeral: true });
          return;
        }
      }
      // Run checks, before, after hooks if needed
      if (handler.commandOptions?.checks) {
        for (const check of handler.commandOptions.checks) {
          if (!(await check(ctx))) return;
        }
      }
      if (handler.commandOptions?.before) {
        await handler.commandOptions.before(ctx);
      }
      const result = await handler(ctx);
      if (result !== undefined && !interaction.replied && !interaction.deferred) {
        await ctx.reply(result);
      }
      if (handler.commandOptions?.after) {
        await handler.commandOptions.after(ctx, result);
      }
    } catch (err) {
      console.error('[Breeze Discord] Command error:', err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'An error occurred.', ephemeral: true });
      }
    }
  });
  // TODO: Wire up HTTP endpoint
  (ctx as any).discord = client;
}

export { Client } from './client.js'; 
