import fs from "fs"
import path from "path"
import { cache } from "react"

interface DocPage {
  title: string
  slug: string
  file: string
}

interface DocConfig {
  title: string
  pages: DocPage[]
}

export interface DocCategory {
  title: string
  items: Array<{
    title: string
    href: string
  }>
}

// This function reads a breezedocs.json file from a specific directory
export const getDocConfig = cache(async (dirPath: string): Promise<DocConfig | null> => {
  try {
    // Use the app/docs path instead of a separate docs directory
    const configPath = path.join(process.cwd(), "app/docs", dirPath, "breezedocs.json")
    const fileContents = await fs.promises.readFile(configPath, "utf8")
    return JSON.parse(fileContents) as DocConfig
  } catch (error) {
    console.error(`Error reading docs config for ${dirPath}:`, error)
    return null
  }
})

// This function builds the full navigation structure by reading all breezedocs.json files
export const buildDocsNavigation = cache(async (): Promise<DocCategory[]> => {
  try {
    // Get all directories in the app/docs folder
    const docsDir = path.join(process.cwd(), "app/docs")
    const entries = await fs.promises.readdir(docsDir, { withFileTypes: true })
    const directories = entries.filter((entry) => entry.isDirectory()).map((dir) => dir.name)

    // Build navigation structure
    const navigation: DocCategory[] = []

    for (const dir of directories) {
      const config = await getDocConfig(dir)
      if (config) {
        const categoryItems = config.pages.map((page) => ({
          title: page.title,
          href: `/docs/${dir}${page.slug === "" ? "" : `/${page.slug}`}`,
        }))

        navigation.push({
          title: config.title,
          items: categoryItems,
        })
      }
    }

    // If no navigation was built, return a default structure
    if (navigation.length === 0) {
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
          ],
        },
      ]
    }

    return navigation
  } catch (error) {
    console.error("Error building docs navigation:", error)
    // Return a default navigation structure in case of error
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
        ],
      },
    ]
  }
})
