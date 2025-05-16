import { Client as DiscordClient, GatewayIntentBits, ChannelType } from 'discord.js';
import type { IntentGroup } from './types.js';
import { Intents } from './types.js';

let client: DiscordClient | null = null;
let ready = false;

export const Client = new Proxy({}, {
  get(_target, prop) {
    if (!client) throw new Error('Discord Client not initialized yet.');
    // @ts-ignore
    return client[prop];
  }
}) as DiscordClient;

function resolveIntents(intents: (number | IntentGroup)[]): number[] {
  const bits: number[] = [];
  for (const intent of intents) {
    if (typeof intent === 'string' && Intents[intent]) {
      bits.push(...Intents[intent]);
    } else if (typeof intent === 'number') {
      bits.push(intent);
    }
  }
  // Remove duplicates
  return Array.from(new Set(bits));
}

export function getClient(config: { token: string, intents: any[], publicKey?: string }) {
  if (!client) {
    client = new DiscordClient({ intents: resolveIntents(config.intents) });
    if (config.publicKey) (client as any).publicKey = config.publicKey;
    client.once('ready', () => {
      ready = true;
      if (client && client.user) {
        console.log(`[Breeze Discord] Bot started as @${client.user.tag} (ID: ${client.user.id})`);
      } else {
        console.log('[Breeze Discord] Bot started (no user info)');
      }
    });
    client.login(config.token);
  }
  return client;
}

// Helper: Send a message to a channel by ID (default: only text channels with .send)
export async function sendToChannel(
  channelId: string,
  message: string,
  opts?: { allow?: ChannelType[] }
) {
  const channel = await Client.channels.fetch(channelId);
  if (!channel) throw new Error('Channel not found');
  if (
    channel.isTextBased() &&
    'send' in channel &&
    (!opts?.allow || opts.allow.includes(channel.type))
  ) {
    // @ts-ignore
    return channel.send(message);
  }
  throw new Error('Channel is not a text-based channel with send()');
} 