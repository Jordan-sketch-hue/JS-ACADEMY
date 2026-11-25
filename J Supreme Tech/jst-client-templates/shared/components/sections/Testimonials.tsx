"use client";

import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

interface Props { items: Testimonial[]; heading?: string; }

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 text-yellow-400 text-sm" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true">{i < n ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export function Testimonials({ items, heading = "What Clients Say" }: Props) {
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const gridRef    = useRevealChildren<HTMLDivElement>(".testimonial-card", { threshold: 0.1 });

  if (!items || items.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} data-reveal className="animate-up mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
        </div>

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <figure
              key={t.author + i}
              data-reveal
              // @ts-ignore
              style={{ "--i": i }}
              className="testimonial-card animate-up rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-6 flex flex-col gap-4 hover-lift"
            >
              {t.rating && <Stars n={t.rating} />}
              <blockquote className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">{t.author[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.author}</p>
                  {t.role && <p className="text-xs text-[var(--text-muted)]">{t.role}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
