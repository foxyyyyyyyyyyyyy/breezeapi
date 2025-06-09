// tRPC adapter for HTTP integration
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export function trpcHandler(router: any, createContext?: any) {
  return (req: Request) =>
    fetchRequestHandler({
      endpoint: '', // dynamic endpoint
      req,
      router,
      createContext: createContext || (() => ({})),
    });
} 