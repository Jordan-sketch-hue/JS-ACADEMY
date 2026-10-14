"use server";

import { requireOwnerClerkId } from "@/lib/session";

const BOT_URL = process.env.SALES_BOT_URL ?? "https://ample-exploration-production-ef51.up.railway.app";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ibtadbwtrxglujkzqofs.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function adminKey(): string {
  const key = process.env.SALES_BOT_ADMIN_KEY;
  if (!key) throw new Error("SALES_BOT_ADMIN_KEY env var is not set");
  return key;
}

export interface LeadRow {
  id: string;
  business_name: string | null;
  phone: string | null;
  address: string | null;
  category: string | null;
  recommended_product: string | null;
  has_website: boolean;
  has_social: boolean;
  google_rating: number | null;
  market: string | null;
  currency: string | null;
  status: string;
  notes: string | null;
  called_at: string | null;
  created_at: string;
}

export interface LeadsStats {
  total: string;
  new_count: string;
  called_count: string;
  dnc_count: string;
  revenue_potential: string;
}

export async function fetchLeads(): Promise<{ stats: LeadsStats; leads: LeadRow[] }> {
  await requireOwnerClerkId();

  try {
    // Read leads directly from Supabase (yello scraper writes here)
    const leadsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/sales_leads?select=*&order=created_at.desc&limit=200`,
      {
        headers: {
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "apikey": SUPABASE_KEY,
        },
        cache: "no-store",
      }
    );
    if (!leadsRes.ok) throw new Error(`Supabase responded ${leadsRes.status}`);
    const leads = await leadsRes.json() as LeadRow[];

    const total = leads.length;
    const new_count = leads.filter(l => l.status === "new").length;
    const called_count = leads.filter(l => l.status === "called").length;
    const dnc_count = leads.filter(l => l.status === "dnc").length;

    // Rough revenue potential: parse price from recommended_product string
    let revenue_potential = 0;
    leads.filter(l => l.status === "new").forEach(l => {
      const match = (l.recommended_product ?? "").match(/J\$(\d[\d,]+)/);
      if (match) revenue_potential += parseInt(match[1].replace(/,/g, ""));
    });

    return {
      stats: {
        total: String(total),
        new_count: String(new_count),
        called_count: String(called_count),
        dnc_count: String(dnc_count),
        revenue_potential: revenue_potential > 0 ? `J$${revenue_potential.toLocaleString()}` : "—",
      },
      leads,
    };
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
