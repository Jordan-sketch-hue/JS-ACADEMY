/**
 * GET|POST /api/v1/jarvis/angel/settings
 *
 * Operator-gated. Read or change a brand's Angel controls — most importantly the
 * autonomy level (approve | faq_auto | full_auto), the instant kill-switch for
 * auto-replying to clients.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { getSettings, upsertSettings } from "@/lib/jarvis/angel/store";
import { angelBrands } from "@/lib/jarvis/angel/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const AUTONOMY = ["approve", "faq_auto", "full_auto"];

export async function GET(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const brand = new URL(req.url).searchParams.get("brand") || angelBrands()[0]?.slug;
  if (!brand) return NextResponse.json({ settings: null });
  return NextResponse.json({ settings: await getSettings(brand) });
}

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    brand?: string;
    autonomy?: string;
    forward_crm?: boolean;
    follow_up_enabled?: boolean;
  };
  const brand = body.brand || angelBrands()[0]?.slug;
  if (!brand) return NextResponse.json({ error: "No brand configured" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.autonomy === "string") {
    if (!AUTONOMY.includes(body.autonomy)) {
      return NextResponse.json({ error: "Invalid autonomy" }, { status: 400 });
    }
    patch.autonomy = body.autonomy;
  }
  if (typeof body.forward_crm === "boolean") patch.forward_crm = body.forward_crm;
  if (typeof body.follow_up_enabled === "boolean") patch.follow_up_enabled = body.follow_up_enabled;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await upsertSettings(brand, patch);
  return NextResponse.json({ ok: true, settings: await getSettings(brand) });
}
