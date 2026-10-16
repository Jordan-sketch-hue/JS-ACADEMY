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
  follow_up_count: string;
  revenue_potential: string;
  local_count: string;
  intl_count: string;
}

export interface FollowUpRow {
  phone: string;
  business_name: string | null;
  industry: string | null;
  interest_level: "hot" | "warm" | "cold";
  interested_services: string[] | null;
  interested_tier: "starter" | "plus" | "elite" | null;
  contact_method: string | null;
  contact_detail: string | null;
  notes: string | null;
  created_at: string;
  stage_reached: string | null;
  booked_followup: boolean;
  mockup_requested: boolean;
  mockup_wa_number: string | null;
  next_action: string | null;
}

export async function fetchLeads(): Promise<{ stats: LeadsStats; leads: LeadRow[] }> {
  await requireOwnerClerkId();

  try {
    const headers = {
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "apikey": SUPABASE_KEY,
      "Prefer": "count=exact",
      "Range": "0-0",
    };

    // Accurate counts via HEAD queries — avoids Supabase's 1000-row REST cap
    const [totalRes, newRes, calledRes, dncRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/sales_leads?select=id`, { headers, cache: "no-store" }),
      fetch(`${SUPABASE_URL}/rest/v1/sales_leads?select=id&status=eq.new`, { headers, cache: "no-store" }),
      fetch(`${SUPABASE_URL}/rest/v1/sales_leads?select=id&status=eq.called`, { headers, cache: "no-store" }),
      fetch(`${SUPABASE_URL}/rest/v1/sales_leads?select=id&status=eq.dnc`, { headers, cache: "no-store" }),
    ]);

    const parseCount = (res: Response) => {
      const range = res.headers.get("content-range") ?? "0/0";
      return parseInt(range.split("/")[1] ?? "0", 10);
    };

    const total      = parseCount(totalRes);
    const new_count  = parseCount(newRes);
    const called_count = parseCount(calledRes);
    const dnc_count  = parseCount(dncRes);

    // Paginate to fetch ALL leads — Supabase REST caps at 1000/request
    const allLeads: LeadRow[] = [];
    let offset = 0;
    const PAGE = 1000;
    while (true) {
      const leadsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/sales_leads?select=*`,
        {
          headers: {
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "apikey": SUPABASE_KEY,
            "Range": `${offset}-${offset + PAGE - 1}`,
            "Range-Unit": "items",
          },
          cache: "no-store",
        }
      );
      if (!leadsRes.ok) throw new Error(`Supabase responded ${leadsRes.status}`);
      const page = await leadsRes.json() as LeadRow[];
      allLeads.push(...page);
      if (page.length < PAGE) break;
      offset += PAGE;
    }

    // LOCAL = JMD currency, INTL = everything else (USD/GBP/CAD)
    const local_count = allLeads.filter(l => l.currency === "JMD").length;
    const intl_count  = allLeads.filter(l => l.currency !== "JMD" && l.currency != null).length;

    // Sort by hotness: JA first → category rank → no-website first → rating desc
    const MARKET_RANK: Record<string, number> = { JA: 0, US: 1, CA: 2, UK: 3 };
    const CATEGORY_RANK: Record<string, number> = {
      barbershop: 0, hair_salon: 0, nail_salon: 0, car_detailing: 0,
      spa: 1, restaurant: 1, bakery: 1, catering: 1,
      clothing_boutique: 2, plumber: 2, electrician: 2, pharmacy: 2, auto_repair: 2,
      gym: 3, dentist: 3, guest_house: 3, accountant: 3, lawyer: 3, real_estate_agent: 3,
      tour_operator: 4, car_dealership: 5,
    };
    allLeads.sort((a, b) => {
      const mr = (MARKET_RANK[a.market ?? ""] ?? 4) - (MARKET_RANK[b.market ?? ""] ?? 4);
      if (mr !== 0) return mr;
      const cr = (CATEGORY_RANK[a.category ?? ""] ?? 6) - (CATEGORY_RANK[b.category ?? ""] ?? 6);
      if (cr !== 0) return cr;
      const wr = (a.has_website ? 1 : 0) - (b.has_website ? 1 : 0);
      if (wr !== 0) return wr;
      return (b.google_rating ?? 0) - (a.google_rating ?? 0);
    });
    const leads = allLeads;

    // Revenue potential — parse both J$ (JMD) and US$ (intl) from new leads
    let revenue_jmd = 0;
    let revenue_usd = 0;
    leads.filter(l => l.status === "new").forEach(l => {
      const prod = l.recommended_product ?? "";
      const jmd = prod.match(/J\$(\d[\d,]+)/);
      if (jmd) revenue_jmd += parseInt(jmd[1].replace(/,/g, ""));
      const usd = prod.match(/US\$(\d[\d,]+)/);
      if (usd) revenue_usd += parseInt(usd[1].replace(/,/g, ""));
    });
    const revenue_potential =
      revenue_usd > 0 && revenue_jmd > 0 ? `US$${revenue_usd.toLocaleString()} + J$${revenue_jmd.toLocaleString()}` :
      revenue_usd > 0 ? `US$${revenue_usd.toLocaleString()}` :
      revenue_jmd > 0 ? `J$${revenue_jmd.toLocaleString()}` : "—";

    // Fetch follow-up count from the bot
    let follow_up_count = 0;
    try {
      const fuRes = await fetch(`${BOT_URL}/follow-ups`, {
        headers: { "x-admin-key": adminKey() },
        cache: "no-store",
      });
      if (fuRes.ok) {
        const fuData = await fuRes.json() as { follow_ups: any[] };
        follow_up_count = fuData.follow_ups?.filter(f => f.interest_level !== "cold").length ?? 0;
      }
    } catch {}

    return {
      stats: {
        total: String(total),
        new_count: String(new_count),
        called_count: String(called_count),
        dnc_count: String(dnc_count),
        follow_up_count: String(follow_up_count),
        revenue_potential,
        local_count: String(local_count),
        intl_count: String(intl_count),
      },
      leads,
    };
  } catch (e: any) {
    console.error("[leads] fetchLeads error:", e.message);
    return { stats: { total: "0", new_count: "0", called_count: "0", dnc_count: "0", follow_up_count: "0", revenue_potential: "—", local_count: "0", intl_count: "0" }, leads: [] };
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

export async function fetchFollowUps(): Promise<FollowUpRow[]> {
  await requireOwnerClerkId();
  try {
    const res = await fetch(`${BOT_URL}/follow-ups`, {
      headers: { "x-admin-key": adminKey() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json() as { follow_ups: FollowUpRow[] };
    return data.follow_ups ?? [];
  } catch {
    return [];
  }
}

export interface CallLogRow {
  call_sid: string;
  to_number: string;
  company_name: string | null;
  lead_name: string | null;
  industry: string | null;
  duration_seconds: number;
  outcome: "answered" | "no_answer" | "busy" | "failed" | "error";
  booked_followup: boolean;
  mockup_requested: boolean;
  stage_reached: string | null;
  next_action: string | null;
  contact_method: string | null;
  contact_detail: string | null;
  interest_level: "hot" | "warm" | "cold" | null;
  interested_tier: string | null;
  interested_services: string[] | null;
  recommended_product: string | null;
  market: string | null;
  transcript: string | null;
  created_at: string;
}

export async function fetchCallLogs(): Promise<CallLogRow[]> {
  await requireOwnerClerkId();
  try {
    const res = await fetch(`${BOT_URL}/call-logs?limit=200`, {
      headers: { "x-admin-key": adminKey() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json() as { call_logs: CallLogRow[] };
    return data.call_logs ?? [];
  } catch {
    return [];
  }
}

export interface CallFilters {
  market?: string;
  category?: string;
  tier?: 1 | 2 | 3;
}

export async function launchCalls(limit = 10, filters: CallFilters = {}): Promise<{ ok: boolean; queued?: number; error?: string }> {
  await requireOwnerClerkId();

  try {
    // "NULL" sentinel is the UI value for Jamaica — all JA records have market='JA'
    const botFilters: Record<string, unknown> = { ...filters };
    if (botFilters.market === "NULL") botFilters.market = "JA";

    const res = await fetch(`${BOT_URL}/call-leads`, {
      method: "POST",
      headers: { "x-admin-key": adminKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ limit, bypass_hours: false, ...botFilters }),
    });
    const data = await res.json() as any;
    if (!res.ok) return { ok: false, error: data.error ?? `Bot responded ${res.status}` };
    return { ok: true, queued: data.queued };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function fetchFilteredCount(filters: CallFilters): Promise<number> {
  await requireOwnerClerkId();
  try {
    let url = `${SUPABASE_URL}/rest/v1/sales_leads?select=id&status=eq.new`;
    if (filters.market === "NULL") {
      url += `&market=eq.JA`;
    } else if (filters.market) {
      url += `&market=eq.${encodeURIComponent(filters.market)}`;
    }
    if (filters.category) url += `&category=eq.${encodeURIComponent(filters.category)}`;
    if (filters.tier)     url += `&notes=ilike.*TIER%3A${filters.tier}*`;
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${SUPABASE_KEY}`, "apikey": SUPABASE_KEY, "Prefer": "count=exact", "Range": "0-0" },
      cache: "no-store",
    });
    const range = res.headers.get("content-range") ?? "0/0";
    return parseInt(range.split("/")[1] ?? "0", 10);
  } catch { return 0; }
}
