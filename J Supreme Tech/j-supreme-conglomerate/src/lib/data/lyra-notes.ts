import { getServiceSupabase } from "@/lib/supabase/admin";

export type LyraNoteStatus = "open" | "resolved" | "dismissed";

export type LyraNote = {
  id: string;
  source_site: string;
  prompt: string;
  page_path: string | null;
  rect_x: number | null;
  rect_y: number | null;
  rect_w: number | null;
  rect_h: number | null;
  user_agent: string | null;
  session_id: string | null;
  client_note_id: number | null;
  status: LyraNoteStatus;
  created_at: string;
  resolved_at: string | null;
};

export type LyraNoteSummary = {
  notes: LyraNote[];
  totals: { all: number; open: number; resolved: number; dismissed: number };
  sites: { site: string; count: number; open: number }[];
  sessionsCount: number;
};

const EMPTY: LyraNoteSummary = {
  notes: [],
  totals: { all: 0, open: 0, resolved: 0, dismissed: 0 },
  sites: [],
  sessionsCount: 0,
};

export async function listLyraNotes(): Promise<LyraNoteSummary> {
  const sb = getServiceSupabase();
  if (!sb) return EMPTY;

  const { data, error } = await sb
    .from("lyra_notes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error || !data) return EMPTY;

  const notes = data as LyraNote[];
  const totals = { all: notes.length, open: 0, resolved: 0, dismissed: 0 };
  const siteMap = new Map<string, { site: string; count: number; open: number }>();
  const sessions = new Set<string>();

  for (const n of notes) {
    totals[n.status] = (totals[n.status] ?? 0) + 1;
    const s = siteMap.get(n.source_site) ?? { site: n.source_site, count: 0, open: 0 };
    s.count += 1;
    if (n.status === "open") s.open += 1;
    siteMap.set(n.source_site, s);
    if (n.session_id) sessions.add(n.session_id);
  }

  const sites = Array.from(siteMap.values()).sort((a, b) => b.count - a.count);

  return { notes, totals, sites, sessionsCount: sessions.size };
}

export async function countOpenLyraNotes(): Promise<number> {
  const sb = getServiceSupabase();
  if (!sb) return 0;
  const { count } = await sb
    .from("lyra_notes")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");
  return count ?? 0;
}
