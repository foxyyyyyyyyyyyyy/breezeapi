// Built-in CORS middleware
export type CORSOptions = {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  exposedHeaders?: string[];
  maxAge?: number;
};


export function cors(options: CORSOptions = {}): any {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    credentials = false,
    exposedHeaders = [],
    maxAge,
  } = options;

  return async function (ctx: any, next: () => Promise<Response>): Promise<Response> {
    let allowedOrigin = origin;
    if (Array.isArray(origin)) {
      const reqOrigin = ctx.headers.get('origin');
      allowedOrigin = origin.includes(reqOrigin) ? reqOrigin : '';
    }
    ctx.set('Access-Control-Allow-Origin', allowedOrigin);
    ctx.set('Access-Control-Allow-Methods', methods.join(','));
    ctx.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
    if (credentials) ctx.set('Access-Control-Allow-Credentials', 'true');
    if (exposedHeaders.length) ctx.set('Access-Control-Expose-Headers', exposedHeaders.join(','));
    if (maxAge) ctx.set('Access-Control-Max-Age', String(maxAge));

    // Handle preflight OPTIONS request
    if (ctx.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: ctx._responseHeaders,
      });
    }

    return next();
  };
} 