/**
 * POST /api/v1/jarvis/angel/sync
 *
 * Operator-gated manual refresh: pulls every configured brand inbox, triages
 * new/updated threads, and drafts replies. Also runs every 15 min via the cron.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { syncAllBrands } from "@/lib/jarvis/angel/sync";
import { isAngelConfigured } from "@/lib/jarvis/angel/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAngelConfigured()) {
    return NextResponse.json(
      { error: "Angel isn't configured yet. Set META_JSM_PAGE_ID + META_JSM_PAGE_TOKEN." },
      { status: 501 },
    );
  }
  try {
    const results = await syncAllBrands();
    return NextResponse.json({ ok: true, results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sync failed" },
      { status: 500 },
    );
  }
}
