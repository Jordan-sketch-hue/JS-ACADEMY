import type { CrmClientRecord } from "@/lib/data/crm-records";

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  twitter: "X / Twitter",
  other: "Other link",
};

/** Best-effort href for opening in a new tab (bare domains, mailto, etc.). */
export function normalizeExternalHref(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("mailto:") || t.startsWith("tel:")) return t;
  if (t.startsWith("//")) return `https:${t}`;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(t)) {
    return `https://${t}`;
  }
  return `https://${t}`;
}

function socialEntryHref(key: string, raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("@")) {
    const h = t.replace(/^@+/, "").replace(/\s+/g, "");
    if (!h) return null;
    if (key === "twitter") return `https://x.com/${h}`;
    if (key === "instagram") return `https://instagram.com/${h}`;
    return `https://instagram.com/${h}`;
  }
  return normalizeExternalHref(t);
}

export type ClientLinkItem = { label: string; href: string };

export function flattenClientLinks(client: CrmClientRecord): ClientLinkItem[] {
  const out: ClientLinkItem[] = [];
  const web = client.website?.trim();
  if (web) {
    const href = normalizeExternalHref(web);
    if (href) out.push({ label: "Website", href });
  }
  const social = client.social_links ?? {};
  for (const [key, val] of Object.entries(social)) {
    const v = String(val ?? "").trim();
    if (!v) continue;
    const href = socialEntryHref(key, v);
    if (!href) continue;
    const label =
      SOCIAL_LABELS[key] ??
      (key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, " "));
    out.push({ label, href });
  }
  for (const row of client.extra_hyperlinks ?? []) {
    const label = row.label.trim();
    const url = row.url.trim();
    if (!label || !url) continue;
    const href =
      url.startsWith("@") && !url.includes("://")
        ? socialEntryHref("instagram", url)
        : normalizeExternalHref(url);
    if (href) out.push({ label, href });
  }
  return out;
}
