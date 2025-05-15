// Built-in CORS middleware
export type CORSOptions = {
  origin?: string;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
};

// In the future, global config (like API version, name, etc.) should go in a breeze.json or similar, not here.

export function cors(options: CORSOptions = {}): any {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    credentials = false,
  } = options;

  return async function (ctx: any, next: () => Promise<Response>): Promise<Response> {
    // Set CORS headers
    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Methods', methods.join(','));
    ctx.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
    if (credentials) {
      ctx.set('Access-Control-Allow-Credentials', 'true');
    }

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