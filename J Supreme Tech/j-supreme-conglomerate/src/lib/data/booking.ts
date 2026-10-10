import { getServiceSupabase } from "@/lib/supabase/admin";
import { createMeeting, type Meeting, type MeetingType } from "@/lib/data/meetings";
import {
  defaultBookingSettings,
  isSlotOpen,
  type AvailabilityRule,
  type BookingSettings,
} from "@/lib/booking/slots";

export type { BookingSettings, AvailabilityRule } from "@/lib/booking/slots";

const MEETING_TYPES = ["call", "zoom", "meet", "in_person"];
const SELECT =
  "owner_clerk_id,enabled,title,description,timezone,duration_min,meeting_type,location,advance_days,min_notice_hours,availability";

/** The single operator whose availability the public /book page serves. */
export function publicBookingOwner(): string {
  return process.env.DIGEST_OWNER_CLERK_ID?.trim() || "user_setup_full_access";
}

function sanitizeAvailability(raw: unknown): AvailabilityRule[] {
  if (!Array.isArray(raw)) return [];
  const out: AvailabilityRule[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const day = Number(o.day);
    const start = String(o.start ?? "");
    const end = String(o.end ?? "");
    if (!Number.isInteger(day) || day < 0 || day > 6) continue;
    if (!/^\d{1,2}:\d{2}$/.test(start) || !/^\d{1,2}:\d{2}$/.test(end)) continue;
    if (start >= end) continue;
    out.push({ day, start, end });
  }
  return out;
}

function mapRow(row: Record<string, unknown>): BookingSettings {
  return {
    owner_clerk_id: String(row.owner_clerk_id),
    enabled: row.enabled !== false,
    title: String(row.title ?? "Book a meeting with J Supreme"),
    description: row.description != null ? String(row.description) : null,
    timezone: String(row.timezone ?? "America/Jamaica"),
    duration_min: Number(row.duration_min ?? 30),
    meeting_type: (MEETING_TYPES.includes(String(row.meeting_type))
      ? String(row.meeting_type)
      : "call") as MeetingType,
    location: row.location != null ? String(row.location) : null,
    advance_days: Number(row.advance_days ?? 14),
    min_notice_hours: Number(row.min_notice_hours ?? 12),
    availability: sanitizeAvailability(row.availability),
  };
}

export async function getBookingSettings(owner: string): Promise<BookingSettings> {
  const sb = getServiceSupabase();
  if (!sb) return defaultBookingSettings(owner);
  try {
    const { data, error } = await sb
      .from("booking_settings")
      .select(SELECT)
      .eq("owner_clerk_id", owner)
      .maybeSingle();
    if (error || !data) return defaultBookingSettings(owner);
    return mapRow(data as Record<string, unknown>);
  } catch {
    return defaultBookingSettings(owner);
  }
}

export type BookingSettingsPatch = Partial<
  Omit<BookingSettings, "owner_clerk_id">
>;

export type SaveSettingsResult =
  | { ok: true; settings: BookingSettings }
  | { ok: false; error: string };

export async function upsertBookingSettings(
  owner: string,
  patch: BookingSettingsPatch,
): Promise<SaveSettingsResult> {
  const sb = getServiceSupabase();
  if (!sb) {
    return {
      ok: false,
      error:
        "Public booking needs Supabase (it's shared with clients) — connect it to enable.",
    };
  }
  const current = await getBookingSettings(owner);
  const merged: BookingSettings = {
    ...current,
    ...patch,
    availability: patch.availability
      ? sanitizeAvailability(patch.availability)
      : current.availability,
    owner_clerk_id: owner,
  };

  try {
    const { data, error } = await sb
      .from("booking_settings")
      .upsert(
        {
          owner_clerk_id: owner,
          enabled: merged.enabled,
          title: merged.title.trim() || "Book a meeting",
          description: merged.description?.trim() || null,
          timezone: merged.timezone.trim() || "America/Jamaica",
          duration_min: Math.min(1440, Math.max(5, merged.duration_min)),
          meeting_type: merged.meeting_type,
          location: merged.location?.trim() || null,
          advance_days: Math.min(120, Math.max(1, merged.advance_days)),
          min_notice_hours: Math.min(720, Math.max(0, merged.min_notice_hours)),
          availability: merged.availability,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "owner_clerk_id" },
      )
      .select(SELECT)
      .single();
    if (error) {
      const hint = /relation|does not exist|schema cache/i.test(error.message)
        ? " Run supabase/migrations/20260531150000_booking_settings.sql."
        : "";
      return { ok: false, error: `${error.message}${hint}` };
    }
    return { ok: true, settings: mapRow(data as Record<string, unknown>) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Scheduled meetings from now forward — used to block already-taken slots. */
export async function listUpcomingBooked(
  owner: string,
): Promise<{ starts_at: string; duration_min: number }[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("meetings")
      .select("starts_at,duration_min,status")
      .eq("owner_clerk_id", owner)
      .eq("status", "scheduled")
      .gte("starts_at", new Date(Date.now() - 86_400_000).toISOString());
    if (error) return [];
    return (data ?? []).map((r) => ({
      starts_at: String((r as Record<string, unknown>).starts_at),
      duration_min: Number((r as Record<string, unknown>).duration_min ?? 30),
    }));
  } catch {
    return [];
  }
}

export type CreateBookingInput = {
  startIso: string;
  name: string;
  email: string;
  notes?: string | null;
};

export type CreateBookingResult =
  | { ok: true; meeting: Meeting; settings: BookingSettings }
  | { ok: false; error: string };

/** Public booking entry point: re-validates the slot, then writes a meeting. */
export async function createPublicBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const owner = publicBookingOwner();
  const settings = await getBookingSettings(owner);
  if (!settings.enabled) {
    return { ok: false, error: "Online booking is currently turned off." };
  }
  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (!input.startIso) return { ok: false, error: "Please pick a time slot." };

  const booked = await listUpcomingBooked(owner);
  if (!isSlotOpen(settings, booked, input.startIso, Date.now())) {
    return {
      ok: false,
      error: "That slot is no longer available — please pick another time.",
    };
  }

  const created = await createMeeting(owner, {
    title: `${name} — ${settings.title.replace(/^book a meeting.*/i, "Booking") || "Booking"}`.slice(0, 120),
    client_name: name,
    client_email: email,
    meeting_type: settings.meeting_type,
    location: settings.location,
    starts_at: input.startIso,
    duration_min: settings.duration_min,
    notes: input.notes?.trim()
      ? `Booked online. ${input.notes.trim()}`
      : "Booked online via /book.",
    status: "scheduled",
  });
  if (!created.ok) return { ok: false, error: created.error };
  return { ok: true, meeting: created.meeting, settings };
}
