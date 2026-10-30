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

  // Ensure video plays (autoplay blocked on some mobile browsers until interaction)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {/* silently ignore — image fallback is already visible */});
  }, []);

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        // Mobile: 70svh keeps content visible without full-screen lock
        // Desktop: 100svh for full impact
        minHeight: "clamp(480px, 70svh, 100svh)",
        width: "100%",
      }}
      aria-label="Hero"
    >
      {/* Video background — muted, loop, plays inline on mobile */}
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
            // Ensure face/subject stays centred on mobile crop
            objectPosition: "center center",
          }}
        />
      )}

      {/* Image background — <picture> swaps to portrait crop on mobile */}
      <picture style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: bgVideo ? -1 : 0 }}>
        {bgImageMobile && (
          <source media="(max-width: 767px)" srcSet={bgImageMobile} />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
          fetchPriority="high"
        />
      </picture>

      {/* Overlay — gradient: heavier at bottom for text legibility on mobile */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.70) 100%)",
        zIndex: 1,
      }} />

      {/* Content */}
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
            // fluid font: 32px mobile → 56px desktop
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
          // fluid: 16px mobile → 20px desktop
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
            onClick={() => document.querySelector(ctaHref)?.scrollIntoView({ behavior: "smooth" })}
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