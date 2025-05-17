// Hardcoded plugins data for when database is not available
const hardcodedPlugins = [
  {
    id: 1,
    name: "CORS",
    slug: "cors",
    description: "Enable Cross-Origin Resource Sharing (CORS) for your API with configurable options.",
    version: "1.0.0",
    installation_command: "bun add @breezeapi/cors",
    usage_example: `// config.ts
import { cors } from "@breezeapi/cors";

export default {
  plugins: [
    cors({
      origin: ["https://example.com"],
      methods: ["GET", "POST"],
      credentials: true
    })
  ]
}`,
    is_official: true,
    icon_name: "Globe",
    github_url: "https://github.com/breeze-api/cors",
    npm_downloads: 1250,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: "Rate Limiting",
    slug: "rate-limit",
    description:
      "Protect your API from abuse with configurable rate limiting based on IP, user, or custom identifiers.",
    version: "1.0.0",
    installation_command: "bun add @breezeapi/rate-limit",
    usage_example: `// config.ts
import { rateLimit } from "@breezeapi/rate-limit";

export default {
  plugins: [
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      message: "Too many requests, please try again later."
    })
  ]
}`,
    is_official: true,
    icon_name: "Shield",
    github_url: "https://github.com/breeze-api/rate-limit",
    npm_downloads: 980,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: "Compression",
    slug: "compression",
    description:
      "Compress API responses to improve performance and reduce bandwidth usage with gzip, deflate, or brotli.",
    version: "1.0.0",
    installation_command: "bun add @breezeapi/compression",
    usage_example: `// config.ts
import { compression } from "@breezeapi/compression";

export default {
  plugins: [
    compression({
      level: 6, // compression level (1-9)
      threshold: 1024, // min size to compress
      encodings: ["gzip", "deflate", "br"]
    })
  ]
}`,
    is_official: true,
    icon_name: "Package",
    github_url: "https://github.com/breeze-api/compression",
    npm_downloads: 820,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: "Database",
    slug: "database",
    description:
      "Seamlessly integrate with popular databases like PostgreSQL, MySQL, and MongoDB with type-safe queries.",
    version: "1.0.0",
    installation_command: "bun add @breezeapi/database",
    usage_example: `// config.ts
import { database } from "@breezeapi/database";

export default {
  plugins: [
    database({
      type: "postgres",
      url: process.env.DATABASE_URL,
      poolSize: 10,
      ssl: true
    })
  ]
}

// routes/users.ts
import { db } from "@breezeapi/database";

export async function GET() {
  const users = await db.query\`
    SELECT * FROM users LIMIT 10
  \`;
  
  return { users };
}`,
    is_official: true,
    icon_name: "Database",
    github_url: "https://github.com/breeze-api/database",
    npm_downloads: 1450,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    name: "Authentication",
    slug: "auth",
    description:
      "Add JWT-based authentication to your API with support for multiple strategies and role-based access control.",
    version: "1.0.0",
    installation_command: "bun add @breezeapi/auth",
    usage_example: `// config.ts
import { auth } from "@breezeapi/auth";

export default {
  plugins: [
    auth({
      secret: process.env.JWT_SECRET,
      expiresIn: "7d",
      strategies: ["jwt", "basic"],
      userProvider: async (id) => {
        // Fetch user from database
        return db.users.findUnique({ where: { id } });
      }
    })
  ]
}

// middleware/auth.ts
import { requireAuth } from "@breezeapi/auth";

export default requireAuth({
  roles: ["admin", "user"],
  excludePaths: ["/login", "/register"]
});`,
    is_official: true,
    icon_name: "Shield",
    github_url: "https://github.com/breeze-api/auth",
    npm_downloads: 1680,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    name: "Validation",
    slug: "validation",
    description: "Validate request data with Zod schemas for type-safe API endpoints with automatic error handling.",
    version: "1.0.0",
    installation_command: "bun add @breezeapi/validation",
    usage_example: `// routes/users.ts
import { z } from "zod";
import { validate } from "@breezeapi/validation";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).optional()
});

export const POST = validate({
  body: userSchema,
  handler: async (req, { body }) => {
    // body is fully typed and validated
    const newUser = await db.users.create({
      data: body
    });
    
    return { user: newUser };
  }
});`,
    is_official: true,
    icon_name: "FileCode",
    github_url: "https://github.com/breeze-api/validation",
    npm_downloads: 1320,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

export interface Plugin {
  id: number
  name: string
  slug: string
  description: string
  version: string
  installation_command: string
  usage_example: string
  is_official: boolean
  icon_name: string | null
  github_url: string | null
  npm_downloads: number
  created_at: Date
  updated_at: Date
}

// Replace all the functions with versions that only return hardcoded data:

export async function getAllPlugins(): Promise<Plugin[]> {
  return hardcodedPlugins
}

export async function getPluginBySlug(slug: string): Promise<Plugin | null> {
  const plugin = hardcodedPlugins.find((p) => p.slug === slug)
  return plugin || null
}

export async function getOfficialPlugins(): Promise<Plugin[]> {
  return hardcodedPlugins.filter((p) => p.is_official)
}

export async function searchPlugins(searchTerm: string): Promise<Plugin[]> {
  return hardcodedPlugins.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}
