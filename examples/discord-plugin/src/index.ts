import { createApp } from '../../../framework';
import { discordPlugin } from '../../../packages/discord';

const app = await createApp();
await app.registerPlugin(discordPlugin);
await app.start();

// Make sure to set up your .breeze/plugins/discord.config.ts and .env.local 