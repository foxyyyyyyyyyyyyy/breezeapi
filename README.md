# Breeze Framework

A modern full-stack TypeScript framework for Bun, focused on developer experience, performance, and type safety. Supports HTTP APIs, WebSockets, tRPC, TCP services, and plugins with file-based routing and Zod validation.

---

## Getting Started

1. Install dependencies:
   ```sh
   bun install
   ```
2. Create an entry point (e.g., `src/index.ts`):
   ```ts
   import { createApp, docs } from '@breezeapi/core';

   const app = createApp({
     debug: true,
     port: 3000,
   });

   app.registerPlugin(docs({ http: true, tcp: true, ws: true, trpc: true }));

   app.start();
   ```
3. Run the dev server:
   ```sh
   bun run src/index.ts
   ```

---

## File-based Routing

| Protocol   | File Name    | Example Path                  | Description                    |
|------------|-------------|-------------------------------|--------------------------------|
| HTTP       | route.ts     | /routes/users/[id]/route.ts   | Handles HTTP requests          |
| WebSocket  | socket.ts    | /routes/chat/socket.ts        | Handles WebSocket connections  |
| TCP        | handler.ts   | /routes/echo/handler.ts       | Handles TCP socket connections |
| tRPC       | trpc.ts      | /routes/chat/trpc.ts          | Handles tRPC API endpoints     |

- Dynamic segments: `[param]` in folder names (e.g., `/users/[id]/route.ts`).

---

## Plugins

Breeze supports plugins for features like Discord bots, documentation generation, and more. 

---

## License
MIT
