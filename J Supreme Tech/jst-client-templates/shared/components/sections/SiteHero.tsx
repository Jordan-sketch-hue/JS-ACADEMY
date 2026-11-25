"use client";

import { useReveal } from "../../lib/useReveal";

interface Props {
  headline: string;
  subline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
  imageAlt?: string;
}

export function SiteHero({
  headline,
  subline,
  ctaLabel = "Get Started",
  ctaHref = "#contact",
  secondaryLabel,
  secondaryHref,
  image,
  imageAlt = "",
}: Props) {
  const headlineRef   = useReveal<HTMLHeadingElement>({ threshold: 0.1 });
  const sublineRef    = useReveal<HTMLParagraphElement>({ threshold: 0.1 });
  const ctaRef        = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] flex items-center bg-[var(--bg)] overflow-hidden"
    >
      {/* Background image */}
      {image && (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <h1
          ref={headlineRef}
          data-reveal
          className="animate-up text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-none max-w-3xl"
        >
          {headline}
        </h1>

        {subline && (
          <p
            ref={sublineRef}
            data-reveal
            // @ts-ignore
            style={{ "--i": 1 }}
            className="animate-up mt-6 text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed"
          >
            {subline}
          </p>
        )}

        <div
          ref={ctaRef}
          data-reveal
          // @ts-ignore
          style={{ "--i": 2 }}
          className="animate-up mt-10 flex flex-wrap gap-4"
        >
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </a>
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
