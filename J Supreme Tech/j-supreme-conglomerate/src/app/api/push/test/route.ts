import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendPushToAll } from "@/lib/notify/push";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await sendPushToAll({
    title: "J Supreme Conglomerate",
    body: "Push notifications are working.",
    url: "/dashboard",
    tag: "push-test",
  });

  return NextResponse.json({ ok: true });
}
