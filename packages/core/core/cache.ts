import { CacheConfig } from './config';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { createHash } from 'crypto';

type CacheStore = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  del: (key: string) => Promise<void>;
  has: (key: string) => Promise<boolean>;
  getRouteCacheKey: (path: string, method: string) => string;
};

type RouteCacheEntry = {
  path: string;
  method: string;
  handler: Function;
  params: Record<string, string>;
  timestamp: number;
};

class MemoryCache implements CacheStore {
  private store: Map<string, { value: string; expires: number }> = new Map();
  private routeCache: Map<string, RouteCacheEntry> = new Map();
  private maxRouteCacheSize: number;

  constructor(maxRouteCacheSize: number = 1000) {
    this.maxRouteCacheSize = maxRouteCacheSize;
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expires && item.expires < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expires = ttl ? Date.now() + ttl * 1000 : undefined;
    this.store.set(key, { value, expires: expires || 0 });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async has(key: string): Promise<boolean> {
    const item = this.store.get(key);
    if (!item) return false;
    if (item.expires && item.expires < Date.now()) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  // Route cache methods
  getRouteCacheKey(path: string, method: string): string {
    return createHash('md5').update(`${method}:${path}`).digest('hex');
  }

  async getRoute(key: string): Promise<RouteCacheEntry | null> {
    return this.routeCache.get(key) || null;
  }

  async setRoute(key: string, entry: RouteCacheEntry): Promise<void> {
    // Implement LRU-like behavior
    if (this.routeCache.size >= this.maxRouteCacheSize) {
      // Remove oldest entry
      const oldestKey = Array.from(this.routeCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.routeCache.delete(oldestKey);
    }
    this.routeCache.set(key, entry);
  }

  async clearRouteCache(): Promise<void> {
    this.routeCache.clear();
  }
}

class RedisCache implements CacheStore {
  private client: any;
  private routeCache: Map<string, RouteCacheEntry> = new Map();
  private maxRouteCacheSize: number;

  constructor(config: CacheConfig['redis'], maxRouteCacheSize: number = 1000) {
    this.client = new (globalThis as any).Bun.Redis({
      host: config?.host || 'localhost',
      port: config?.port || 6379,
      password: config?.password,
      db: config?.db || 0,
    });
    this.maxRouteCacheSize = maxRouteCacheSize;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, { ex: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async has(key: string): Promise<boolean> {
    return await this.client.exists(key) === 1;
  }

  // Route cache methods (using in-memory for Redis as well since route cache is temporary)
  getRouteCacheKey(path: string, method: string): string {
    return createHash('md5').update(`${method}:${path}`).digest('hex');
  }

  async getRoute(key: string): Promise<RouteCacheEntry | null> {
    return this.routeCache.get(key) || null;
  }

  async setRoute(key: string, entry: RouteCacheEntry): Promise<void> {
    if (this.routeCache.size >= this.maxRouteCacheSize) {
      const oldestKey = Array.from(this.routeCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.routeCache.delete(oldestKey);
    }
    this.routeCache.set(key, entry);
  }

  async clearRouteCache(): Promise<void> {
    this.routeCache.clear();
  }
}

export function createCacheStore(config: CacheConfig): CacheStore {
  if (!config.enabled) {
    return {
      get: async () => null,
      set: async () => {},
      del: async () => {},
      has: async () => false,
      getRouteCacheKey: () => '',
    };
  }

  return config.type === 'redis' 
    ? new RedisCache(config.redis, config.routeCache?.maxSize)
    : new MemoryCache(config.routeCache?.maxSize);
}

export async function loadRouteCacheConfig(routeFile: string, srcRoot: string): Promise<Partial<CacheConfig> | null> {
  const routeDir = dirname(routeFile);
  const cacheFile = join(routeDir, 'cache.ts');
  
  if (existsSync(cacheFile)) {
    try {
      const mod = await import(cacheFile);
      return mod.default || mod;
    } catch (e) {
      console.warn(`[Breeze] Failed to load cache config from ${cacheFile}:`, e);
    }
  }
  return null;
}

function generateCacheControlHeader(config: CacheConfig): string {
  const directives: string[] = [];

  if (config.noStore) {
    directives.push('no-store');
    return directives.join(', ');
  }

  if (config.noCache) {
    directives.push('no-cache');
  }

  if (config.private) {
    directives.push('private');
  } else {
    directives.push('public');
  }

  if (config.maxAge !== undefined) {
    directives.push(`max-age=${config.maxAge}`);
  }

  if (config.sMaxAge !== undefined) {
    directives.push(`s-maxage=${config.sMaxAge}`);
  }

  if (config.mustRevalidate) {
    directives.push('must-revalidate');
  }

  if (config.proxyRevalidate) {
    directives.push('proxy-revalidate');
  }

  if (config.noTransform) {
    directives.push('no-transform');
  }

  if (config.immutable) {
    directives.push('immutable');
  }

  if (config.staleWhileRevalidate) {
    directives.push('stale-while-revalidate');
  }

  if (config.staleIfError) {
    directives.push('stale-if-error');
  }

  return directives.join(', ');
}

export function createCacheMiddleware(store: CacheStore, config: CacheConfig) {
  return async (ctx: any, next: () => Promise<Response>) => {
    if (!config.enabled) {
      return await next();
    }

    // Skip caching for non-GET requests
    if (ctx.method !== 'GET') {
      return await next();
    }

    // Generate cache key based on URL and vary headers
    const varyHeaders = config.vary || [];
    const varyValues = varyHeaders.map(header => ctx.headers.get(header)).filter(Boolean);
    const cacheKey = `${ctx.url.pathname}${ctx.url.search}${varyValues.length ? ':' + varyValues.join(':') : ''}`;
    
    const cached = await store.get(cacheKey);

    if (cached) {
      const response = new Response(cached);
      // Add cache headers
      const cacheControl = generateCacheControlHeader(config);
      if (cacheControl) {
        response.headers.set('Cache-Control', cacheControl);
      }
      if (config.defaultHeaders) {
        Object.entries(config.defaultHeaders).forEach(([key, value]) => {
          if (value) response.headers.set(key, value.toString());
        });
      }
      return response;
    }

    const response = await next();
    
    // Only cache successful responses
    if (response.status === 200) {
      const body = await response.clone().text();
      await store.set(cacheKey, body, config.ttl);
    }

    return response;
  };
} 