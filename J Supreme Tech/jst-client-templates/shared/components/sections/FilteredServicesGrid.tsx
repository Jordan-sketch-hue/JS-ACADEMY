"use client";

import { useState, useMemo } from "react";
import { useRevealChildren } from "../../lib/useReveal";
import type { ServiceItem } from "./ServicesGrid";

interface Props {
  items: ServiceItem[];
  heading?: string;
  tags?: string[];
  searchable?: boolean;
}

export function FilteredServicesGrid({ items, heading = "Services", tags = [], searchable = false }: Props) {
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");
  const gridRef = useRevealChildren<HTMLDivElement>(".fsg-card", { threshold: 0.08 });

  const filtered = useMemo(() => {
    let out = items;
    if (activeTag !== "All") out = out.filter(i => i.icon === activeTag || i.title.toLowerCase().includes(activeTag.toLowerCase()));
    if (query.trim()) out = out.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()));
    return out;
  }, [items, activeTag, query]);

  const allTags = ["All", ...tags];

  return (
    <section id="filtered-services" className="py-20 px-6 bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center animate-up" data-reveal>
            {heading}
          </h2>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={["px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors",
                  tag === activeTag ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"].join(" ")}>
                {tag}
              </button>
            ))}
          </div>
          {searchable && (
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search services…"
              className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors w-56"
            />
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-muted)] py-16">No services match your filter.</p>
        ) : (
          <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <div
                key={item.title + i}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
                className="fsg-card animate-up rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-[var(--accent)] transition-colors hover-lift"
              >
                {item.icon && <span className="text-3xl" aria-hidden="true">{item.icon}</span>}
                <h3 className="mt-3 text-base font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
                {item.href && (
                  <a href={item.href} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline">
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
