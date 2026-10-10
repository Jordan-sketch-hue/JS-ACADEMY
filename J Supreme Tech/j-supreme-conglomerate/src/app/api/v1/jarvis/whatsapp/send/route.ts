/**
 * POST /api/v1/jarvis/whatsapp/send   { threadId, text }
 *
 * Operator-gated (Clerk owner). The "Approve & Send" path: Jordan's click IS the
 * gate — exactly like Angel, nothing sends on its own. Forwards to the Railway
 * bot's guarded /send (Baileys socket), then clears the card (status=done).
 *
 * Talks to the bot via WA_BOT_URL (defaults to the known Railway URL) with the
 * shared x-send-secret (WA_SEND_SECRET, which equals APPROVAL_SECRET). Fails
 * CLOSED — a 5xx from the bot surfaces as an error; the card is NOT cleared so the
 * message is never silently lost.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { getThread, setThreadStatus } from "@/lib/jarvis/whatsapp/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_BOT_URL = "https://whatsapp-jarvis-bot-production.up.railway.app";

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { threadId?: string; text?: string };
  if (!body.threadId || !body.text?.trim()) {
    return NextResponse.json({ error: "threadId and text are required" }, { status: 400 });
  }

  try {
    const thread = await getThread(body.threadId);
    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

    // Never send to scam/payment/personal threads from here.
    if (["spam", "payment", "personal"].includes((thread.category ?? "") as string)) {
      return NextResponse.json({ error: `Sending is blocked for ${thread.category} threads` }, { status: 403 });
    }

    const jid = thread.chat_id || (thread.phone ? `${thread.phone}@s.whatsapp.net` : null);
    if (!jid) return NextResponse.json({ error: "No WhatsApp address on this thread" }, { status: 400 });

    const base = (process.env.WA_BOT_URL || DEFAULT_BOT_URL).replace(/\/$/, "");
    const secret = process.env.WA_SEND_SECRET || process.env.APPROVAL_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "WhatsApp sender not configured (missing WA_SEND_SECRET/APPROVAL_SECRET)" }, { status: 503 });
    }

    let r: Response;
    try {
      r = await fetch(`${base}/send`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-send-secret": secret },
        body: JSON.stringify({ jid, text: body.text }),
      });
    } catch (e) {
      return NextResponse.json({ error: `WhatsApp sender unreachable: ${e instanceof Error ? e.message : "network"}` }, { status: 502 });
    }

    if (!r.ok) {
      const detail = (await r.text().catch(() => "")).slice(0, 160);
      const msg = r.status === 503 ? "WhatsApp device isn't linked — scan the QR on the bot's /qr page" : `bot ${r.status}: ${detail}`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    await setThreadStatus(thread.id, "done");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Send failed" },
      { status: 500 },
    );
  }
}
