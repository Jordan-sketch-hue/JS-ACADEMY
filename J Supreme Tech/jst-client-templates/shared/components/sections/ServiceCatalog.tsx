"use client";

import { useState } from "react";
import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface CatalogService {
  name: string;
  description: string;
  price?: string;
  duration?: string;
  features?: string[];
  popular?: boolean;
  href?: string;
  category?: string;
}

interface Props { services: CatalogService[]; heading?: string; }

export function ServiceCatalog({ services, heading = "Services & Pricing" }: Props) {
  const categories = Array.from(new Set(services.map(s => s.category).filter(Boolean)));
  const hasCategories = categories.length > 1;
  const [active, setActive] = useState<string>("All");
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const gridRef    = useRevealChildren<HTMLDivElement>(".catalog-card", { threshold: 0.08 });

  const filtered = !hasCategories || active === "All" ? services : services.filter(s => s.category === active);

  return (
    <section id="services-catalog" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} data-reveal className="animate-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
        </div>

        {hasCategories && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["All", ...categories].map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={["px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors",
                  cat === active ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"].join(" ")}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => (
            <div
              key={s.name + i}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
              className={["catalog-card animate-up rounded-[var(--radius-lg)] border bg-[var(--bg-card)] p-6 flex flex-col gap-4 hover-lift transition-colors",
                s.popular ? "border-[var(--accent)]" : "border-[var(--border)]"].join(" ")}
            >
              {s.popular && (
                <span className="self-start rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  Popular
                </span>
              )}
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{s.name}</h3>
                {s.duration && <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.duration}</p>}
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{s.description}</p>
              </div>
              {s.features && s.features.length > 0 && (
                <ul className="space-y-1.5 flex-1">
                  {s.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] mt-0.5" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] mt-auto">
                {s.price ? <span className="text-lg font-black text-[var(--accent)]">{s.price}</span> : <span />}
                {s.href && (
                  <a href={s.href} className="text-xs font-bold uppercase tracking-wide text-[var(--accent)] hover:underline">
                    Book →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
