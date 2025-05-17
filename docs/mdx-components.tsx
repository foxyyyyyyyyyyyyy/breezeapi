import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Copy, Terminal, FileCode } from "lucide-react"
import { DocsNavigation } from "@/components/docs-navigation"

// Custom components for MDX
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
   
    wrapper: ({ children }) => (
      <>
        {children}
        <DocsNavigation />
      </>
    ),
    // Override default components
    h1: ({ children }) => <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-50 mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-slate-50 mt-6 mb-3">{children}</h3>,
    p: ({ children }) => <p className="text-slate-300 mb-4">{children}</p>,
    a: ({ href, children }) => (
      <Link href={href || "#"} className="text-teal-400 hover:text-teal-300 hover:underline">
        {children}
      </Link>
    ),
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-slate-300 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-slate-300 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-slate-300">{children}</li>,
    code: ({ children }) => <code className="bg-slate-800 text-teal-400 px-1 py-0.5 rounded text-sm">{children}</code>,
    // Custom components
    CodeBlock: ({ children, filename, language }) => (
      <div className="rounded-md bg-slate-900 border border-slate-700 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-slate-300">{filename}</span>
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
        <pre className="mt-2 overflow-x-auto text-sm font-mono text-teal-300">
          <code className={`language-${language || "typescript"}`}>{children}</code>
        </pre>
      </div>
    ),
    Terminal: ({ children }) => (
      <div className="rounded-md bg-slate-900 border border-slate-700 p-4 my-4">
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
        <pre className="mt-2 overflow-x-auto text-sm font-mono text-teal-300">
          <code>{children}</code>
        </pre>
      </div>
    ),
    FileStructure: ({ children }) => (
      <div className="rounded-md bg-slate-900 border border-slate-700 p-4 my-4">
        <pre className="overflow-x-auto text-sm font-mono text-slate-300">
          <code>{children}</code>
        </pre>
      </div>
    ),
    ...components,
  }
}
