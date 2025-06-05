# Breeze Framework Configuration Guide

## Overview

The Breeze Framework uses a configuration system that can be customized through a `.breeze/config.ts` file in your project root. This guide covers all available configuration options and provides detailed explanations of the caching system.

## Basic Configuration

```typescript
export default {
  apiDir: 'src/routes',      // Directory for HTTP routes
  tcpDir: 'src/tcp',         // Directory for TCP routes
  plugins: [],               // Array of plugins to load
  port: 3000,                // HTTP server port
  tcpPort: 4000,            // TCP server port
  enableTcp: false,         // Whether to enable TCP server
  debug: false              // Enable debug mode
}
```

## Caching System

The Breeze Framework includes a powerful caching system that supports both memory and Redis caching, with extensive configuration options for fine-grained control over caching behavior.

### Cache Configuration

```typescript
export default {
  cache: {
    enabled: true,          // Enable/disable caching
    type: 'memory',         // 'memory' or 'redis'
    ttl: 60,                // Default time-to-live in seconds
    
    // Redis-specific configuration
    redis: {
      host: 'localhost',    // Redis host
      port: 6379,           // Redis port
      password: 'optional', // Redis password
      db: 0                 // Redis database number
    },

    // Cache control headers
    defaultHeaders: {
      'Cache-Control': 'public, max-age=60',
      'ETag': true
    },

    // Advanced cache control options
    staleWhileRevalidate: false,  // Serve stale content while revalidating
    staleIfError: false,          // Serve stale content on error
    maxAge: 60,                   // Maximum age in seconds
    sMaxAge: undefined,           // Shared maximum age for CDNs
    mustRevalidate: false,        // Force revalidation
    proxyRevalidate: false,       // Force revalidation for proxies
    noTransform: false,           // Prevent content transformation
    immutable: false,             // Content never changes
    private: false,               // Private cache only
    noCache: false,               // Don't cache
    noStore: false,               // Don't store
    noVary: false,                // Don't vary cache by headers
    vary: [],                     // Headers to vary cache by

    // Route caching options
    routeCache: {
      enabled: true,              // Enable route caching
      ttl: 300,                   // Route cache TTL in seconds
      maxSize: 1000               // Maximum number of routes to cache
    }
  }
}
```

### Caching Features

1. **Multiple Cache Stores**
   - Memory Cache: Fast, in-memory caching for single-server deployments
   - Redis Cache: Distributed caching for multi-server deployments

2. **Route Caching**
   - Automatically caches route handlers and their parameters
   - LRU (Least Recently Used) eviction policy
   - Configurable cache size and TTL
   - Improves response times for frequently accessed routes

3. **Cache Control Headers**
   - `staleWhileRevalidate`: Serve stale content while revalidating
   - `staleIfError`: Serve stale content on error
   - `maxAge` and `sMaxAge`: Control cache duration
   - `mustRevalidate` and `proxyRevalidate`: Force revalidation
   - `noTransform`: Prevent content transformation
   - `immutable`: Mark content as never changing
   - `private`: Private cache only
   - `noCache` and `noStore`: Control caching behavior
   - `vary`: Cache by specific headers

4. **Route-Level Cache Configuration**
   Create a `cache.ts` file in your route directory to override global cache settings:

   ```typescript
   // src/routes/api/users/cache.ts
   export default {
     ttl: 300,
     staleWhileRevalidate: true,
     private: true,
     vary: ['Authorization']
   }
   ```

### Cache Behavior

1. **Cache Key Generation**
   - Includes URL path and query parameters
   - Supports varying cache by headers
   - MD5 hashing for route cache keys

2. **Cache Invalidation**
   - Automatic TTL expiration
   - Manual cache key deletion
   - Server restart (for memory cache)

3. **Cache Headers**
   - Automatically adds appropriate cache headers
   - Supports CDN caching
   - Browser cache control
   - Cache revalidation

### Best Practices

