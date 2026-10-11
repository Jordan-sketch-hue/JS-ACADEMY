import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import webpush from "web-push";

// Configure VAPID — keys must be set in Vercel env
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@jsupremetech.online",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subscription, payload } = await req.json();
  if (!subscription?.endpoint)
    return NextResponse.json({ error: "No subscription" }, { status: 400 });

  const message = typeof payload === "string" ? payload : JSON.stringify(payload);

  try {
    await webpush.sendNotification(subscription, message);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
