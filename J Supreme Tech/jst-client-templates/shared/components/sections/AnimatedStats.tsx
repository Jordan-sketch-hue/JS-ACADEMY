/**
 * AnimatedStats — count-up number animation triggered on scroll into view.
 * Pure JS requestAnimationFrame — no counter library.
 * HOW TO TEST:
 *   - Scroll this section into view → numbers count up from 0 to their target value
 *   - Inspect at 320px width → all stat items stack cleanly
 */
"use client";
import { useEffect, useRef } from "react";

export interface Stat { value: number; suffix?: string; label: string; }
interface Props { stats: Stat[]; }

function countUp(el: HTMLElement, target: number, duration = 1200) {
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(eased * target));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function AnimatedStats({ stats }: Props) {
  const ref = useRef<HTMLElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          el.querySelectorAll<HTMLElement>("[data-count]").forEach((num) => {
            countUp(num, Number(num.dataset.count));
          });
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[var(--accent)] py-16 px-6">
      <div className="mx-auto max-w-4xl grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-4xl font-bold text-[var(--accent-fg)]">
              <span data-count={s.value}>0</span>{s.suffix ?? ""}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--accent-fg)] opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
