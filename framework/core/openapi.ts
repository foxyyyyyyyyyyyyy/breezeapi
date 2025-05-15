import { scanRoutes } from "./utils";
import { resolve } from "node:path";

// Helper: Convert zod object to JSON schema (very basic, for demo)
function zodToJsonSchema(zodObj: any): any {
  if (!zodObj || typeof zodObj !== "object" || !zodObj.shape) return undefined;
  const properties: any = {};
  for (const [key, val] of Object.entries(zodObj.shape)) {
    // Only handle string type for demo
    properties[key] = { type: "string" };
  }
  return {
    type: "object",
    properties,
    required: Object.keys(zodObj.shape),
  };
}

// Helper: Expand zod object to OpenAPI parameters
function zodToOpenApiParams(zodObj: any, location: 'path' | 'query') {
  if (!zodObj || typeof zodObj !== "object" || !zodObj.shape) return [];
  return Object.entries(zodObj.shape).map(([key, val]: [string, any]) => ({
    name: key,
    in: location,
    required: true, // For demo, all required
    schema: { type: "string" }, // Only string for demo
  }));
}

// Helper: Convert /users/[id] to /users/{id}
function toOpenApiPath(routePath: string): string {
  return routePath.replace(/\[([^\]]+)\]/g, "{$1}");
}

const HTTP_METHODS = ["get", "post", "put", "delete", "patch", "options", "head"];

export async function generateOpenAPISpec(ctx?: any): Promise<object> {
  // Use the correct apiDir from the router context if available
  let apiDir: string | undefined;
  if (ctx && ctx.router && ctx.router.apiDir) {
    apiDir = ctx.router.apiDir;
  } else if (ctx && ctx.apiDir) {
    apiDir = ctx.apiDir;
  } else {
    apiDir = resolve(process.cwd(), "src/routes");
  }
  if (!apiDir) apiDir = resolve(process.cwd(), "src/routes");
  const routes = await scanRoutes(apiDir);
  const paths: any = {};
  for (const route of routes) {
    if (route.type !== "http") continue;
    let mod;
    try {
      mod = await import(route.file + "?t=" + Date.now());
    } catch (e) {
      continue;
    }
    // For each HTTP method, look for METHOD_config
    for (const method of HTTP_METHODS) {
      const config = mod[method.toUpperCase() + '_config'];
      if (!config) continue;
      const openApiPath = toOpenApiPath(route.routePath);
      if (!paths[openApiPath]) paths[openApiPath] = {};
      const params = zodToOpenApiParams(config.params, 'path');
      const querys = zodToOpenApiParams(config.querys, 'query');
      paths[openApiPath][method] = {
        summary: config.summary || undefined,
        description: config.description || undefined,
        parameters: [...params, ...querys],
        responses: config.response ? { "200": { description: "Success", content: { "application/json": { schema: zodToJsonSchema(config.response) } } } } : {},
      };
    }
  }
  return {
    openapi: "3.0.0",
    info: {
      title: "API Docs",
      version: "1.0.0",
    },
    paths,
  };
}

export function serveSwaggerUI(ctx?: any): Response {
  // TODO: Serve Swagger UI HTML
  return new Response('<html><body>Swagger UI Coming Soon</body></html>', { headers: { 'Content-Type': 'text/html' } });
} 