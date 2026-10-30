/**
 * GalleryCarousel — horizontal scroll gallery. No external carousel lib.
 * HOW TO TEST:
 *   - Pass 4+ images → renders scrollable row
 *   - Scroll/swipe horizontally → images scroll smoothly
 *   - Pass [] → "No gallery images yet" message appears (empty state)
 */
"use client";

interface GalleryImage { src: string; alt: string; }
interface Props { images: GalleryImage[]; heading?: string; }

export function GalleryCarousel({ images, heading = "Gallery" }: Props) {
  // Empty state
  if (!images.length) {
    return (
      <section id="gallery" className="py-20 px-6 bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-6xl text-center text-sm text-[var(--text-muted)]">No gallery images yet</div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
      </div>
      {/* Scroll container — no JS, pure CSS scroll-snap */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img) => (
          <div
            key={img.src}
            className="shrink-0 snap-start w-72 h-72 sm:w-80 sm:h-80 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
