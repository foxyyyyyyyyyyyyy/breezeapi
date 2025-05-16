import { Intents } from '../../../../packages/discord';

export default {
  // Discord bot token (keep this in your .env.local, not here!)
  token: process.env.DISCORD_TOKEN!,
  // Discord public key for interaction verification (for HTTP endpoint)
  publicKey: process.env.DISCORD_PUBLIC_KEY!,
  // Discord client ID
  clientId: process.env.DISCORD_CLIENT_ID!,
  // Required: Discord.js Gateway Intents
  intents: [
    ...Intents.All,
    ...Intents.GuildMessages,
    ...Intents.MessageContent,
    // Add more as needed, or use ...Intents.All
  ],
}; 