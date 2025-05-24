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
    const reqOrigin = ctx.headers.get('origin');

    // If origin is true, reflect the request's origin and always allow credentials
    if (typeof origin === 'boolean' && origin === true) {
      allowedOrigin = reqOrigin || '*';
      ctx.set('Access-Control-Allow-Origin', allowedOrigin);
      ctx.set('Access-Control-Allow-Credentials', 'true');
    } else if (typeof origin === 'undefined') {
      // If origin is undefined, behave like origin: true (allow all origins, reflect if present)
      allowedOrigin = reqOrigin || '*';
      ctx.set('Access-Control-Allow-Origin', allowedOrigin);
      if (credentials) ctx.set('Access-Control-Allow-Credentials', 'true');
    } else if (Array.isArray(origin)) {
      allowedOrigin = origin.includes(reqOrigin) ? reqOrigin : '';
      ctx.set('Access-Control-Allow-Origin', allowedOrigin);
      if (credentials) ctx.set('Access-Control-Allow-Credentials', 'true');
    } else {
      // origin is a string (e.g. '*', 'https://example.com')
      allowedOrigin = origin;
      ctx.set('Access-Control-Allow-Origin', allowedOrigin);
      if (credentials) ctx.set('Access-Control-Allow-Credentials', 'true');
    }

    ctx.set('Access-Control-Allow-Methods', methods.join(','));
    ctx.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
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