1. **Memory Cache**
   - Use for single-server deployments
   - Set appropriate `maxSize` to prevent memory issues
   - Consider using `immutable` for static content

2. **Redis Cache**
   - Use for multi-server deployments
   - Configure proper connection settings
   - Consider using Redis cluster for high availability

3. **Route Caching**
   - Enable for frequently accessed routes
   - Set appropriate TTL based on content update frequency
   - Use `vary` headers for personalized content

4. **Cache Headers**
   - Use `staleWhileRevalidate` for better user experience
   - Set appropriate `maxAge` based on content type
   - Use `private` for user-specific content
   - Use `vary` for content that depends on headers

## Compression Configuration

The Breeze Framework includes built-in compression support using Bun's native compression capabilities. You can configure compression settings in your `.breeze/config.ts` file:

```typescript
export default {
  // ... other config options ...

  compression: {
    enabled: true,                    // Enable/disable compression
    level: 6,                         // Compression level (1-9, higher = better compression but slower)
    threshold: 1024,                  // Minimum size in bytes to compress
    types: [                          // MIME types to compress
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
    exclude: [                        // Paths to exclude from compression
      '/api/health',
      '/metrics'
    ],
    // Advanced options
    windowBits: 15,                   // Window size for compression (9-15)
    memLevel: 8,                      // Memory level for compression (1-9)
    strategy: 'default',              // Compression strategy: 'default', 'filtered', 'huffman', 'rle', 'fixed'
    // Gzip specific options
    gzip: {
      enabled: true,                  // Enable gzip compression
      level: 6                        // Gzip compression level (1-9)
    },
    // Brotli specific options
    brotli: {
      enabled: true,                  // Enable brotli compression
      level: 4,                       // Brotli compression level (0-11)
      mode: 'text',                   // Brotli mode: 'generic', 'text', 'font'
      quality: 11,                    // Brotli quality (0-11)
      lgwin: 22,                      // Brotli window size (10-24)
      lgblock: 0                      // Brotli block size (16-24)
    }
  }
}
```

### Compression Features

1. **Multiple Compression Algorithms**
   - Gzip: Widely supported, good balance of speed and compression
   - Brotli: Better compression ratio, modern browsers support
   - Automatic algorithm selection based on client support

2. **Smart Compression**
   - Only compresses responses above the threshold size
   - Skips compression for already compressed content
   - Excludes specified paths from compression
   - Respects client's compression capabilities

3. **Performance Optimizations**
   - Configurable compression levels
   - Memory usage control
   - Window size optimization
   - Strategy selection for different content types

### Best Practices

1. **Compression Levels**
   - Use level 6 for most content (good balance)
   - Use higher levels (7-9) for static assets
   - Use lower levels (1-3) for dynamic content

2. **MIME Types**
   - Compress text-based content
   - Don't compress already compressed formats (images, videos)
   - Consider adding custom MIME types for your application

3. **Threshold Settings**
   - Set appropriate threshold based on your content
   - Consider network conditions of your users
   - Balance between compression overhead and benefits

4. **Exclusions**
   - Exclude health check endpoints
   - Exclude metrics endpoints
   - Exclude already compressed content
   - Exclude very small responses

### Example Use Cases

1. **Static Content**
```typescript
compression: {
  enabled: true,
  level: 9,
  types: ['text/html', 'text/css', 'application/javascript'],
  threshold: 1024
}
```

2. **API Responses**
```typescript
compression: {
  enabled: true,
  level: 6,
  types: ['application/json'],
  threshold: 512,
  exclude: ['/api/health', '/api/metrics']
}
```

3. **High Performance**
```typescript
compression: {
  enabled: true,
  level: 4,
  threshold: 2048,
  windowBits: 12,
  memLevel: 4
}
```

4. **Maximum Compression**
```typescript
compression: {
  enabled: true,
  level: 9,
  brotli: {
    enabled: true,
    level: 11,
    quality: 11
  }
}
``` 