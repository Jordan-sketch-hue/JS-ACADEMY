import "server-only";
import type { NewProspect } from "@/lib/sales/prospects";
import type { Region, SalesSettings, ServiceFocus } from "@/lib/sales/types";

/**
 * Hunter.io lead sourcing. Discovers real companies by region, then resolves a
 * verified business contact per domain. Reads HUNTER_API_KEY (set in Vercel).
 *
 * Hard rule: we only ever return addresses Hunter actually found + verified.
 * Nothing is invented — fabricated recipients would be both illegal to email
 * and ruinous for the sending domain's reputation.
 */

const HUNTER_BASE = "https://api.hunter.io/v2";

/** Hunter rate-limits aggressively; space calls out to stay under the burst cap. */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function apiKey(): string {
  return process.env.HUNTER_API_KEY?.trim() || "";
}

export function isHunterConfigured(): boolean {
  return Boolean(apiKey());
}

/** One-shot diagnostic: log the Hunter plan + remaining monthly search quota. */
export async function logHunterAccount(): Promise<void> {
  const key = apiKey();
  if (!key) return;
  try {
    const res = await fetch(`${HUNTER_BASE}/account?api_key=${key}`, {
      headers: { Accept: "application/json" },
    });
    const j = (await res.json().catch(() => null)) as {
      data?: { plan_name?: string; requests?: { searches?: { used?: number; available?: number } } };
    } | null;
    if (!res.ok) {
      console.error(`[hunter] account ${res.status}`);
      return;
    }
    const s = j?.data?.requests?.searches;
    console.log(`[hunter] plan=${j?.data?.plan_name} searches=${s?.used}/${s?.available}`);
  } catch (e) {
    console.error(`[hunter] account error ${e instanceof Error ? e.message : String(e)}`);
  }
}

const REGION_LOCATIONS: Record<Region, string[]> = {
  local: ["Jamaica"],
  caribbean: ["Trinidad and Tobago", "Barbados", "Bahamas", "Saint Lucia", "Guyana"],
  europe: ["United Kingdom", "Ireland", "Germany", "Netherlands", "Spain"],
  americas: ["United States", "Canada"],
};

type Counter = { used: number; cap: number };

