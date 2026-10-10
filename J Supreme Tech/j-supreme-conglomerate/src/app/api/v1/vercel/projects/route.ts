import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { buildVercelSitesHub } from "@/lib/vercel-portfolio/build-hub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await requireOwnerClerkId();
    const hub = await buildVercelSitesHub();
    return NextResponse.json(hub);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
