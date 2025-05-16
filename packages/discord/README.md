# Breeze Discord Plugin

A Breeze-native Discord.js integration for Bun, inspired by Robo.js and modern best practices.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Quickstart](#quickstart)
- [Configuration](#configuration)
- [File Structure](#file-structure)
- [Command Definition](#command-definition)
- [Command Context](#command-context)
- [Event Handlers](#event-handlers)
- [Context Menus](#context-menus)
- [Intents](#intents)
- [Command Registration](#command-registration)
- [Gateway vs HTTP Endpoint](#gateway-vs-http-endpoint)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

---

## Features
- Unified, singleton Discord.js client (auto-proxy import)
- File-based commands, events, and context menus (`src/discord/`)
- Auto-grouped slash commands by folder
- Context menu and event handler auto-wiring
- **Gateway-first:** All bot logic via Discord Gateway (WebSocket)
- **Optional HTTP endpoint** for stateless/webhook integrations
- Smart handler context (`ctx.reply`, `ctx.defer`, etc.)
- Automatic command registration on API start
- Bun and Discord.js native (no shims)

---

## Installation

```sh
bun add discord.js @breezejs/discord
```

---

## Quickstart

1. **Create your config:**
   Create `.breeze/plugins/discord.config.ts` in your API project:

   ```ts
   import { Intents } from '@breezejs/discord';

   export default {
     token: process.env.DISCORD_TOKEN!,
     clientId: process.env.DISCORD_CLIENT_ID!,
     intents: [
       ...Intents.Guilds,
       ...Intents.GuildMessages,
       ...Intents.MessageContent,
     ],
   };
   ```

2. **Register the plugin:**
   ```ts
   import { createApp } from 'framework';
   import { discordPlugin } from '@breezejs/discord';

   (async () => {
     const app = await createApp();
     await app.registerPlugin(discordPlugin);
     await app.start();
   })();
   ```

3. **Add commands/events/context menus:**
   - `src/discord/commands/ping.ts`
   - `src/discord/events/messageCreate.ts`
   - `src/discord/context/user/hello.ts`

---

## Configuration

See [docs/intents.md](docs/intents.md) for intent groups and privileged intents.

- **token**: Your bot token (from .env.local, loaded by Bun)
- **clientId**: Your bot's application client ID (needed for command registration)
- **publicKey**: Only needed for HTTP endpoint (not required for Gateway-only bots)
- **intents**: Use `Intents` groups or list individual GatewayIntentBits
- **enableHttpInteractions**: Set to `true` to enable HTTP endpoint (default: false)

---

## File Structure

- `src/discord/commands/` — Slash commands (auto-grouped by folder)
- `src/discord/events/` — Event handlers (filename = event)
- `src/discord/context/` — Context menu commands

All folders are optional. If a folder does not exist, it is skipped.

---

## Command Definition

Use the `Command` decorator to define command metadata and options:

```ts
import { Command, DiscordContext } from '@breezejs/discord';

Command({
  name: 'ping',
  description: 'Ping the bot',
  checks: [async (ctx) => !ctx.interaction.user.bot],
});

export default async function (ctx: DiscordContext) {
  return 'Pong!';
}
```

See [docs/commands.md](docs/commands.md) for advanced command options, checks, and hooks.

---

## Command Context

The `ctx` object passed to your command handler includes:
- `client`: The Discord.js client
- `interaction`: The Discord.js CommandInteraction
- `reply(data)`: Smart reply helper
- `defer()`: Defers the interaction
- `followUp(data)`: Sends a follow-up message

You can extend `DiscordContext` with your own properties if needed.

---

## Event Handlers

Create a file in `src/discord/events/` named after the event (e.g. `messageCreate.ts`).

```ts
import type { Message } from 'discord.js';
export default (client, message: Message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
};
```

See [docs/events.md](docs/events.md) for more event patterns and tips.

---

## Context Menus

Create context menu commands in `src/discord/context/user/` or `src/discord/context/message/`.

See [docs/context-menus.md](docs/context-menus.md) for details.

---

## Intents

You can use grouped intents for ergonomic config:

```ts
import { Intents } from '@breezejs/discord';

export default {
  intents: [
    ...Intents.Messages, // includes GuildMessages, DirectMessages, MessageContent
  ],
};
```

See [docs/intents.md](docs/intents.md) for all groups and privileged intent info.

---

## Command Registration

Commands are automatically registered with Discord on every API start. If your commands change, the plugin will update Discord and remove old commands.

---

## Gateway vs HTTP Endpoint

- **Gateway (default):** All commands, buttons, context menus, etc. are handled via the Gateway (`interactionCreate` event). This is the standard for Discord bots.
- **HTTP endpoint:** Only needed for stateless/webhook integrations or advanced use cases. Not required for normal bots. Enable with `enableHttpInteractions: true` in your config.

---

## Troubleshooting

- **Commands not showing up?**
  - Make sure your bot has the correct `clientId` and `token` in config.
  - Wait a few minutes for Discord to propagate changes.
  - Try removing and re-inviting your bot if permissions changed.
- **Events not firing?**
  - Check your `intents` config. See [docs/intents.md](docs/intents.md).
  - Make sure you enabled privileged intents in the Discord Developer Portal if needed.
- **Application did not respond?**
  - Your handler did not reply or defer in time. Use `ctx.defer()` for slow commands.
- **Still stuck?**
  - See [docs/faq.md](docs/faq.md) for more help.

---

## Advanced Usage

- [Advanced command options, checks, hooks](docs/commands.md)
- [Event handler patterns](docs/events.md)
- [Context menu commands](docs/context-menus.md)
- [Intents and privileged intents](docs/intents.md)
- [FAQ & Troubleshooting](docs/faq.md)

---

## License
MIT 