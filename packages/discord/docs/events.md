# Event Handlers

## Overview

Event handlers in Breeze Discord are TypeScript files placed in the `src/discord/events/` directory. The filename (without extension) determines which Discord.js event it handles.

## Basic Usage

Create a file named after the event you want to handle. For example, `messageCreate.ts`:

```ts
import type { Message } from 'discord.js';

export default (message: Message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
};
```

## Event Parameters

Each event handler receives the event-specific parameters directly. Here are some common examples:

### Message Events

```ts
// messageCreate.ts
import type { Message } from 'discord.js';

export default (message: Message) => {
  // Handle new messages
};

// messageUpdate.ts
import type { Message, PartialMessage } from 'discord.js';

export default (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
  // Handle message updates
};
```

### Member Events

```ts
// guildMemberAdd.ts
import type { GuildMember } from 'discord.js';

export default (member: GuildMember) => {
  // Handle new members
};

// guildMemberUpdate.ts
import type { GuildMember, PartialGuildMember } from 'discord.js';

export default (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
  // Handle member updates
};
```

### Voice Events

```ts
// voiceStateUpdate.ts
import type { VoiceState } from 'discord.js';

export default (oldState: VoiceState, newState: VoiceState) => {
  // Handle voice state changes
};
```

## Accessing the Client

If you need access to the Discord.js client in your event handler, you can import it directly:

```ts
import { Client } from '@breezejs/discord';

export default (message: Message) => {
  // Use Client here
  Client.channels.cache.get('some-channel-id');
};
```

## Error Handling

Event handlers are automatically wrapped in try-catch blocks. If an error occurs, it will be logged to the console with the event name.

## Available Events

Here are some commonly used events:

- `messageCreate`: New messages
- `messageUpdate`: Message edits
- `messageDelete`: Message deletions
- `guildMemberAdd`: New members
- `guildMemberRemove`: Members leaving
- `guildMemberUpdate`: Member updates
- `voiceStateUpdate`: Voice state changes
- `channelCreate`: New channels
- `channelDelete`: Channel deletions
- `channelUpdate`: Channel updates
- `roleCreate`: New roles
- `roleDelete`: Role deletions
- `roleUpdate`: Role updates
- `guildBanAdd`: User banned
- `guildBanRemove`: User unbanned
- `interactionCreate`: Slash commands, buttons, etc.

For a complete list of events and their parameters, see the [Discord.js documentation](https://discord.js.org/#/docs/main/stable/class/Client).

## Best Practices

1. **Type Safety**: Always import and use the correct types from discord.js for your event parameters.
2. **Error Handling**: Use try-catch blocks for critical operations within your event handlers.
3. **Async/Await**: Use async/await for asynchronous operations.
4. **Performance**: Keep event handlers lightweight and avoid blocking operations.

## Example: Complex Event Handler

```ts
// guildMemberUpdate.ts
import type { GuildMember, PartialGuildMember } from 'discord.js';

export default async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
  try {
    // Check if nickname changed
    if (oldMember.nickname !== newMember.nickname) {
      console.log(`${newMember.user.tag} changed nickname from ${oldMember.nickname} to ${newMember.nickname}`);
    }
    
    // Check if roles changed
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    
    if (!oldRoles.equals(newRoles)) {
      const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
      
      if (addedRoles.size > 0) {
        console.log(`Added roles to ${newMember.user.tag}: ${addedRoles.map(r => r.name).join(', ')}`);
      }
      
      if (removedRoles.size > 0) {
        console.log(`Removed roles from ${newMember.user.tag}: ${removedRoles.map(r => r.name).join(', ')}`);
      }
    }
  } catch (error) {
    console.error('Error in guildMemberUpdate handler:', error);
  }
};
```

## See Also
- [Intents](intents.md)
- [Command Definition](commands.md)
- [FAQ](faq.md)
