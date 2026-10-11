import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendPushToAll } from "@/lib/notify/push";
import { sendNotificationEmail } from "@/lib/notify/email";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [pushResult, emailResult] = await Promise.allSettled([
    sendPushToAll({
      title: "JARVIS Alerts Active",
      body: "Push notifications are working. You will receive QA alerts here.",
      url: "/jarvis",
      tag: "push-test",
    }),
    sendNotificationEmail({
      subject: "[JARVIS] Alert delivery test",
      html: `<div style="font-family:system-ui,sans-serif;color:#111;max-width:480px">
<h2 style="margin:0 0 12px;font-size:18px">JARVIS Alert Test</h2>
<p style="color:#555">Email + push alert delivery is working. You will receive QA Health alerts at this address when failures are detected.</p>
<p style="margin-top:16px"><a href="https://jsupremeconglomerate.online/jarvis" style="background:#111;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px">Open JARVIS →</a></p>
</div>`,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    push: pushResult.status === "fulfilled" ? pushResult.value : { ok: false },
    email: emailResult.status === "fulfilled" ? emailResult.value : { ok: false },
  });
}
