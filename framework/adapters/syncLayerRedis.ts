import { syncLayer } from '../core/syncLayer';
import { redis } from 'bun';

export function syncLayerRedis(options: any) {
  // Optionally allow passing a custom redis instance
  const r = options.redis || redis;

  return syncLayer({
    ...options,
    persist: async (key: string, state: any) => {
      await r.set(options.prefix ? `${options.prefix}:${key}` : key, JSON.stringify(state));
    },
    load: async (key: string) => {
      const data = await r.get(options.prefix ? `${options.prefix}:${key}` : key);
      return data ? JSON.parse(data) : options.initial();
    },
  });
} 