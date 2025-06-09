import { scanRoutes, matchRoute, RouteFile } from './utils';
import { HttpContext } from './context/api';
import { WebSocketContext } from './context/ws';
import { TcpSocketContext } from './context/tcp';
import { compose, getMiddlewareForRoute } from './middleware';
import { cors } from './cors';
import { CORSConfig } from './config';

function extractParams(routePath: string, actualPath: string): Record<string, string> {
  const params: Record<string, string> = {};
  const routeParts = routePath.split('/').filter(Boolean);
  const pathParts = actualPath.split('/').filter(Boolean);
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith('[') && routeParts[i].endsWith(']')) {
      const key = routeParts[i].slice(1, -1);
      params[key] = pathParts[i];
    }
  }
  return params;
}

function stripRoutesPrefix(routePath: string, type: 'http' | 'ws' | 'tcp' | 'trpc'): string {
  if (type === 'http' || type === 'ws') {
    return routePath.replace(/^\/routes/, '') || '/';
  }
  // For tcp and trpc, keep the prefix
  return routePath;
}

// Simple wildcard matcher: /api/auth/* matches /api/auth/foo/bar
function matchWildcard(pattern: string, path: string): boolean {
  if (pattern.endsWith('/*')) {
    const base = pattern.slice(0, -2);
    return path === base || path.startsWith(base + '/');
  }
  return pattern === path;
}

interface RouterOptions {
  debug?: boolean;
  cache?: any;
  requestMerge?: {
    enabled: boolean;
    timeout?: number;
  };	
  cors?: CORSConfig;
  enableTcp?: boolean;
}

// Router class for Breeze Framework
// Accepts and stores the full config object (including custom fields like name)

export class Router {
  private httpRoutes: RouteFile[] = [];
  private wsRoutes: RouteFile[] = [];
  private tcpRoutes: RouteFile[] = [];
  private trpcRoutes: RouteFile[] = [];
  private routesLoaded = false;
  private debug: boolean;
  private customGetRoutes: { path: string, handler: Function }[] = [];
  private customPostRoutes: { path: string, handler: Function }[] = [];
  private customAllRoutes: { path: string, handler: Function }[] = [];
  private mountedApps: Map<string, { fetch: (req: Request) => Promise<Response> }> = new Map();
  public config: RouterOptions; // Store the config object
  private cacheStore: any; // Cache store for routes
  private requestMergeCache: Map<string, Promise<Response>> = new Map();
  private requestMergeTimeout: number = 100; // ms

  constructor(private apiDir: string, private tcpDir: string, options: RouterOptions = {}) {
    this.debug = options.debug || false;
    this.config = options; // Store the full config for access in plugins, etc.
    if (options.cache?.routeCache?.enabled) {
      const { createCacheStore } = require('./cache');
      this.cacheStore = createCacheStore(options.cache);
    }
    if (options.requestMerge?.enabled) {
      this.requestMergeTimeout = options.requestMerge.timeout || 100;
    }
  }

  /**
   * Register a custom GET route (for plugins, docs, etc)
   */
  get(path: string, handler: Function) {
    this.customGetRoutes.push({ path, handler });
    if (this.debug) {
      console.log(`[Breeze] Registered manual route: GET ${path}`);
    }
  }

  /**
   * Register a custom POST route (for plugins, docs, etc)
   */
  post(path: string, handler: Function) {
    if (!this.customPostRoutes) this.customPostRoutes = [];
    this.customPostRoutes.push({ path, handler });
    if (this.debug) {
      console.log(`[Breeze] Registered manual route: POST ${path}`);
    }
  }

  /**
   * Register a custom ALL route (any method, with wildcard support)
   */
  all(path: string, handler: Function) {
    this.customAllRoutes.push({ path, handler });
    if (this.debug) {
      console.log(`[Breeze] Registered manual route: ALL ${path}`);
    }
  }

  /**
   * Mount another fetch-compatible application at a specific path
   * @param path - The path prefix to mount the app at
   * @param app - An object with a fetch method that handles requests 
   */
  mount(path: string, app: { fetch: (req: Request) => Promise<Response> }) {
    this.mountedApps.set(path, app);
    if (this.debug) {
      console.log(`[Breeze] Mounted app at ${path}`);
    }
  }

