# Breeze Framework Documentation

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

## 1. File-based Routing

Your framework uses a file-based routing system. Each protocol (HTTP, WebSocket, TCP, tRPC) is mapped to a specific file in the route directory:

| Protocol   | File Name      | Example Path                        | Description                        |
|------------|---------------|-------------------------------------|------------------------------------|
| HTTP       | `route.ts`    | `/routes/users/[id]/route.ts`       | Handles HTTP requests              |
| WebSocket  | `socket.ts`   | `/routes/chat/socket.ts`            | Handles WebSocket connections      |
| TCP        | `handler.ts`  | `/tcp/echo/handler.ts`              | Handles TCP socket connections     |
| tRPC       | `trpc.ts`     | `/routes/chat/trpc.ts`              | Handles tRPC API endpoints         |

- Dynamic segments are supported using `[param]` in the directory name (e.g., `/users/[id]/route.ts`).

---

## 2. Creating HTTP Routes

Create a `route.ts` file in your desired route directory.  
Export functions named after HTTP methods (e.g., `GET`, `POST`, `PUT`, `DELETE`).

**Example: `/routes/users/[id]/route.ts`**
```ts
import { t, HttpContext } from '@breezeapi/core';

export const GET_config = {
  params: t.object({ id: t.string() }),
  querys: t.object({ name: t.string() }),
  response: t.object({
    id: t.string(),
    name: t.string(),
    theme: t.string().optional(),
    ctx: t.any().optional(),
  }),
};

export async function GET(ctx: HttpContext) {
  // Access params: ctx.params.id
  // Access query: ctx.querys.name
  return Response.json({ id: ctx.params.id, name: ctx.querys.name, theme: 'dark' });
}
```
- **Config objects** (`GET_config`, etc.) allow you to define validation for params, query, and response using Zod.

---

## 3. Creating WebSocket Routes

Create a `socket.ts` file in your route directory.  
Export handler functions: `open`, `message`, `close`, `error`.

**Example: `/routes/chat/socket.ts`**
```ts
export function open(ctx) {
  // Called when a new WebSocket connection is opened
}

export function message(ctx, data) {
  // Called when a message is received
}

export function close(ctx, code, reason) {
  // Called when the connection is closed
}

export function error(ctx, error) {
  // Called on error
}
```
- The `ctx` is a `WebSocketContext` instance (see below).

---

## 4. Creating TCP Routes

Create a `handler.ts` file in your TCP directory.  
Export handler functions: `open`, `data`, `close`, `error`.

**Example: `/tcp/echo/handler.ts`**
```ts
export function open(ctx) {
  // Called when a new TCP connection is opened
}

export function data(ctx, data) {
  // Called when data is received
}

export function close(ctx) {
  // Called when the connection is closed
}

export function error(ctx, error) {
  // Called on error
}
```
- The `ctx` is a `TcpSocketContext` instance.

---

## 5. Creating tRPC Routes

Create a `trpc.ts` file in your route directory.  
Export a tRPC router as `router` (and optionally a `createContext`).

**Example: `/routes/chat/trpc.ts`**
```ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router({
  hello: t.procedure.query(() => 'Hello from chat tRPC!'),
});

export const createContext = async (req: Request) => ({});
```
- The framework will automatically wire up `/chat/trpc` to this router using tRPC's official fetch adapter.

---

## 6. Context Objects

### HTTP Context (`HttpContext`)
- Provided to all HTTP route handlers.
- Properties:
  - `req`: The original `Request` object.
  - `url`, `method`, `headers`
  - `params`: Route parameters (from `[param]` segments)
  - `querys`: Query parameters (parsed)
  - `cookies`: Parsed cookies
  - `db`: Placeholder for ORM/database clients

### WebSocket Context (`WebSocketContext`)
- Provided to all WebSocket handlers.
- Properties:
  - `raw`: The raw WebSocket object
  - `id`: Unique connection ID
  - `params`: Route parameters
  - `url`: The request URL
  - Pub/Sub helpers: `subscribe`, `unsubscribe`, `publish`

