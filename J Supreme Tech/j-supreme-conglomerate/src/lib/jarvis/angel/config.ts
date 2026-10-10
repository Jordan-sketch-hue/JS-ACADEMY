/**
 * Angel — which brand inboxes to triage, and the Meta credentials for each.
 *
 * Page-token model (the same tokens the meta-poster already uses): a long-lived
 * Page access token can read that page's Messenger inbox, and — IF the token was
 * granted `instagram_manage_messages` — the linked Instagram account's DMs too.
 *
 * J Supreme Marketing is wired from env. Add more brands later via
 * ANGEL_BRANDS_JSON (a JSON array of {slug,name,pageId,igUserId,pageToken})
 * without touching code.
 */

export type AngelBrand = {
  slug: string;
  name: string;
  pageId: string;
  igUserId?: string;
  /** Long-lived Page access token (carries the messaging scopes). */
  pageToken: string;
};

function fromJsonEnv(): AngelBrand[] {
  const raw = process.env.ANGEL_BRANDS_JSON?.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AngelBrand[];
    return Array.isArray(parsed)
      ? parsed.filter((b) => b && b.slug && b.pageId && b.pageToken)
      : [];
  } catch {
    return [];
  }
}

/** All configured brand inboxes, J Supreme Marketing first. */
export function angelBrands(): AngelBrand[] {
  const brands = fromJsonEnv();

  const jsmToken = process.env.META_JSM_PAGE_TOKEN?.trim();
  const jsmPage = process.env.META_JSM_PAGE_ID?.trim();
  if (jsmToken && jsmPage && !brands.some((b) => b.slug === "jsupreme-marketing")) {
    brands.unshift({
      slug: "jsupreme-marketing",
      name: "J Supreme Marketing",
      pageId: jsmPage,
      igUserId: process.env.META_JSM_IG_USER_ID?.trim() || undefined,
      pageToken: jsmToken,
    });
  }
  return brands;
}

export function angelBrand(slug: string): AngelBrand | null {
  return angelBrands().find((b) => b.slug === slug) ?? null;
}

export function isAngelConfigured(): boolean {
  return angelBrands().length > 0;
}
