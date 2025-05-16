import { Command } from '../../../../../packages/discord';
import type { DiscordContext } from '../../../../../packages/discord';

Command({
  name: 'ping',
  description: 'Ping the bot',
  checks: [
    async (ctx) => {
      // Example: Only allow if user is not a bot
      return !ctx.interaction.user.bot;
    },
  ],
  before: async (ctx) => {
    // Example: Log before command runs
    console.log('Before ping command');
  },
  after: async (ctx, result) => {
    // Example: Log after command runs
    console.log('After ping command, result:', result);
  },
});

export default async function (ctx: DiscordContext) {
    console.log("Hit")
  return 'Pong!';
} 