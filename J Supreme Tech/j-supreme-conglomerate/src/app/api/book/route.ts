import { createPublicBooking } from "@/lib/data/booking";
import { sendNotificationEmail, notifyRecipient } from "@/lib/notify/email";
import { emailShell, escapeHtml } from "@/lib/notify/format";
import {
  buildICS,
  googleCalendarUrl,
  icsFileName,
  MEETING_TYPE_META,
} from "@/lib/meetings/invite";
import { rateLimit } from "@/lib/cyber/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Public, unauthenticated endpoint — rate-limit per IP to stop booking spam
  // and resource abuse (5 bookings / 10 min is generous for a real human).
  const gate = rateLimit(req, { limit: 5, windowMs: 10 * 60_000, key: "book" });
  if (!gate.ok) return gate.response;

  let body: { startIso?: string; name?: string; email?: string; notes?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = await createPublicBooking({
    startIso: String(body.startIso ?? ""),
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    notes: body.notes ? String(body.notes) : null,
  });
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 400 });
  }

  const { meeting, settings } = result;
  const meta = MEETING_TYPE_META[meeting.meeting_type];
  const when = new Date(meeting.starts_at).toLocaleString("en-US", {
    timeZone: settings.timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  const gcal = googleCalendarUrl(meeting);

  // Confirmation to the person who booked (best-effort; never fails the booking).
  try {
    const inner = `
      <p style="margin:14px 0 6px;font-size:15px">Hi ${escapeHtml(meeting.client_name ?? "there")}, your booking is confirmed.</p>
      <table style="width:100%;border-collapse:collapse;margin:8px 0">
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px">When</td><td style="padding:6px 0;font-size:14px;font-weight:600">${escapeHtml(when)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Type</td><td style="padding:6px 0;font-size:14px">${escapeHtml(meta.label)} · ${meeting.duration_min} min</td></tr>
        ${meeting.location ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px">${escapeHtml(meta.locationLabel)}</td><td style="padding:6px 0;font-size:14px">${escapeHtml(meeting.location)}</td></tr>` : ""}
      </table>
      <a href="${gcal}" style="display:inline-block;margin:8px 0;background:#0f1115;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:8px">Add to Google Calendar</a>
      <p style="margin:12px 0 0;color:#6b7280;font-size:12px">A calendar file (.ics) is attached for Apple/Outlook.</p>
    `;
    await sendNotificationEmail({
      to: meeting.client_email ?? undefined,
      subject: `Booking confirmed — ${when}`,
      html: emailShell({ heading: "You're booked ✓", subheading: meta.label, inner }),
      text: `Your booking is confirmed.\n\nWhen: ${when}\nType: ${meta.label} (${meeting.duration_min} min)\n${meeting.location ? meta.locationLabel + ": " + meeting.location + "\n" : ""}\nAdd to calendar: ${gcal}`,
      attachments: [
        {
          filename: icsFileName(meeting),
          content: Buffer.from(buildICS(meeting), "utf-8").toString("base64"),
        },
      ],
    });
  } catch {
    /* ignore email failure */
  }

  // Notify the operator.
  try {
    if (notifyRecipient()) {
      const inner = `
        <p style="margin:14px 0 6px;font-size:15px;font-weight:600">${escapeHtml(meeting.client_name ?? "Someone")} booked a ${escapeHtml(meta.label.toLowerCase())}.</p>
        <table style="width:100%;border-collapse:collapse;margin:8px 0">
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px">When</td><td style="padding:6px 0;font-size:14px;font-weight:600">${escapeHtml(when)}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Contact</td><td style="padding:6px 0;font-size:14px">${escapeHtml(meeting.client_email ?? "—")}</td></tr>
          ${meeting.notes ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Notes</td><td style="padding:6px 0;font-size:14px">${escapeHtml(meeting.notes)}</td></tr>` : ""}
        </table>
        <p style="margin:8px 0 0;color:#6b7280;font-size:12px">It's on your Meetings page. Send the invite from there.</p>
      `;
      await sendNotificationEmail({
        subject: `📅 New booking · ${meeting.client_name ?? "Guest"} · ${when}`,
        html: emailShell({ heading: "New booking", subheading: meta.label, inner }),
        text: `New booking from ${meeting.client_name} (${meeting.client_email})\nWhen: ${when}\nType: ${meta.label}`,
      });
    }
  } catch {
    /* ignore */
  }

  return Response.json({
    ok: true,
    meeting: {
      id: meeting.id,
      starts_at: meeting.starts_at,
      duration_min: meeting.duration_min,
      meeting_type: meeting.meeting_type,
      location: meeting.location,
      title: meeting.title,
    },
    googleUrl: gcal,
  });
}
