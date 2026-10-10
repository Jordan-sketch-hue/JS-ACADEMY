import "server-only";
import { cookies } from "next/headers";
import { requireOwnerClerkId } from "@/lib/session";
import { listBrands } from "@/lib/sales/brands";

export const ACTIVE_BRAND_COOKIE = "sales_brand";

/**
 * Auth gate + resolve the operator's currently-selected brand. The returned slug
 * is the tenant key used across every sales_* table, so swapping
 * `requireOwnerClerkId()` → `requireBrandTenant()` in a page/action is all it
 * takes to make that surface brand-scoped. Falls back to the first active brand
 * (or "jsupreme-tech") when no valid cookie is set.
 */
export async function requireBrandTenant(): Promise<string> {
  await requireOwnerClerkId(); // throws if the caller isn't an allowed operator
  // Accept the cookie if it names ANY known brand (the switcher + cards offer the
  // full roster), so a selected brand always sticks. Only the empty-cookie
  // fallback prefers an active brand.
  const brands = await listBrands({});
  const slugs = brands.map((b) => b.slug);
  const fallback =
    brands.find((b) => b.active)?.slug ?? slugs[0] ?? "jsupreme-tech";
  try {
    const c = (await cookies()).get(ACTIVE_BRAND_COOKIE)?.value;
    if (c && slugs.includes(c)) return c;
  } catch {
    /* cookies() not available in this context — use the fallback */
  }
  return fallback;
}
