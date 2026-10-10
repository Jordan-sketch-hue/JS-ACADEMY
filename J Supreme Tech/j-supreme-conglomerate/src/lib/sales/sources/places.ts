import "server-only";

/**
 * Google Places (New) "Text Search" provider — the local-business discovery
 * engine Hunter lacks. Given a natural query ("car dealerships in Kingston,
 * Jamaica") it returns real businesses with their website + phone, which the
 * orchestrator then turns into an email (website scrape → Hunter fallback).
 *
 * Activates when GOOGLE_PLACES_API_KEY is set (Google Maps Platform → Places API).
 */

function apiKey(): string {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() || "";
}

export function isPlacesConfigured(): boolean {
  return Boolean(apiKey());
}

export type PlaceBiz = {
  name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
};

/** Text Search for businesses. Up to ~20 results per call. */
export async function discoverBusinesses(query: string, maxN = 20): Promise<PlaceBiz[]> {
  if (!isPlacesConfigured()) return [];
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey(),
        // Field mask keeps the bill low — only what we need.
        "X-Goog-FieldMask":
          "places.displayName,places.websiteUri,places.internationalPhoneNumber,places.formattedAddress",
      },
      body: JSON.stringify({ textQuery: query, pageSize: Math.min(Math.max(maxN, 1), 20) }),
    });
    if (!res.ok) {
      console.error(`[places] ${res.status} ${(await res.text().catch(() => "")).slice(0, 240)}`);
      return [];
    }
    const data = (await res.json()) as {
      places?: {
        displayName?: { text?: string };
        websiteUri?: string;
        internationalPhoneNumber?: string;
        formattedAddress?: string;
      }[];
    };
    return (data.places ?? [])
      .map((p) => ({
        name: p.displayName?.text ?? "",
        website: p.websiteUri ?? null,
        phone: p.internationalPhoneNumber ?? null,
        address: p.formattedAddress ?? null,
      }))
      .filter((b) => b.name);
  } catch (e) {
    console.error(`[places] error ${e instanceof Error ? e.message : String(e)}`);
    return [];
  }
}
