/**
 * app/crm/[category]/page.tsx — Config-driven CRM shell.
 *
 * Replaces 20 identical hardcoded pages with one dynamic route driven by
 * CATEGORY_CONFIG in shared/lib/category-config.ts.
 *
 * Route: /crm/automotive, /crm/beauty, /crm/food ... (all 20 categories)
 *
 * noindex: robots meta set to noindex via generateMetadata — customer-facing
 * CRM data must never appear in search results.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CRMShell } from "../../../shared/components/crm/CRMShell";
import { CATEGORY_CONFIG, getCategoryConfig } from "../../../shared/lib/category-config";
import type { CategorySlug } from "../../../shared/lib/category-config";

// ─── Static params for all 20 categories ──────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(CATEGORY_CONFIG).map((slug) => ({ category: slug }));
}

// ─── Metadata — noindex on all CRM routes ──────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
    title: `${params.category} CRM | JST`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: { category: string };
  searchParams?: { tab?: string };
}

export default function CRMCategoryPage({ params, searchParams }: Props) {
  const slug = params.category as CategorySlug;

  // 404 for unknown slugs
  let config;
  try {
    config = getCategoryConfig(slug);
  } catch {
    notFound();
  }

  const initialTab = searchParams?.tab ?? config.crmTabs[0];

  return (
    <CRMShell
      slug={slug}
      config={config}
      initialTab={initialTab}
    />
  );
}
