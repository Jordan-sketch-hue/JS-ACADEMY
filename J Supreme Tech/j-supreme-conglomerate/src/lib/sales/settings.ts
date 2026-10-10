import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { getBrand } from "@/lib/sales/brands";
import {
  type Region,
  type SalesBrand,
  type SalesSettings,
  type ServiceFocus,
} from "@/lib/sales/types";

/** Fallback used when no settings row exists yet (also the shape we upsert). */
export function defaultSalesSettings(owner: string): SalesSettings {
  return {
    owner_clerk_id: owner,
    sending_enabled: true,
    daily_target: 50,
    warmup_enabled: true,
    warmup_started_on: null,
    from_name: "Jordan Morris · J Supreme",
    from_email: process.env.SALES_OUTREACH_FROM?.trim() || "sales@jsupremeconglomerate.online",
    reply_to: process.env.SALES_REPLY_TO?.trim() || "sales@jsupremeconglomerate.online",
    bcc_email: process.env.SALES_BCC?.trim() || "jordanmorrisr@gmail.com",
    company_name: "The J Supreme Group",
    postal_address: "Kingston, Jamaica",
    regions: ["local", "caribbean", "europe", "americas"],
    service_focus: ["tech", "marketing"],
    hunter_daily_cap: 80,
    min_email_confidence: 80,
    calendar_url: null,
    site_url: "https://jsupremetech.online",
    portfolio_url: process.env.SALES_PORTFOLIO_URL?.trim() || "https://jsupremetech.online/products",
    signature_html: null,
    send_window_start: 13,
    send_window_end: 22,
    throttle_seconds: 90,
  };
}

function coerceRegions(raw: unknown): Region[] {
  if (!Array.isArray(raw)) return ["local", "caribbean", "europe", "americas"];
  const ok = new Set(["local", "caribbean", "europe", "americas"]);
  const out = raw.map(String).filter((r) => ok.has(r)) as Region[];
  return out.length ? out : ["local", "caribbean", "europe", "americas"];
}

function coerceServices(raw: unknown): ServiceFocus[] {
  if (!Array.isArray(raw)) return ["tech", "marketing"];
  const ok = new Set(["tech", "marketing", "both", "promo"]);
  const out = raw.map(String).filter((s) => ok.has(s)) as ServiceFocus[];
  return out.length ? out : ["tech", "marketing"];
}