  public async loadRoutes() {
    if (this.routesLoaded) return;
    this.httpRoutes = (await scanRoutes(this.apiDir)).filter(r => r.type === 'http').map(r => ({ ...r, routePath: stripRoutesPrefix(r.routePath, 'http') }));
    this.wsRoutes = (await scanRoutes(this.apiDir)).filter(r => r.type === 'ws').map(r => ({ ...r, routePath: stripRoutesPrefix(r.routePath, 'ws') }));
    if (this.config.enableTcp) {
      this.tcpRoutes = (await scanRoutes(this.tcpDir)).filter(r => r.type === 'tcp').map(r => ({ ...r, routePath: stripRoutesPrefix(r.routePath, 'tcp') }));
    }
    this.trpcRoutes = (await scanRoutes(this.apiDir)).filter(r => r.type === 'trpc').map(r => ({ ...r, routePath: stripRoutesPrefix(r.routePath, 'trpc') }));
    this.routesLoaded = true;
    if (this.debug) {
      console.log('Registered HTTP routes:');
      for (const r of this.httpRoutes) {
        console.log(`  [HTTP] ${r.routePath} (${r.file})`);
      }
      console.log('Registered WebSocket routes:');
      for (const r of this.wsRoutes) {
        console.log(`  [WS] ${r.routePath} (${r.file})`);
      }
      if (this.config.enableTcp) {
        console.log('Registered TCP routes:');
        for (const r of this.tcpRoutes) {
          console.log(`  [TCP] ${r.routePath} (${r.file})`);
        }
      }
      console.log('Registered tRPC routes:');
      for (const r of this.trpcRoutes) {
        console.log(`  [tRPC] ${r.routePath} (${r.file})`);
      }
    }
  }

  private getRequestKey(req: Request): string | null {
    // Only merge GET requests
    if (req.method !== 'GET') return null;
    
    // Don't merge requests with auth headers or cookies
    if (req.headers.get('authorization') || req.headers.get('cookie')) return null;
    
    const url = new URL(req.url);
    // Create a key based on method, path, and query params
    return `${req.method}:${url.pathname}:${url.search}`;
  }

  private async clearRequestMergeCache(key: string) {
    // Clear the cache after the response is sent
    setTimeout(() => {
      this.requestMergeCache.delete(key);
    }, this.requestMergeTimeout);
  }

