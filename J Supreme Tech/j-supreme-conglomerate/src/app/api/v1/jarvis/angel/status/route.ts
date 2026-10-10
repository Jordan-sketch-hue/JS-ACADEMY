/**
 * POST /api/v1/jarvis/angel/status  { threadId, status, snoozeHours? }
 *
 * Operator-gated. Move a thread through the workflow without sending:
 * open | done | snoozed (with snoozeHours) | dismissed.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { getThreadById, updateThread, logAction } from "@/lib/jarvis/angel/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED = ["open", "done", "snoozed", "dismissed"] as const;
type AllowedStatus = (typeof ALLOWED)[number];

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    threadId?: string;
    status?: string;
    snoozeHours?: number;
  };
  if (!body.threadId || !ALLOWED.includes(body.status as AllowedStatus)) {
    return NextResponse.json(
      { error: "threadId and a valid status (open|done|snoozed|dismissed) are required" },
      { status: 400 },
    );
  }
  const thread = await getThreadById(body.threadId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const patch: Record<string, unknown> = { status: body.status };
  if (body.status === "snoozed") {
    const hrs = Math.max(1, Math.min(720, Math.round(body.snoozeHours ?? 24)));
    patch.snoozed_until = new Date(Date.now() + hrs * 3_600_000).toISOString();
  } else {
    patch.snoozed_until = null;
  }
  if (body.status === "dismissed") patch.draft_status = "dismissed";

  const updated = await updateThread(thread.id, patch);
  await logAction({
    threadUuid: thread.id,
    brand: thread.brand,
    action: "status_changed",
    detail: body.status,
  });
  return NextResponse.json({ ok: true, thread: updated });
}
