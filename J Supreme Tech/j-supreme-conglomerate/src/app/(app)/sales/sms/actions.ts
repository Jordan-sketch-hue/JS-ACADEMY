"use server";

import { requireOwnerClerkId } from "@/lib/session";
import { createClient } from "@supabase/supabase-js";

export interface SmsLogRow {
  id: number;
  to_number: string;
  body: string;
  telnyx_id: string | null;
  ok: boolean;
  error: string | null;
  sent_at: string;
  source?: "kai" | "blast_reply";
}

async function fetchFromRailway(botUrl: string, adminKey: string, limit: number): Promise<SmsLogRow[]> {
  const res = await fetch(`${botUrl}/sms-logs?limit=${limit}`, {
    headers: { "x-admin-key": adminKey },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Railway ${res.status}`);
  const data = await res.json() as { sms: SmsLogRow[] };
  return (data.sms ?? []).map(r => ({ ...r, source: "kai" as const }));
}

async function fetchFromSupabase(limit: number): Promise<SmsLogRow[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase
    .from("sms_replies")
    .select("id, from_number, body, sentiment, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r: any, i: number) => ({
    id: i + 1,
    to_number: r.from_number,
    body: `[Blast reply] ${r.body} — ${r.sentiment?.toUpperCase()}`,
    telnyx_id: null,
    ok: true,
    error: null,
    sent_at: r.created_at,
    source: "blast_reply" as const,
  }));
}

export async function fetchSmsLogs(limit = 100): Promise<SmsLogRow[]> {
  await requireOwnerClerkId();

  const botUrl = process.env.SALES_BOT_URL ?? "https://ample-exploration-production-ef51.up.railway.app";
  const adminKey = process.env.SALES_BOT_ADMIN_KEY ?? "jst-sales-bot-2026";

  try {
    return await fetchFromRailway(botUrl, adminKey, limit);
  } catch (e: any) {
    console.warn("[sms] Railway unavailable, falling back to Supabase replies:", e.message);
    try {
      return await fetchFromSupabase(limit);
    } catch (e2: any) {
      console.error("[sms] Supabase fallback failed:", e2.message);
      return [];
    }
  }
}