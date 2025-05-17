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
  state: Record<string, any> = {};
  private _jsonBody?: any;
  private _textBody?: string;
  private _rawBody?: Uint8Array;
  private _formData?: FormData;

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
    if (this._rawBody !== undefined) return this._rawBody;
    this._rawBody = new Uint8Array(await this.req.arrayBuffer());
    return this._rawBody;
  }

  async json<T = any>(): Promise<T> {
    if (this._jsonBody !== undefined) return this._jsonBody;
    this._jsonBody = await this.req.json();
    return this._jsonBody;
  }

  async text(): Promise<string> {
    if (this._textBody !== undefined) return this._textBody;
    this._textBody = await this.req.text();
    return this._textBody;
  }

  html(html: string): Response {
    const headersObj: Record<string, string> = { 'Content-Type': 'text/html' };
    this._responseHeaders.forEach((v, k) => { headersObj[k] = v; });
    return new Response(html, { headers: headersObj });
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
    this._responseHeaders.forEach((v, k) => {
      headers.set(k, v);
    });
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

  async formData(): Promise<FormData> {
    if (this._formData !== undefined) return this._formData;
    this._formData = await this.req.formData();
    return this._formData;
  }

  async files(): Promise<Record<string, File | File[]>> {
    const form = await this.formData();
    const files: Record<string, File | File[]> = {};
    for (const [key, value] of Array.from(form.entries())) {
      // @ts-ignore
      if (typeof File !== 'undefined' && value instanceof File) {
        if (files[key]) {
          if (Array.isArray(files[key])) {
            (files[key] as File[]).push(value);
          } else {
            files[key] = [files[key] as File, value];
          }
        } else {
          files[key] = value;
        }
      }
    }
    return files;
  }

  public get responseHeaders(): Headers {
    return this._responseHeaders;
  }
} 