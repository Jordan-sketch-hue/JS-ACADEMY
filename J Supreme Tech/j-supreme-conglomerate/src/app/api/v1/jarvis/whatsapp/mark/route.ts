/**
 * POST /api/v1/jarvis/whatsapp/mark
 *
 * Operator-gated. Card actions for the WhatsApp surface:
 *  - { threadId, status: "done" | "dismissed" }  → clear a card
 *  - { paused: boolean }                          → pause/resume the reader
 *  - { captureMode: "all_business" | "action_money_shipping" | "urgent_only" }
 *
 * The reader (on Railway) re-reads jarvis_wa_settings within ~60s, so pause /
 * capture-mode changes take effect without a redeploy.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { setThreadStatus, patchSettings } from "@/lib/jarvis/whatsapp/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CAPTURE_MODES = ["all_business", "action_money_shipping", "urgent_only"];

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    threadId?: string;
    status?: string;
    paused?: boolean;
    captureMode?: string;
    autoreplyEnabled?: boolean;
    clientAllowlist?: Record<string, string>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    if (body.threadId && body.status) {
      if (!["done", "dismissed", "open"].includes(body.status)) {
        return NextResponse.json({ error: "Bad status" }, { status: 400 });
      }
      await setThreadStatus(body.threadId, body.status as "done" | "dismissed" | "open");
    }

    const settingsPatch: Record<string, unknown> = {};
    if (typeof body.paused === "boolean") settingsPatch.paused = body.paused;
    if (body.captureMode && CAPTURE_MODES.includes(body.captureMode)) settingsPatch.capture_mode = body.captureMode;
    if (typeof body.autoreplyEnabled === "boolean") settingsPatch.autoreply_enabled = body.autoreplyEnabled;
    if (body.clientAllowlist && typeof body.clientAllowlist === "object") {
      // Sanitize: digits-only phone keys, trimmed labels. Clients only.
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(body.clientAllowlist)) {
        const digits = String(k).replace(/[^0-9]/g, "");
        const label = String(v ?? "").trim().slice(0, 80);
        if (digits.length >= 7 && label) clean[digits] = label;
      }
      settingsPatch.client_allowlist = clean;
    }
    if (Object.keys(settingsPatch).length) await patchSettings(settingsPatch);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Action failed" },
      { status: 500 },
    );
  }
}