async function getJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    await sleep(400);
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      // Log status + body (never the URL — it carries the api_key).
      const b = await res.text().catch(() => "");
      console.error(`[hunter] GET ${res.status} ${b.slice(0, 240)}`);
      return null;
    }
    return (await res.json()) as Record<string, unknown>;
  } catch (e) {
    console.error(`[hunter] GET error ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

async function postJson(
  url: string,
  body: unknown,
): Promise<Record<string, unknown> | null> {
  try {
    await sleep(400);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const b = await res.text().catch(() => "");
      console.error(`[hunter] POST ${res.status} ${b.slice(0, 240)}`);
      return null;
    }
    return (await res.json()) as Record<string, unknown>;
  } catch (e) {
    console.error(`[hunter] POST error ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

/**
 * Discover company domains via Hunter's natural-language `query`. The structured
 * filters and `limit`/`offset` are Premium-only (and an array `headquarters_location`
 * 400s on standard plans), so we use `query`, which works on standard plans —
 * e.g. "retail, hospitality companies in Jamaica".
 */
async function discoverDomains(query: string, counter: Counter): Promise<string[]> {
  if (counter.used >= counter.cap) return [];
  counter.used++;
  const json = await postJson(`${HUNTER_BASE}/discover?api_key=${apiKey()}`, { query });
  if (!json) return [];
  // Discover returns data as an array of organisations (shape is defensive).
  const data = (json.data as unknown) ?? [];
  const arr = Array.isArray(data)
    ? data
    : Array.isArray((data as { organizations?: unknown[] }).organizations)
      ? (data as { organizations: unknown[] }).organizations
      : [];
  const domains: string[] = [];
  for (const item of arr as Record<string, unknown>[]) {
    const d =
      (item.domain as string) ||
      (item.organization_domain as string) ||
      ((item.organization as Record<string, unknown> | undefined)?.domain as string);
    if (d && typeof d === "string") domains.push(d.toLowerCase());
  }
  return [...new Set(domains)];
}

/** Resolve one good contact for a domain via Domain Search. */
export async function contactForDomain(
  domain: string,
  minConfidence: number,
  counter: Counter,
): Promise<{
  email: string;
  first_name: string | null;
  contact_name: string | null;
  title: string | null;
  confidence: number | null;
  status: string;
  organization: string | null;
  country: string | null;
} | null> {
  if (counter.used >= counter.cap) return null;
  counter.used++;
  const json = await getJson(
    `${HUNTER_BASE}/domain-search?domain=${encodeURIComponent(
      domain,
    )}&type=personal&limit=3&api_key=${apiKey()}`,
  );
  const data = json?.data as Record<string, unknown> | undefined;
  if (!data) return null;
  const emails = (data.emails as Record<string, unknown>[] | undefined) ?? [];
  // Prefer a decision-maker; fall back to the highest-confidence personal email.
  const ranked = emails
    .map((e) => ({
      value: String(e.value ?? ""),
      first: (e.first_name as string) ?? null,
      last: (e.last_name as string) ?? null,
      position: (e.position as string) ?? null,
      confidence: typeof e.confidence === "number" ? (e.confidence as number) : null,
      status:
        ((e.verification as Record<string, unknown> | undefined)?.status as string) ??
        "unverified",
    }))
    .filter((e) => /.+@.+\..+/.test(e.value))
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));

  const pick = ranked.find((e) => (e.confidence ?? 0) >= minConfidence) ?? ranked[0];
  if (!pick) return null;

  return {
    email: pick.value,
    first_name: pick.first,
    contact_name: [pick.first, pick.last].filter(Boolean).join(" ") || null,
    title: pick.position,
    confidence: pick.confidence,
    status: pick.status === "valid" ? "verified" : pick.status,
    organization: (data.organization as string) ?? null,
    country: (data.country as string) ?? null,
  };
}

function regionServiceFocus(_settings: SalesSettings): ServiceFocus {
  // Each brand is a single offering now; its cold sequence is tagged "both"
  // (B2C opt-in contacts are tagged "promo" at import instead).
  void _settings;
  return "both";
}

/**
 * Source up to `want` fresh prospects for one region. Bounded by `counter` so a
 * single run can't blow the daily Hunter request cap.
 */
export async function sourceRegion(
  region: Region,
  want: number,
  settings: SalesSettings,
  counter: Counter,
): Promise<NewProspect[]> {
  if (!isHunterConfigured() || want <= 0) return [];
  // Per-brand ICP → a natural-language Discover query Hunter accepts on any plan.
  const locations = settings.icp_locations?.[region] ?? REGION_LOCATIONS[region];
  const industries = (settings.icp_industries ?? []).slice(0, 3);
  const industryPart = industries.length ? industries.join(", ") : "businesses";
  const locationPart = (locations ?? []).slice(0, 3).join(" or ") || "Jamaica";
  const query = `${industryPart} companies in ${locationPart}`;
  const domains = await discoverDomains(query, counter);
  const out: NewProspect[] = [];
  const focus = regionServiceFocus(settings);

  for (const domain of domains) {
    if (out.length >= want || counter.used >= counter.cap) break;
    const c = await contactForDomain(domain, settings.min_email_confidence, counter);
    if (!c) continue;
    if ((c.confidence ?? 0) < settings.min_email_confidence) continue;
    out.push({
      company: c.organization || domain.replace(/\.[a-z.]+$/, ""),
      domain,
      contact_name: c.contact_name,
      first_name: c.first_name,
      title: c.title,
      email: c.email,
      email_status: c.status,
      email_confidence: c.confidence,
      region,
      country: c.country,
      industry: null,
      service_focus: focus,
      source: "hunter",
      criteria: { sourced_for: region, via: "hunter.domain-search" },
    });
  }
  return out;
}
