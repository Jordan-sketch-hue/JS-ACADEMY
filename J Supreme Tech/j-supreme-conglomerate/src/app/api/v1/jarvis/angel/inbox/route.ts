/**
 * GET /api/v1/jarvis/angel/inbox
 *
 * Operator-gated. Returns the triaged inbox (open threads + snoozes that are due),
 * the configured brands, and per-brand settings (incl. whether IG DMs are unlocked).
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { listThreads, getSettings } from "@/lib/jarvis/angel/store";
import { angelBrands, isAngelConfigured } from "@/lib/jarvis/angel/config";
import { isIgConnected } from "@/lib/jarvis/angel/ig-store";
import { isIgLoginConfigured } from "@/lib/jarvis/angel/ig-login";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brands = angelBrands().map((b) => ({ slug: b.slug, name: b.name, ig: !!b.igUserId }));

  if (!isAngelConfigured()) {
    return NextResponse.json({ configured: false, brands: [], threads: [], settings: [], igPermissionOk: false });
  }

  try {
    const threads = await listThreads({ statuses: ["open", "snoozed"] });
    const now = Date.now();
    // Snoozed threads only re-appear once their snooze window has elapsed.
    const visible = threads.filter((t) => {
      if (t.status !== "snoozed") return true;
      return t.snoozed_until ? Date.parse(t.snoozed_until) <= now : true;
    });

    const settings = (await Promise.all(angelBrands().map((b) => getSettings(b.slug)))).filter(
      (s): s is NonNullable<typeof s> => Boolean(s),
    );
    const igPermissionOk = settings.some((s) => s.ig_permission_ok);
    const igConnected = (
      await Promise.all(angelBrands().map((b) => isIgConnected(b.slug)))
    ).some(Boolean);

    return NextResponse.json({
      configured: true,
      brands,
      igPermissionOk,
      igConnected,
      igLoginConfigured: isIgLoginConfigured(),
      settings,
      threads: visible,
      snoozedCount: threads.length - visible.length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load inbox" },
      { status: 500 },
    );
  }
}
