/**
 * GET /api/v1/marketing/connections — list the operator's connected Meta assets
 * (Pages / IG accounts / ad accounts). Tokens are never included.
 */
import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { listConnections } from "@/lib/data/meta-connections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let owner: string;
  try {
    owner = await requireOwnerClerkId();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const connections = await listConnections(owner);
  return NextResponse.json({ ok: true, connections });
}
