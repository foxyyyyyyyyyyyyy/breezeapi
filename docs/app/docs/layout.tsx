import type { ReactNode } from "react"
import Link from "next/link"
import { Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { DocsSidebarWrapper } from "@/components/docs-sidebar-wrapper"

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex-1 container px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0 md:border-r border-slate-800 pr-4">
            <DocsSidebarWrapper />
          </aside>
          <main className="flex-1 min-w-0">
            <article className="prose prose-slate max-w-none">{children}</article>
          </main>
        </div>
      </div>
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="container flex flex-col gap-2 py-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-teal-400" />
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} BreezeAPI. All rights reserved.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="/docs"
              className="text-sm font-medium text-slate-400 hover:text-teal-400 hover:underline underline-offset-4"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com/breeze-api/breeze"
              className="text-sm font-medium text-slate-400 hover:text-teal-400 hover:underline underline-offset-4"
            >
              GitHub
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium text-slate-400 hover:text-teal-400 hover:underline underline-offset-4"
            >
              Examples
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
