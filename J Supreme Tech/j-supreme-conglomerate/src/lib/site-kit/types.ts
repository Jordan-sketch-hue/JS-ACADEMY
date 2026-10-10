export type SiteKitKind = "website" | "react-app";

export type SiteKitInput = {
  kitKind: SiteKitKind;
  projectName: string;
  tagline?: string;
  /** Used on About page / hero */
  description?: string;
  /** Hex, e.g. #0ea5e9 */
  primaryColor?: string;
  /** Canonical origin for sitemap, e.g. https://client.com */
  baseUrl?: string;
  /** Shown in header / meta */
  logoUrl?: string;
  contactEmail?: string;
};

export function slugProjectName(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return s || "project";
}

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
