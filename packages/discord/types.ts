import { Client as DiscordClient, GatewayIntentBits, Interaction, CommandInteraction, Message, IntentsBitField } from 'discord.js';

/**
 * Intent groups for easy configuration. Use these in your .breeze/plugins/discord.config.ts.
 * Example: intents: [...Intents.Guilds, ...Intents.Messages]
 */
export type IntentGroup = keyof typeof Intents;
export const Intents = {
  Guilds: [GatewayIntentBits.Guilds],
  GuildMessages: [GatewayIntentBits.GuildMessages],
  MessageContent: [GatewayIntentBits.MessageContent],
  GuildMembers: [GatewayIntentBits.GuildMembers],
  GuildVoiceStates: [GatewayIntentBits.GuildVoiceStates],
  DirectMessages: [GatewayIntentBits.DirectMessages],
  /**
   * All message-related intents (for most bots, use this for full message support)
   * Includes: GuildMessages, DirectMessages, MessageContent
   */
  Messages: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  /**
   * All recommended intents for most bots
   */
  All: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
  ],
};

/**
 * Re-export of Discord.js GatewayIntentBits for custom intent selection.
 * Example: intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
 */
export { GatewayIntentBits };

export type DiscordPluginConfig = {
  token: string;
  clientId: string; // Required for command registration
  publicKey?: string; // Only needed for HTTP endpoint
  intents: (number | IntentGroup)[]; // Accepts both bit values and group names
  enableHttpInteractions?: boolean; // Default: false (Gateway only)
};

export type DiscordContext<T = {}> = {
  client: DiscordClient;
  interaction: CommandInteraction;
  reply: (data: any) => Promise<any>;
  defer: () => Promise<any>;
  followUp: (data: any) => Promise<any>;
} & T;

export type CommandOptions = {
  name: string;
  description: string;
  checks?: Array<(ctx: DiscordContext) => Promise<boolean> | boolean>;
  before?: (ctx: DiscordContext) => Promise<void> | void;
  after?: (ctx: DiscordContext, result: any) => Promise<void> | void;
  // Add more options as needed (e.g., permissions, cooldown, etc.)
};

export type CommandHandler = (ctx: DiscordContext) => any;
export type EventHandler = (client: DiscordClient, ...args: any[]) => any;
export type ContextMenuHandler = (ctx: DiscordContext) => any; 