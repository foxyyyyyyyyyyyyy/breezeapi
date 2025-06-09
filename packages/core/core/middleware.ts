// Middleware system for HTTP
import { join, dirname, relative, sep, resolve, basename } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';
import { loadRouteCacheConfig } from './cache';
import { CacheConfig } from './config';
import { HttpContext } from './context/api';

export type Middleware = (ctx: HttpContext, next: () => Promise<Response>) => Promise<Response>;

export type OnRequestMiddleware = (ctx: HttpContext, next: () => Promise<Response>) => Promise<Response>;
export type OnResponseMiddleware = (ctx: HttpContext, next: () => Promise<Response>) => Promise<Response>;

// Load middleware from a directory
function loadMiddlewareFromDir(dir: string): { onRequest: Middleware[], onResponse: Middleware[] } {
  if (!existsSync(dir)) return { onRequest: [], onResponse: [] };
  const files = readdirSync(dir);
  const middleware = { onRequest: [] as Middleware[], onResponse: [] as Middleware[] };
  
  for (const file of files) {
    if (file.endsWith('.ts')) {
      const mod = require(join(dir, file));
      if (typeof mod.onRequest === 'function') middleware.onRequest.push(mod.onRequest);
      else if (typeof mod.onResponse === 'function') middleware.onResponse.push(mod.onResponse);
      else if (typeof mod.default === 'function') middleware.onRequest.push(mod.default);
      else if (typeof mod.middleware === 'function') middleware.onRequest.push(mod.middleware);
    }
  }
  return middleware;
}

// Compose middleware into a single function
export function compose(middleware: Middleware[]): Middleware {
  return async (ctx: HttpContext, next: () => Promise<Response>) => {
    let index = -1;
    async function dispatch(i: number): Promise<Response> {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      const fn = middleware[i] || next;
      return await fn(ctx, () => dispatch(i + 1));
    }
    return await dispatch(0);
  };
}

// Discover all applicable middleware for a given route file path
export async function getMiddlewareForRoute(routeFile: string, srcRoot: string, routesRoot: string, cacheConfig?: CacheConfig): Promise<{ onRequest: Middleware[], onResponse: Middleware[] }> {
  // 1. Global middleware from srcRoot/middleware/
  const globalDir = join(srcRoot, 'middleware');
  const globalMiddleware = loadMiddlewareFromDir(globalDir);

  // 2. Walk up from route file's directory to routesRoot, collecting middleware.ts in each dir
  let dir = dirname(routeFile);
  const rootAbs = resolve(routesRoot);
  const perRouteMiddleware = { onRequest: [] as Middleware[], onResponse: [] as Middleware[] };
  
  while (resolve(dir).startsWith(rootAbs)) {
    const mwFile = join(dir, 'middleware.ts');
    if (existsSync(mwFile)) {
      const mod = require(mwFile);
      if (typeof mod.onRequest === 'function') perRouteMiddleware.onRequest.push(mod.onRequest);
      else if (typeof mod.onResponse === 'function') perRouteMiddleware.onResponse.push(mod.onResponse);
      else if (typeof mod.default === 'function') perRouteMiddleware.onRequest.push(mod.default);
      else if (typeof mod.middleware === 'function') perRouteMiddleware.onRequest.push(mod.middleware);
    }
    if (resolve(dir) === rootAbs) break;
    dir = dirname(dir);
  }

  // 3. Load route-specific cache config if global cache is enabled
  let cacheMiddleware = { onRequest: [] as Middleware[], onResponse: [] as Middleware[] };
  if (cacheConfig?.enabled) {
    const routeCacheConfig = await loadRouteCacheConfig(routeFile, srcRoot);
    if (routeCacheConfig) {
      const mergedConfig = { ...cacheConfig, ...routeCacheConfig };
      const { createCacheMiddleware, createCacheStore } = await import('./cache');
      const store = createCacheStore(mergedConfig);
      const cacheMw = createCacheMiddleware(store, mergedConfig);
      cacheMiddleware.onRequest.push(cacheMw);
    }
  }

  // Parent middleware should run before child, so reverse perRouteMiddleware
  return {
    onRequest: [...globalMiddleware.onRequest, ...perRouteMiddleware.onRequest.reverse(), ...cacheMiddleware.onRequest],
    onResponse: [...globalMiddleware.onResponse, ...perRouteMiddleware.onResponse.reverse(), ...cacheMiddleware.onResponse]
  };
}

export const globalMiddleware = { onRequest: [] as Middleware[], onResponse: [] as Middleware[] }; 