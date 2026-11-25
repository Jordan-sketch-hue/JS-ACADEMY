/**
 * GalleryCarousel — editorial horizontal scroll carousel with animated entrance.
 *
 * Animation: heading + subline reveal on scroll. Cards slide-in left-to-right
 * with staggered delay. Images have hover scale. Pure CSS snap scroll.
 */
"use client";

import { useReveal, useRevealChildren } from "../../lib/useReveal";

interface GalleryImage { src: string; alt: string; caption?: string; }
interface Props { images: GalleryImage[]; heading?: string; subline?: string; }

export function GalleryCarousel({ images, heading = "Gallery", subline }: Props) {
  const headingRef  = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const carouselRef = useRevealChildren<HTMLDivElement>(".gallery-card", { threshold: 0.05 });

  if (!images.length) {
    return (
      <section id="gallery" className="py-20 px-6 bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-6xl text-center text-sm text-[var(--text-muted)]">
          No gallery images yet
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-[var(--bg-surface)]">
      {/* Section heading */}
      <div ref={headingRef} data-reveal className="animate-up mx-auto max-w-6xl px-6 mb-10">
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
        {subline && (
          <p className="mt-2 text-sm text-[var(--text-muted)] tracking-wide">{subline}</p>
        )}
      </div>

      {/* Snap scroll carousel */}
      <div
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto px-6 pb-6 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((item, i) => {
          const isVideo = item.src.endsWith(".mp4") || item.src.endsWith(".webm");
          return (
            <div
              key={item.src + i}
              data-reveal
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore — CSS custom property
              style={{ "--i": i }}
              className="gallery-card relative shrink-0 snap-start w-80 sm:w-96 aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)] group animate-right"
            >
              {isVideo ? (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-white/90 tracking-wide uppercase">
                {item.caption ?? item.alt}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
