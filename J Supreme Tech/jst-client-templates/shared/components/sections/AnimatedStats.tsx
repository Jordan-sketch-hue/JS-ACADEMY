"use client";

import { useEffect, useRef } from "react";
import { useReveal, useRevealChildren } from "../../lib/useReveal";

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

interface Props { stats: StatItem[]; heading?: string; }

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const raf = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function AnimatedStats({ stats, heading = "By the Numbers" }: Props) {
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const gridRef    = useRevealChildren<HTMLDivElement>(".stat-card", { threshold: 0.15 });

  if (!stats || stats.length === 0) return null;

  return (
    <section id="stats" className="py-20 px-6 bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-5xl">
        <div ref={headingRef} data-reveal className="animate-up mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
        </div>

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              data-reveal
              // @ts-ignore — CSS custom property
              style={{ "--i": i }}
              className="stat-card animate-up rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center hover-lift"
            >
              <p className="text-4xl font-bold text-[var(--accent)]">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
