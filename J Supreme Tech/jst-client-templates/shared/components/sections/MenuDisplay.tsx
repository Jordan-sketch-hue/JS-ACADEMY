"use client";

import { useState } from "react";
import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface MenuItem {
  name: string;
  description?: string;
  price: string;
  image?: string;
  tags?: string[];
  category: string;
}

interface Props { items: MenuItem[]; heading?: string; }

export function MenuDisplay({ items, heading = "Our Menu" }: Props) {
  const categories = Array.from(new Set(items.map(i => i.category)));
  const [active, setActive] = useState(categories[0] ?? "");
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const listRef    = useRevealChildren<HTMLDivElement>(".menu-item", { threshold: 0.08 });

  const filtered = items.filter(i => i.category === active);

  return (
    <section id="menu" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-4xl">
        <div ref={headingRef} data-reveal className="animate-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={[
                "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors",
                cat === active
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <div ref={listRef} className="space-y-3">
          {filtered.map((item, i) => (
            <div
              key={item.name + i}
              data-reveal
              // @ts-ignore
              style={{ "--i": i }}
              className="menu-item animate-up flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-4 hover-lift"
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-[var(--radius)] object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</h3>
                  <span className="shrink-0 text-sm font-bold text-[var(--accent)]">{item.price}</span>
                </div>
                {item.description && (
                  <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
