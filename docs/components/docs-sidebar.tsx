"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"

// Define the type for navigation items
interface DocLink {
  title: string
  href: string
}

interface DocCategory {
  title: string
  items: DocLink[]
}

// Default navigation to use when the actual navigation is not available yet
const defaultNavigation: DocCategory[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Installation",
        href: "/docs/getting-started",
      },
      {
        title: "Project Structure",
        href: "/docs/getting-started/project-structure",
      },
      {
        title: "Your First API",
        href: "/docs/getting-started/first-api",
      },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      {
        title: "File-based Routing",
        href: "/docs/core-concepts/routing",
      },
      {
        title: "Request & Response",
        href: "/docs/core-concepts/request-response",
      },
      {
        title: "Middleware",
        href: "/docs/core-concepts/middleware",
      },
      {
        title: "Error Handling",
        href: "/docs/core-concepts/error-handling",
      },
    ],
  },
  {
    title: "WebSockets",
    items: [
      {
        title: "Introduction",
        href: "/docs/websockets/introduction",
      },
      {
        title: "Setting Up WebSockets",
        href: "/docs/websockets/setup",
      },
      {
        title: "Handling Events",
        href: "/docs/websockets/events",
      },
      {
        title: "Authentication",
        href: "/docs/websockets/authentication",
      },
    ],
  },
]

interface DocsSidebarProps {
  navigation?: DocCategory[]
}

export function DocsSidebar({ navigation = defaultNavigation }: DocsSidebarProps) {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Find active category based on current path
  useEffect(() => {
    const newExpandedCategories: Record<string, boolean> = {}

    // Find which category contains the current path
    navigation.forEach((category) => {
      const isActive = category.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))

      if (isActive) {
        newExpandedCategories[category.title] = true
      }
    })

    setExpandedCategories(newExpandedCategories)
  }, [pathname, navigation])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Check if an item is active
  const isItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="w-full">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2 pb-10">
        <nav className="space-y-1">
          {navigation.map((category) => (
            <div key={category.title} className="mb-6">
              <button
                onClick={() => toggleCategory(category.title)}
                className="flex items-center justify-between w-full text-left px-2 py-2 rounded-md hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-200">{category.title}</span>
                {expandedCategories[category.title] ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {expandedCategories[category.title] && (
                <ul className="mt-1 ml-2 space-y-1 border-l border-slate-800 pl-4">
                  {category.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className={`block py-1.5 px-2 text-sm rounded-md transition-colors ${
                          isItemActive(item.href)
                            ? "text-teal-400 font-medium bg-slate-800/30"
                            : "text-slate-300 hover:text-teal-400 hover:bg-slate-800/20"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
