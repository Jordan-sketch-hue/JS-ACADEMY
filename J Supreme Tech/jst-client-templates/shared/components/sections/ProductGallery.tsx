"use client";

import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface Product {
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  href?: string;
  category?: string;
}

interface Props { products: Product[]; heading?: string; subline?: string; }

export function ProductGallery({ products, heading = "Shop Products", subline }: Props) {
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const gridRef    = useRevealChildren<HTMLDivElement>(".product-card", { threshold: 0.08 });

  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} data-reveal className="animate-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
          {subline && <p className="mt-2 text-sm text-[var(--text-muted)]">{subline}</p>}
        </div>

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => {
            const card = (
              <>
                <div className="relative overflow-hidden aspect-square bg-[var(--bg-surface)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">{p.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--accent)]">{p.price}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-[var(--text-muted)] line-through">{p.originalPrice}</span>
                    )}
                  </div>
                </div>
              </>
            );
            const cls = "product-card animate-up rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden group hover-lift";
            return p.href ? (
              <a key={p.name + i} href={p.href} data-reveal style={{ "--i": i } as React.CSSProperties} className={cls}>{card}</a>
            ) : (
              <div key={p.name + i} data-reveal style={{ "--i": i } as React.CSSProperties} className={cls}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
