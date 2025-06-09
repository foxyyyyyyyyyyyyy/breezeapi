import { CompressionConfig } from './config';
import { Middleware } from './middleware';
import { HttpContext } from './context/api';
import { gzipSync, brotliCompressSync } from 'zlib';

// Brotli compression constants
const BROTLI_MODE = {
  GENERIC: 0,
  TEXT: 1,
  FONT: 2
} as const;

export class CompressionMiddleware {
  private config: CompressionConfig;

  constructor(config: CompressionConfig) {
    this.config = config;
  }

  public async handle(ctx: HttpContext, next: () => Promise<Response>): Promise<Response> {
    if (!this.config.enabled) {
      return next();
    }

    // Check if path should be excluded
    const url = new URL(ctx.url);
    if (this.config.exclude?.some(path => url.pathname.startsWith(path))) {
      return next();
    }

    // Get the response
    const response = await next();

    // Check if response should be compressed
    if (!this.shouldCompress(response)) {
      return response;
    }

    // Get the response body
    const body = await response.arrayBuffer();
    if (body.byteLength < (this.config.threshold || 0)) {
      return response;
    }

    // Check client's accepted encodings
    const acceptEncoding = ctx.headers.get('accept-encoding') || '';
    const supportsBrotli = acceptEncoding.includes('br') && this.config.brotli?.enabled;
    const supportsGzip = acceptEncoding.includes('gzip') && this.config.gzip?.enabled;

    if (!supportsBrotli && !supportsGzip) {
      return response;
    }

    // Compress the response
    let compressedBody: Buffer;
    let encoding: string;

    if (supportsBrotli) {
      compressedBody = this.compressBrotli(Buffer.from(body));
      encoding = 'br';
    } else {
      compressedBody = this.compressGzip(Buffer.from(body));
      encoding = 'gzip';
    }

    // Create new response with compressed body
    const compressedResponse = new Response(compressedBody, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    });

    // Add compression headers
    compressedResponse.headers.set('Content-Encoding', encoding);
    compressedResponse.headers.set('Vary', 'Accept-Encoding');
    compressedResponse.headers.set('Content-Length', compressedBody.length.toString());

    return compressedResponse;
  }

  private shouldCompress(response: Response): boolean {
    const contentType = response.headers.get('content-type');
    if (!contentType) return false;

    // Check if content type should be compressed
    return this.config.types?.some(type => contentType.includes(type)) ?? false;
  }

  private compressBrotli(data: Buffer): Buffer {
    const options = this.config.brotli || {};
    const mode = options.mode === 'text' ? BROTLI_MODE.TEXT :
                options.mode === 'font' ? BROTLI_MODE.FONT :
                BROTLI_MODE.GENERIC;

    return brotliCompressSync(data, {
      params: {
        [Symbol.for('brotli.quality')]: options.quality ?? 11,
        [Symbol.for('brotli.lgwin')]: options.lgwin ?? 22,
        [Symbol.for('brotli.lgblock')]: options.lgblock ?? 0,
        [Symbol.for('brotli.mode')]: mode
      }
    });
  }

  private compressGzip(data: Buffer): Buffer {
    const options = this.config.gzip || {};
    return gzipSync(data, {
      level: options.level ?? 6,
      windowBits: this.config.windowBits ?? 15,
      memLevel: this.config.memLevel ?? 8,
      strategy: this.getGzipStrategy(this.config.strategy ?? 'default')
    });
  }

  private getGzipStrategy(strategy: string): number {
    switch (strategy) {
      case 'filtered': return 1;
      case 'huffman': return 2;
      case 'rle': return 3;
      case 'fixed': return 4;
      default: return 0;
    }
  }
}

// Export as onResponse middleware
export const onResponse = (config: CompressionConfig): Middleware => {
  const compressionMiddleware = new CompressionMiddleware(config);
  return async (ctx: HttpContext, next: () => Promise<Response>) => {
    return compressionMiddleware.handle(ctx, next);
  };
};

// For backward compatibility
export function createCompressionMiddleware(config: CompressionConfig): Middleware {
  return onResponse(config);
} 