import { NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/notify/push";
import { sendNotificationEmail } from "@/lib/notify/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = req.headers.get("x-jarvis-secret");
  if (!process.env.JARVIS_NOTIFY_SECRET || secret !== process.env.JARVIS_NOTIFY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    run_id?: string;
    critical_count?: number;
    warning_count?: number;
    alerts?: string[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { run_id = "unknown", critical_count = 0, warning_count = 0, alerts = [] } = body;
  const total = critical_count + warning_count;
  if (total === 0) return NextResponse.json({ ok: true, skipped: true });

  const alertList = alerts.slice(0, 12).join("\n");
  const subject = `[JARVIS QA] ${critical_count} critical, ${warning_count} warning`;

  const html = `
<div style="font-family:system-ui,sans-serif;max-width:560px;color:#111">
  <h2 style="margin:0 0 12px;font-size:18px">JARVIS QA Health Alert</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    <tr>
      <td style="padding:8px 12px;background:#fee2e2;border-radius:6px;font-weight:700;color:#dc2626">
        ${critical_count} Critical
      </td>
      <td style="width:8px"></td>
      <td style="padding:8px 12px;background:#fef3c7;border-radius:6px;font-weight:700;color:#d97706">
        ${warning_count} Warning
      </td>
    </tr>
  </table>
  <pre style="background:#0f0f0f;color:#22c55e;padding:14px;border-radius:8px;font-size:12px;line-height:1.6;overflow-x:auto;white-space:pre-wrap">${alertList}</pre>
  <p style="margin:16px 0 4px">
    <a href="https://jsupremeconglomerate.online/jarvis" style="background:#111;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px">
      View in JARVIS →
    </a>
  </p>
  <p style="color:#888;font-size:11px;margin-top:16px">Run ID: ${run_id}</p>
</div>`;

  await Promise.allSettled([
    sendNotificationEmail({ subject, html }),
    sendPushToAll({
      title: `QA: ${critical_count} Critical Alert${critical_count !== 1 ? "s" : ""}`,
      body: alerts[0] ?? "Check QA Health dashboard",
      url: "/jarvis",
      urgent: critical_count > 0,
      tag: "qa-alert",
    }),
  ]);

  return NextResponse.json({ ok: true, critical_count, warning_count });
}
