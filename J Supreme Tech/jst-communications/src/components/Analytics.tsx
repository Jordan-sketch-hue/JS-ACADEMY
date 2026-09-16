"use client";

import { useEffect, useRef } from "react";

const TRACK = "/api/track";

/* ── UTM helper (for generating outbound links with attribution) ── */
export function utmLink(href: string, medium = "editorial", campaign = "comms") {
  if (!href || href.startsWith("#") || href.startsWith("mailto")) return href;
  try {
    const url = new URL(href);
    url.searchParams.set("utm_source", "jst-communications");
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", campaign);
    return url.toString();
  } catch {
    return href;
  }
}

/* ── Fire-and-forget event to /api/track ── */
function fire(event: string, extra: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const sessionUtm = (() => {
    try { return JSON.parse(sessionStorage.getItem("jst_utm") ?? "{}"); } catch { return {}; }
  })();

  const utm = {
    source:   params.get("utm_source")   ?? sessionUtm.source   ?? null,
    medium:   params.get("utm_medium")   ?? sessionUtm.medium   ?? null,
    campaign: params.get("utm_campaign") ?? sessionUtm.campaign ?? null,
    content:  params.get("utm_content")  ?? sessionUtm.content  ?? null,
    term:     params.get("utm_term")     ?? sessionUtm.term     ?? null,
  };

  // Persist UTMs to session so subsequent events on the same visit carry attribution
  if (utm.source || utm.medium) {
    try { sessionStorage.setItem("jst_utm", JSON.stringify(utm)); } catch {}
  }

  fetch(TRACK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ event, page: window.location.pathname, utm, props: extra }),
  }).catch(() => {});
}

/* ── Page view + UTM capture ── */
function PageViewTracker() {
  useEffect(() => {
    fire("page_view");
  }, []);
  return null;
}

/* ── Scroll depth (25 / 50 / 75 / 100%) ── */
function ScrollDepthTracker() {
  const fired = useRef(new Set<number>());
  useEffect(() => {
    const check = () => {
      const el = document.documentElement;
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight || 1)) * 100);
      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          fire("scroll_depth", { depth_pct: threshold });
        }
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  return null;
}

/* ── Click tracker — outbound / CTA / affiliate / internal ── */
function ClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      const label = el.textContent?.trim().slice(0, 80) ?? href;
      const isExternal = href.startsWith("http") && !href.includes("communications.jsupremetech.online");
      const isAffiliate = href.includes("namecheap") || href.includes("ref=") || href.includes("affiliate");
      const isCTA = el.closest("[data-cta]") !== null ||
        el.classList.contains("btn") ||
        el.closest("button") !== null;

      const eventName = isAffiliate
        ? "affiliate_click"
        : isCTA
          ? "cta_click"
          : isExternal
            ? "outbound_click"
            : "internal_click";

      fire(eventName, { label, href: href.slice(0, 300), is_external: isExternal });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return null;
}

/* ── Article read time tracker (fires when user leaves or after 30s) ── */
function ArticleReadTracker({ slug, title }: { slug?: string; title?: string }) {
  useEffect(() => {
    if (!slug && !title) return;
    const start = Date.now();
    const wordsEl = document.querySelector("article");
    const wordCount = wordsEl?.innerText?.split(/\s+/).length ?? 0;
    const estReadMin = Math.max(1, Math.round(wordCount / 200));

    const handleLeave = () => {
      const elapsed = Math.round((Date.now() - start) / 1000);
      fire("article_read", {
        slug: slug ?? window.location.pathname,
        title: title ?? document.title,
        est_read_min: estReadMin,
        time_on_page_sec: elapsed,
        completed: elapsed >= estReadMin * 60 * 0.7,
      });
    };

    window.addEventListener("beforeunload", handleLeave);
    const timeout = setTimeout(handleLeave, 30_000);
    return () => {
      window.removeEventListener("beforeunload", handleLeave);
      clearTimeout(timeout);
    };
  }, [slug, title]);
  return null;
}

/* ── Main export ── */
export default function Analytics({
  articleSlug,
  articleTitle,
}: {
  articleSlug?: string;
  articleTitle?: string;
} = {}) {
  return (
    <>
      <PageViewTracker />
      <ScrollDepthTracker />
      <ClickTracker />
      {(articleSlug || articleTitle) && (
        <ArticleReadTracker slug={articleSlug} title={articleTitle} />
      )}
    </>
  );
}

/* ── Standalone newsletter signup event (call from subscribe handler) ── */
export function trackNewsletterSignup(email?: string) {
  fire("newsletter_signup", { has_email: !!email });
}
