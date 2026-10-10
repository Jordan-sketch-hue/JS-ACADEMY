import "server-only";

/**
 * Free website email finder — no API key, no quota. Given a business website,
 * fetches the homepage + common contact pages and extracts a real contact email.
 * This is the "email resolution" half of sourcing: discovery finds the site, this
 * turns it into a reachable address (falling back to Hunter only when this fails).
 */

const EMAIL_RE = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/gi;
// Local-parts that are almost always noise / not real business inboxes.
const JUNK_LOCAL = ["example", "sentry", "wix", "godaddy", "domain", "yourname", "user", "email", "name", "test", "no-reply", "noreply", "donotreply"];
const IMG_EXT = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

async function fetchText(url: string, ms = 5000): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JSupremeSalesBot/1.0; +https://jsupremeconglomerate.online)" },
    });
    if (!res.ok) return "";
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return "";
    return (await res.text()).slice(0, 600_000);
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

function extractEmails(html: string, rootDomain: string): string[] {
  const found = new Set<string>();
  // mailto: links are the most reliable signal.
  for (const m of html.match(/mailto:([^"'?>\s]+)/gi) ?? []) {
    const e = m.replace(/mailto:/i, "").split("?")[0].toLowerCase().trim();
    if (/.+@.+\..+/.test(e)) found.add(e);
  }
  for (const m of html.match(EMAIL_RE) ?? []) found.add(m.toLowerCase());

  const root = rootDomain.replace(/^www\./, "");
  return [...found]
    .filter((e) => {
      if (IMG_EXT.some((x) => e.endsWith(x))) return false; // sprite/image filenames matched as emails
      if (e.length > 80) return false;
      const local = e.split("@")[0];
      if (JUNK_LOCAL.some((j) => local === j || local.startsWith(j))) return false;
      return true;
    })
    // Prefer emails on the business's own domain, then anything else.
    .sort((a, b) => {
      const aOwn = a.endsWith("@" + root) ? 0 : 1;
      const bOwn = b.endsWith("@" + root) ? 0 : 1;
      return aOwn - bOwn;
    });
}

/** Returns the best contact email found on a business website, or null. */
export async function findEmailOnWebsite(website: string): Promise<string | null> {
  let base = website.trim();
  if (!/^https?:\/\//i.test(base)) base = "https://" + base;
  let root = "";
  try {
    root = new URL(base).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  const stem = base.replace(/\/+$/, "");
  // Homepage (footer often has it) then /contact — kept to 2 pages to stay fast
  // inside the cron's time budget.
  const pages = [base, `${stem}/contact`];
  for (const p of pages) {
    const html = await fetchText(p);
    if (!html) continue;
    const emails = extractEmails(html, root);
    if (emails.length) return emails[0];
  }
  return null;
}

/** Best-effort: derive a clean domain from a website URL. */
export function domainOf(website: string): string | null {
  let u = website.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}
