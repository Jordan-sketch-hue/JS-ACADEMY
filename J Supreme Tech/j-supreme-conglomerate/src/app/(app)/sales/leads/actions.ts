"use server";

import { requireOwnerClerkId } from "@/lib/session";

const BOT_URL = process.env.SALES_BOT_URL ?? "https://ample-exploration-production-ef51.up.railway.app";

function adminKey(): string {
  const key = process.env.SALES_BOT_ADMIN_KEY;
  if (!key) throw new Error("SALES_BOT_ADMIN_KEY env var is not set");
  return key;
}

export interface LeadRow {
  id: number;
  business_name: string | null;
  phone: string | null;
  address: string | null;
  category: string | null;
  recommended_product: string | null;
  has_website: boolean;
  status: string;
  called_at: string | null;
  created_at: string;
}

export interface LeadsStats {
  total: string;
  new_count: string;
  called_count: string;
  dnc_count: string;
}

export async function fetchLeads(): Promise<{ stats: LeadsStats; leads: LeadRow[] }> {
  await requireOwnerClerkId();

  try {
    const res = await fetch(`${BOT_URL}/leads`, {
      headers: { "x-admin-key": adminKey() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Bot responded ${res.status}`);
    return await res.json() as { stats: LeadsStats; leads: LeadRow[] };
  } catch (e: any) {
    console.error("[leads] fetchLeads error:", e.message);
    return { stats: { total: "0", new_count: "0", called_count: "0", dnc_count: "0" }, leads: [] };
  }
}

export async function runScraper(): Promise<{ ok: boolean; message?: string; error?: string }> {
  await requireOwnerClerkId();

  try {
    const res = await fetch(`${BOT_URL}/scrape`, {
      method: "POST",
      headers: { "x-admin-key": adminKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 30 }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as any;
      return { ok: false, error: body.error ?? `Bot responded ${res.status}` };
    }
    const data = await res.json() as { started: boolean; message: string };
    return { ok: true, message: data.message };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function launchCalls(limit = 10): Promise<{ ok: boolean; queued?: number; error?: string }> {
  await requireOwnerClerkId();

  try {
    const res = await fetch(`${BOT_URL}/call-leads`, {
      method: "POST",
      headers: { "x-admin-key": adminKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ limit, bypass_hours: false }),
    });
    const data = await res.json() as any;
    if (!res.ok) return { ok: false, error: data.error ?? `Bot responded ${res.status}` };
    return { ok: true, queued: data.queued };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
