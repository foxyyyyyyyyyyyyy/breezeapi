import { type NextRequest, NextResponse } from "next/server"
import { getAllPlugins, getOfficialPlugins, searchPlugins } from "@/lib/plugins"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const officialOnly = searchParams.get("official") === "true"

    let plugins

    if (query) {
      plugins = await searchPlugins(query)
    } else if (officialOnly) {
      plugins = await getOfficialPlugins()
    } else {
      plugins = await getAllPlugins()
    }

    return NextResponse.json({ plugins })
  } catch (error) {
    console.error("Error fetching plugins:", error)
    return NextResponse.json({ error: "Failed to fetch plugins" }, { status: 500 })
  }
}
