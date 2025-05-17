import Link from "next/link"
import { Book, FileCode, Zap, Puzzle, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import DocsLayout from "@/components/docs-layout"

export default function DocsPage() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">BreezeAPI Documentation</h1>
          <p className="mt-2 text-lg text-slate-400">Everything you need to know about building APIs with BreezeAPI</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/docs/getting-started"
            className="group rounded-lg border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Book className="h-5 w-5 text-teal-400" />
              <h3 className="font-semibold text-slate-50">Getting Started</h3>
            </div>
            <p className="mt-2 text-sm text-slate-400">Learn how to install BreezeAPI and create your first project</p>
          </Link>
          <Link
            href="/docs/core-concepts/routing"
            className="group rounded-lg border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileCode className="h-5 w-5 text-teal-400" />
              <h3 className="font-semibold text-slate-50">File-based Routing</h3>
            </div>
            <p className="mt-2 text-sm text-slate-400">Understand how BreezeAPI's file-based routing system works</p>
          </Link>
          <Link
            href="/docs/websockets/introduction"
            className="group rounded-lg border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Puzzle className="h-5 w-5 text-teal-400" />
              <h3 className="font-semibold text-slate-50">WebSocket Integration</h3>
            </div>
            <p className="mt-2 text-sm text-slate-400">Add real-time capabilities to your API with WebSockets</p>
          </Link>
          <Link
            href="/docs/advanced/deployment"
            className="group rounded-lg border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-teal-400" />
              <h3 className="font-semibold text-slate-50">Deployment</h3>
            </div>
            <p className="mt-2 text-sm text-slate-400">Learn how to deploy your BreezeAPI application to production</p>
          </Link>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-teal-400" />
            <h3 className="font-semibold text-slate-50">Contribute to BreezeAPI</h3>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            BreezeAPI is an open-source project. We welcome contributions from the community.
          </p>
          <div className="mt-4">
            <Link href="https://github.com/foxyyyyyyyyyyyyy/breezeapi" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50"
              >
                <GitBranch className="h-4 w-4" />
                GitHub Repository
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
