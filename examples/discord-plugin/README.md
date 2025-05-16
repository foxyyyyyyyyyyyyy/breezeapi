# Breeze Discord Plugin Example

This is a demo Breeze API project using the @breezejs/discord plugin.

## Setup

1. **Install dependencies:**
   ```
   bun install
   ```

2. **Configure your bot:**
   - Copy `src/discord.config.ts` to `.breeze/plugins/discord.config.ts`.
   - Fill in your bot token and public key in `.env.local` (see `.env.local.example`).

3. **Run the app:**
   ```
   bun run start
   ```

## What's Included

- `src/discord/commands/ping.ts` — Slash command `/ping` replies with "Pong!"
- `src/discord/events/ready.ts` — Logs when the bot is ready
- `src/discord/events/messageCreate.ts` — Replies "Pong!" to "ping" messages

## File Structure

- `src/discord/commands/` — Slash commands
- `src/discord/events/` — Event handlers
- `src/discord/context/` — Context menu commands (add your own)

## Notes
- Make sure your `.env.local` is **not** committed (see `.gitignore`).
- You can import the Discord client anywhere in your app:
  ```ts
  import { Client } from '@breezejs/discord';
  ```
- See the main plugin README for more details. 