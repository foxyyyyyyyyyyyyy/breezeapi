# Context Menu Commands

## File Structure
- Place context menu commands in `src/discord/context/user/` (for user context menus) or `src/discord/context/message/` (for message context menus).
- The filename (without extension) is the command name.

## Handler Signature
- Default export: `(ctx) => {}`
- `ctx` includes the Discord.js client and the interaction object.

Example (user context menu):
```ts
import type { DiscordContext } from '@breezejs/discord';
export default async function (ctx: DiscordContext) {
  // ctx.interaction is a UserContextMenuCommandInteraction
  await ctx.reply('Hello from context menu!');
}
```

## Types
- User context menus: `UserContextMenuCommandInteraction`
- Message context menus: `MessageContextMenuCommandInteraction`

## Registration
- Context menu commands are auto-registered with Discord on API start, just like slash commands.

## See Also
- [Command Definition](commands.md)
- [Event Handlers](events.md)
- [Intents](intents.md) 