  async handleHttp(req: Request): Promise<Response> {
    await this.loadRoutes();
    const url = new URL(req.url);

    // Create CORS middleware if configured
    const corsMiddleware = this.config.cors ? cors(this.config.cors) : null;

    // Check mounted apps first
    for (const [prefix, app] of Array.from(this.mountedApps.entries())) {
      if (url.pathname.startsWith(prefix)) {
        // Create a new request with the path adjusted for the mounted app
        const newUrl = new URL(url.pathname.slice(prefix.length) + url.search, url.origin);
        const newReq = new Request(newUrl, {
          method: req.method,
          headers: req.headers,
          body: req.body,
          redirect: req.redirect,
          signal: req.signal,
          referrer: req.referrer,
          referrerPolicy: req.referrerPolicy,
          mode: req.mode,
          credentials: req.credentials,
          cache: req.cache,
          integrity: req.integrity,
          keepalive: req.keepalive
        });

        const response = await app.fetch(newReq);
        return response;
      }
    }

    // Check if request can be merged
    const requestKey = this.getRequestKey(req);
    if (requestKey && this.config?.requestMerge?.enabled) {
      const existingPromise = this.requestMergeCache.get(requestKey);
      if (existingPromise) {
        if (this.debug) {
          console.log(`[Breeze] Merging request: ${requestKey}`);
        }
        return existingPromise;
      }
    }

    // Create a promise for this request
    const requestPromise = (async () => {
      // Check route cache first if enabled
      if (this.cacheStore && this.config.cache.routeCache?.enabled) {
        const routeKey = this.cacheStore.getRouteCacheKey(url.pathname, req.method);
        const cachedRoute = await this.cacheStore.getRoute(routeKey);
        
        if (cachedRoute) {
          // Use cached route handler
          const ctx = new HttpContext(req, cachedRoute.params);
          ctx.querys = Object.fromEntries(url.searchParams.entries());
          const response = await cachedRoute.handler(ctx);
          return response;
        }
      }

      // --- Custom ALL routes with wildcard support (priority) ---
      for (const { path, handler } of this.customAllRoutes) {
        if (matchWildcard(path, url.pathname)) {
          const context = {
            request: req,
            req,
            url,
            method: req.method,
            error: (status = 500, message = 'Error') => new Response(message, { status }),
          };
          let response;
          try {
            if (handler.length === 1) {
              try {
                response = await handler(context);
              } catch (e) {
                response = await handler(req);
              }
            } else {
              response = await handler(context);
            }
          } catch (e) {
            response = new Response('Internal Server Error', { status: 500 });
          }

          // Apply CORS middleware if configured
          if (corsMiddleware) {
            const ctx = new HttpContext(req, {});
            ctx.querys = Object.fromEntries(url.searchParams.entries());
            response = await corsMiddleware(ctx, () => Promise.resolve(response));
          }

          return response;
        }
      }

      // Check custom GET routes first
      if (req.method === 'GET') {
        const custom = this.customGetRoutes.find(r => r.path === url.pathname);
        if (custom) {
          const response = await custom.handler({ req });

          // Apply CORS middleware if configured
          if (corsMiddleware) {
            const ctx = new HttpContext(req, {});
            ctx.querys = Object.fromEntries(url.searchParams.entries());
            return await corsMiddleware(ctx, () => Promise.resolve(response));
          }

          return response;
        }
      }

      // Check custom POST routes
      if (req.method === 'POST' && this.customPostRoutes) {
        const custom = this.customPostRoutes.find(r => r.path === url.pathname);
        if (custom) {
          const response = await custom.handler({ req });

          // Apply CORS middleware if configured
          if (corsMiddleware) {
            const ctx = new HttpContext(req, {});
            ctx.querys = Object.fromEntries(url.searchParams.entries());
            return await corsMiddleware(ctx, () => Promise.resolve(response));
          }

          return response;
        }
      }

      const method = req.method;
      const route = matchRoute(this.httpRoutes, url.pathname, method, 'http');
      if (!route) {
        return new Response('Not Found', { status: 404 });
      }

      const mod = await import(route.file + '?t=' + Date.now());
      const handler = mod[method] || (mod[method && method.toUpperCase()]);
      if (!handler) {
        return new Response('Method Not Allowed', { status: 405 });
      }

      let params = extractParams(route.routePath, url.pathname);
      let querys = Object.fromEntries(url.searchParams.entries());

      // --- config-based validation ---
      if (mod.config) {
        if (mod.config.params) {
          try {
            params = mod.config.params.parse(params);
          } catch (e: any) {
            return new Response('Invalid params: ' + e.message, { status: 400 });
          }
        }
        if (mod.config.querys) {
          try {
            querys = mod.config.querys.parse(querys);
          } catch (e: any) {
            return new Response('Invalid query: ' + e.message, { status: 400 });
          }
        }
      }

      const ctx = new HttpContext(req, params);
      ctx.querys = querys;

      // Use new middleware discovery logic
      const path = require('path');
      const srcRoot = path.resolve(this.apiDir, '..');
      const middlewareArr = await getMiddlewareForRoute(route.file, srcRoot, this.apiDir, this.config.cache);

      // Add CORS middleware if configured
      if (this.config.cors) {
        middlewareArr.onRequest.unshift(cors(this.config.cors));
      }

      // Run onRequest middleware
      const onRequestMw = compose(middlewareArr.onRequest);
      let response = await onRequestMw(ctx, () => handler.handler ? handler.handler(ctx, mod.config) : handler(ctx, mod.config));

      // Run onResponse middleware
      const onResponseMw = compose(middlewareArr.onResponse);
      response = await onResponseMw(ctx, () => Promise.resolve(response));

      if (mod.config && mod.config.response) {
        try {
          // Try to parse the response if it's a JSON body
          const cloned = response.clone();
          const text = await cloned.text();
          let json;
          try { json = JSON.parse(text); } catch { json = undefined; }
          if (json) mod.config.response.parse(json);
        } catch (e: any) {
          return new Response('Invalid response: ' + e.message, { status: 500 });
        }
      }
      
      let hasCustomHeaders = false;
      ctx.responseHeaders.forEach(() => { hasCustomHeaders = true; });
      if (hasCustomHeaders) {
        const newHeaders = new Headers(response.headers);
        ctx.responseHeaders.forEach((v, k) => {
          newHeaders.set(k, v);
        });
        response = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }

      return response;
    })();

    // Store the promise if request can be merged
    if (requestKey && this.config?.requestMerge?.enabled) {
      this.requestMergeCache.set(requestKey, requestPromise);
      this.clearRequestMergeCache(requestKey);
    }

    return requestPromise;
  }

