import Link from "next/link"
import { ArrowRight, FileCode, Zap, Puzzle, GitBranch, Terminal, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-5xl xl:text-6xl/none">
                    Build APIs with Breeze
                  </h1>
                  <p className="max-w-[600px] text-slate-400 md:text-xl">
                    BreezeAPI is a TypeScript framework that aims to make building APIs a breeze.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/docs/getting-started">
                    <Button size="lg" className="bg-teal-500 text-slate-950 hover:bg-teal-400 gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="https://github.com/foxyyyyyyyyyyyyy/breezeapi">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50 gap-1.5"
                    >
                      <GitBranch className="h-4 w-4" />
                      GitHub
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 shadow-lg">
                  <pre className="overflow-x-auto text-sm font-mono text-teal-300">
                    <code>{`import { t, HttpContext } from '@breezeapi/core';
import { sendToChannel } from '@breezeapi/discord';

export const GET_config = {
  querys: t.object({ name: t.string() }),
  response: t.string(),
};

export async function GET(ctx: HttpContext) {
  const name = ctx.querys?.name || "No name";
  await sendToChannel('1364724391392579695', \`New registration: \${name}\`);
  return Response.json({ name });
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 border-b border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-slate-800/50 px-2.5 py-0.5 text-xs font-semibold text-teal-400">
                  Why BreezeAPI?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-5xl">
                  Features that make development a breeze
                </h2>
                <p className="max-w-[900px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Some of the features we offer to help you build your API faster.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-teal-400" />
                    <h3 className="text-xl font-bold text-slate-50">File-based Routing</h3>
                  </div>
                  <p className="text-slate-400">
                    Create routes by simply adding files to your project. BreezeAPI automatically maps your file
                    structure to endpoints.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-teal-400" />
                    <h3 className="text-xl font-bold text-slate-50">Builtin Sync Layer</h3>
                  </div>
                  <p className="text-slate-400">
                    BreezeAPI comes with a built-in sync layer, that allowes you to sync your websocket data with your database. 
                    
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-teal-400" />
                    <h3 className="text-xl font-bold text-slate-50">Plugin System</h3>
                  </div>
                  <p className="text-slate-400">
                    We allow you to build your own plugins, that can deeply integrate into the framework and make it even more powerful.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
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
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                    <h3 className="text-xl font-bold text-slate-50">Multi Protocoll Support</h3>
                  </div>
                  <p className="text-slate-400">
                    Add Websockets, http routes, tRCP or TCP to your API just by adding a file. No config required!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-b border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-4xl md:text-5xl">
                  Get started in seconds
                </h2>
                <p className="max-w-[900px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  BreezeAPI is designed to be simple to set up and use
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl pt-8">
              <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-teal-400" />
                    <span className="text-sm font-medium text-slate-300">Terminal</span>
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
                  <code>{`# Install BreezeAPI
bun add @breezeapi/core

# Initialize a new project
coming soon...
`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 border-b border-slate-800">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter text-slate-50 md:text-4xl/tight">
                Ready to build your API?
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start building with BreezeAPI today and let us know what you think.
              </p>
            </div>
            <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link href="/docs/getting-started">
                <Button size="lg" className="bg-teal-500 text-slate-950 hover:bg-teal-400 gap-1.5">
                  Read the Docs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/foxyyyyyyyyyyyyy/breezeapi">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50 gap-1.5"
                >
                  <GitBranch className="h-4 w-4" />
                  Star on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>
       
        <section className="w-full py-12 md:py-24 lg:py-32 border-b border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-slate-800/50 px-2.5 py-0.5 text-xs font-semibold text-teal-400">
                  Experimental
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-4xl">
                  Documentation out of the box
                </h2>
                <p className="text-slate-400 md:text-xl">
                  BreezeAPI automatically generates Documentation for your API endpoints and all other supported protocols.
                  This is still experimental and does currently not contain a option to add it as ui.
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
                    <span>OpenAPI compatible</span>
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
                    <span>No config required</span>
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
                    <span>Automatic route discovery</span>
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
                    <span>Disable it if you don't need it</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/docs/plugins/docs">
                    <Button className="bg-teal-500 text-slate-950 hover:bg-teal-400">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-sm text-slate-400">http://localhost:3000/docs</div>
                  </div>
                </div>
                <div className="bg-slate-900 p-4">
                  <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-teal-400">BreezeAPI Documentation</h3>
                      <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full">v1.0.0</span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">
                            GET
                          </span>
                          <span className="text-slate-300 font-mono">/users</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">Get all users</p>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">POST</span>
                          <span className="text-slate-300 font-mono">/users</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">Create a new user</p>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">
                            GET
                          </span>
                          <span className="text-slate-300 font-mono">/users/{"{id}"}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">Get a user by ID</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 border-b border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg order-2 lg:order-1">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-sm text-slate-400">sockets/chat/[id].ts</div>
                  </div>
                </div>
                <div className="bg-slate-900 p-4">
                  <pre className="overflow-x-auto text-sm font-mono text-teal-300">
                    <code>{`
export function open(ctx) {
  // Handle connection logic here
}

export function message(ctx, msg) {
  let parsed;
  try {
    parsed = JSON.parse(msg);
  } catch {
    ctx.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
    return;
  }
  if (!parsed.user || !parsed.text) {
    ctx.send(JSON.stringify({ type: 'error', error: 'Missing user or text' }));
    return;
  }
  // Handle the message (e.g., echo or broadcast)
  ctx.send(JSON.stringify({ type: 'message', user: parsed.user, text: parsed.text, ts: Date.now() }));
}

export function close(ctx) {
  // Handle cleanup here
}
`}</code>
                  </pre>
                </div>
              </div>
              <div className="space-y-4 order-1 lg:order-2">
                <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-slate-800/50 px-2.5 py-0.5 text-xs font-semibold text-teal-400">
                  Real-time
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-4xl">
                  Dynamic WebSocket routing
                </h2>
                <p className="text-slate-400 md:text-xl">
                  Create dynamic WebSocket endpoints with the same file-based routing system. Perfect for chat rooms,
                  live dashboards, and anything you can imagine.
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
                    <span>Dynamic route parameters</span>
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
                    <span>Isolated state per endpoint</span>
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
                    <span>Targeted broadcasting</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/docs/websockets/introduction">
                    <Button className="bg-teal-500 text-slate-950 hover:bg-teal-400">Learn More</Button>
                  </Link>
                </div>
              </div>
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
                  <Link href="/swagger" className="text-sm text-slate-400 hover:text-teal-400">
                    API Reference
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
