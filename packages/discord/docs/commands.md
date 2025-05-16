# Advanced Command Usage

## Command Options

You can use the `Command` decorator to add metadata and hooks to your command handler:

```ts
import { Command } from '@breezejs/discord';

Command({
  name: 'ban',
  description: 'Ban a user',
  checks: [async (ctx) => ctx.interaction.member.permissions.has('BanMembers')],
  before: async (ctx) => console.log('About to ban'),
  after: async (ctx, result) => console.log('Ban result:', result),
});

export default async function (ctx) {
  // ...
}
```

### Supported Options
- `name` (string, required): Command name (used for `/name`)
- `description` (string, required): Command description
- `checks` (array of async functions): Each check receives `ctx`. If any return false, the command is not run.
- `before` (async function): Runs before the command handler.
- `after` (async function): Runs after the command handler.

## Return Values
- If your handler returns a string or object, it is sent as a reply (unless you already replied/deferred).
- If you need to defer, call `ctx.defer()` early.

## Error Handling
- If your handler throws, the plugin logs the error and replies with a generic error message (unless already replied).

## Extending Context
You can extend the `DiscordContext` type for your own helpers:

```ts
import type { DiscordContext } from '@breezejs/discord';

export default async function (ctx: DiscordContext & { myHelper: () => void }) {
  ctx.myHelper();
}
```

## See Also
- [Command Context](../README.md#command-context)
- [Event Handlers](events.md)
- [Troubleshooting](faq.md) 