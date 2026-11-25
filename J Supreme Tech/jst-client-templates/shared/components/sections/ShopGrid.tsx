"use client";

import { useState } from "react";
import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface ShopItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
  badge?: string;
  href?: string;
  inStock?: boolean;
}

interface Props {
  items: ShopItem[];
  heading?: string;
  showCategories?: boolean;
}

export function ShopGrid({ items, heading = "Shop", showCategories = true }: Props) {
  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
  const [active, setActive] = useState("All");
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const gridRef    = useRevealChildren<HTMLDivElement>(".shop-card", { threshold: 0.08 });

  const filtered = active === "All" ? items : items.filter(i => i.category === active);

  return (
    <section id="shop" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} data-reveal className="animate-up mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
          <span className="text-xs text-[var(--text-muted)]">{filtered.length} items</span>
        </div>

        {showCategories && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {["All", ...categories].map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={["px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors",
                  cat === active ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"].join(" ")}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => {
            const isOut = item.inStock === false;
            const card = (
              <>
                <div className="relative overflow-hidden aspect-square bg-[var(--bg-surface)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name}
                    className={["h-full w-full object-cover transition-transform duration-500", !isOut && "group-hover:scale-105"].join(" ")} />
                  {item.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {item.badge}
                    </span>
                  )}
                  {isOut && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-white bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">{item.name}</p>
                  <p className="text-sm font-bold text-[var(--accent)] mt-0.5">{item.price}</p>
                </div>
              </>
            );
            const cls = `shop-card animate-up rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden group ${!isOut ? "hover-lift cursor-pointer" : "opacity-70"}`;
            return item.href && !isOut ? (
              <a key={item.id} href={item.href} data-reveal style={{ "--i": i } as React.CSSProperties} className={cls}>{card}</a>
            ) : (
              <div key={item.id} data-reveal style={{ "--i": i } as React.CSSProperties} className={cls}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
