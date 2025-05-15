import { loadConfig } from './core/config';
import { Router } from './core/router';
import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
export * as t from 'zod'; 
export * from './core/trpc-adapter';
export * from './core/context/api';
export * from './core/context/ws';
export * from './core/context/tcp';
export * from './core/middleware';
export * from './core/docs';
export { cors } from './core/cors';

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
 *   - ...future extension points
 */
export type PluginContext = {
  router: Router;
  config: any;
  app: any;
  registerRoute?: (method: string, path: string, handler: Function) => void;
};

function loadUserConfig() {
  const root = process.cwd();
  const configFiles = ['Breeze.json', 'breeze.config'];
  for (const file of configFiles) {
    const path = resolve(root, file);
    if (existsSync(path)) {
      try {
        return JSON.parse(readFileSync(path, 'utf8'));
      } catch (e) {
        console.warn(`[Breeze] Failed to parse ${file}:`, e);
      }
    }
  }
  return {};
}

export function createApp(options = {}) {
  const userConfig = loadUserConfig();
  // Merge: options > userConfig > defaults
  const config = {
    ...userConfig,
    ...options,
  };
  // Always resolve the API dir and TCP dir relative to the process cwd
  const apiDir = resolve(process.cwd(), config.apiDir || 'src/routes');
  const tcpDir = resolve(process.cwd(), config.tcpDir || apiDir);
  const router = new Router(apiDir, tcpDir, config);
  const port = config.port || 3000;
  const tcpPort = config.tcpPort || 4000;

  // Example usage:
  // app.registerPlugin(docs({ http: true, tcp: true, ws: true, trpc: true }));

  // Plugin context object
  const app = {
    async start() {
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
      });
    },
  };
  return app;
} 