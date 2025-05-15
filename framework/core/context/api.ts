// ApiContext for HTTP handlers
export class HttpContext {
  req: Request;
  url: URL;
  method: string;
  headers: Headers;
  params: Record<string, string | undefined> = {};
  querys?: Record<string, any>;
  db: Record<string, any> = {}; // For ORM clients
  private _cookies: Record<string, string> | null = null;
  cookies: Record<string, string> = {};
  private _setCookies: string[] = [];
  private _responseHeaders: Headers = new Headers();

  constructor(req: Request, params: Record<string, string | undefined> = {}) {
    this.req = req;
    this.url = new URL(req.url);
    this.method = req.method;
    this.headers = req.headers;
    this.params = params;
    // Parse cookies immediately for public access
    const cookieHeader = this.headers.get('cookie');
    if (cookieHeader) {
      for (const part of cookieHeader.split(';')) {
        const [k, ...v] = part.trim().split('=');
        this.cookies[k] = v.join('=');
      }
    }
  }

  async query(): Promise<Record<string, string>> {
    return Object.fromEntries(this.url.searchParams.entries());
  }

  async body(): Promise<Uint8Array> {
    return new Uint8Array(await this.req.arrayBuffer());
  }

  async json<T = any>(): Promise<T> {
    return await this.req.json();
  }

  async text(): Promise<string> {
    return await this.req.text();
  }

  html(html: string): Response {
    return new Response(html, { headers: { 'Content-Type': 'text/html', ...Object.fromEntries(this._responseHeaders) } });
  }

  stream(stream: ReadableStream): Response {
    return new Response(stream, { headers: this._responseHeaders });
  }

  set(name: string, value: string): void {
    this._responseHeaders.set(name, value);
  }

  get(name: string): string | undefined {
    return this.headers.get(name) || this._responseHeaders.get(name) || undefined;
  }

  getCookie(name: string): string | undefined {
    if (!this._cookies) {
      this._cookies = {};
      const cookieHeader = this.headers.get('cookie');
      if (cookieHeader) {
        for (const part of cookieHeader.split(';')) {
          const [k, ...v] = part.trim().split('=');
          this._cookies[k] = v.join('=');
        }
      }
    }
    return this._cookies[name];
  }

  setCookie(name: string, value: string, options: Record<string, any> = {}): void {
    let cookie = `${name}=${value}`;
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.httpOnly) cookie += '; HttpOnly';
    if (options.secure) cookie += '; Secure';
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    this._setCookies.push(cookie);
    this._responseHeaders.append('Set-Cookie', cookie);
  }

  buildResponse(body: BodyInit, init: ResponseInit = {}): Response {
    const headers = new Headers(init.headers || {});
    for (const [k, v] of this._responseHeaders.entries()) {
      headers.set(k, v);
    }
    return new Response(body, { ...init, headers });
  }

  res = {
    json: (data: any, status = 200, headers: Record<string, string> = {}) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers },
      }),
    text: (data: string, status = 200, headers: Record<string, string> = {}) =>
      new Response(data, {
        status,
        headers: { 'Content-Type': 'text/plain', ...headers },
      }),
    custom: (body: BodyInit, init: ResponseInit = {}) =>
      new Response(body, init),
  };
} 