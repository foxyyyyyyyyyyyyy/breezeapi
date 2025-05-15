# [Your Framework Name]

A modern full-stack TypeScript framework for Bun, focused on developer experience, performance, and type safety. Supports HTTP APIs, WebSockets, GraphQL/tRPC, and TCP services with file-based routing and Zod validation.

## Folder Structure

- **/framework**: The core framework source code (what you publish to npm).
- **/examples**: Example Bun projects that use the framework. Each subfolder is a full Bun app.
  - **/examples/basic-app/src**: The default demo/test app using the framework.

```
/framework
  /core
    context/
    router.ts
    ...
/examples
  /basic-app
    /src
      /api
      /tcp
      /trpc
    package.json
    bunfig.toml
    ...
```

## Example Usage (in examples/basic-app/src)

### HTTP Route
```ts
// examples/basic-app/src/api/users/[id]/route.ts
import { t } from '../../../../framework/core/zod';
export const GET = {
  schema: {
    params: t.object({ id: t.string() }),
    response: t.object({ id: t.string(), name: t.string() }),
  },
  async handler(ctx) {
    const { id } = ctx.params;
    return new Response(JSON.stringify({ id, name: 'Alice' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
```

### WebSocket Route
```ts
// examples/basic-app/src/api/chat/socket.ts
export function open(ws) {
  ws.send('Welcome!');
}
export function message(ws, msg) {
  ws.publish('chat', msg);
}
```

### TCP Handler
```ts
// examples/basic-app/src/tcp/echo/handler.ts
export function data(socket, data) {
  socket.write(data); // echo
}
```

### tRPC Router
```ts
// examples/basic-app/src/trpc/router.ts
import { t } from '../../../../framework/core/zod';
// import { initTRPC } from '@trpc/server';
// const trpc = initTRPC.context().create();
// export const appRouter = trpc.router({
//   hello: trpc.procedure.input(t.object({ name: t.string() })).query(({ input }) => {
//     return { greeting: `Hello, ${input.name}` };
//   }),
// });
export const appRouter = {};
```

## Getting Started
1. Install dependencies: `bun install`
2. Run dev server: `bun run framework/index.ts`

## License
MIT 