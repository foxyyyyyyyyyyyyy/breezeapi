// Utility functions for router

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export type RouteFile = {
  type: 'http' | 'ws' | 'tcp' | 'trpc';
  file: string;
  routePath: string;
  method?: string;
};

function joinPath(...parts: string[]): string {
  return parts.filter(Boolean).join('/').replace(/\\/g, '/');
}

export async function scanRoutes(dir: string, base = ''): Promise<RouteFile[]> {
  const routes: RouteFile[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...(await scanRoutes(fullPath, joinPath(base, entry.name))));
    } else if (entry.name === 'route.ts') {
      routes.push({ type: 'http', file: fullPath, routePath: '/' + joinPath(base) });
    } else if (entry.name === 'socket.ts') {
      routes.push({ type: 'ws', file: fullPath, routePath: '/' + joinPath(base) });
    } else if (entry.name === 'handler.ts') {
      routes.push({ type: 'tcp', file: fullPath, routePath: '/' + joinPath(base) });
    } else if (entry.name === 'trpc.ts') {
      routes.push({ type: 'trpc', file: fullPath, routePath: '/' + joinPath(base) });
    }
  }
  return routes;
}

export function matchRoute(routes: RouteFile[], path: string, method?: string, type: 'http' | 'ws' | 'tcp' | 'trpc' = 'http'): RouteFile | undefined {
  // Simple matching, dynamic segments: [id]
  for (const route of routes) {
    if (route.type !== type) continue;
    const routeParts = route.routePath.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    if (routeParts.length !== pathParts.length) continue;
    let matched = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith('[') && routeParts[i].endsWith(']')) continue;
      if (routeParts[i] !== pathParts[i]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      if (type === 'http' && method && route.method && route.method !== method) continue;
      return route;
    }
  }
  return undefined;
} 