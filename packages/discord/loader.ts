import { join, relative, sep } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';

// Helper: Recursively scan a directory, ignoring folders in parentheses
function scanDir(dir: string, ignoreParens = true): string[] {
  if (!existsSync(dir)) return [];
  let results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (ignoreParens && /^\(.+\)$/.test(entry)) continue;
      results = results.concat(scanDir(full, ignoreParens));
    } else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
}

// Helper: Get command group and name from file path
function getCommandMeta(baseDir: string, file: string) {
  const rel = relative(baseDir, file).replace(/\\/g, '/');
  const parts = rel.split('/');
  const name = parts.pop()!.replace(/\.(ts|js)$/, '');
  // Ignore folders in parentheses for grouping
  const groups = parts.filter(p => !/^\(.+\)$/.test(p));
  return {
    group: groups.join(' '),
    name,
    rel,
    file
  };
}

// Commands: Build tree, auto-group by folder, ignore (parens) folders
export async function loadCommands(baseDir = 'src/discord/commands') {
  const files = scanDir(baseDir);
  const commands: any[] = [];
  for (const file of files) {
    const meta = getCommandMeta(baseDir, file);
    // Dynamic import
    const mod = await import(join(process.cwd(), file));
    commands.push({
      ...meta,
      handler: mod.default || mod,
    });
  }
  return commands;
}

// Events: Map filename or parent folder to event name
export async function loadEvents(baseDir = 'src/discord/events') {
  const files = scanDir(baseDir, false);
  const events: any[] = [];
  for (const file of files) {
    // Get relative path from baseDir
    const rel = relative(baseDir, file).replace(/\\/g, '/');
    const parts = rel.split('/');
    let name;
    if (parts.length > 1) {
      // File is in a subfolder: use the first folder as the event name
      name = parts[0];
    } else {
      // File is directly under events: use filename as event name
      name = parts[0].replace(/\.(ts|js)$/, '');
    }
    const mod = await import(join(process.cwd(), file));
    events.push({
      name,
      file,
      handler: mod.default || mod,
    });
  }
  return events;
}

// Context Menus: Map filename to context menu name/type
export async function loadContextMenus(baseDir = 'src/discord/context') {
  const files = scanDir(baseDir, false);
  const contexts: any[] = [];
  for (const file of files) {
    const rel = relative(baseDir, file).replace(/\\/g, '/');
    const parts = rel.split('/');
    const name = parts.pop()!.replace(/\.(ts|js)$/, '');
    // Type: user or message (by subfolder), or undefined
    const type = parts[0] || undefined;
    const mod = await import(join(process.cwd(), file));
    contexts.push({
      name,
      type,
      file,
      handler: mod.default || mod,
    });
  }
  return contexts;
}

// Intent suggestion helper
export async function suggestIntents() {
  // Analyze loaded events and commands to suggest intents
  const events = await loadEvents();
  const eventNames = events.map(e => e.name);
  const intents = new Set();
  // Map event names to required intents (simplified)
  const eventIntentMap: Record<string, string[]> = {
    messageCreate: ['GuildMessages', 'MessageContent'],
    guildMemberAdd: ['GuildMembers'],
    guildMemberRemove: ['GuildMembers'],
    voiceStateUpdate: ['GuildVoiceStates'],
    // Add more mappings as needed
  };
  for (const name of eventNames) {
    if (eventIntentMap[name]) {
      for (const intent of eventIntentMap[name]) intents.add(intent);
    }
  }
  // Always recommend Guilds intent
  intents.add('Guilds');
  return Array.from(intents);
}

// Config loader (unchanged)
export async function loadDiscordConfig() {
  // Dynamic import for config file
  try {
    const config = await import(process.cwd() + '/.breeze/plugins/discord.config.ts');
    return config.default || config;
  } catch (e) {
    throw new Error('Could not load Discord config: ' + e);
  }
} 