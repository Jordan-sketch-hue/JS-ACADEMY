import { getServiceSupabase } from "@/lib/supabase/admin";

export type MeetingType = "call" | "zoom" | "meet" | "in_person";
export type MeetingStatus = "scheduled" | "completed" | "canceled";

export const MEETING_TYPES: MeetingType[] = ["call", "zoom", "meet", "in_person"];
export const MEETING_STATUSES: MeetingStatus[] = [
  "scheduled",
  "completed",
  "canceled",
];

export type Meeting = {
  id: string;
  owner_clerk_id: string;
  client_id: string | null;
  title: string;
  client_name: string | null;
  client_email: string | null;
  meeting_type: MeetingType;
  /** Phone number, Zoom/Meet link, or street address depending on `meeting_type`. */
  location: string | null;
  starts_at: string;
  duration_min: number;
  notes: string | null;
  status: MeetingStatus;
  created_at: string;
  updated_at: string;
};

export type MeetingInput = {
  title?: string | null;
  client_id?: string | null;
  client_name?: string | null;
  client_email?: string | null;
  meeting_type?: MeetingType;
  location?: string | null;
  starts_at: string;
  duration_min?: number | null;
  notes?: string | null;
  status?: MeetingStatus;
};

export type MeetingPatch = Partial<MeetingInput>;

export type MeetingResult =
  | { ok: true; meeting: Meeting }
  | { ok: false; error: string };

const SELECT =
  "id,owner_clerk_id,client_id,title,client_name,client_email,meeting_type,location,starts_at,duration_min,notes,status,created_at,updated_at";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function iso(d = new Date()) {
  return d.toISOString();
}

function formatSupabaseNetworkError(message: string): string {
  if (
    !/fetch failed|failed to fetch|networkerror|econnrefused|enotfound|eai_again|etimedout/i.test(
      message,
    )
  ) {
    return message;
  }
  return `${message} — Could not reach Supabase from this server. Use the HTTPS REST “Project URL” from Supabase → Settings → API and confirm SUPABASE_SERVICE_ROLE_KEY matches that project (and that it is not paused).`;
}

function missingTableHint(message: string, code: string): string {
  return /relation|does not exist|schema cache/i.test(message) || code === "42P01"
    ? " Run supabase/migrations/20260531120000_meetings.sql in your project’s SQL editor, then try again."
    : "";
}

/** Per-process fallback so the page works before Supabase env is configured. */
const mem = new Map<string, Meeting[]>();
function bucket(owner: string): Meeting[] {
  let b = mem.get(owner);
  if (!b) {
    b = [];
    mem.set(owner, b);
  }
  return b;
}

function normalizeType(raw: unknown): MeetingType {
  const s = String(raw ?? "call").toLowerCase().trim();
  return (MEETING_TYPES as string[]).includes(s) ? (s as MeetingType) : "call";
}

function normalizeStatus(raw: unknown): MeetingStatus {
  const s = String(raw ?? "scheduled").toLowerCase().trim();
  return (MEETING_STATUSES as string[]).includes(s)
    ? (s as MeetingStatus)
    : "scheduled";
}

