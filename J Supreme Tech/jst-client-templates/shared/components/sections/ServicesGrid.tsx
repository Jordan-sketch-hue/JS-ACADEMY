/**
 * ServicesGrid — displays the business's service/product offerings in a responsive grid.
 * HOW TO TEST:
 *   - Pass 3+ items → renders in a 3-column grid on desktop, 1-column on mobile
 *   - Each card shows icon, title, description
 *   - Scroll down to this section → cards animate in from below (scroll observer)
 */
"use client";
import { useEffect, useRef } from "react";

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  image?: string;
}

interface Props { items: ServiceItem[]; heading?: string; }

export function ServicesGrid({ items, heading = "What We Offer" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="services" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--accent)] transition-colors"
            >
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
                <h3 className={`${item.image ? "" : "mt-4"} text-lg font-semibold text-[var(--text-primary)]`}>{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
