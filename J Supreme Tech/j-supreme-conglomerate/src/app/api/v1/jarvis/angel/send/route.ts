/**
 * POST /api/v1/jarvis/angel/send  { threadId, text }
 *
 * Operator-gated. The approval action — sends the (possibly edited) draft to the
 * client via the Meta Graph API and marks the thread done.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { sendReply } from "@/lib/jarvis/angel/send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { threadId?: string; text?: string };
  if (!body.threadId || !body.text) {
    return NextResponse.json({ error: "threadId and text are required" }, { status: 400 });
  }
  const res = await sendReply(body.threadId, body.text);
  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