function normalizeStartsAt(raw: string): string | null {
  if (!raw || !String(raw).trim()) return null;
  const d = new Date(String(raw).trim());
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function clampDuration(raw: number | null | undefined): number {
  const n = Number(raw ?? 30);
  if (!Number.isFinite(n)) return 30;
  return Math.min(1440, Math.max(5, Math.round(n)));
}

/** Title falls back to "<Type> with <client>" so a quick booking never fails on a blank title. */
function deriveTitle(input: MeetingInput): string {
  const t = input.title?.trim();
  if (t) return t;
  const who = input.client_name?.trim();
  const labels: Record<MeetingType, string> = {
    call: "Call",
    zoom: "Zoom",
    meet: "Meet",
    in_person: "Meeting",
  };
  const label = labels[normalizeType(input.meeting_type)];
  return who ? `${label} with ${who}` : `${label}`;
}

export async function listMeetings(ownerClerkId: string): Promise<Meeting[]> {
  const sb = getServiceSupabase();
  if (!sb) {
    return bucket(ownerClerkId)
      .slice()
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }
  try {
    const { data, error } = await sb
      .from("meetings")
      .select(SELECT)
      .eq("owner_clerk_id", ownerClerkId)
      .order("starts_at", { ascending: true });
    if (error) return [];
    return (data ?? []).map((row) => ({
      ...(row as Meeting),
      meeting_type: normalizeType((row as Meeting).meeting_type),
      status: normalizeStatus((row as Meeting).status),
    }));
  } catch {
    return [];
  }
}

export async function createMeeting(
  ownerClerkId: string,
  input: MeetingInput,
): Promise<MeetingResult> {
  const starts_at = normalizeStartsAt(input.starts_at);
  if (!starts_at) return { ok: false, error: "Pick a date and time for the meeting." };

  const row = {
    owner_clerk_id: ownerClerkId,
    client_id:
      input.client_id && UUID_RE.test(String(input.client_id).trim())
        ? String(input.client_id).trim()
        : null,
    title: deriveTitle(input),
    client_name: input.client_name?.trim() || null,
    client_email: input.client_email?.trim() || null,
    meeting_type: normalizeType(input.meeting_type),
    location: input.location?.trim() || null,
    starts_at,
    duration_min: clampDuration(input.duration_min),
    notes: input.notes?.trim() || null,
    status: normalizeStatus(input.status),
  };

  const sb = getServiceSupabase();
  if (!sb) {
    const now = iso();
    const meeting: Meeting = {
      id: crypto.randomUUID(),
      ...row,
      created_at: now,
      updated_at: now,
    };
    bucket(ownerClerkId).push(meeting);
    return { ok: true, meeting };
  }

  try {
    const { data, error } = await sb
      .from("meetings")
      .insert(row)
      .select(SELECT)
      .single();
    if (error) {
      const code =
        "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg =
        (error as { message?: string }).message ?? "Could not save the meeting.";
      return { ok: false, error: `${msg}${missingTableHint(msg, code)}` };
    }
    if (!data) return { ok: false, error: "No row returned from database." };
    return { ok: true, meeting: data as Meeting };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: formatSupabaseNetworkError(raw) };
  }
}

export async function updateMeeting(
  ownerClerkId: string,
  meetingId: string,
  patch: MeetingPatch,
): Promise<MeetingResult> {
  const updates: Record<string, unknown> = {};
  if (patch.title !== undefined) updates.title = deriveTitle({ ...patch, starts_at: patch.starts_at ?? "" } as MeetingInput);
  if (patch.client_id !== undefined) {
    updates.client_id =
      patch.client_id && UUID_RE.test(String(patch.client_id).trim())
        ? String(patch.client_id).trim()
        : null;
  }
  if (patch.client_name !== undefined)
    updates.client_name = patch.client_name?.trim() || null;
  if (patch.client_email !== undefined)
    updates.client_email = patch.client_email?.trim() || null;
  if (patch.meeting_type !== undefined)
    updates.meeting_type = normalizeType(patch.meeting_type);
  if (patch.location !== undefined)
    updates.location = patch.location?.trim() || null;
  if (patch.starts_at !== undefined) {
    const s = normalizeStartsAt(patch.starts_at);
    if (!s) return { ok: false, error: "Pick a valid date and time." };
    updates.starts_at = s;
  }
  if (patch.duration_min !== undefined)
    updates.duration_min = clampDuration(patch.duration_min);
  if (patch.notes !== undefined) updates.notes = patch.notes?.trim() || null;
  if (patch.status !== undefined) updates.status = normalizeStatus(patch.status);

  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    const m = b.find((x) => x.id === meetingId);
    if (!m) return { ok: false, error: "Meeting not found." };
    Object.assign(m, updates, { updated_at: iso() });
    return { ok: true, meeting: m };
  }

  try {
    const { data, error } = await sb
      .from("meetings")
      .update(updates)
      .eq("id", meetingId)
      .eq("owner_clerk_id", ownerClerkId)
      .select(SELECT)
      .single();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Meeting not found." };
    return { ok: true, meeting: data as Meeting };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: formatSupabaseNetworkError(raw) };
  }
}

export async function setMeetingStatus(
  ownerClerkId: string,
  meetingId: string,
  status: MeetingStatus,
): Promise<MeetingResult> {
  return updateMeeting(ownerClerkId, meetingId, { status, starts_at: undefined });
}

export async function deleteMeeting(
  ownerClerkId: string,
  meetingId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    const i = b.findIndex((x) => x.id === meetingId);
    if (i === -1) return { ok: false, error: "Meeting not found." };
    b.splice(i, 1);
    return { ok: true };
  }
  try {
    const { error } = await sb
      .from("meetings")
      .delete()
      .eq("id", meetingId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