  async handleWebSocket(upgradeReq: Request, ws: any): Promise<void> {
    await this.loadRoutes();
    const url = new URL(upgradeReq.url);
    const route = matchRoute(this.wsRoutes, url.pathname, undefined, 'ws');
    if (!route) return ws.close();
    const mod = await import(route.file + '?t=' + Date.now());
    let params = extractParams(route.routePath, url.pathname);
    // Provide a context object for WebSocket handlers
    const wsCtx = new WebSocketContext(ws, upgradeReq, ws.id, params);
    wsCtx.params = params;
    wsCtx.url = url;
    // Pub/Sub helpers
    wsCtx.subscribe = function (topic) {
      WebSocketContext._subscribe(topic, wsCtx);
    };
    wsCtx.unsubscribe = function (topic) {
      WebSocketContext._unsubscribe(topic, wsCtx);
    };
    wsCtx.publish = function (topic, message) {
      WebSocketContext._publish(topic, message);
    };
    if (mod.open) mod.open(wsCtx);
    ws.onmessage = (event: any) => mod.message && mod.message(wsCtx, event.data);
    ws.onclose = (event: any) => mod.close && mod.close(wsCtx, event.code, event.reason);
    ws.onerror = (event: any) => mod.error && mod.error(wsCtx, event.error);
  }

  async handleTcp(socket: any): Promise<void> {
    await this.loadRoutes();
    // For TCP, match by port or service name if needed
    const route = this.tcpRoutes[0]; // TODO: match by port/service
    if (!route) return socket.end();
    const mod = await import(route.file + '?t=' + Date.now());
    let params = extractParams(route.routePath, '');
    const tcpCtx = new TcpSocketContext(socket, socket.id, socket.localAddress, socket.localPort, socket.remoteAddress, socket.remotePort, params);
    if (mod.open) mod.open(tcpCtx);
    socket.ondata = (data: Uint8Array) => mod.data && mod.data(tcpCtx, data);
    socket.onclose = () => mod.close && mod.close(tcpCtx);
    socket.onerror = (err: Error) => mod.error && mod.error(tcpCtx, err);
  }

  // --- tRPC handler ---
  async handleTrpc(req: Request): Promise<Response> {
    await this.loadRoutes();
    const url = new URL(req.url);
    const route = matchRoute(this.trpcRoutes, url.pathname, undefined, 'trpc');
    if (!route) return new Response('Not Found', { status: 404 });
    const mod = await import(route.file + '?t=' + Date.now());
    const { router, createContext } = mod;
    // Use your trpc-adapter to create a handler
    const { trpcHandler } = await import('./trpc-adapter');
    const handler = trpcHandler(router, createContext);
    return handler(req);
  }
}

// --- In-memory pub/sub for WebSocketContext ---
WebSocketContext._topics = new Map();
WebSocketContext._subscribe = function (topic, wsCtx) {
  if (!WebSocketContext._topics.has(topic)) WebSocketContext._topics.set(topic, new Set());
  WebSocketContext._topics.get(topic)!.add(wsCtx);
};
WebSocketContext._unsubscribe = function (topic, wsCtx) {
  if (WebSocketContext._topics.has(topic)) WebSocketContext._topics.get(topic)!.delete(wsCtx);
};
WebSocketContext._publish = function (topic, message) {
  if (WebSocketContext._topics.has(topic)) {
    Array.from(WebSocketContext._topics.get(topic)!).forEach(wsCtx => {
      wsCtx.send(message);
    });
  }
};