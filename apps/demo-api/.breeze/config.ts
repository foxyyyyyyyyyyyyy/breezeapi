import { z } from 'zod';

export default {
  port: 3500,
  debug: true,
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  cache: {
    routeCache: {
      enabled: true,
      ttl: 60, // seconds
    },
  },
  compression: {
    enabled: true,
    level: 6, // 0-9, higher means better compression but slower
  },
} as const; 