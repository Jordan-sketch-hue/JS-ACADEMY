/**
 * POST /api/ops/send   { channel, threadId, text }   header: x-ops-secret
 *
 * Server-to-server send path for the Client Ops Autopilot. No Clerk session
 * (the worker has no cookie) — auth is the shared APPROVAL_SECRET. Reuses the
 * Angel Meta-Graph sender for IG/Messenger so there's one place that talks to Meta.
 *
 * Only fires when the autopilot is in live mode for an opted-in client AND the
 * ticket was approved; this route just executes the already-approved send.
 */
import { NextResponse } from "next/server";
import { sendReply } from "@/lib/jarvis/angel/send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.APPROVAL_SECRET || "dev";
  if (req.headers.get("x-ops-secret") !== secret) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => ({}))) as { channel?: string; threadId?: string; text?: string };
  if (!body.threadId || !body.text) {
    return NextResponse.json({ error: "threadId and text are required" }, { status: 400 });
  }
  if (body.channel && !["instagram", "messenger"].includes(body.channel)) {
    return NextResponse.json({ error: `channel ${body.channel} not handled here` }, { status: 400 });
  }
  const res = await sendReply(body.threadId, body.text);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
