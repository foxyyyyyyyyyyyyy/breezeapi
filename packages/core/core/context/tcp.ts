// TcpSocketContext for TCP handlers
// TODO: Replace 'any' with Bun.Socket when Bun types are available
export class TcpSocketContext {
  raw: any;
  id: string;
  data: Record<string, any> = {};
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  params: Record<string, string | undefined> = {};
  state: Record<string, any> = {};

  constructor(raw: any, id: string, localAddress: string, localPort: number, remoteAddress: string, remotePort: number, params: Record<string, string | undefined> = {}) {
    this.raw = raw;
    this.id = id;
    this.localAddress = localAddress;
    this.localPort = localPort;
    this.remoteAddress = remoteAddress;
    this.remotePort = remotePort;
    this.params = params;
  }

  static extractParams(routePattern: string, actualPath: string): Record<string, string | undefined> {
    // For TCP, params are not typically used, but this is here for future extensibility
    return {};
  }

  write(data: string | Uint8Array | ArrayBufferView): number {
    // Delegate to the underlying Bun TCP socket's write method
    if (this.raw && typeof this.raw.write === 'function') {
      return this.raw.write(data);
    }
    return 0;
  }

  end(data?: string | Uint8Array | ArrayBufferView): void {
    // Delegate to the underlying Bun TCP socket's end method
    if (this.raw && typeof this.raw.end === 'function') {
      if (data !== undefined) {
        this.raw.end(data);
      } else {
        this.raw.end();
      }
    }
  }
} 