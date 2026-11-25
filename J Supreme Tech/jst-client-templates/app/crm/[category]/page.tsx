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
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return {
    robots: { index: false, follow: false },
    title: `${category} CRM | JST`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

export default async function CRMCategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const slug = category as CategorySlug;

  // 404 for unknown slugs
  let config;
  try {
    config = getCategoryConfig(slug);
  } catch {
    notFound();
  }

  const resolvedSearch = searchParams ? await searchParams : undefined;
  const initialTab = resolvedSearch?.tab ?? config.crmTabs[0];

  return (
    <CRMShell
      slug={slug}
      config={config}
      initialTab={initialTab}
    />
  );
}
