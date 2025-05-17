import { type NextRequest, NextResponse } from "next/server"
import { getPluginBySlug } from "@/lib/plugins"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const plugin = await getPluginBySlug(params.slug)

    if (!plugin) {
      return NextResponse.json({ error: "Plugin not found" }, { status: 404 })
    }

    return NextResponse.json({ plugin })
  } catch (error) {
    console.error("Error fetching plugin:", error)
    return NextResponse.json({ error: "Failed to fetch plugin" }, { status: 500 })
  }
}
