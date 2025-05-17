import { buildDocsNavigation } from "@/lib/docs-config"
import { DocsSidebar } from "@/components/docs-sidebar"

export async function DocsSidebarWrapper() {
  try {
    const navigation = await buildDocsNavigation()
    return <DocsSidebar navigation={navigation} />
  } catch (error) {
    console.error("Error in DocsSidebarWrapper:", error)
    // Return the DocsSidebar with default navigation
    return <DocsSidebar />
  }
}
