import type { Meeting, MeetingType } from "@/lib/data/meetings";

/** Display + form metadata for each meeting channel. */
export const MEETING_TYPE_META: Record<
  MeetingType,
  { label: string; short: string; locationLabel: string; locationHint: string }
> = {
  call: {
    label: "Phone call",
    short: "Call",
    locationLabel: "Phone number",
    locationHint: "+1 876 555 0123",
  },
  zoom: {
    label: "Zoom",
    short: "Zoom",
    locationLabel: "Zoom link",
    locationHint: "https://zoom.us/j/…",
  },
  meet: {
    label: "Google Meet",
    short: "Meet",
    locationLabel: "Meet link",
    locationHint: "https://meet.google.com/…",
  },
  in_person: {
    label: "In person",
    short: "In person",
    locationLabel: "Address / venue",
    locationHint: "123 Hope Rd, Kingston",
  },
};

const ORGANIZER_NAME = "J Supreme Conglomerate";
const ORGANIZER_EMAIL = "global.jsuprememarketing@gmail.com";
const ORGANIZER_PHONE = "(658) 218-2282";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** ISO → UTC basic format `YYYYMMDDTHHMMSSZ` (used by both .ics and Google Calendar). */
export function toICSDate(input: string): string {
  const d = new Date(input);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

export function meetingEndIso(
  m: Pick<Meeting, "starts_at" | "duration_min">,
): string {
  return new Date(
    new Date(m.starts_at).getTime() + m.duration_min * 60_000,
  ).toISOString();
}

function escapeICS(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function describe(m: Meeting): string {
  const meta = MEETING_TYPE_META[m.meeting_type];
  const lines = [`${meta.label} with ${ORGANIZER_NAME}.`];
  if (m.location) lines.push(`${meta.locationLabel}: ${m.location}`);
  if (m.notes) lines.push("", m.notes);
  lines.push("", `Organized by ${ORGANIZER_NAME} · ${ORGANIZER_PHONE}`);
  return lines.join("\n");
}

/** RFC 5545 VEVENT the operator can download and double-click to add anywhere. */
export function buildICS(m: Meeting): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//J Supreme Conglomerate//Meetings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${m.id}@j-supreme-conglomerate`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(m.starts_at)}`,
    `DTEND:${toICSDate(meetingEndIso(m))}`,
    `SUMMARY:${escapeICS(m.title)}`,
    `DESCRIPTION:${escapeICS(describe(m))}`,
    m.location ? `LOCATION:${escapeICS(m.location)}` : "",
    `ORGANIZER;CN=${ORGANIZER_NAME}:mailto:${ORGANIZER_EMAIL}`,
    m.client_email
      ? `ATTENDEE;CN=${escapeICS(m.client_name || m.client_email)};RSVP=TRUE:mailto:${m.client_email}`
      : "",
    `STATUS:${m.status === "canceled" ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

/** One-click "Add to Google Calendar" prefilled template. */
export function googleCalendarUrl(m: Meeting): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: m.title,
    dates: `${toICSDate(m.starts_at)}/${toICSDate(meetingEndIso(m))}`,
    details: describe(m),
    location: m.location || MEETING_TYPE_META[m.meeting_type].label,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Pre-filled email invite (opens the operator's mail client; no email server needed). */
export function mailtoInvite(m: Meeting): string {
  const meta = MEETING_TYPE_META[m.meeting_type];
  const when = new Date(m.starts_at).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  const body = [
    `Hi ${m.client_name || "there"},`,
    "",
    `You're booked for a ${meta.label.toLowerCase()} with ${ORGANIZER_NAME}.`,
    "",
    `When: ${when} (${m.duration_min} min)`,
    m.location ? `${meta.locationLabel}: ${m.location}` : "",
    m.notes ? `Notes: ${m.notes}` : "",
    "",
    "Add it to your calendar:",
    googleCalendarUrl(m),
    "",
    `— ${ORGANIZER_NAME}`,
    ORGANIZER_PHONE,
  ]
    .filter((l) => l !== null && l !== undefined)
    .join("\n");
  const subject = `${meta.label} · ${m.title}`;
  const qs = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${m.client_email ?? ""}?${qs}`;
}

export function icsFileName(m: Meeting): string {
  const slug = m.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${slug || "meeting"}.ics`;
}
