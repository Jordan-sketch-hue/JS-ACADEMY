/**
 * CRMShell — config-driven CRM layout used by app/crm/[category]/page.tsx.
 *
 * Renders the nav tabs, dashboard stat cards and module slot based on
 * the category's CATEGORY_CONFIG entry. Each module slot renders a
 * placeholder panel — module components are added in Programme C.
 */
"use client";

import { useState } from "react";
import type { CategoryConfig, CRMModuleKey } from "../../lib/category-config";
import { MODULE_LABELS } from "../../lib/category-config";
import type { CategorySlug } from "../../lib/category-config";

interface Props {
  slug: CategorySlug;
  config: CategoryConfig;
  initialTab: string;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value = "—" }: { label: string; value?: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

// ─── Module panel placeholder ─────────────────────────────────────────────────

function ModulePanel({ tabKey }: { tabKey: CRMModuleKey }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
      <p className="text-sm text-[var(--text-muted)]">
        {MODULE_LABELS[tabKey] ?? tabKey} — module coming in Programme C
      </p>
    </div>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function CRMShell({ slug, config, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const accentStyle = {
    "--accent": config.accentMood,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[var(--bg)]" style={accentStyle}>

      {/* ── Top bar ── */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-card)] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">{config.label}</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{config.crmSubtitle}</p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{ background: `${config.accentMood}22`, color: config.accentMood }}
        >
          {slug}
        </span>
      </header>

      {/* ── Tab nav ── */}
      <nav className="border-b border-[var(--border)] bg-[var(--bg-card)] px-6 overflow-x-auto flex gap-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {config.crmTabs.map((tabKey) => {
          const isActive = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={[
                "shrink-0 px-4 py-3 text-xs font-semibold uppercase tracking-widest border-b-2 transition-colors",
                isActive
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              {MODULE_LABELS[tabKey] ?? tabKey}
            </button>
          );
        })}
      </nav>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">

        {/* Dashboard stats — always visible */}
        {activeTab === config.crmTabs[0] && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.dashboardStats.map((label) => (
              <StatCard key={label} label={label} />
            ))}
          </div>
        )}

        {/* Active module panel */}
        <ModulePanel tabKey={activeTab as CRMModuleKey} />

      </main>
    </div>
  );
}
