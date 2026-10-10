import "server-only";
import type { NewProspect } from "@/lib/sales/prospects";
import type { Region, SalesSettings } from "@/lib/sales/types";
import {
  isHunterConfigured,
  contactForDomain,
  sourceRegion as hunterSourceRegion,
} from "@/lib/sales/sources/hunter";
import { isPlacesConfigured, discoverBusinesses } from "@/lib/sales/sources/places";
import { discoverOsm } from "@/lib/sales/sources/osm";
import { findEmailOnWebsite, domainOf } from "@/lib/sales/sources/scrape";

/**
 * Multi-source lead orchestrator — "what Hunter does, plus more."
 *
 * Discovery (find businesses):   Google Places (local-strong) ➜ Hunter Discover
 * Email resolution (get inbox):  free website scrape ➜ Hunter Domain Search
 *
 * Splitting discovery from resolution means we get local Jamaica businesses
 * (Places) that Hunter misses, and we resolve most emails for free (scrape),
 * only spending Hunter quota as a fallback.
 */

type Counter = { used: number; cap: number };

export function isSourcingConfigured(): boolean {
  return true; // OpenStreetMap is free + keyless, so sourcing is always available
}

/** Human label of which providers are active (for engine notes). */
export function sourcingProviders(): string {
  const p: string[] = [];
  if (isPlacesConfigured()) p.push("places");
  p.push("osm");
  if (isHunterConfigured()) p.push("hunter");
  p.push("web-scrape");
  return p.join("+");
}

function pick<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Source up to `want` fresh prospects for one region, bounded by `counter` so a
 * tick can't blow any provider's rate/quota.
 */
export async function sourceLeads(
  region: Region,
  want: number,
  settings: SalesSettings,
  counter: Counter,
): Promise<NewProspect[]> {
  if (want <= 0) return [];
  const out: NewProspect[] = [];
  const locations = settings.icp_locations?.[region] ?? [];
  const industries = settings.icp_industries ?? [];
  // Rotate category/location each call so repeated ticks discover new businesses.
  const industry = (pick(industries) as string) || "businesses";
  const location = (pick(locations) as string) || "Jamaica";

  // 1) DISCOVERY — Google Places first (strong on local), email via free scrape.
  if (isPlacesConfigured() && counter.used < counter.cap) {
    counter.used++;
    const biz = await discoverBusinesses(`${industry} in ${location}`, 20);
    let attempts = 0;
    for (const b of biz) {
      if (out.length >= want || counter.used >= counter.cap) break;
      if (attempts >= want + 4) break; // bound scrape work per tick
      attempts++;
      if (!b.website) continue;
      const domain = domainOf(b.website);
      if (!domain) continue;

      let email = await findEmailOnWebsite(b.website); // free, no quota
      let first: string | null = null;
      let contact: string | null = null;
      let title: string | null = null;
      let confidence: number | null = null;
      let emailStatus = "unverified";

      if (!email && isHunterConfigured() && counter.used < counter.cap) {
        counter.used++;
        const c = await contactForDomain(domain, settings.min_email_confidence, counter);
        if (c) {
          email = c.email;
          first = c.first_name;
          contact = c.contact_name;
          title = c.title;
          confidence = c.confidence;
          emailStatus = c.status;
        }
      }
      if (!email) continue;

      out.push({
        company: b.name || domain,
        domain,
        contact_name: contact,
        first_name: first,
        title,
        email,
        email_status: emailStatus,
        email_confidence: confidence,
        region,
        country: location,
        industry,
        service_focus: "both",
        source: email && emailStatus === "unverified" ? "scrape" : "places",
        criteria: { via: "google-places", query: `${industry} in ${location}`, website: b.website, phone: b.phone, address: b.address },
      });
    }
  }

  // 1b) LOCAL DISCOVERY — OpenStreetMap (free, keyless). Only on the local region
  //     (Overpass is slow; running it per-region would blow the cron's time budget).
  //     Fills the gap Hunter leaves on hyper-local markets; OSM often has the email.
  if (region === "local" && out.length < want && counter.used < counter.cap) {
    counter.used++;
    const biz = await discoverOsm(location, 40);
    let attempts = 0;
    for (const b of biz) {
      if (out.length >= want) break;
      if (attempts >= want + 6) break; // bound scrape work per tick
      attempts++;
      let email = b.email;
      if (!email && b.website) email = await findEmailOnWebsite(b.website); // free
      if (!email) continue;
      const domain = b.website ? domainOf(b.website) : email.split("@")[1] ?? null;
      out.push({
        company: b.name,
        domain,
        email,
        email_status: "unverified",
        email_confidence: null,
        region,
        country: location,
        industry,
        service_focus: "both",
        source: "directory",
        criteria: { via: "openstreetmap", website: b.website, phone: b.phone },
      });
    }
  }

  // 2) SUPPLEMENT — Hunter Discover (great for regional/international ICPs).
  if (out.length < want && isHunterConfigured() && counter.used < counter.cap) {
    const more = await hunterSourceRegion(region, want - out.length, settings, counter);
    out.push(...more);
  }

  return out.slice(0, want);
}
