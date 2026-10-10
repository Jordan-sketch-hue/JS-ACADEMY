/**
 * Sales Department — shared types & enums.
 *
 * The "Sales Department" is an automated cold-outreach engine: it sources B2B
 * prospects (Hunter), drafts region/service-targeted emails from branded
 * templates, sends them via Resend from a dedicated outreach subdomain, BCCs the
 * operator, captures replies into a two-way inbox, and enforces legal compliance
 * (suppression list, postal address, one-click unsubscribe) on every send.
 */

export const REGIONS = ["local", "caribbean", "europe", "americas"] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_LABEL: Record<Region, string> = {
  local: "Local (Jamaica)",
  caribbean: "Caribbean",
  europe: "Europe",
  americas: "Americas (USA/CA)",
};

export const SERVICE_FOCUSES = ["tech", "marketing", "both", "promo"] as const;
export type ServiceFocus = (typeof SERVICE_FOCUSES)[number];

/** How a brand reaches its market. Decides cold sourcing vs opt-in promos. */
export const OUTREACH_MODES = ["b2b_cold", "b2c_optin", "both"] as const;
export type OutreachMode = (typeof OUTREACH_MODES)[number];

export const SERVICE_LABEL: Record<ServiceFocus, string> = {
  tech: "Tech & software",
  marketing: "Marketing & growth",
  both: "Core offer (B2B)",
  promo: "Promo / B2C opt-in",
};

export type EmailStatus =
  | "queued"
  | "approved"
  | "sending"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "complained"
  | "failed"
  | "skipped";

export type ProspectStatus =
  | "new"
  | "queued"
  | "contacted"
  | "replied"
  | "bounced"
  | "unsubscribed"
  | "suppressed"
  | "converted"
  | "disqualified";

export type EmailConfidenceStatus =
  | "verified"
  | "unverified"
  | "risky"
  | "invalid";

export type SuppressionReason =
  | "unsubscribed"
  | "bounced"
  | "complained"
  | "manual"
  | "invalid";

export type SalesSettings = {
  owner_clerk_id: string;
  sending_enabled: boolean;
  daily_target: number;
  warmup_enabled: boolean;
  warmup_started_on: string | null;
  from_name: string;
  from_email: string;
  reply_to: string;
  bcc_email: string;
  company_name: string;
  postal_address: string;
  regions: Region[];
  service_focus: ServiceFocus[];
  hunter_daily_cap: number;
  min_email_confidence: number;
  calendar_url: string | null;
  site_url: string;
  portfolio_url: string;
  signature_html: string | null;
  send_window_start: number;
  send_window_end: number;
  throttle_seconds: number;
  // --- Multi-brand identity (merged in from sales_brands at load time) ---
  brand_slug?: string;
  brand_name?: string;
  brand_tagline?: string;
  mode?: OutreachMode;
  accent_color?: string;
  /** One-line description of what the brand sells (feeds {{service_line}}). */
  offering?: string;
  cta_label?: string;
  cta_url?: string | null;
  /** Per-brand go-live switch: true once the outreach subdomain is verified. */
  sending_live?: boolean;
  /** Per-brand Hunter ICP overrides. */
  icp_locations?: Partial<Record<Region, string[]>>;
  icp_industries?: string[];
  icp_titles?: string[];
  /** Where opt-in B2C contacts come from (for the audit trail / UI). */
  optin_source?: string | null;
  created_at?: string;
  updated_at?: string;
};

/** Registry row: one brand the Sales Department runs outreach for. */
export type SalesBrand = {
  slug: string;
  operator_clerk_id: string | null;
  name: string;
  tagline: string;
  mode: OutreachMode;
  accent_color: string;
  logo_url: string | null;
  offering: string;
  value_props: string[];
  cta_label: string;
  cta_url: string | null;
  icp_locations: Partial<Record<Region, string[]>>;
  icp_industries: string[];
  icp_titles: string[];
  optin_source: string | null;
  sending_live: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SalesProspect = {
  id: string;
  owner_clerk_id: string;
  company: string;
  domain: string | null;
  contact_name: string | null;
  first_name: string | null;
  title: string | null;
  email: string;
  email_status: EmailConfidenceStatus;
  email_confidence: number | null;
  region: Region;
  country: string | null;
  industry: string | null;
  service_focus: ServiceFocus;
  source: "hunter" | "csv" | "manual" | "places" | "scrape" | "directory";
  criteria: Record<string, unknown>;
  score: number;
  status: ProspectStatus;
  tags: string[];
  notes: string | null;
  last_contacted_at: string | null;
  next_action_at: string | null;
  reply_received_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SalesCampaign = {
  id: string;
  owner_clerk_id: string;
  name: string;
  region: Region | "all";
  service_focus: ServiceFocus;
  status: "active" | "paused";
  daily_cap: number;
  template_id: string | null;
  followup_template_id: string | null;
  followup_days: number;
  max_steps: number;
  created_at: string;
  updated_at: string;
};

export type SalesTemplate = {
  id: string;
  owner_clerk_id: string;
  name: string;
  step: number;
  service_focus: ServiceFocus;
  region: Region | "all";
  subject: string;
  body_md: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type SalesEmail = {
  id: string;
  owner_clerk_id: string;
  prospect_id: string | null;
  campaign_id: string | null;
  template_id: string | null;
  step: number;
  direction: "outbound" | "inbound";
  thread_id: string | null;
  to_email: string;
  from_email: string;
  reply_to: string | null;
  subject: string;
  html: string | null;
  text: string | null;
  status: EmailStatus;
  resend_id: string | null;
  error: string | null;
  unsubscribe_token: string | null;
  scheduled_for: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  replied: boolean;
  attempts: number;
  created_at: string;
  updated_at: string;
};

export type SalesMessage = {
  id: string;
  owner_clerk_id: string;
  prospect_id: string | null;
  email_id: string | null;
  thread_id: string | null;
  direction: "inbound" | "outbound";
  from_email: string | null;
  to_email: string | null;
  subject: string | null;
  snippet: string | null;
  html: string | null;
  text: string | null;
  resend_inbound_id: string | null;
  read: boolean;
  created_at: string;
};

export type SalesSuppression = {
  id: string;
  owner_clerk_id: string;
  email: string;
  reason: SuppressionReason;
  source: string | null;
  created_at: string;
};

/** Merge-tag context — the "common identifiers" personalising each email. */
export type MergeContext = {
  first_name: string;
  contact_name: string;
  company: string;
  industry: string;
  country: string;
  region: string;
  domain: string;
  service_line: string;
  sender_name: string;
  company_name: string;
  site_url: string;
  portfolio_url: string;
  calendar_url: string;
};
