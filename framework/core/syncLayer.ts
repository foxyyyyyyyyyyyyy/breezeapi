import { z } from 'zod';

export type SyncLayerOptions<T> = {
  key: (ctx: any) => string;
  schema: z.ZodType<T>;
  initial: () => T;
  ttl?: number;
  onUpdate?: (key: string, state: T, ctx: any) => void;
  onClose?: (key: string, state: T) => void;
  persist?: (key: string, state: T) => Promise<void> | void;
  load?: (key: string) => Promise<T> | T;
};

type SyncEntry<T> = {
  state: T;
  clients: Set<any>;
  timeout?: any;
  lastActive: number;
  loaded: boolean;
};

export function syncLayer<T>(options: SyncLayerOptions<T>) {
  const states = new Map<string, SyncEntry<T>>();

  function getOrCreate(key: string, ctx: any): Promise<SyncEntry<T>> {
    let entry = states.get(key);
    if (!entry) {
      entry = {
        state: options.initial(),
        clients: new Set(),
        lastActive: Date.now(),
        loaded: false,
      };
      states.set(key, entry);
    }
    // Load from storage if needed
    if (!entry.loaded && options.load) {
      return Promise.resolve(options.load(key)).then(loadedState => {
        if (loadedState) entry!.state = loadedState;
        entry!.loaded = true;
        return entry!;
      });
    }
    entry.loaded = true;
    return Promise.resolve(entry);
  }

  function cleanup(key: string) {
    const entry = states.get(key);
    if (entry) {
      if (options.onClose) options.onClose(key, entry.state);
      if (options.persist) options.persist(key, entry.state);
      states.delete(key);
    }
  }

  return {
    async join(ctx: any, onInit: (state: T) => void) {
      const key = options.key(ctx);
      const entry = await getOrCreate(key, ctx);
      entry.clients.add(ctx.raw || ctx);
      entry.lastActive = Date.now();
      onInit(entry.state);
      if (entry.timeout) {
        clearTimeout(entry.timeout);
        entry.timeout = undefined;
      }
    },
    async leave(ctx: any) {
      const key = options.key(ctx);
      const entry = states.get(key);
      if (!entry) return;
      entry.clients.delete(ctx.raw || ctx);
      if (entry.clients.size === 0) {
        if (options.ttl) {
          entry.timeout = setTimeout(() => cleanup(key), options.ttl);
        } else {
          cleanup(key);
        }
      }
    },
    async update(ctx: any, updater: (state: T) => T, data?: any) {
      const key = options.key(ctx);
      const entry = await getOrCreate(key, ctx);
      let newState = updater(entry.state);
      // Validate
      const parsed = options.schema.safeParse(newState);
      if (!parsed.success) {
        if (ctx.raw && ctx.raw.send) ctx.raw.send(JSON.stringify({ type: 'error', error: parsed.error }));
        return;
      }
      entry.state = parsed.data;
      entry.lastActive = Date.now();
      // Broadcast
      Array.from(entry.clients).forEach(client => {
        if (client.send) client.send(JSON.stringify({ type: 'update', data: entry.state }));
      });
      if (options.onUpdate) options.onUpdate(key, entry.state, ctx);
      if (options.persist) options.persist(key, entry.state);
    },
    getState(key: string) {
      const entry = states.get(key);
      return entry ? entry.state : undefined;
    },
  };
} 