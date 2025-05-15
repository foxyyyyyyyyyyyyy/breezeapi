// WebSocketContext for WebSocket handlers
// TODO: Replace 'any' with Bun.ServerWebSocket when Bun types are available
export class WebSocketContext {
  raw: any;
  id: string;
  data: Record<string, any> = {};
  httpRequest: Request;
  params: Record<string, string | undefined> = {};
  url?: URL;

  constructor(raw: any, httpRequest: Request, id: string, params: Record<string, string | undefined> = {}) {
    this.raw = raw;
    this.httpRequest = httpRequest;
    this.id = id;
    this.params = params;
  }

  static extractParams(routePattern: string, actualPath: string): Record<string, string | undefined> {
    const params: Record<string, string | undefined> = {};
    const routeParts = routePattern.split('/').filter(Boolean);
    const pathParts = actualPath.split('/').filter(Boolean);
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith('[') && routeParts[i].endsWith(']')) {
        const key = routeParts[i].slice(1, -1);
        params[key] = pathParts[i];
      }
    }
    return params;
  }

  send(message: string | Uint8Array | ArrayBufferView): void {
    this.raw.send(message);
  }

  close(code?: number, reason?: string): void {
    this.raw.close(code, reason);
  }

  // Instance pub/sub helpers (set by router)
  subscribe?: (topic: string) => void;
  unsubscribe?: (topic: string) => void;
  publish?: (topic: string, message: string | Uint8Array | ArrayBufferView) => void;

  // Static pub/sub storage and methods
  static _topics: Map<string, Set<WebSocketContext>> = new Map();
  static _subscribe(topic: string, wsCtx: WebSocketContext) {
    if (!WebSocketContext._topics.has(topic)) WebSocketContext._topics.set(topic, new Set());
    WebSocketContext._topics.get(topic)!.add(wsCtx);
  }
  static _unsubscribe(topic: string, wsCtx: WebSocketContext) {
    if (WebSocketContext._topics.has(topic)) WebSocketContext._topics.get(topic)!.delete(wsCtx);
  }
  static _publish(topic: string, message: string | Uint8Array | ArrayBufferView) {
    if (WebSocketContext._topics.has(topic)) {
      for (const wsCtx of WebSocketContext._topics.get(topic)!) {
        wsCtx.send(message);
      }
    }
  }
} 