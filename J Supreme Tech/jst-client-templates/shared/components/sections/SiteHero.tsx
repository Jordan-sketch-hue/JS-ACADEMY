"use client";
import { useEffect, useRef } from "react";
import { Button } from "@shared/components/ui/Button";
import type { ClientConfig } from "@shared/types/config";

interface Props {
  config: ClientConfig;
  headline: string;
  subline: string;
  bgImage: string;
  bgImageMobile?: string | null;
  bgVideo?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
}

export function SiteHero({ config, headline, subline, bgImage, bgImageMobile, bgVideo, ctaLabel = "Get in Touch", ctaHref = "#contact" }: Props) {
  const headRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  const hasMobileAlt = !!(bgImageMobile && bgImageMobile !== bgImage);
  const bgZ = bgVideo ? -1 : 0;

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        minHeight: "clamp(480px, 70svh, 100svh)",
        width: "100%",
      }}
      aria-label="Hero"
    >
      {bgVideo && (
        <video
          ref={videoRef}
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={bgImage}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      )}

      {/*
        CSS bg-image divs replace <picture>/<img> to eliminate viewport-swap flicker.
        Browser evaluates CSS media queries at paint time — only one image loads per viewport.
        With <picture>, <img> loads immediately then swaps when <source> media query resolves.
      */}
      <div
        className={hasMobileAlt ? "hero-bg-desktop has-mobile-alt" : "hero-bg-desktop"}
        style={{ backgroundImage: `url(${JSON.stringify(bgImage)})`, zIndex: bgZ }}
      />
      {hasMobileAlt && (
        <div
          className="hero-bg-mobile"
          style={{ backgroundImage: `url(${JSON.stringify(bgImageMobile!)})`, zIndex: bgZ }}
        />
      )}

      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.70) 100%)",
        zIndex: 1,
      }} />

      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 720,
        width: "100%",
        padding: "0 20px",
        textAlign: "center",
        color: "#fff",
      }}>
        <p style={{
          marginBottom: 12,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.75,
        }}>
          {config.name}
        </p>
        <h1
          ref={headRef}
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {headline}
        </h1>
        <p style={{
          margin: "0 auto 32px",
          maxWidth: 520,
          fontSize: "clamp(16px, 2.5vw, 20px)",
          lineHeight: 1.6,
          opacity: 0.9,
        }}>
          {subline}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => { if (ctaHref.startsWith('#')) { document.querySelector(ctaHref)?.scrollIntoView({ behavior: 'smooth' }); } else { window.location.href = ctaHref; } }}
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            {ctaLabel}
          </Button>
          {config.contact.phone && (
            <a
              href={`tel:${config.contact.phone}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: "var(--radius)",
                border: "1px solid rgba(255,255,255,0.4)",
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                backdropFilter: "blur(4px)",
              }}
            >
              {config.contact.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
