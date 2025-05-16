# FAQ & Troubleshooting

## Commands not showing up in Discord
- Make sure your bot has the correct `clientId` and `token` in config.
- Wait a few minutes for Discord to propagate changes.
- Try removing and re-inviting your bot if permissions changed.
- Check for errors in your console during registration.

## Events not firing
- Check your `intents` config. See [intents.md](intents.md).
- Make sure you enabled privileged intents in the Discord Developer Portal.
- Some events (like `messageCreate`) require `MessageContent` intent.

## "Application did not respond"
- Your handler did not reply or defer in time. Use `ctx.defer()` for slow commands.
- Make sure your handler is being called (add a `console.log`).

## Permissions
- Your bot needs the right permissions in the server to read/send messages, manage roles, etc.
- If using context menus, make sure your bot has the right scopes when invited.

## Discord quirks
- Sometimes Discord caches commands. Try restarting your Discord client.
- Command changes may take a few minutes to propagate.

## Plugin-specific gotchas
- All handler folders (`commands`, `events`, `context`) are optional. If a folder does not exist, it is skipped.
- Commands are auto-registered on every API start. If you remove a command file, it will be removed from Discord.

## Still stuck?
- See [Event Handlers](events.md), [Intents](intents.md), or [Command Definition](commands.md) for more help.
- Ask in the Breeze community! 