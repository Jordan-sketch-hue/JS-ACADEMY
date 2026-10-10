import type { MeetingType } from "@/lib/data/meetings";

/** One weekly availability window. `day` is 0=Sunday … 6=Saturday; times are
 * wall-clock "HH:MM" in the operator's timezone. */
export type AvailabilityRule = { day: number; start: string; end: string };

export type BookingSettings = {
  owner_clerk_id: string;
  enabled: boolean;
  title: string;
  description: string | null;
  timezone: string;
  duration_min: number;
  meeting_type: MeetingType;
  location: string | null;
  advance_days: number;
  min_notice_hours: number;
  availability: AvailabilityRule[];
};

export type BookedSlot = { starts_at: string; duration_min: number };

export type OpenSlot = { iso: string; label: string };
export type OpenDay = { date: string; label: string; slots: OpenSlot[] };

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DEFAULT_AVAILABILITY: AvailabilityRule[] = [1, 2, 3, 4, 5].map((day) => ({
  day,
  start: "09:00",
  end: "17:00",
}));

export function defaultBookingSettings(owner: string): BookingSettings {
  return {
    owner_clerk_id: owner,
    enabled: true,
    title: "Book a meeting with J Supreme",
    description: "Pick a time that works for you and you'll get a calendar invite.",
    timezone: "America/Jamaica",
    duration_min: 30,
    meeting_type: "call",
    location: null,
    advance_days: 14,
    min_notice_hours: 12,
    availability: DEFAULT_AVAILABILITY,
  };
}

// ── Timezone math (no library; exact for fixed-offset zones like Jamaica) ──

/** Offset in ms between the given timezone's wall clock and UTC at `date`. */
function tzOffsetMs(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(date)) p[part.type] = part.value;
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second),
  );
  return asUTC - date.getTime();
}

/** UTC instant for a wall-clock time in `tz`. */
function wallTimeToUtc(
  y: number,
  monthIndex: number,
  d: number,
  hh: number,
  mm: number,
  tz: string,
): Date {
  const guess = Date.UTC(y, monthIndex, d, hh, mm);
  const offset = tzOffsetMs(new Date(guess), tz);
  return new Date(guess - offset);
}

/** Y/M/D of `date` as seen in `tz`. */
function partsInTz(date: Date, tz: string): { y: number; m: number; d: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(date)) p[part.type] = part.value;
  return { y: Number(p.year), m: Number(p.month), d: Number(p.d ?? p.day) };
}

function hm(t: string): { h: number; m: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

function fmtTime(iso: string, tz: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  });
}

function fmtDayLabel(iso: string, tz: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Generate open booking slots: availability windows, stepped by duration,
 * minus past times, minimum-notice, and anything overlapping a booked meeting. */
export function computeOpenDays(
  settings: BookingSettings,
  booked: BookedSlot[],
  nowMs: number,
): OpenDay[] {
  if (!settings.enabled) return [];
  const tz = settings.timezone || "America/Jamaica";
  const dur = settings.duration_min * 60_000;
  const earliest = nowMs + settings.min_notice_hours * 3_600_000;

  const busy = booked
    .filter((b) => b.starts_at)
    .map((b) => {
      const s = new Date(b.starts_at).getTime();
      return { s, e: s + (b.duration_min || settings.duration_min) * 60_000 };
    });

  const today = partsInTz(new Date(nowMs), tz);
  const base = Date.UTC(today.y, today.m - 1, today.d);
  const days: OpenDay[] = [];

  for (let i = 0; i <= settings.advance_days; i++) {
    const dayDate = new Date(base + i * 86_400_000);
    const y = dayDate.getUTCFullYear();
    const monthIndex = dayDate.getUTCMonth();
    const d = dayDate.getUTCDate();
    const dow = dayDate.getUTCDay();

    const rules = settings.availability.filter((r) => r.day === dow);
    if (!rules.length) continue;

    const slots: OpenSlot[] = [];
    for (const rule of rules) {
      const start = hm(rule.start);
      const end = hm(rule.end);
      if (!start || !end) continue;
      const endMs = wallTimeToUtc(y, monthIndex, d, end.h, end.m, tz).getTime();
      let cursor = wallTimeToUtc(y, monthIndex, d, start.h, start.m, tz).getTime();

      while (cursor + dur <= endMs) {
        const slotStart = cursor;
        const slotEnd = cursor + dur;
        const overlaps = busy.some((b) => slotStart < b.e && b.s < slotEnd);
        if (slotStart >= earliest && !overlaps) {
          const iso = new Date(slotStart).toISOString();
          slots.push({ iso, label: fmtTime(iso, tz) });
        }
        cursor += dur;
      }
    }
    if (slots.length) {
      slots.sort((a, b) => a.iso.localeCompare(b.iso));
      const iso = slots[0].iso;
      days.push({ date: iso.slice(0, 10), label: fmtDayLabel(iso, tz), slots });
    }
  }
  return days;
}

/** Server-side guard: is `iso` a currently-bookable slot? */
export function isSlotOpen(
  settings: BookingSettings,
  booked: BookedSlot[],
  iso: string,
  nowMs: number,
): boolean {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return false;
  return computeOpenDays(settings, booked, nowMs).some((day) =>
    day.slots.some((s) => new Date(s.iso).getTime() === target),
  );
}
