/**
 * ServicesGrid — responsive service/product card grid with scroll-triggered entrance.
 *
 * Animation: section heading reveals on scroll, cards stagger-up with --i index.
 * Requires animations.css imported in globals.css.
 * Respects prefers-reduced-motion via animations.css media query.
 */
"use client";

import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  image?: string;
  href?: string;
}

interface Props { items: ServiceItem[]; heading?: string; }

export function ServicesGrid({ items, heading = "What We Offer" }: Props) {
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const gridRef    = useRevealChildren<HTMLDivElement>(".services-card", { threshold: 0.1 });

  if (!items || items.length === 0) return null;

  return (
    <section id="services" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">

        {/* Heading — section-heading class + ref-driven reveal */}
        <div ref={headingRef} data-reveal className="animate-up mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
        </div>

        {/* Grid — children observed individually for stagger */}
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const baseClass =
              "services-card rounded-[var(--radius-lg)] border border-[var(--border)] " +
              "bg-[var(--bg-card)] overflow-hidden hover:border-[var(--accent)] " +
              "transition-colors hover-lift animate-up";

            const inner = (
              <>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  {!item.image && item.icon && (
                    <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  )}
                  <h3 className={`${item.image ? "" : "mt-4"} text-lg font-semibold text-[var(--text-primary)]`}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                  {item.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                      Learn more <span aria-hidden="true">→</span>
                    </span>
                  )}
                </div>
              </>
            );

            if (item.href) {
              return (
                <a
                  key={item.title}
                  href={item.href}
                  data-reveal
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore — CSS custom property
                  style={{ "--i": i }}
                  className={`${baseClass} block cursor-pointer`}
                >
                  {inner}
                </a>
              );
            }

            return (
              <div
                key={item.title}
                data-reveal
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore — CSS custom property
                style={{ "--i": i }}
                className={baseClass}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