function mapRow(row: Record<string, unknown>): SalesSettings {
  const d = defaultSalesSettings(String(row.owner_clerk_id ?? ""));
  return {
    ...d,
    owner_clerk_id: String(row.owner_clerk_id ?? d.owner_clerk_id),
    sending_enabled: Boolean(row.sending_enabled ?? d.sending_enabled),
    daily_target: Number(row.daily_target ?? d.daily_target),
    warmup_enabled: Boolean(row.warmup_enabled ?? d.warmup_enabled),
    warmup_started_on: (row.warmup_started_on as string) ?? null,
    from_name: String(row.from_name ?? d.from_name),
    from_email: String(row.from_email ?? d.from_email),
    reply_to: String(row.reply_to ?? d.reply_to),
    bcc_email: String(row.bcc_email ?? d.bcc_email),
    company_name: String(row.company_name ?? d.company_name),
    postal_address: String(row.postal_address ?? d.postal_address),
    regions: coerceRegions(row.regions),
    service_focus: coerceServices(row.service_focus),
    hunter_daily_cap: Number(row.hunter_daily_cap ?? d.hunter_daily_cap),
    min_email_confidence: Number(row.min_email_confidence ?? d.min_email_confidence),
    calendar_url: (row.calendar_url as string) ?? null,
    site_url: String(row.site_url ?? d.site_url),
    portfolio_url: String(row.portfolio_url ?? d.portfolio_url),
    signature_html: (row.signature_html as string) ?? null,
    send_window_start: Number(row.send_window_start ?? d.send_window_start),
    send_window_end: Number(row.send_window_end ?? d.send_window_end),
    throttle_seconds: Number(row.throttle_seconds ?? d.throttle_seconds),
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

/** Merge a brand's identity / mode / ICP onto an operational settings object. */
function withBrand(s: SalesSettings, b: SalesBrand | null): SalesSettings {
  if (!b) return s;
  return {
    ...s,
    brand_slug: b.slug,
    brand_name: b.name,
    brand_tagline: b.tagline,
    mode: b.mode,
    accent_color: b.accent_color,
    offering: b.offering,
    cta_label: b.cta_label,
    cta_url: b.cta_url,
    sending_live: b.sending_live,
    icp_locations: b.icp_locations,
    icp_industries: b.icp_industries,
    icp_titles: b.icp_titles,
    optin_source: b.optin_source,
  };
}

/**
 * Read a brand's settings (keyed by slug) merged with its registry row, lazily
 * creating a default settings row on first access. `owner` is the brand slug —
 * the tenant key reused across every sales_* table.
 */
export async function getSalesSettings(owner: string): Promise<SalesSettings> {
  const sb = getServiceSupabase();
  if (!sb) return defaultSalesSettings(owner);

  const { data, error } = await sb
    .from("sales_settings")
    .select("*")
    .eq("owner_clerk_id", owner)
    .maybeSingle();

  let base: SalesSettings;
  if (error || !data) {
    const seed = defaultSalesSettings(owner);
    const today = new Date().toISOString().slice(0, 10);
    await sb
      .from("sales_settings")
      .upsert(
        { ...seed, regions: seed.regions, service_focus: seed.service_focus, warmup_started_on: today },
        { onConflict: "owner_clerk_id" },
      );
    base = { ...seed, warmup_started_on: today };
  } else {
    base = mapRow(data as Record<string, unknown>);
  }

  return withBrand(base, await getBrand(owner));
}

export async function updateSalesSettings(
  owner: string,
  patch: Partial<SalesSettings>,
): Promise<{ ok: boolean; error?: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Cloud persistence is not configured." };

  // Drop owner from the patch so it can never be reassigned.
  const { owner_clerk_id: _ignore, created_at, updated_at, ...rest } = patch;
  void _ignore;
  void created_at;
  void updated_at;

  const { error } = await sb
    .from("sales_settings")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("owner_clerk_id", owner);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Today's send ceiling. A brand-new outreach subdomain that suddenly emits 50/day
 * looks like spam to mailbox providers, so we ramp over ~2 weeks before holding at
 * the steady-state daily_target. Once warmup is complete (or disabled) we send the
 * full target. The schedule is conservative and well within Resend limits.
 */
export function dailySendCeiling(s: SalesSettings, today = new Date()): number {
  if (!s.warmup_enabled || !s.warmup_started_on) return s.daily_target;
  const start = new Date(s.warmup_started_on + "T00:00:00Z");
  const days = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  // Ramp: d0-2 -> 10, d3-5 -> 20, d6-9 -> 30, d10-13 -> 40, then target.
  let cap: number;
  if (days < 3) cap = 10;
  else if (days < 6) cap = 20;
  else if (days < 10) cap = 30;
  else if (days < 14) cap = 40;
  else cap = s.daily_target;
  return Math.min(cap, s.daily_target);
}

/**
 * Per-brand go-live gate. A brand sends only when (a) Resend is configured and
 * (b) THIS brand's `sending_live` flag is on — flipped to true once its outreach
 * subdomain is verified in Resend. Until then the engine still sources leads and
 * stages emails, but never fires a cold send from an unverified domain. This is
 * per-brand by design: one verified subdomain shouldn't unlock the others.
 */
export function isSalesSendingConfigured(s: SalesSettings): boolean {
  const hasKey = Boolean(process.env.RESEND_API_KEY?.trim());
  const live = Boolean(s.sending_live);
  const hasFrom = /@/.test(s.from_email);
  return hasKey && live && hasFrom;
}
