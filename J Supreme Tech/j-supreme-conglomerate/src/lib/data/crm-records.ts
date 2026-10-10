import type { LeadStage } from "@/lib/data/seed";

/** User-defined label + URL pairs (Instagram, portfolio, etc.). */
export type ClientHyperlink = { label: string; url: string };

export const CLIENT_SERVICE_CATEGORIES = [
  "tech",
  "marketing",
  "trading",
  "general",
  "other",
] as const;
export type ClientServiceCategory = (typeof CLIENT_SERVICE_CATEGORIES)[number];

export function normalizeServiceCategory(raw: unknown): ClientServiceCategory {
  const s = String(raw ?? "general")
    .toLowerCase()
    .trim();
  if ((CLIENT_SERVICE_CATEGORIES as readonly string[]).includes(s)) {
    return s as ClientServiceCategory;
  }
  return "general";
}

export type CrmClientRecord = {
  id: string;
  owner_clerk_id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  website: string | null;
  notes: string | null;
  social_links: Record<string, string>;
  /** Saved to Supabase `clients.extra_hyperlinks` when cloud persistence is on. */
  extra_hyperlinks: ClientHyperlink[];
  /** Marketing creative links — images, video, Figma, Drive folders, app store, etc. */
  marketing_asset_links: ClientHyperlink[];
  service_category: ClientServiceCategory;
  /** Higher = closer to top of client roster. */
  roster_priority: number;
  services_needed: string | null;
  budget_amount: number | null;
  project_deadline: string | null;
  last_follow_up_at: string | null;
  next_follow_up_at: string | null;
  follow_up_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CrmLeadRecord = {
  id: string;
  owner_clerk_id: string;
  client_id: string | null;
  company: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  estimated_value: number | null;
  stage: LeadStage;
  tags: string[];
  /** Last touch / last follow-up (maps `leads.last_contacted_at`). */
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  follow_up_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadCardView = {
  id: string;
  clientId: string | null;
  company: string;
  contact: string;
  value: number;
  tags: string[];
  stage: LeadStage;
  lastFollowUpLabel: string | null;
  nextFollowUpLabel: string | null;
};

export type CreateCrmDealInput = {
  business_name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  website?: string | null;
  notes?: string | null;
  services_needed?: string | null;
  budget_amount?: number | null;
  project_deadline?: string | null;
  social_linkedin?: string | null;
  social_instagram?: string | null;
  social_twitter?: string | null;
  social_other?: string | null;
  /** Any number of labeled URLs (shown with Website / socials in CRM). */
  extra_hyperlinks?: ClientHyperlink[];
  /** Hosted creative / product links (kept separate from profile links in the roster). */
  marketing_asset_links?: ClientHyperlink[];
  stage?: LeadStage;
  pipeline_tags?: string[];
  /** ISO or datetime-local value — stored as timestamptz when possible. */
  last_follow_up_at?: string | null;
  next_follow_up_at?: string | null;
  follow_up_notes?: string | null;
  service_category?: ClientServiceCategory;
  /** Set by server on insert; optional for local seed. */
  roster_priority?: number;
};

export function formatFollowUpDisplay(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return String(iso);
  }
}

function normalizeTimestampInput(v: string | null | undefined): string | null {
  if (!v || !String(v).trim()) return null;
  const s = String(v).trim();
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  return s;
}

export function parseSocial(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (k === "extra_hyperlinks") continue;
    if (v != null && String(v).trim()) out[k] = String(v).trim();
  }
  return out;
}

export function parseExtraHyperlinks(raw: unknown): ClientHyperlink[] {
  if (!Array.isArray(raw)) return [];
  const out: ClientHyperlink[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const label = typeof o.label === "string" ? o.label.trim() : "";
    const url = typeof o.url === "string" ? o.url.trim() : "";
    if (!label || !url) continue;
    out.push({ label, url });
  }
  return out;
}

function sanitizeLabeledLinks(
  raw:
    | { label?: string | null; url?: string | null }[]
    | null
    | undefined,
): ClientHyperlink[] {
  if (!raw?.length) return [];
  const out: ClientHyperlink[] = [];
  for (const row of raw) {
    const label = row.label?.trim() ?? "";
    const url = row.url?.trim() ?? "";
    if (!label || !url) continue;
    out.push({ label, url });
  }
  return out;
}

function sanitizeExtraHyperlinks(
  raw: CreateCrmDealInput["extra_hyperlinks"],
): ClientHyperlink[] {
  return sanitizeLabeledLinks(raw);
}

