/**
 * Angel — sales playbook for reply generation.
 *
 * Feeds Jordan's own J Supreme Marketing scripts (the /scripts library) plus the
 * exact pricing + contact facts into Angel's AI prompt, so drafted replies are
 * built from his approved scripts and quote the right numbers — not generic AI text.
 */
import { SCRIPTS } from "@/lib/data/scripts-data";

const BRAND_FACTS = `J Supreme Tech (JST) — Jamaica-based one-stop studio. Tagline: "Run your business — we handle the rest." Everything we build is 100% owned by the client.

SIX SERVICE LINES (the full "we handle the rest" flyer):
1) Business registration — get registered & compliant, fast.
2) Websites — conversion-built sites & landing pages, built clean and shipped live.
3) Apps (iOS & Android) — your brand, your app, on the App Store + Google Play.
4) Marketing & sales — done-for-you social media + paid ads. More reach, more revenue.
5) Email & social — campaigns + posts that convert.
6) Consulting — strategy that fits your goals.
Also: branding & design, and ready-made Supreme Suite business systems (3-day free trial).

ACTIVE SALE — 35% OFF ALL BUILDS (LIMITED TIME): Website → J$35,750 | App (PWA/install from web) → J$58,500 | Native App (App Store + Play Store) → J$104,000. When anyone asks about apps or websites, lead with the sale. Tell them to DM "35" to lock in their price before it's gone.

PRICING RULE — CRITICAL: We work to the client's budget. NEVER quote, estimate, hint at, or confirm a price for ANY service EXCEPT the active sale prices above (which you MUST share when relevant — apps or websites). For all other services, the ONLY figure you may mention is "packages start at J$5,000 (≈ US$32)." If a client asks about non-build services, ASK what their budget is and what they're trying to achieve. US$1 ≈ J$157.

Contact: jsupremetech.online · WhatsApp / Call (658) 218-2282 · hello@jsupremetech.online.`;

const cache = new Map<string, string>();
// Cache version — bump when BRAND_FACTS changes to invalidate stale entries
const CACHE_VERSION = "35pct-sale-2026-07-02";

/** A compact, prompt-ready dump of the approved scripts (optionally a subset of categories). */
export function buildScriptPlaybook(categories?: readonly string[]): string {
  const key = `${CACHE_VERSION}:${categories ? categories.join("|") : "all"}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const list = categories
    ? SCRIPTS.filter((s) => categories.includes(s.category))
    : SCRIPTS;
  const blocks = list.map((s) => `• [${s.category}] ${s.title} — ${s.when}\n  ${s.body}`);
  const out = `${BRAND_FACTS}\n\nAPPROVED SALES SCRIPTS — base your reply on the closest one and adapt it naturally. OBEY THE PRICING RULE ABOVE: ignore and never repeat any dollar figure that appears in these scripts — the only price you may give is the J$5,000 starting point, otherwise ask the client's budget. Keep contacts EXACT and fill any [brackets] with real info:\n\n${blocks.join("\n\n")}`;

  cache.set(key, out);
  return out;
}
