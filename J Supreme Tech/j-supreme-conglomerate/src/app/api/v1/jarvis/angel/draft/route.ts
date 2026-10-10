/**
 * POST /api/v1/jarvis/angel/draft
 *
 * Operator-gated. Two modes:
 *  - { threadId, regenerate: true } → re-run triage + re-draft from the stored
 *    conversation (e.g. you want a different angle).
 *  - { threadId, text } → save an edited draft (status becomes "edited" so a
 *    later sync won't overwrite your wording).
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import {
  getThreadById,
  listMessages,
  updateThread,
  logAction,
} from "@/lib/jarvis/angel/store";
import { triageThread } from "@/lib/jarvis/angel/triage";
import type { AngelThreadInput } from "@/lib/jarvis/angel/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    threadId?: string;
    text?: string;
    regenerate?: boolean;
  };
  if (!body.threadId) {
    return NextResponse.json({ error: "threadId is required" }, { status: 400 });
  }
  const thread = await getThreadById(body.threadId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  if (body.regenerate) {
    const msgs = await listMessages(thread.id);
    const input: AngelThreadInput = {
      brand: thread.brand,
      platform: thread.platform,
      threadId: thread.thread_id,
      pageId: thread.page_id ?? "",
      participantId: thread.participant_id,
      participantName: thread.participant_name,
      participantUsername: thread.participant_username,
      lastMessageText: thread.last_message_text,
      lastMessageAt: thread.last_message_at,
      lastMessageFromClient: thread.last_message_from_client,
      messageCount: thread.message_count,
      messages: msgs.map((m) => ({
        messageId: m.message_id,
        fromId: m.from_id,
        fromName: m.from_name,
        fromClient: m.from_client,
        body: m.body ?? "",
        createdTime: m.created_time,
      })),
    };
    const tri = await triageThread(input);
    const updated = await updateThread(thread.id, {
      draft_reply: tri.draftReply,
      intent: tri.intent,
      priority: tri.priority,
      summary: tri.summary,
      triage_engine: tri.engine,
      draft_status: "pending",
      draft_updated_at: new Date().toISOString(),
    });
    await logAction({
      threadUuid: thread.id,
      brand: thread.brand,
      action: "draft_generated",
      detail: tri.engine,
    });
    return NextResponse.json({ ok: true, thread: updated });
  }

  if (typeof body.text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const updated = await updateThread(thread.id, {
    draft_reply: body.text,
    draft_status: "edited",
    draft_updated_at: new Date().toISOString(),
  });
  await logAction({ threadUuid: thread.id, brand: thread.brand, action: "draft_edited" });
  return NextResponse.json({ ok: true, thread: updated });
}