/** For marketing / media URL lists (same shape as extra hyperlinks). */
export function sanitizeMarketingAssetLinks(
  raw:
    | { label?: string | null; url?: string | null }[]
    | null
    | undefined,
): ClientHyperlink[] {
  return sanitizeLabeledLinks(raw);
}

export function leadToCard(lead: CrmLeadRecord): LeadCardView {
  return {
    id: lead.id,
    clientId: lead.client_id,
    company: lead.company,
    contact:
      [lead.contact_name, lead.email, lead.phone].filter(Boolean).join(" · ") || "—",
    value: lead.estimated_value ?? 0,
    tags: lead.tags ?? [],
    stage: lead.stage,
    lastFollowUpLabel: formatFollowUpDisplay(lead.last_contacted_at),
    nextFollowUpLabel: formatFollowUpDisplay(lead.next_follow_up_at),
  };
}

function buildSocialLinks(input: CreateCrmDealInput): Record<string, string> {
  const s: Record<string, string> = {};
  const li = input.social_linkedin?.trim();
  const ig = input.social_instagram?.trim();
  const tw = input.social_twitter?.trim();
  const ot = input.social_other?.trim();
  if (li) s.linkedin = li;
  if (ig) s.instagram = ig;
  if (tw) s.twitter = tw;
  if (ot) s.other = ot;
  return s;
}

function iso(d = new Date()) {
  return d.toISOString();
}

/** If the user left company name blank, still create a roster row from email/contact or a default label. */
export function withCrmDealNameFallback(input: CreateCrmDealInput): CreateCrmDealInput {
  const bn = input.business_name?.trim();
  if (bn) return { ...input, business_name: bn };
  const email = input.email?.trim();
  if (email) return { ...input, business_name: `Lead (${email})` };
  const contact = input.contact_name?.trim();
  if (contact) return { ...input, business_name: contact };
  return { ...input, business_name: "New roster entry" };
}

/** Build client + linked pipeline lead (browser or after DB insert). */
export function createDealRecords(
  ownerClerkId: string,
  input: CreateCrmDealInput,
): { client: CrmClientRecord; lead: CrmLeadRecord } | { error: string } {
  const business = input.business_name.trim();
  if (!business) return { error: "Business / project name is required." };

  const stage: LeadStage = input.stage ?? "cold";
  const social_links = buildSocialLinks(input);
  const extra_hyperlinks = sanitizeExtraHyperlinks(input.extra_hyperlinks);
  const marketing_asset_links = sanitizeMarketingAssetLinks(
    input.marketing_asset_links,
  );
  const tags = (input.pipeline_tags ?? []).map((t) => t.trim()).filter(Boolean);
  const now = iso();

  const budget =
    input.budget_amount != null && !Number.isNaN(Number(input.budget_amount))
      ? Number(input.budget_amount)
      : null;
  const deadline =
    input.project_deadline && String(input.project_deadline).trim() !== ""
      ? String(input.project_deadline).trim()
      : null;

  const lastFu = normalizeTimestampInput(input.last_follow_up_at ?? null);
  const nextFu = normalizeTimestampInput(input.next_follow_up_at ?? null);
  const fuNotes = input.follow_up_notes?.trim() || null;
  const service_category = normalizeServiceCategory(input.service_category);

  const client: CrmClientRecord = {
    id: crypto.randomUUID(),
    owner_clerk_id: ownerClerkId,
    business_name: business,
    contact_name: input.contact_name?.trim() || null,
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    industry: input.industry?.trim() || null,
    website: input.website?.trim() || null,
    notes: input.notes?.trim() || null,
    social_links,
    extra_hyperlinks,
    marketing_asset_links,
    service_category,
    roster_priority: input.roster_priority ?? 0,
    services_needed: input.services_needed?.trim() || null,
    budget_amount: budget,
    project_deadline: deadline,
    last_follow_up_at: lastFu,
    next_follow_up_at: nextFu,
    follow_up_notes: fuNotes,
    created_at: now,
    updated_at: now,
  };

  const lead: CrmLeadRecord = {
    id: crypto.randomUUID(),
    owner_clerk_id: ownerClerkId,
    client_id: client.id,
    company: business,
    contact_name: client.contact_name,
    email: client.email,
    phone: client.phone,
    estimated_value: budget,
    stage,
    tags,
    last_contacted_at: lastFu,
    next_follow_up_at: nextFu,
    follow_up_notes: fuNotes,
    created_at: now,
    updated_at: now,
  };

  return { client, lead };
}
