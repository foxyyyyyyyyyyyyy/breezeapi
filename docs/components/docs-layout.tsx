import type React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface DocsLayoutProps {
  children: React.ReactNode
  prevPage?: {
    title: string
    href: string
  }
  nextPage?: {
    title: string
    href: string
  }
}

// This component should ONLY handle the prev/next navigation, not the entire layout
export default function DocsLayout({ children, prevPage, nextPage }: DocsLayoutProps) {
  return (
    <>
      {children}

      {(prevPage || nextPage) && (
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
      )}
    </>
  )
}
