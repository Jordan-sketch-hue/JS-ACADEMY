/**
 * GET|POST /api/v1/webhooks/meta  — Meta webhook receiver for Angel.
 *
 * Public (Meta calls it, no Clerk). GET answers the subscription handshake.
 * POST receives real-time message events for Instagram (`instagram` object) and
 * Facebook Messenger (`page` object), including message REQUESTS — which the
 * polling conversations endpoint can't see. Each inbound message is handed to
 * Angel's processInbound (triage → act per autonomy). Replying auto-accepts an
 * Instagram request.
 *
 * Signature: verified against INSTAGRAM_APP_SECRET (instagram) / META_APP_SECRET
 * (page) when present. If neither validates and ANGEL_WEBHOOK_STRICT=1, the event
 * is rejected; otherwise it's processed and logged as unverified (so it works
 * before the IG app secret is added, then can be locked down).
 */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { processInbound, processRead, processEcho } from "@/lib/jarvis/angel/sync";
import { angelBrands } from "@/lib/jarvis/angel/config";
import { getIgAuth } from "@/lib/jarvis/angel/ig-store";
import { logAction } from "@/lib/jarvis/angel/store";
import type { AngelPlatform } from "@/lib/jarvis/angel/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const u = new URL(req.url);
  const mode = u.searchParams.get("hub.mode");
  const token = u.searchParams.get("hub.verify_token");
  const challenge = u.searchParams.get("hub.challenge");
  const expected = process.env.ANGEL_WEBHOOK_VERIFY_TOKEN?.trim();
  if (mode === "subscribe" && expected && token === expected) {
    return new Response(challenge ?? "", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }
  return new Response("forbidden", { status: 403 });
}

function verifySignature(raw: string, header: string | null): boolean {
  if (!header) return false;
  const secrets = [
    process.env.INSTAGRAM_APP_SECRET?.trim(),
    process.env.META_APP_SECRET?.trim(),
  ].filter((s): s is string => !!s);
  for (const s of secrets) {
    const digest = "sha256=" + crypto.createHmac("sha256", s).update(raw, "utf8").digest("hex");
    try {
      if (
        digest.length === header.length &&
        crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(header))
      ) {
        return true;
      }
    } catch {
      // length mismatch etc. — try next secret
    }
  }
  return false;
}

async function brandForEntry(object: string, entryId: string): Promise<string | null> {
  if (object === "page") {
    return angelBrands().find((b) => b.pageId === entryId)?.slug ?? null;
  }
  // instagram: entry.id is our IG user id — match env or the connected token.
  for (const b of angelBrands()) {
    if (b.igUserId && b.igUserId === entryId) return b.slug;
    try {
      const auth = await getIgAuth(b.slug);
      if (auth?.igUserId === entryId) return b.slug;
    } catch {
      // ignore
    }
  }
  return null;
}

type MessagingEvent = {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: { mid?: string; text?: string; is_echo?: boolean };
  /** "Seen" receipt — Messenger sends { watermark, seq }, IG sends { mid }. */
  read?: { watermark?: number; seq?: number; mid?: string };
};
type Entry = { id?: string; messaging?: MessagingEvent[] };
type WebhookBody = { object?: string; entry?: Entry[] };

export async function POST(req: Request) {
  const raw = await req.text();
  const verified = verifySignature(raw, req.headers.get("x-hub-signature-256"));
  if (!verified && process.env.ANGEL_WEBHOOK_STRICT === "1") {
    return NextResponse.json({ ok: false, error: "bad signature" }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(raw) as WebhookBody;
  } catch {
    return NextResponse.json({ ok: true }); // ack so Meta doesn't retry junk
  }

  const object = body.object ?? "";
  const platform: AngelPlatform | null =
    object === "instagram" ? "instagram" : object === "page" ? "facebook" : null;
  if (!platform) return NextResponse.json({ ok: true });

  try {
    for (const entry of body.entry ?? []) {
      const entryId = String(entry.id ?? "");
      const brandSlug = await brandForEntry(object, entryId);
      if (!brandSlug) continue;
      for (const ev of entry.messaging ?? []) {
        const senderId = ev.sender?.id ? String(ev.sender.id) : "";

        // "Seen" receipt: the lead read our reply. Stamp it so the seen-hook can
        // nudge if they go quiet. (Requires the message_reads webhook field.)
        if (ev.read) {
          if (senderId && senderId !== entryId) {
            await processRead({ brandSlug, platform, senderId });
          }
          continue;
        }

        const msg = ev.message;
        const text = msg?.text;
        // Echo of an outbound message on our account. If Jordan typed it by hand
        // (not one of Angel's sends), flag the thread so Angel won't auto-reply on
        // top of him. Angel's own sends are recognized + ignored inside processEcho.
        if (msg?.is_echo) {
          const recipientId = ev.recipient?.id ? String(ev.recipient.id) : "";
          if (typeof text === "string" && text.trim() && recipientId && recipientId !== entryId) {
            await processEcho({ brandSlug, platform, recipientId, text });
          }
          continue;
        }
        if (!msg) continue; // non-text event (attachment, reaction, etc.)
        if (!senderId || senderId === entryId) continue; // ignore our own account
        if (typeof text !== "string" || !text.trim()) continue;
        await processInbound({
          brandSlug,
          platform,
          senderId,
          text,
          messageId: String(msg.mid ?? ev.timestamp ?? ""),
          createdTime: ev.timestamp ? new Date(Number(ev.timestamp)).toISOString() : undefined,
        });
      }
    }
  } catch (e) {
    // Always 200 so Meta doesn't disable the subscription; record the failure.
    try {
      await logAction({ action: "webhook_error", detail: e instanceof Error ? e.message : "error" });
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ ok: true });
}
