// Middleware system for HTTP
import { join, dirname, relative, sep, resolve, basename } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';

export type Middleware = (ctx: any, next: () => Promise<Response>) => Promise<Response>;

export function compose(middleware: Middleware[]): Middleware {
  return function (ctx, next) {
    let index = -1;
    function dispatch(i: number): Promise<Response> {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i] || next;
      if (!fn) return Promise.resolve(new Response('Not Found', { status: 404 }));
      return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
    }
    return dispatch(0);
  };
}

// Load all middleware from a directory (e.g. global middleware)
export function loadMiddlewareFromDir(dir: string): Middleware[] {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  const middleware: Middleware[] = [];
  for (const file of files) {
    const mod = require(join(dir, file));
    if (typeof mod.default === 'function') middleware.push(mod.default);
    else if (typeof mod.middleware === 'function') middleware.push(mod.middleware);
  }
  return middleware;
}

// Discover all applicable middleware for a given route file path
// srcRoot: absolute path to /src, routesRoot: absolute path to /src/routes
export function getMiddlewareForRoute(routeFile: string, srcRoot: string, routesRoot: string): Middleware[] {
  // 1. Global middleware from srcRoot/middleware/
  const globalDir = join(srcRoot, 'middleware');
  const globalMiddleware = loadMiddlewareFromDir(globalDir);
  // 2. Walk up from route file's directory to routesRoot, collecting middleware.ts in each dir (including route groups)
  let dir = dirname(routeFile);
  const rootAbs = resolve(routesRoot);
  const perRouteMiddleware: Middleware[] = [];
  while (resolve(dir).startsWith(rootAbs)) {
    const mwFile = join(dir, 'middleware.ts');
    if (existsSync(mwFile)) {
      const mod = require(mwFile);
      if (typeof mod.default === 'function') perRouteMiddleware.push(mod.default);
      else if (typeof mod.middleware === 'function') perRouteMiddleware.push(mod.middleware);
    }
    if (resolve(dir) === rootAbs) break;
    dir = dirname(dir);
  }
  // Parent middleware should run before child, so reverse perRouteMiddleware
  return [...globalMiddleware, ...perRouteMiddleware.reverse()];
}

export const globalMiddleware: Middleware[] = []; 