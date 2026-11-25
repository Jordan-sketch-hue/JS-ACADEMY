/**
 * shared/lib/seo.ts — generateMetadata() factory used across all public-facing routes.
 *
 * Usage:
 *   export const metadata = buildPageMetadata({ title: "About", ... });
 *   // or inside generateMetadata():
 *   return buildPageMetadata({ ... }, { noindex: true }); // CRM/admin routes
 */

import type { Metadata } from "next";

export interface PageSEO {
  title: string;
  description?: string;
  /** Canonical path, e.g. "/about". Resolved against NEXT_PUBLIC_SITE_URL. */
  canonicalPath?: string;
  /** Open Graph image (absolute URL or path under /public). */
  ogImage?: string;
  /** Array of keyword strings. Keep ≤ 10; not a ranking factor but aids internal tooling. */
  keywords?: string[];
  /** hreflang alternates — { locale: "en-JM", href: "https://..." }[] */
  alternates?: { locale: string; href: string }[];
}

export interface SEOOptions {
  /** Force noindex/nofollow (always set for /crm, /admin, /dashboard). */
  noindex?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "JST Client";

export function buildPageMetadata(seo: PageSEO, opts: SEOOptions = {}): Metadata {
  const robots = opts.noindex
    ? { index: false, follow: false }
    : { index: true, follow: true };

  const canonical = seo.canonicalPath ? `${SITE_URL}${seo.canonicalPath}` : undefined;

  return {
    title: `${seo.title} | ${SITE_NAME}`,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    robots,
    ...(canonical && {
      alternates: {
        canonical,
        languages: seo.alternates
          ? Object.fromEntries(seo.alternates.map(a => [a.locale, a.href]))
          : undefined,
      },
    }),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: SITE_NAME,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

/** Convenience wrapper — always noindex. Use on all /crm /admin /dashboard routes. */
export function privateRouteMetadata(label: string): Metadata {
  return {
    title: `${label} | JST`,
    robots: { index: false, follow: false },
  };
}
