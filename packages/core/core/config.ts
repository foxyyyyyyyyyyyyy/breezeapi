// Config loader for framework and plugins
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

export type CacheConfig = {
  enabled: boolean;
  type: 'memory' | 'redis';
  ttl?: number; // Time to live in seconds
  redis?: {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
  };
  // Route-specific cache settings can override these
  defaultHeaders?: {
    'Cache-Control'?: string;
    'ETag'?: boolean;
  };
  // Additional caching options
  staleWhileRevalidate?: boolean; // Serve stale content while revalidating
  staleIfError?: boolean; // Serve stale content on error
  maxAge?: number; // Maximum age in seconds
  sMaxAge?: number; // Shared maximum age for CDNs
  mustRevalidate?: boolean; // Force revalidation
  proxyRevalidate?: boolean; // Force revalidation for proxies
  noTransform?: boolean; // Prevent content transformation
  immutable?: boolean; // Content never changes
  private?: boolean; // Private cache only
  noCache?: boolean; // Don't cache
  noStore?: boolean; // Don't store
  noVary?: boolean; // Don't vary cache by headers
  vary?: string[]; // Headers to vary cache by
  // Route caching options
  routeCache?: {
    enabled: boolean;
    ttl?: number;
    maxSize?: number; // Maximum number of routes to cache
  };
};

export type CompressionConfig = {
  enabled: boolean;
  level?: number; // Compression level (1-9)
  threshold?: number; // Minimum size in bytes to compress
  types?: string[]; // MIME types to compress
  exclude?: string[]; // Paths to exclude from compression
  // Advanced options
  windowBits?: number; // Window size for compression (9-15)
  memLevel?: number; // Memory level for compression (1-9)
  strategy?: 'default' | 'filtered' | 'huffman' | 'rle' | 'fixed';
  // Gzip specific options
  gzip?: {
    enabled?: boolean;
    level?: number;
  };
  // Brotli specific options
  brotli?: {
    enabled?: boolean;
    level?: number;
    mode?: 'generic' | 'text' | 'font';
    quality?: number;
    lgwin?: number;
    lgblock?: number;
  };
};

export type CORSConfig = {
  origin?: string | string[] | ((origin: string) => boolean | string);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
};

export type FrameworkConfig = {
  apiDir?: string;
  tcpDir?: string;
  plugins?: any[];
  port?: number;
  tcpPort?: number;
  enableTcp?: boolean;
  cache?: CacheConfig;
  compression?: CompressionConfig;
  cors?: CORSConfig;
  [key: string]: any;
};

async function loadUserConfig(): Promise<FrameworkConfig> {
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

export async function loadConfig(options: FrameworkConfig = {}): Promise<FrameworkConfig> {
  const userConfig = await loadUserConfig();
  
  // Merge: options > userConfig > defaults
  const config = {
    apiDir: 'src/routes',
    tcpDir: 'src/tcp',
    plugins: [],
    port: 3000,
    tcpPort: 4000,
    enableTcp: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: [],
      credentials: false,
      maxAge: 86400, // 24 hours
      preflightContinue: false
    } satisfies CORSConfig,
    cache: {
      enabled: false,
      type: 'memory' as const,
      ttl: 60, // 1 minute default TTL
      defaultHeaders: {
        'Cache-Control': 'public, max-age=60',
        'ETag': true
      },
      staleWhileRevalidate: false,
      staleIfError: false,
      maxAge: 60,
      sMaxAge: undefined,
      mustRevalidate: false,
      proxyRevalidate: false,
      noTransform: false,
      immutable: false,
      private: false,
      noCache: false,
      noStore: false,
      noVary: false,
      vary: [],
      routeCache: {
        enabled: true, // Route caching is enabled by default
        ttl: 300, // 5 minutes for route cache
        maxSize: 1000 // Maximum number of routes to cache
      }
    } satisfies CacheConfig,
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024,
      types: [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/javascript',
        'application/json',
        'application/xml',
        'application/x-www-form-urlencoded',
        'image/svg+xml'
      ],
      exclude: [
        '/api/health',
        '/metrics'
      ],
      windowBits: 15,
      memLevel: 8,
      strategy: 'default',
      gzip: {
        enabled: true,
        level: 6
      },
      brotli: {
        enabled: true,
        level: 4,
        mode: 'text',
        quality: 11,
        lgwin: 22,
        lgblock: 0
      }
    } satisfies CompressionConfig,
    ...userConfig,
    ...options,
  };

  // Always resolve the API dir and TCP dir relative to the process cwd
  config.apiDir = resolve(process.cwd(), config.apiDir);
  config.tcpDir = resolve(process.cwd(), config.tcpDir || config.apiDir);

  return config;
} 