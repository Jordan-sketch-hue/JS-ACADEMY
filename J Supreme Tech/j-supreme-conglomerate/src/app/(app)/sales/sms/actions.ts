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
  source?: "kai" | "blast_reply" | "blast";
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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

async function fetchReplies(limit: number): Promise<SmsLogRow[]> {
  const { data } = await getSupabase()
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

async function fetchOutbound(limit: number): Promise<SmsLogRow[]> {
  const { data } = await getSupabase()
    .from("sms_outbound")
    .select("id, to_number, body, telnyx_id, ok, error, sent_at")
    .order("sent_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((r: any) => ({ ...r, source: "blast" as const }));
}

export async function fetchSmsLogs(limit = 100): Promise<SmsLogRow[]> {
  await requireOwnerClerkId();

  const botUrl = process.env.SALES_BOT_URL ?? "https://ample-exploration-production-ef51.up.railway.app";
  const adminKey = process.env.SALES_BOT_ADMIN_KEY ?? "jst-sales-bot-2026";

  // Fan-out: fetch Kai (Railway), blast outbound, and inbound replies in parallel
  const [railwayResult, outboundResult, repliesResult] = await Promise.allSettled([
    fetchFromRailway(botUrl, adminKey, limit),
    fetchOutbound(limit),
    fetchReplies(limit),
  ]);

  const kai = railwayResult.status === "fulfilled" ? railwayResult.value : [];
  if (railwayResult.status === "rejected") {
    console.warn("[sms] Railway unavailable:", (railwayResult.reason as Error).message);
  }

  const outbound = outboundResult.status === "fulfilled" ? outboundResult.value : [];
  if (outboundResult.status === "rejected") {
    console.error("[sms] sms_outbound fetch failed:", (outboundResult.reason as Error).message);
  }

  const replies = repliesResult.status === "fulfilled" ? repliesResult.value : [];
  if (repliesResult.status === "rejected") {
    console.error("[sms] sms_replies fetch failed:", (repliesResult.reason as Error).message);
  }

  return [...kai, ...outbound, ...replies];
}