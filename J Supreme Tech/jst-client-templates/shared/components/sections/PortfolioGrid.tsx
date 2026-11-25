"use client";

import { useState } from "react";
import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface PortfolioItem {
  title: string;
  category: string;
  image: string;
  href?: string;
  tags?: string[];
}

interface Props { items: PortfolioItem[]; heading?: string; subline?: string; }

export function PortfolioGrid({ items, heading = "Our Work", subline }: Props) {
  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];
  const [active, setActive] = useState("All");
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const gridRef    = useRevealChildren<HTMLDivElement>(".portfolio-card", { threshold: 0.08 });

  const filtered = active === "All" ? items : items.filter(i => i.category === active);

  return (
    <section id="portfolio" className="py-20 px-6 bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} data-reveal className="animate-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
          {subline && <p className="mt-2 text-sm text-[var(--text-muted)]">{subline}</p>}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={["px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors",
                cat === active ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"].join(" ")}>
              {cat}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => {
            const inner = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    {item.tags && <p className="text-xs text-white/70 mt-1">{item.tags.join(" · ")}</p>}
                  </div>
                </div>
              </>
            );
            const cls = "portfolio-card animate-up relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] group cursor-pointer hover-lift";
            return item.href ? (
              <a key={item.title + i} href={item.href} data-reveal style={{ "--i": i } as React.CSSProperties} className={cls}>{inner}</a>
            ) : (
              <div key={item.title + i} data-reveal style={{ "--i": i } as React.CSSProperties} className={cls}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
