# Intents

## Intent Groups

For ergonomic configuration, use grouped intents:

```ts
import { Intents } from '@breezejs/discord';

export default {
  intents: [
    ...Intents.Messages, // includes GuildMessages, DirectMessages, MessageContent
  ],
};
```

### Available Groups
- `Intents.Guilds`
- `Intents.GuildMessages`
- `Intents.MessageContent`
- `Intents.GuildMembers`
- `Intents.GuildVoiceStates`
- `Intents.DirectMessages`
- `Intents.Messages` (all message-related)
- `Intents.All` (all recommended)

You can also use raw GatewayIntentBits if needed.

## Privileged Intents
Some events require privileged intents:
- `GUILD_MEMBERS` (for member events)
- `MESSAGE_CONTENT` (for message content)

Enable these in the Discord Developer Portal under your bot's settings.

## Troubleshooting
- If your event handler is not firing, check your `intents` config and make sure you enabled privileged intents in the Developer Portal.
- See [RoboJS event docs](https://robojs.dev/discord-bots/events) for more info.

## See Also
- [Event Handlers](events.md)
- [Command Definition](commands.md)
- [FAQ](faq.md) 