import Link from "next/link"
import { ArrowRight, Zap, Package, Shield, Globe, Database, FileCode, Copy, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"

// Hardcoded plugins data
const plugins = [
  {
    id: 1,
    name: "CORS",
    slug: "cors",
    description: "Enable Cross-Origin Resource Sharing (CORS) for your API with configurable options.",
    version: "1.0.4",
    installationCommand: "bun add @breezeapi/cors",
    isOfficial: true,
    iconName: "Globe",
    githubUrl: "https://github.com/foxyyyyyyyyyyyyy/breezeapi-plugins",
    npmDownloads: 323,
  },
  {
    id: 2,
    name: "CRON",
    slug: "cron",
    description: "Schedule tasks to run at specific intervals using CRON expressions.",
    version: "1.0.4",
    installationCommand: "bun add @breezeapi/cron",
    isOfficial: true,
    iconName: "regex",
    githubUrl: "https://github.com/foxyyyyyyyyyyyyy/breezeapi-plugins",
    npmDownloads: 204,
  },
  {
    id: 3,
    name: "Caching",
    slug: "caching",
    description: "Implement a caching middleware with an redis backend.",
    version: "1.0.11",
    installationCommand: "bun add @breezeapi/cache",
    isOfficial: true,
    iconName: "regex",
    githubUrl: "https://github.com/foxyyyyyyyyyyyyy/breezeapi-plugins",
    npmDownloads: 204,
  },
  /*{
    id: 4,
    name: "Time Plugin",
    slug: "time",
    description: "Transform human readable time strings into Date objects. Supports multiple formats.",
    version: "1.0.0",
    installationCommand: "bun add @breezeapi/time",
    isOfficial: true,
    iconName: "regex",
    githubUrl: "https://github.com/foxyyyyyyyyyyyyy/breezeapi-plugins",
    npmDownloads: 204,
  },*/
]

// Helper function to get the correct icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Globe":
      return <Globe className="h-6 w-6 text-teal-400" />
    case "Shield":
      return <Shield className="h-6 w-6 text-teal-400" />
    case "Package":
      return <Package className="h-6 w-6 text-teal-400" />
    case "Database":
      return <Database className="h-6 w-6 text-teal-400" />
    case "FileCode":
      return <FileCode className="h-6 w-6 text-teal-400" />
    default:
      return <Package className="h-6 w-6 text-teal-400" />
  }
}

