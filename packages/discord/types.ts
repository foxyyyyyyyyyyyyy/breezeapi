import { Client as DiscordClient, GatewayIntentBits, Interaction, CommandInteraction, Message, IntentsBitField, PermissionsBitField } from 'discord.js';

/**
 * Intent groups for easy configuration. Use these in your .breeze/plugins/discord.config.ts.
 * Example: intents: [...Intents.Guilds, ...Intents.Messages]
 */
export type IntentGroup = keyof typeof Intents;
export const Intents = {
  /**
   * All guild-related events (channels, roles, threads, stage instances, etc.)
   */
  Guilds: [GatewayIntentBits.Guilds],
  /**
   * Guild member events (add, update, remove, thread members update)
   * Privileged intent
   */
  GuildMembers: [GatewayIntentBits.GuildMembers],
  /**
   * Guild moderation events (audit log, bans)
   */
  GuildModeration: [GatewayIntentBits.GuildModeration],
  /**
   * Guild expressions (emojis, stickers, soundboard)
   */
  GuildExpressions: [GatewayIntentBits.GuildExpressions],
  /**
   * Guild integrations (integrations, webhooks)
   */
  GuildIntegrations: [GatewayIntentBits.GuildIntegrations],
  /**
   * Guild webhooks
   */
  GuildWebhooks: [GatewayIntentBits.GuildWebhooks],
  /**
   * Guild invites
   */
  GuildInvites: [GatewayIntentBits.GuildInvites],
  /**
   * Guild voice state events
   */
  GuildVoiceStates: [GatewayIntentBits.GuildVoiceStates],
  /**
   * Guild presences (online status, activities)
   * Privileged intent
   */
  GuildPresences: [GatewayIntentBits.GuildPresences],
  /**
   * Guild message events (create, update, delete, bulk delete)
   */
  GuildMessages: [GatewayIntentBits.GuildMessages],
  /**
   * Guild message reactions (add, remove, remove all, remove emoji)
   */
  GuildMessageReactions: [GatewayIntentBits.GuildMessageReactions],
  /**
   * Guild message typing events
   */
  GuildMessageTyping: [GatewayIntentBits.GuildMessageTyping],
  /**
   * Direct message events (create, update, delete, channel pins update)
   */
  DirectMessages: [GatewayIntentBits.DirectMessages],
  /**
   * Direct message reactions (add, remove, remove all, remove emoji)
   */
  DirectMessageReactions: [GatewayIntentBits.DirectMessageReactions],
  /**
   * Direct message typing events
   */
  DirectMessageTyping: [GatewayIntentBits.DirectMessageTyping],
  /**
   * Message content (enables content, embeds, attachments, components fields)
   * Privileged intent
   */
  MessageContent: [GatewayIntentBits.MessageContent],
  /**
   * Guild scheduled events (create, update, delete, user add/remove)
   */
  GuildScheduledEvents: [GatewayIntentBits.GuildScheduledEvents],
  /**
   * Auto moderation configuration (rule create, update, delete)
   */
  AutoModerationConfiguration: [GatewayIntentBits.AutoModerationConfiguration],
  /**
   * Auto moderation execution (action execution)
   */
  AutoModerationExecution: [GatewayIntentBits.AutoModerationExecution],
  /**
   * Guild message polls (vote add, vote remove)
   */
  GuildMessagePolls: [GatewayIntentBits.GuildMessagePolls],
  /**
   * Direct message polls (vote add, vote remove)
   */
  DirectMessagePolls: [GatewayIntentBits.DirectMessagePolls],
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
   * All non-privileged intents (recommended for most bots, does NOT include GuildMembers, GuildPresences, MessageContent)
   * Use this if you want all events except those requiring privileged access in the Discord Developer Portal.
   */
  AllDefault: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.DirectMessagePolls,
  ],
  /**
   * All available intents (use with caution, may require privileged intents enabled)
   */
  All: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.DirectMessagePolls,
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
  options: Record<string, any>;
  reply: (data: any) => Promise<any>;
  defer: () => Promise<any>;
  followUp: (data: any) => Promise<any>;
} & T;

/**
 * Represents a single option for a slash command (compatible with Discord.js API)
 */
export type CommandOption = {
  name: string;
  description: string;
  type: number | string; // Accepts Discord.js API type or string alias (e.g. 'boolean', 'string', etc.)
  required?: boolean;
  choices?: Array<{ name: string; value: string | number }>;
  // Add more fields as needed (autocomplete, min/max, etc.)
};

