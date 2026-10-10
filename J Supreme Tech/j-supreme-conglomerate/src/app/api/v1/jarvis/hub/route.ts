import { NextResponse } from "next/server";
import { buildJarvisHub } from "@/lib/jarvis/build";

export const dynamic = "force-dynamic";

/**
 * Launch-tower data: live Vercel project list + HTTP health for every site.
 * Slow by nature (~40 parallel probes), so the hub fetches it lazily when the
 * Tower tab opens instead of blocking the /jarvis page render.
 * Auth: /api/v1/* is operator-gated by the Clerk middleware.
 */
export async function GET() {
  try {
    const hub = await buildJarvisHub();
    return NextResponse.json(hub);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to build hub" },
      { status: 500 },
    );
  }
}
