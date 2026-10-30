/**
 * Testimonials — customer review cards.
 * HOW TO TEST:
 *   - Pass 2+ reviews → renders card grid
 *   - Stars render correctly for rating 1–5
 *   - Pass [] → section is not rendered (returns null)
 */
interface Review { name: string; rating: number; text: string; }
interface Props { reviews: Review[]; }

export function Testimonials({ reviews }: Props) {
  if (!reviews.length) return null;

  return (
    <section id="testimonials" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-[var(--text-primary)]">What Customers Say</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-6">
              {/* Star rating — pure CSS, no icon lib */}
              <div className="flex gap-0.5 mb-3" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-lg" style={{ color: j < r.rating ? "var(--accent)" : "var(--border)" }}>★</span>
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">"{r.text}"</p>
              <p className="mt-4 text-xs font-semibold text-[var(--text-muted)]">— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
