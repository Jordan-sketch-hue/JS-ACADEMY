import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  // Vercel injects x-vercel-ip-country on every request — free, no API call
  const country = req.headers.get("x-vercel-ip-country") ?? "UNKNOWN"
  const region = country === "US" ? "US" : country === "JM" ? "JM" : "OTHER"
  return NextResponse.json({ country, region })
}
