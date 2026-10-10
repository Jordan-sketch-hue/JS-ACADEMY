import "server-only";

/**
 * OpenStreetMap (Overpass API) local-business discovery — FREE, no API key, no
 * account, no billing. The strongest source I can wire up with zero setup, and a
 * great complement to Hunter for hyper-local markets (esp. Jamaica). OSM often
 * carries the business `email`/`website` directly, so many leads need no scrape.
 */

const OVERPASS = "https://overpass-api.de/api/interpreter";

export function isOsmEnabled(): boolean {
  return true; // free + keyless — always available
}

export type OsmBiz = { name: string; website: string | null; email: string | null; phone: string | null };

async function postOverpass(query: string, ms = 12000): Promise<unknown | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(OVERPASS, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "JSupremeSalesBot/1.0 (+https://jsupremeconglomerate.online)",
      },
      body: "data=" + encodeURIComponent(query),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      console.error(`[osm] ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`[osm] error ${e instanceof Error ? e.message : String(e)}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Businesses inside a named area (e.g. "Jamaica", "Kingston") that publish a
 * website or email in OSM. Returns name + website + email + phone.
 */
export async function discoverOsm(location: string, maxN = 40): Promise<OsmBiz[]> {
  const area = location.replace(/["\\]/g, "").trim();
  if (!area) return [];
  // Named businesses in the area that expose a website OR an email.
  const q =
    `[out:json][timeout:12];area["name"="${area}"]->.a;` +
    `(nwr(area.a)["name"]["website"];nwr(area.a)["name"]["contact:website"];` +
    `nwr(area.a)["name"]["email"];nwr(area.a)["name"]["contact:email"];);` +
    `out tags ${maxN};`;
  const json = (await postOverpass(q)) as { elements?: { tags?: Record<string, string> }[] } | null;
  if (!json) return [];

  const seen = new Set<string>();
  const out: OsmBiz[] = [];
  for (const el of json.elements ?? []) {
    const t = el.tags ?? {};
    const name = t.name;
    if (!name) continue;
    const k = name.toLowerCase();
    if (seen.has(k)) continue;
    const website = t.website || t["contact:website"] || null;
    const email = t.email || t["contact:email"] || null;
    const phone = t.phone || t["contact:phone"] || null;
    if (!website && !email) continue;
    seen.add(k);
    out.push({ name, website, email, phone });
  }
  return out;
}
