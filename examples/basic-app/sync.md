# Breeze Sync Layer

The Breeze syncLayer utility provides a dead-simple, type-safe way to keep data in sync across WebSocket clients, with optional persistence, validation, and lifecycle hooks.

## Features
- **Real-time sync**: Broadcasts state changes to all connected clients.
- **Schema validation**: Uses Zod (t) schemas for type safety and validation.
- **Persistence**: Optionally load/save state from/to disk, DB, etc.
- **Lifecycle hooks**: Run custom logic on update or when the last client leaves.
- **TTL/Expiration**: Auto-cleanup state after a period of inactivity.
- **Minimal API**: Just import and configure.

---

## Bun-Native SyncLayer Adapters

### SQLite (Bun built-in)
```ts
import { syncLayerSqlite } from 'framework';

const chatSync = syncLayerSqlite({
  key: ctx => ctx.params.id,
  schema: t.object({ messages: t.array(t.string()) }),
  initial: () => ({ messages: [] }),
});
```
- Uses Bun's built-in `bun:sqlite` for maximum performance and zero dependencies.
- Great for local, persistent storage.

### Redis (Bun built-in)
```ts
import { syncLayerRedis } from 'framework';

const chatSync = syncLayerRedis({
  key: ctx => ctx.params.id,
  schema: t.object({ messages: t.array(t.string()) }),
  initial: () => ({ messages: [] }),
  prefix: 'chat', // optional
});
```
- Uses Bun's built-in `redis` API for distributed, scalable, and multi-instance sync.
- Great for cloud, multi-server, or ephemeral use cases.

---

## Basic Usage

```ts
import { syncLayer, t } from 'framework';

const chatSync = syncLayer({
  key: ctx => ctx.params.id, // Unique key per chat room
  schema: t.object({
    messages: t.array(t.object({
      user: t.string(),
      text: t.string(),
      ts: t.number(),
    })),
  }),
  initial: () => ({ messages: [] }),
  ttl: 5 * 60 * 1000, // 5 minutes (optional)
});

export function open(ctx) {
  chatSync.join(ctx, (state) => {
    ctx.send(JSON.stringify({ type: 'init', data: state }));
  });
}

export function message(ctx, msg) {
  let parsed;
  try {
    parsed = JSON.parse(msg);
  } catch {
    ctx.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
    return;
  }
  if (!parsed.user || !parsed.text) {
    ctx.send(JSON.stringify({ type: 'error', error: 'Missing user or text' }));
    return;
  }
  chatSync.update(ctx, (state) => ({
    messages: [
      ...state.messages,
      { user: parsed.user, text: parsed.text, ts: Date.now() },
    ],
  }));
}

export function close(ctx) {
  chatSync.leave(ctx);
}
```

---

## Advanced Usage

You can use advanced options for persistence, hooks, and custom cleanup:

```ts
import { syncLayer, t } from 'framework';

export default syncLayer({
  key: ctx => ctx.params.id,
  schema: t.object({
    messages: t.array(t.object({
      user: t.string(),
      text: t.string(),
      ts: t.number(),
    })),
  }),
  initial: () => ({ messages: [] }),
  ttl: 10 * 60 * 1000, // 10 minutes
  onUpdate: (key, state, ctx) => {
    // Called after every update
    console.log('Chat updated:', key, state);
  },
  onClose: (key, state) => {
    // Called when last client leaves
    console.log('Chat closed:', key, state);
    // Optionally persist or cleanup
  },
  persist: async (key, state) => {
    // Save to DB or disk
    // await db.saveChat(key, state.messages);
  },
  load: async (key) => {
    // Load from DB or disk
    // return { messages: await db.loadChat(key) };
    return { messages: [] };
  },
});
```

---

## API Reference

### `syncLayer(options)`

**Options:**
- `key(ctx)`: Function to return a unique key for each sync group (e.g., chat room ID).
- `schema`: Zod schema (using `t`) for state validation.
- `initial()`: Function returning the initial state.
- `ttl`: (optional) Time in ms to keep state after last client leaves.
- `onUpdate(key, state, ctx)`: (optional) Called after every update.
- `onClose(key, state)`: (optional) Called when last client leaves.
- `persist(key, state)`: (optional) Save state to DB/disk.
- `load(key)`: (optional) Load state from DB/disk.

**Instance Methods:**
- `join(ctx, onInit)`: Add a client to the sync group. Calls `onInit(state)` with the current state.
- `leave(ctx)`: Remove a client from the sync group.
- `update(ctx, updater)`: Update the state and broadcast to all clients. Validates with schema.
- `getState(key)`: Get the current state for a key.

---

## Example: Collaborative Document

```ts
import { syncLayer, t } from 'framework';

const docSync = syncLayer({
  key: ctx => ctx.params.docId,
  schema: t.object({ content: t.string() }),
  initial: () => ({ content: '' }),
});

export function open(ctx) {
  docSync.join(ctx, (state) => {
    ctx.send(JSON.stringify({ type: 'init', data: state }));
  });
}

export function message(ctx, msg) {
  let parsed;
  try {
    parsed = JSON.parse(msg);
  } catch {
    ctx.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
    return;
  }
  if (!parsed.content) {
    ctx.send(JSON.stringify({ type: 'error', error: 'Missing content' }));
    return;
  }
  docSync.update(ctx, (state) => ({ content: parsed.content }));
}

export function close(ctx) {
  docSync.leave(ctx);
}
```

---

## Notes
- All state is validated with your schema before broadcasting.
- If you use `persist`/`load`, you can make your sync state durable.
- Use `ttl` and `onClose` for efficient memory management.
- Works with any WebSocket route in Breeze. 