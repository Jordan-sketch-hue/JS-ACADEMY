/**
 * POST /api/v1/jarvis/whatsapp/draft   { threadId, regenerate? }
 *
 * Operator-gated. Generates (or regenerates) a WhatsApp reply draft for a thread,
 * persists it on meta.draft, and returns the updated thread. Scam/payment/personal
 * threads return a null draft (they escalate, never auto-reply).
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { getThread, setThreadDraft } from "@/lib/jarvis/whatsapp/store";
import { draftReplyFor } from "@/lib/jarvis/whatsapp/draft";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { threadId?: string };
  if (!body.threadId) {
    return NextResponse.json({ error: "threadId is required" }, { status: 400 });
  }
  try {
    const thread = await getThread(body.threadId);
    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

    const { draft, engine } = await draftReplyFor(thread);
    await setThreadDraft(thread.id, draft, engine);

    const meta = { ...(thread.meta ?? {}), draft, draft_engine: engine };
    return NextResponse.json({ ok: true, thread: { ...thread, meta } });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Draft failed" },
      { status: 500 },
    );
  }
}
