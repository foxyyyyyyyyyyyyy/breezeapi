"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="border-b border-slate-800 sticky top-0 z-50 bg-slate-950">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-teal-400" />
            <span className="text-xl font-bold text-slate-50">BreezeAPI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium ${
              isActive("/") ? "text-slate-50" : "text-slate-300"
            } hover:text-teal-400 hover:underline underline-offset-4`}
          >
            Home
          </Link>
          <Link
            href="/docs"
            className={`text-sm font-medium ${
              isActive("/docs") ? "text-slate-50" : "text-slate-300"
            } hover:text-teal-400 hover:underline underline-offset-4`}
          >
            Documentation
          </Link>
          <Link
            href="/plugins"
            className={`text-sm font-medium ${
              isActive("/plugins") ? "text-slate-50" : "text-slate-300"
            } hover:text-teal-400 hover:underline underline-offset-4`}
          >
            Plugins
          </Link>
          
          <Link
            href="https://github.com/foxyyyyyyyyyyyyy/breezeapi"
            className="text-sm font-medium text-slate-300 hover:text-teal-400 hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/docs/getting-started" className="hidden md:block">
            <Button className="bg-teal-500 text-slate-950 hover:bg-teal-400">Get Started</Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="container py-4 px-4 flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive("/") ? "text-slate-50" : "text-slate-300"
              } hover:text-teal-400 py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/docs"
              className={`text-sm font-medium ${
                isActive("/docs") ? "text-slate-50" : "text-slate-300"
              } hover:text-teal-400 py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/plugins"
              className={`text-sm font-medium ${
                isActive("/plugins") ? "text-slate-50" : "text-slate-300"
              } hover:text-teal-400 py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Plugins
            </Link>
            <Link
              href="/swagger"
              className={`text-sm font-medium ${
                isActive("/swagger") ? "text-slate-50" : "text-slate-300"
              } hover:text-teal-400 py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              API Reference
            </Link>
            <Link
              href="https://github.com/breeze-api/breeze"
              className="text-sm font-medium text-slate-300 hover:text-teal-400 py-2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </Link>
            <Link href="/docs/getting-started" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400 mt-2">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
