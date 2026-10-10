/**
 * GET /api/v1/jarvis/whatsapp/updates
 *
 * Operator-gated. Returns the open WhatsApp update cards (newest first), plus the
 * reader's link/heartbeat status so the dashboard can show "linked & listening"
 * or prompt to finish setup.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { listThreads, getSettings, isWhatsappConfigured } from "@/lib/jarvis/whatsapp/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isWhatsappConfigured())) {
    return NextResponse.json({ configured: false, threads: [], settings: null });
  }

  try {
    const [threads, settings] = await Promise.all([listThreads({ statuses: ["open"] }), getSettings()]);
    return NextResponse.json({ configured: true, threads, settings });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load WhatsApp updates" },
      { status: 500 },
    );
  }
}