### TCP Context (`TcpSocketContext`)
- Provided to all TCP handlers.
- Properties:
  - `socket`: The raw TCP socket
  - `id`, `localAddress`, `localPort`, `remoteAddress`, `remotePort`
  - `params`: Route parameters

---

## 7. Middleware System

Breeze supports a powerful, file-based middleware system inspired by Next.js:

- **Middleware functions** are of the form:
```ts
(ctx, next) => Promise<Response>
```

### Global Middleware
- Place any `.ts` or `.js` file exporting a default middleware function in a `middleware/` folder at the root of your `src` directory (e.g. `src/middleware/`).
- This is fully optional: if the folder does not exist, no global middleware will run.
- All global middleware will run for every request, in the order of the files in that folder.

**Example: `src/middleware/logger.ts`**
```ts
export default async (ctx, next) => {
  console.log('Request:', ctx.req.url);
  return next();
};
```

### Per-directory Middleware
- Add a `middleware.ts` file to any route directory (e.g. `routes/users/middleware.ts`).
- This middleware will run for all routes inside that directory (and its subdirectories), after global middleware.

**Example: `routes/users/middleware.ts`**
```ts
export default async (ctx, next) => {
  if (!ctx.user) return new Response('Unauthorized', { status: 401 });
  return next();
};
```

### Route Groups

Route groups let you organize related routes and apply shared middleware. A route group is a folder named with parentheses, e.g., `(auth)`. You can nest route groups as needed.

**Example structure:**
```
src/routes/
  (auth)/
    middleware.ts
    users/
      [id]/
        route.ts
```
- Requests to `/users/[id]` will run middleware in this order:
  1. `src/middleware/` (global)
  2. `src/routes/(auth)/middleware.ts` (group)
  3. `src/routes/(auth)/users/middleware.ts` (if present)
  4. `src/routes/(auth)/users/[id]/middleware.ts` (if present)

**Group middleware example:**
```ts
// src/routes/(auth)/middleware.ts
export default async (ctx, next) => {
  // Auth logic for all routes in (auth) group
  return next();
};
```

You can nest groups and combine with dynamic segments, e.g.:
```
src/routes/
  (admin)/
    (reports)/
      [reportId]/
        route.ts
```

---

## 8. Plugins & Documentation

- You can register plugins (such as auto-generated docs) using the `registerPlugin` method on your app instance.
- Example:
```ts
import { docs } from '@breezeapi/core';
app.registerPlugin(docs({ http: true, tcp: true, ws: true, trpc: true }));
```
- This will expose documentation endpoints for all enabled protocols.

---

## 9. Dynamic Segments

- Use `[param]` in your route directory names to capture dynamic segments (e.g., `/users/[id]/route.ts`).
- Access these as `ctx.params.id` in your handler.

---

## 10. Type Safety & Validation

- Use Zod schemas in your config objects for params, query, and response validation.
- tRPC routes are fully type-safe and leverage TypeScript inference end-to-end.

---

## 8. CORS Middleware

Breeze provides a built-in CORS middleware to handle Cross-Origin Resource Sharing for your API.

### Importing and Using CORS Middleware

First, import the `cors` middleware from the core package:

```ts
import { cors } from '@breezeapi/core';
```

Then, register it as global middleware in your app (e.g. in `src/middleware/cors.ts`):

```ts
// src/middleware/cors.ts
import { cors } from '@breezeapi/core';

export default cors({
  origin: '*', // or specify your allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // if you need cookies/auth
});
```

- The CORS middleware will automatically handle `OPTIONS` preflight requests and set the appropriate headers.
- You can customize the options as needed for your API.

#### CORS Options
- `origin`: Allowed origin(s) (default: `*`)
- `methods`: Allowed HTTP methods (default: `['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']`)
- `allowedHeaders`: Allowed request headers (default: `['Content-Type', 'Authorization']`)
- `credentials`: Whether to allow credentials (default: `false`)

---

For more details, see the codebase and inline comments. Happy hacking! 