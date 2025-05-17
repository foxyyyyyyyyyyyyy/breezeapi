"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

// This would be generated from the breezedocs.json files
// For now, we'll hardcode it
const flatNavigation = [
  { title: "Installation", href: "/docs/getting-started" },
  { title: "Project Structure", href: "/docs/getting-started/project-structure" },
  { title: "Your First API", href: "/docs/getting-started/first-api" },
  { title: "File-based Routing", href: "/docs/core-concepts/routing" },
  { title: "Request & Response", href: "/docs/core-concepts/request-response" },
  { title: "Middleware", href: "/docs/core-concepts/middleware" },
  { title: "Error Handling", href: "/docs/core-concepts/error-handling" },
  { title: "Introduction", href: "/docs/websockets/introduction" },
  { title: "Setting Up WebSockets", href: "/docs/websockets/setup" },
  { title: "Handling Events", href: "/docs/websockets/events" },
  { title: "Authentication", href: "/docs/websockets/authentication" },
]

export function DocsNavigation() {
  const pathname = usePathname()

  // Find current page index
  const currentIndex = flatNavigation.findIndex((item) => item.href === pathname)

  // Get prev and next pages
  const prevPage = currentIndex > 0 ? flatNavigation[currentIndex - 1] : null
  const nextPage = currentIndex < flatNavigation.length - 1 ? flatNavigation[currentIndex + 1] : null

  if (!prevPage && !nextPage) return null

  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
      {prevPage ? (
        <Link
          href={prevPage.href}
          className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {prevPage.title}
        </Link>
      ) : (
        <div />
      )}
      {nextPage && (
        <Link
          href={nextPage.href}
          className="flex items-center gap-1 text-sm font-medium text-teal-400 hover:underline"
        >
          {nextPage.title}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
