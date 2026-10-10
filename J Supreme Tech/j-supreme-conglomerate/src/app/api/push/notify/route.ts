import { NextRequest, NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/notify/push";

const SECRET = process.env.PUSH_NOTIFY_SECRET;

// Called by the WA Jarvis bot (Railway) after creating an ops_ticket.
// Protected by a shared secret in x-push-secret header.
export async function POST(req: NextRequest) {
  const incoming = req.headers.get("x-push-secret");
  if (!SECRET || incoming !== SECRET)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payload = await req.json();
  if (!payload?.title)
    return NextResponse.json({ error: "title required" }, { status: 400 });

  await sendPushToAll(payload);
  return NextResponse.json({ ok: true });
}
