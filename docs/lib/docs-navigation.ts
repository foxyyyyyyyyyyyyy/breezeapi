import { cache } from "react"

export interface DocLink {
  title: string
  href: string
  items?: DocLink[]
}

export interface DocCategory {
  title: string
  items: DocLink[]
}

// This would normally be fetched from your breezedocs.json files
// For now, we'll hardcode the structure
export const getDocsNavigation = cache((): DocCategory[] => {
  return [
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
    {
      title: "Advanced",
      items: [
        {
          title: "Deployment",
          href: "/docs/advanced/deployment",
        },
        {
          title: "Testing",
          href: "/docs/advanced/testing",
        },
        {
          title: "Performance",
          href: "/docs/advanced/performance",
        },
      ],
    },
    {
      title: "Plugins",
      items: [
        {
          title: "Overview",
          href: "/docs/plugins",
        },
        {
          title: "Creating Plugins",
          href: "/docs/plugins/creating-plugins",
        },
        {
          title: "Official Plugins",
          href: "/docs/plugins/official",
          items: [
            {
              title: "CORS",
              href: "/docs/plugins/cors",
            },
            {
              title: "Rate Limiting",
              href: "/docs/plugins/rate-limit",
            },
            {
              title: "Authentication",
              href: "/docs/plugins/auth",
            },
          ],
        },
      ],
    },
  ]
})

// Helper function to find the active category and item
export function findActiveItem(pathname: string): {
  activeCategory: string | null
  activeItem: string | null
  activeSubItem: string | null
} {
  const navigation = getDocsNavigation()

  for (const category of navigation) {
    for (const item of category.items) {
      // Check if this is the active item
      if (item.href === pathname) {
        return {
          activeCategory: category.title,
          activeItem: item.title,
          activeSubItem: null,
        }
      }

      // Check sub-items if they exist
      if (item.items) {
        for (const subItem of item.items) {
          if (subItem.href === pathname) {
            return {
              activeCategory: category.title,
              activeItem: item.title,
              activeSubItem: subItem.title,
            }
          }
        }
      }
    }
  }

  // If no exact match, check if pathname starts with any item href
  for (const category of navigation) {
    for (const item of category.items) {
      if (pathname.startsWith(item.href) && item.href !== "/docs") {
        return {
          activeCategory: category.title,
          activeItem: item.title,
          activeSubItem: null,
        }
      }

      // Check sub-items
      if (item.items) {
        for (const subItem of item.items) {
          if (pathname.startsWith(subItem.href) && subItem.href !== "/docs") {
            return {
              activeCategory: category.title,
              activeItem: item.title,
              activeSubItem: subItem.title,
            }
          }
        }
      }
    }
  }

  return { activeCategory: null, activeItem: null, activeSubItem: null }
}
