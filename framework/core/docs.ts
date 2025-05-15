import { scanRoutes } from "./utils";
import { resolve } from "node:path";
import { generateOpenAPISpec, serveSwaggerUI } from "./openapi";

// Real TCP doc generator
async function generateTcpDocs(ctx?: any) {
  // Try to get tcpDir from ctx or router if available
  let tcpDir: string | undefined;
  if (ctx && ctx.router && ctx.router.tcpDir) {
    tcpDir = ctx.router.tcpDir;
  } else if (ctx && ctx.tcpDir) {
    tcpDir = ctx.tcpDir;
  } else {
    // Fallback: try to use process.cwd() and a default
    tcpDir = resolve(process.cwd(), "src/tcp");
  }
  if (!tcpDir) tcpDir = resolve(process.cwd(), "src/tcp");
  const routes = await scanRoutes(tcpDir);
  const endpoints: any[] = [];
  for (const route of routes) {
    if (route.type !== "tcp") continue;
    let mod;
    try {
      mod = await import(route.file + "?t=" + Date.now());
    } catch (e) {
      continue;
    }
    // List all exported handler names
    const handlers = Object.keys(mod).filter(k => typeof mod[k] === 'function');
    endpoints.push({ file: route.file, handlers });
  }
  return { endpoints };
}
async function serveTcpDocsHtml(ctx?: any) {
  return new Response("<h2>TCP Documentation (stub)</h2>", { headers: { "Content-Type": "text/html" } });
}

// Stub WebSocket doc generators
async function generateWsDocs(ctx?: any) {
  return {
    description: "WebSocket endpoints documentation (stub)",
    endpoints: [],
  };
}
async function serveWsDocsHtml(ctx?: any) {
  return new Response("<h2>WebSocket Documentation (stub)</h2>", { headers: { "Content-Type": "text/html" } });
}

// Stub tRPC doc generators
async function generateTrpcDocs(ctx?: any) {
  return {
    description: "tRPC endpoints documentation (stub)",
    endpoints: [],
  };
}
async function serveTrpcDocsHtml(ctx?: any) {
  return new Response("<h2>tRPC Documentation (stub)</h2>", { headers: { "Content-Type": "text/html" } });
}

// Plugin factory
export function docs(options: { http?: boolean; tcp?: boolean; ws?: boolean; trpc?: boolean }) {
  return (ctx: any) => {
    // All-in-one HTML
    ctx.router.get("/docs", async (ctx2: any) => {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Docs</title>
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #f8fafc; }</style>
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">API Documentation</h1>
    <div id="docs-root" class="space-y-8"></div>
  </div>
  <script>
    async function renderDocs() {
      const res = await fetch('/docs.json');
      const data = await res.json();
      const root = document.getElementById('docs-root');
      root.innerHTML = '';
      for (const proto of Object.keys(data)) {
        const section = document.createElement('section');
        section.className = 'bg-white rounded-lg shadow p-6';
        section.innerHTML = '<h2 class="text-2xl font-semibold mb-4">' + proto.toUpperCase() + '</h2>';
        if (proto === 'http' && data.http && data.http.paths) {
          for (const [path, methods] of Object.entries(data.http.paths)) {
            const pathDiv = document.createElement('div');
            pathDiv.className = 'mb-4 border-b pb-4';
            pathDiv.innerHTML = '<div class="font-mono text-blue-700">' + path + '</div>';
            for (const [method, info] of Object.entries(methods)) {
              const methodDiv = document.createElement('div');
              methodDiv.className = 'ml-4 my-2';
              methodDiv.innerHTML = '<span class="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold uppercase text-xs mr-2">' + method + '</span>' +
                '<button class="underline text-sm" onclick="this.nextElementSibling.classList.toggle(\\'hidden\\')">Details</button>' +
                '<div class="hidden mt-2 text-sm bg-slate-100 rounded p-2">' +
                '<pre>' + JSON.stringify(info, null, 2) + '</pre></div>';
              pathDiv.appendChild(methodDiv);
            }
            section.appendChild(pathDiv);
          }
        } else if (proto === 'tcp' && data.tcp && data.tcp.endpoints) {
          for (const ep of data.tcp.endpoints) {
            const epDiv = document.createElement('div');
            epDiv.className = 'mb-2';
            epDiv.innerHTML = '<div class="font-mono text-green-700">' + ep.file + '</div>' +
              '<div class="ml-4 text-xs text-slate-600">Handlers: ' + ep.handlers.join(', ') + '</div>';
            section.appendChild(epDiv);
          }
        } else if (proto === 'ws' && data.ws) {
          section.innerHTML += '<pre class="bg-slate-100 p-2 rounded text-xs">' + JSON.stringify(data.ws, null, 2) + '</pre>';
        } else if (proto === 'trpc' && data.trpc) {
          section.innerHTML += '<pre class="bg-slate-100 p-2 rounded text-xs">' + JSON.stringify(data.trpc, null, 2) + '</pre>';
        }
        root.appendChild(section);
      }
    }
    renderDocs();
  </script>
</body>
</html>`;
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    });
    // All-in-one JSON
    ctx.router.get("/docs.json", async (ctx2: any) => {
      // Merge plugin context (ctx) and request context (ctx2)
      const pluginCtx = { ...ctx, ...ctx2, router: ctx.router };
      const result: any = {};
      if (options.http) result.http = await generateOpenAPISpec(pluginCtx);
      if (options.tcp) result.tcp = await generateTcpDocs(pluginCtx);
      if (options.ws) result.ws = await generateWsDocs(pluginCtx);
      if (options.trpc) result.trpc = await generateTrpcDocs(pluginCtx);
      return Response.json(result);
    });
    // Per-protocol HTML and JSON
    if (options.http) {
      ctx.router.get("/docs/http", (ctx2: any) => serveSwaggerUI(ctx2));
      ctx.router.get("/docs/http.json", async (ctx2: any) => Response.json(await generateOpenAPISpec({ ...ctx, ...ctx2, router: ctx.router })));
    }
    if (options.tcp) {
      ctx.router.get("/docs/tcp", (ctx2: any) => serveTcpDocsHtml(ctx2));
      ctx.router.get("/docs/tcp.json", async (ctx2: any) => Response.json(await generateTcpDocs(ctx2)));
    }
    if (options.ws) {
      ctx.router.get("/docs/ws", (ctx2: any) => serveWsDocsHtml(ctx2));
      ctx.router.get("/docs/ws.json", async (ctx2: any) => Response.json(await generateWsDocs(ctx2)));
    }
    if (options.trpc) {
      ctx.router.get("/docs/trpc", (ctx2: any) => serveTrpcDocsHtml(ctx2));
      ctx.router.get("/docs/trpc.json", async (ctx2: any) => Response.json(await generateTrpcDocs(ctx2)));
    }
  };
} 