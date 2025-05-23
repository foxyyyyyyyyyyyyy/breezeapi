import { loadConfig } from './core/config';
import { Router } from './core/router';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
export * as t from 'zod'; 
export * from './core/trpc-adapter';
export * from './core/context/api';
export * from './core/context/ws';
export * from './core/context/tcp';
export * from './core/middleware';
export * from './core/docs';
export { cors } from './core/cors';
export { syncLayer } from './core/syncLayer';
export { syncLayerSqlite } from './adapters/syncLayerSqlite';
export { syncLayerRedis } from './adapters/syncLayerRedis';

/**
 * Plugin API: Plugins receive a context object with deep integration points.
 * Example plugin signature:
 *   (ctx: PluginContext) => void | Promise<void>
 *
 * PluginContext includes:
 *   - router: the main Router instance
 *   - config: loaded config
 *   - app: the app instance (for hooks, etc.)
 *   - registerRoute: (method, path, handler) => void (optional convenience)
 *   - registerPluginRoute: (method, path, handler) => void (registers before user routes)
 *   - ...future extension points
 *
 * ctx type: Strongly typed context for plugin handlers (e.g., DiscordPluginContext)
 */
export type PluginContext<Ctx = any> = {
  router: Router;
  config: any;
  app: any;
  registerRoute?: (method: string, path: string, handler: Function) => void;
  registerPluginRoute?: (method: string, path: string, handler: Function) => void;
  ctxType?: Ctx;
};

async function loadUserConfig() {
  const root = process.cwd();
  const configPath = resolve(root, '.breeze/config.ts');
  if (existsSync(configPath)) {
    try {
      const config = await import(configPath);
      return config.default || config;
    } catch (e) {
      console.warn(`[Breeze] Failed to import .breeze/config.ts:`, e);
    }
  }
  return {};
}

export async function createApp(options = {}) {
  const userConfig = await loadUserConfig();
  // Merge: options > userConfig > defaults
  const config = {
    ...userConfig,
    ...options,
  };
  // Always resolve the API dir and TCP dir relative to the process cwd
  //@ts-ignore
  const apiDir = resolve(process.cwd(), config.apiDir || 'src/routes');
  //@ts-ignore
  const tcpDir = resolve(process.cwd(), config.tcpDir || apiDir);
  const router = new Router(apiDir, tcpDir, config);
  const port = config.port || 3000;
  const tcpPort = config.tcpPort || 4000;

  // Internal: Store plugin routes to register before user routes
  const pluginRoutes: Array<{ method: string, path: string, handler: Function }> = [];

  // Internal: Register plugin route (before user routes)
  function _registerPluginRoute(method: string, path: string, handler: Function) {
    pluginRoutes.push({ method, path, handler });
  }

  // Plugin context object
  const app = {
    async start() {
      // Register plugin routes before user routes
      for (const { method, path, handler } of pluginRoutes) {
        if (typeof router[method.toLowerCase()] === 'function') {
          router[method.toLowerCase()](path, handler);
        }
      }
      // HTTP & WebSocket
      (globalThis as any).Bun.serve({
        port,
        fetch: async (req: Request, server: any) => {
          if (server.upgrade(req)) return undefined;
          return await router.handleHttp(req);
        },
        websocket: {
          open(ws: any) {},
          message(ws: any, message: string) {},
          close(ws: any, code: number, reason: string) {},
          drain(ws: any) {},
          async upgrade(req: Request, ws: any) {
            await router.handleWebSocket(req, ws);
          },
        },
      });
      // TCP
      (globalThis as any).Bun.listen({
        hostname: '0.0.0.0',
        port: tcpPort,
        socket: {
          open(socket: any) {
            router.handleTcp(socket);
          },
          data(socket: any, data: Uint8Array) {},
          close(socket: any) {},
          error(socket: any, error: Error) {},
        },
      });
      console.log(`HTTP/WebSocket on :${port}, TCP on :${tcpPort}`);
    },
    router,
    config,
    /**
     * Register a plugin with deep integration.
     * The plugin receives a PluginContext object.
     */
    async registerPlugin(plugin: (ctx: PluginContext) => void | Promise<void>) {
      await plugin({
        router,
        config,
        app,
        registerRoute: (method: string, path: string, handler: Function) => {
          if (typeof router[method.toLowerCase()] === 'function') {
            router[method.toLowerCase()](path, handler);
          }
        },
        registerPluginRoute: _registerPluginRoute,
      });
    },
    // Expose for plugins
    _registerPluginRoute,
  };
  return app;
} 