export default function PluginsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 border-b border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-slate-800/50 px-3 py-1 text-sm font-semibold text-teal-400">
                  Extend Your API
                </div>
                <h1 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-5xl">BreezeAPI Plugins</h1>
                <p className="max-w-[900px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Enhance your API with official plugins that add powerful features with minimal configuration
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex flex-col h-full rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-lg transition-all hover:border-slate-700"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {getIconComponent(plugin.iconName)}
                    <h3 className="text-xl font-bold text-slate-50">{plugin.name}</h3>
                    {plugin.isOfficial && (
                      <Badge className="ml-auto bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border-none">
                        Official
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 mb-4 flex-grow">{plugin.description}</p>
                  <div className="rounded-md bg-slate-900 border border-slate-800 p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-teal-400" />
                        <span className="text-sm font-medium text-slate-300">Installation</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy code</span>
                      </Button>
                    </div>
                    <pre className="overflow-x-auto text-sm font-mono text-teal-300">
                      <code>{plugin.installationCommand}</code>
                    </pre>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Downloads:</span>
                        <span className="text-sm font-medium text-teal-400">
                          {plugin.npmDownloads.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Version:</span>
                        <span className="text-sm font-medium text-teal-400">{plugin.version}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <a
                        href={`https://www.npmjs.com/package/@breezeapi/${plugin.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" fill="currentColor">
                            <path d="M0 0v24h24V0H0zm6.672 19.992H4.008V4.008h5.328v15.984H6.672zm6.336-7.992h-2.664v-3.336h2.664v3.336zm0 7.992h-2.664v-5.328h2.664v5.328zm6.336 0h-2.664V8.016h-2.664V4.008h5.328v15.984z" />
                          </svg>
                          npm
                        </Button>
                      </a>
                      {plugin.githubUrl && (
                        <a href={plugin.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                          </Button>
                        </a>
                      )}
                    </div>
                    <Link href={`/docs/plugins/${plugin.slug}`} className="mt-2">
                      <Button
                        variant="outline"
                        className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50 gap-1.5"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-slate-800/50 px-2.5 py-0.5 text-xs font-semibold text-teal-400">
                  Extend BreezeAPI
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-4xl">
                  Create your own plugins
                </h2>
                <p className="text-slate-400 md:text-xl">
                  BreezeAPI offers tools to let you create your own plugins easier like a global config object.
                </p>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-teal-400"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Hook into request/response lifecycle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-teal-400"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Add global middleware</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-teal-400"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Extend core functionality</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/docs/plugins/creating-plugins">
                    <Button className="bg-teal-500 text-slate-950 hover:bg-teal-400">Learn How</Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-sm text-slate-400">my-plugin.ts</div>
                  </div>
                </div>
                <div className="bg-slate-900 p-4">
                  <pre className="overflow-x-auto text-sm font-mono text-teal-300">
                    <code>{`
                    import { Config, type apiRequest, type apiResponse, type apiNext } from '@breezeapi/core';
[...]

/**
 * Zod schema for per-route cache configuration.
 * - enabled: Enable or disable caching for this route.
 * - cacheKey: Optional custom cache key. If not provided, the URL will be used.
 * - duration: Cache duration in seconds.
 */
export const cacheConfigSchema = z.object({
    enabled: z.boolean().default(true), // Caching active or not
    cacheKey: z.string().optional(), // Optional cache key for custom cache key generation if nothing is provided, the URL will be used as the cache key 
    duration: z.string(), // Cache duration as a string (e.g. "5s", "2h")
});

/**
 * Zod schema for global breezeCache configuration.
 * - redisUrl: Redis connection URL (required).
 * - enabled: Enable or disable caching globally.
 * - excludedPaths: Optional array of route prefixes to exclude from caching.
 * - debug: Optional flag to enable debug logging.
 */
export const breezeCacheConfigSchema = z.object({
    redisUrl: z.string().url(), // required Redis URL
    enabled: z.boolean().default(true), // Caching active or not
    excludedPaths: z.array(z.string()).optional(), // Optional: excluded routes for caching
    debug: z.boolean().optional(), // <-- Add debug flag
});

[...]
export function initializeCache() {
    const BreezeConfig = Config.get('breezeCache');
    const parseResult = breezeCacheConfigSchema.safeParse(BreezeConfig);
    [...]
}

                    `}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter text-slate-50 md:text-4xl/tight">
                Ready to enhance your API?
              </h2>
              <p className="mx-auto max-w-[600px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start using BreezeAPI plugins today and take your API to the next level.
              </p>
            </div>
            <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link href="https://github.com/foxyyyyyyyyyyyyy/breezeapi-plugins" target="_blank">
                <Button size="lg" className="bg-teal-500 text-slate-950 hover:bg-teal-400 gap-1.5">
                  View All Plugins
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/getting-started">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50 gap-1.5"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="container px-4 py-10 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-teal-400" />
                <span className="text-xl font-bold text-slate-50">BreezeAPI</span>
              </div>
              <p className="text-sm text-slate-400">Build APIs at the speed of thought with TypeScript and Bun.</p>
              <div className="flex items-center gap-3">
                <a href="https://github.com/breeze-api/breeze" className="text-slate-400 hover:text-teal-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="https://twitter.com/breezeapi" className="text-slate-400 hover:text-teal-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="https://discord.gg/breezeapi" className="text-slate-400 hover:text-teal-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12h6m-6 4h6m-3-8v8M8 7H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/getting-started" className="text-sm text-slate-400 hover:text-teal-400">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link href="/docs/core-concepts/routing" className="text-sm text-slate-400 hover:text-teal-400">
                    File-based Routing
                  </Link>
                </li>
                <li>
                  <Link href="/docs/websockets/introduction" className="text-sm text-slate-400 hover:text-teal-400">
                    WebSockets
                  </Link>
                </li>
                <li>
                  <Link href="/plugins" className="text-sm text-slate-400 hover:text-teal-400">
                    Plugins
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/examples" className="text-sm text-slate-400 hover:text-teal-400">
                    Examples
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-slate-400 hover:text-teal-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/breeze-api/breeze"
                    className="text-sm text-slate-400 hover:text-teal-400"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-sm text-slate-400 hover:text-teal-400">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-200 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-slate-400 hover:text-teal-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-slate-400 hover:text-teal-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/license" className="text-sm text-slate-400 hover:text-teal-400">
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} BreezeAPI. All rights reserved.</p>
            <p className="text-xs text-slate-500 mt-2 sm:mt-0">
              Made with ❤️ using <span className="text-teal-500">Bun</span> and{" "}
              <span className="text-teal-500">TypeScript</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