/**
 * Simple mapping of permission names to Discord.js PermissionsBitField flags for ergonomic use.
 */
export const Permissions = {
  CreateInstantInvite: PermissionsBitField.Flags.CreateInstantInvite,
  KickMembers: PermissionsBitField.Flags.KickMembers,
  BanMembers: PermissionsBitField.Flags.BanMembers,
  Administrator: PermissionsBitField.Flags.Administrator,
  ManageChannels: PermissionsBitField.Flags.ManageChannels,
  ManageGuild: PermissionsBitField.Flags.ManageGuild,
  AddReactions: PermissionsBitField.Flags.AddReactions,
  ViewAuditLog: PermissionsBitField.Flags.ViewAuditLog,
  PrioritySpeaker: PermissionsBitField.Flags.PrioritySpeaker,
  Stream: PermissionsBitField.Flags.Stream,
  ViewChannel: PermissionsBitField.Flags.ViewChannel,
  SendMessages: PermissionsBitField.Flags.SendMessages,
  SendTTSMessages: PermissionsBitField.Flags.SendTTSMessages,
  ManageMessages: PermissionsBitField.Flags.ManageMessages,
  EmbedLinks: PermissionsBitField.Flags.EmbedLinks,
  AttachFiles: PermissionsBitField.Flags.AttachFiles,
  ReadMessageHistory: PermissionsBitField.Flags.ReadMessageHistory,
  MentionEveryone: PermissionsBitField.Flags.MentionEveryone,
  UseExternalEmojis: PermissionsBitField.Flags.UseExternalEmojis,
  ViewGuildInsights: PermissionsBitField.Flags.ViewGuildInsights,
  Connect: PermissionsBitField.Flags.Connect,
  Speak: PermissionsBitField.Flags.Speak,
  MuteMembers: PermissionsBitField.Flags.MuteMembers,
  DeafenMembers: PermissionsBitField.Flags.DeafenMembers,
  MoveMembers: PermissionsBitField.Flags.MoveMembers,
  UseVAD: PermissionsBitField.Flags.UseVAD,
  ChangeNickname: PermissionsBitField.Flags.ChangeNickname,
  ManageNicknames: PermissionsBitField.Flags.ManageNicknames,
  ManageRoles: PermissionsBitField.Flags.ManageRoles,
  ManageWebhooks: PermissionsBitField.Flags.ManageWebhooks,
  ManageEmojisAndStickers: PermissionsBitField.Flags.ManageEmojisAndStickers,
  UseApplicationCommands: PermissionsBitField.Flags.UseApplicationCommands,
  RequestToSpeak: PermissionsBitField.Flags.RequestToSpeak,
  ManageEvents: PermissionsBitField.Flags.ManageEvents,
  ManageThreads: PermissionsBitField.Flags.ManageThreads,
  CreatePublicThreads: PermissionsBitField.Flags.CreatePublicThreads,
  CreatePrivateThreads: PermissionsBitField.Flags.CreatePrivateThreads,
  UseExternalStickers: PermissionsBitField.Flags.UseExternalStickers,
  SendMessagesInThreads: PermissionsBitField.Flags.SendMessagesInThreads,
  UseEmbeddedActivities: PermissionsBitField.Flags.UseEmbeddedActivities,
  ModerateMembers: PermissionsBitField.Flags.ModerateMembers,
  ViewCreatorMonetizationAnalytics: PermissionsBitField.Flags.ViewCreatorMonetizationAnalytics,
  UseSoundboard: PermissionsBitField.Flags.UseSoundboard,
  UseExternalSounds: PermissionsBitField.Flags.UseExternalSounds,
  SendVoiceMessages: PermissionsBitField.Flags.SendVoiceMessages,
};

export type CommandOptions = {
  name: string;
  description: string;
  options?: CommandOption[];
  permissions?: string | string[]; // Friendly permission names, e.g. 'ManageChannels' or ['BanMembers', ...]
  checks?: Array<(ctx: DiscordContext) => Promise<boolean> | boolean>;
  before?: (ctx: DiscordContext) => Promise<void> | void;
  after?: (ctx: DiscordContext, result: any) => Promise<void> | void;
  // Add more options as needed (e.g., permissions, cooldown, etc.)
};

export type CommandHandler = (ctx: DiscordContext) => any;
export type EventHandler = (client: DiscordClient, ...args: any[]) => any;
export type ContextMenuHandler = (ctx: DiscordContext) => any; 