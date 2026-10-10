/**
 * Angel — send an approved reply (the only outward action).
 *
 * Facebook Messenger → Facebook Graph + Page token. Instagram → graph.instagram.com
 * + the Instagram-Login user token. `messaging_type: RESPONSE` covers Meta's 24h
 * standard window; outside it Meta errors and we surface that verbatim.
 */
import { graphPost } from "@/lib/marketing/meta/graph";
import { igPost } from "./ig-login";
import { getValidIgToken } from "./ig-store";
import { getThreadById, updateThread, logAction } from "./store";
import { angelBrand } from "./config";
import { addAngelSend } from "./takeover";

export type SendResult = { ok: boolean; error?: string };

export async function sendReply(threadId: string, text: string): Promise<SendResult> {
  const body = text.trim();
  if (!body) return { ok: false, error: "Message is empty." };

  const thread = await getThreadById(threadId);
  if (!thread) return { ok: false, error: "Thread not found." };
  if (!thread.participant_id) {
    return { ok: false, error: "No recipient id on this thread — can't send." };
  }

  try {
    if (thread.platform === "instagram") {
      const igAuth = await getValidIgToken(thread.brand);
      if (!igAuth) {
        return { ok: false, error: "Instagram isn't connected. Open Angel → Connect Instagram." };
      }
      await igPost("me/messages", igAuth.token, {
        recipient: JSON.stringify({ id: thread.participant_id }),
        message: JSON.stringify({ text: body }),
      });
    } else {
      const brand = angelBrand(thread.brand);
      if (!brand) return { ok: false, error: `Brand "${thread.brand}" is not configured.` };
      await graphPost(`${brand.pageId}/messages`, brand.pageToken, {
        recipient: JSON.stringify({ id: thread.participant_id }),
        message: JSON.stringify({ text: body }),
        messaging_type: "RESPONSE",
      });
    }

    await updateThread(thread.id, {
      draft_reply: body,
      draft_status: "sent",
      status: "done",
      sent_at: new Date().toISOString(),
      // Remember what we sent so the next sync can't read our own reply back as a
      // human takeover. Merge onto the freshly-read meta we already hold.
      meta: addAngelSend(thread.meta, body),
    });
    await logAction({
      threadUuid: thread.id,
      brand: thread.brand,
      action: "sent",
      detail: thread.platform,
      payload: { text: body },
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Send failed.";
    await logAction({ threadUuid: thread.id, brand: thread.brand, action: "send_failed", detail: msg });
    return { ok: false, error: msg };
  }
}
