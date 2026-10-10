"use client";

import type {
  Meeting,
  MeetingInput,
  MeetingPatch,
  MeetingStatus,
  MeetingType,
} from "@/lib/data/meetings";

/**
 * Browser-only mirror of the meetings data lib, used when Supabase persistence
 * is off (no env). Keeps the page fully usable on a single device; the server
 * actions take over automatically once Supabase is configured.
 */

const KEY = (owner: string) => `jsc-meetings:${owner}`;
const TYPES: MeetingType[] = ["call", "zoom", "meet", "in_person"];
const STATUSES: MeetingStatus[] = ["scheduled", "completed", "canceled"];

function normType(raw: unknown): MeetingType {
  const s = String(raw ?? "call").toLowerCase();
  return (TYPES as string[]).includes(s) ? (s as MeetingType) : "call";
}
function normStatus(raw: unknown): MeetingStatus {
  const s = String(raw ?? "scheduled").toLowerCase();
  return (STATUSES as string[]).includes(s) ? (s as MeetingStatus) : "scheduled";
}

export function loadLocalMeetings(owner: string): Meeting[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY(owner));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return (parsed as Meeting[])
      .map((m) => ({
        ...m,
        meeting_type: normType(m.meeting_type),
        status: normStatus(m.status),
      }))
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  } catch {
    return [];
  }
}

function saveAll(owner: string, rows: Meeting[]): void {
  try {
    window.localStorage.setItem(KEY(owner), JSON.stringify(rows));
  } catch {
    /* quota / private mode — ignore */
  }
}

function deriveTitle(input: MeetingInput): string {
  const t = input.title?.trim();
  if (t) return t;
  const labels: Record<MeetingType, string> = {
    call: "Call",
    zoom: "Zoom",
    meet: "Meet",
    in_person: "Meeting",
  };
  const label = labels[normType(input.meeting_type)];
  const who = input.client_name?.trim();
  return who ? `${label} with ${who}` : label;
}

export function createLocalMeeting(
  owner: string,
  input: MeetingInput,
): Meeting | null {
  const d = new Date(input.starts_at);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date().toISOString();
  const meeting: Meeting = {
    id: crypto.randomUUID(),
    owner_clerk_id: owner,
    client_id: input.client_id?.trim() || null,
    title: deriveTitle(input),
    client_name: input.client_name?.trim() || null,
    client_email: input.client_email?.trim() || null,
    meeting_type: normType(input.meeting_type),
    location: input.location?.trim() || null,
    starts_at: d.toISOString(),
    duration_min: Math.min(1440, Math.max(5, Math.round(Number(input.duration_min ?? 30)))),
    notes: input.notes?.trim() || null,
    status: normStatus(input.status),
    created_at: now,
    updated_at: now,
  };
  const rows = loadLocalMeetings(owner);
  rows.push(meeting);
  saveAll(owner, rows);
  return meeting;
}

export function updateLocalMeeting(
  owner: string,
  id: string,
  patch: MeetingPatch,
): Meeting | null {
  const rows = loadLocalMeetings(owner);
  const m = rows.find((x) => x.id === id);
  if (!m) return null;
  if (patch.title !== undefined || patch.client_name !== undefined || patch.meeting_type !== undefined) {
    m.title = deriveTitle({ ...m, ...patch } as MeetingInput);
  }
  if (patch.client_id !== undefined) m.client_id = patch.client_id?.trim() || null;
  if (patch.client_name !== undefined) m.client_name = patch.client_name?.trim() || null;
  if (patch.client_email !== undefined) m.client_email = patch.client_email?.trim() || null;
  if (patch.meeting_type !== undefined) m.meeting_type = normType(patch.meeting_type);
  if (patch.location !== undefined) m.location = patch.location?.trim() || null;
  if (patch.starts_at !== undefined) {
    const d = new Date(patch.starts_at);
    if (!Number.isNaN(d.getTime())) m.starts_at = d.toISOString();
  }
  if (patch.duration_min !== undefined) {
    m.duration_min = Math.min(1440, Math.max(5, Math.round(Number(patch.duration_min ?? 30))));
  }
  if (patch.notes !== undefined) m.notes = patch.notes?.trim() || null;
  if (patch.status !== undefined) m.status = normStatus(patch.status);
  m.updated_at = new Date().toISOString();
  saveAll(owner, rows);
  return m;
}

export function removeLocalMeeting(owner: string, id: string): boolean {
  const rows = loadLocalMeetings(owner);
  const next = rows.filter((x) => x.id !== id);
  if (next.length === rows.length) return false;
  saveAll(owner, next);
  return true;
}
