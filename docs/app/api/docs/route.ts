import { NextResponse } from "next/server"
import { swaggerHtml } from "@/lib/swagger-html"

export async function GET() {
  return new NextResponse(swaggerHtml, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
