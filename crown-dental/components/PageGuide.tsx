"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { guides, type PageGuide as GuideType } from "@/lib/guides";

const STORAGE_KEY = "crown-guides-v1";

function getSeenKeys(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function markSeen(key: string) {
  const s = getSeenKeys();
  s[key] = true;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export function useGuideControl() {
  const pathname = usePathname();
  const guide = guides[pathname];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!guide) return;
    const seen = getSeenKeys();
    if (!seen[guide.key]) {
      const t = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, [guide]);

  const openGuide = useCallback(() => setOpen(true), []);
  const closeGuide = useCallback(() => setOpen(false), []);
  return { guide, open, openGuide, closeGuide };
}

/* ── Positioning ── */
const TOOLTIP_W = 340;
const TOOLTIP_H = 280;
const PAD = 16;
const SPOT_PAD = 8; // padding around highlighted element

type Placement = "below" | "above" | "right" | "left" | "corner";

interface TooltipPos { top: number; left: number; placement: Placement }

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function computeTooltipPos(rect: DOMRect): TooltipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const sr = { // spotlight rect (with padding)
    top: rect.top - SPOT_PAD,
    left: rect.left - SPOT_PAD,
    right: rect.right + SPOT_PAD,
    bottom: rect.bottom + SPOT_PAD,
  };

  // below
  if (sr.bottom + TOOLTIP_H + 12 < vh) {
    return {
      placement: "below",
      top: sr.bottom + 12,
      left: clamp(sr.left, PAD, vw - TOOLTIP_W - PAD),
    };
  }
  // above
  if (sr.top - TOOLTIP_H - 12 > 0) {
    return {
      placement: "above",
      top: sr.top - TOOLTIP_H - 12,
      left: clamp(sr.left, PAD, vw - TOOLTIP_W - PAD),
    };
  }
  // right
  if (sr.right + TOOLTIP_W + 12 < vw) {
    return {
      placement: "right",
      top: clamp(sr.top, PAD, vh - TOOLTIP_H - PAD),
      left: sr.right + 12,
    };
  }
  // left
  if (sr.left - TOOLTIP_W - 12 > 0) {
    return {
      placement: "left",
      top: clamp(sr.top, PAD, vh - TOOLTIP_H - PAD),
      left: sr.left - TOOLTIP_W - 12,
    };
  }
  // corner fallback
  return { placement: "corner", top: vh - TOOLTIP_H - PAD, left: vw - TOOLTIP_W - PAD };
}

/* ── Arrow indicator ── */
function Arrow({ placement }: { placement: Placement }) {
  if (placement === "corner") return null;
  const base = "absolute w-0 h-0 pointer-events-none";
  const border = "border-[8px] border-transparent";
  const styles: Record<string, string> = {
    below: `${base} ${border} border-b-white bottom-full left-6`,
    above: `${base} ${border} border-t-white top-full left-6`,
    right: `${base} ${border} border-r-white right-full top-6`,
    left:  `${base} ${border} border-l-white left-full top-6`,
  };
  return <div className={styles[placement]} />;
}

/* ── Main component ── */
interface PageGuideProps { guide: GuideType; open: boolean; onClose: () => void }

export function PageGuide({ guide, open, onClose }: PageGuideProps) {
  const [step, setStep] = useState(0);
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPos>({ top: 0, left: 0, placement: "corner" });
  const rafRef = useRef<number | null>(null);

  // Reset step when opened
  useEffect(() => { if (open) setStep(0); }, [open]);

  // Locate target element and compute positions
  const updatePos = useCallback(() => {
    const current = guide.steps[step];
    if (!current?.spotlight) {
      setSpotRect(null);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setTooltipPos({ placement: "corner", top: vh - TOOLTIP_H - PAD, left: vw - TOOLTIP_W - PAD });
      return;
    }

    const el = document.querySelector(current.spotlight);
    if (!el) {
      setSpotRect(null);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setTooltipPos({ placement: "corner", top: vh - TOOLTIP_H - PAD, left: vw - TOOLTIP_W - PAD });
      return;
    }

    // Scroll element into view (smooth, centered)
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    // Wait a tick for scroll to settle, then compute
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setSpotRect(rect);
      setTooltipPos(computeTooltipPos(rect));
    }, 320);
  }, [guide.steps, step]);

  useEffect(() => {
    if (!open) return;
    updatePos();
    const onResize = () => updatePos();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, updatePos]);

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && step < guide.steps.length - 1) setStep(s => s + 1);
      if (e.key === "ArrowLeft" && step > 0) setStep(s => s - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, guide.steps.length, onClose]);

  if (!open) return null;

  const current = guide.steps[step];
  const isLast = step === guide.steps.length - 1;
  function dismiss(neverAgain = false) {
    if (neverAgain) markSeen(guide.key);
    onClose();
  }

  return (
    <>
      {/* ── Spotlight overlay ── */}
      {spotRect ? (
        <div
          className="fixed inset-0 z-[48] pointer-events-none"
          aria-hidden="true"
        >
          {/* Dark backdrop with hole — achieved by a positioned box with massive box-shadow */}
          <div
            style={{
              position: "fixed",
              top: spotRect.top - SPOT_PAD,
              left: spotRect.left - SPOT_PAD,
              width: spotRect.width + SPOT_PAD * 2,
              height: spotRect.height + SPOT_PAD * 2,
              borderRadius: 10,
              boxShadow: "0 0 0 9999px rgba(15,12,11,0.62)",
              border: "2px solid rgba(196,157,69,0.8)",
              outline: "4px solid rgba(196,157,69,0.2)",
              transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      ) : (
        /* No target — just a soft backdrop so the tooltip is readable */
        <div className="fixed inset-0 z-[48] pointer-events-none bg-ink/30" aria-hidden="true" />
      )}

      {/* ── Tooltip card ── */}
      <div
        className="fixed z-[50] pointer-events-none"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: TOOLTIP_W,
          transition: "top 0.35s cubic-bezier(0.4,0,0.2,1), left 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
        aria-modal="true"
        role="dialog"
        aria-label={`How to use ${guide.title}`}
      >
        <div className="pointer-events-auto relative rounded-2xl bg-white shadow-2xl border border-line overflow-hidden">
          <Arrow placement={tooltipPos.placement} />

          {/* Gold accent top bar */}
          <div className="h-1 bg-gradient-to-r from-gold-deep via-gold to-gold/40" />

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-3.5 pb-2.5 border-b border-line">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icons.BookOpen className="h-3 w-3 text-gold-deep shrink-0" strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gold-deep">How to use this page</span>
              </div>
              <h2 className="text-sm font-semibold text-ink leading-tight">{guide.title}</h2>
              <p className="text-[11px] text-slate mt-0.5">{guide.subtitle}</p>
            </div>
            <button
              onClick={() => dismiss()}
              className="ml-2 shrink-0 rounded-lg p-1 text-mist hover:text-ink transition-colors"
              aria-label="Close guide"
            >
              <Icons.X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1 px-5 pt-2.5">
            {guide.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-5 bg-gold-deep" : i < step ? "w-2 bg-gold/40" : "w-1.5 bg-line hover:bg-gold/30"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
            <span className="ml-auto text-[9px] text-mist font-mono tabular-nums">{step + 1}/{guide.steps.length}</span>
          </div>

          {/* Step content */}
          <div className="px-5 pt-2.5 pb-3" style={{ minHeight: 72 }}>
            {spotRect && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-gold-deep animate-pulse" />
                <span className="text-[9px] text-gold-deep font-semibold uppercase tracking-wider">Highlighted on page</span>
              </div>
            )}
            <p className="text-sm font-semibold text-ink mb-1">{current.title}</p>
            <p className="text-sm text-slate leading-relaxed">{current.body}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 border-t border-line px-5 py-2.5">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>

            {!isLast ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex-1 rounded-lg bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-deep hover:bg-gold/20 transition-colors text-center"
              >
                Next →
              </button>
            ) : guide.nextPage ? (
              <Link
                href={guide.nextPage.href}
                onClick={() => dismiss(true)}
                className="flex-1 gold-btn rounded-lg px-3 py-1.5 text-xs text-center"
              >
                {guide.nextPage.label} →
              </Link>
            ) : (
              <button
                onClick={() => dismiss(true)}
                className="flex-1 gold-btn rounded-lg px-3 py-1.5 text-xs"
              >
                Got it
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 pb-3 gap-3">
            <button
              onClick={() => dismiss(true)}
              className="text-[10px] text-mist hover:text-slate transition-colors"
            >
              Don&apos;t show again
            </button>
            <Link
              href="/platform/training"
              className="text-[10px] text-mist hover:text-gold-deep transition-colors"
            >
              All guides →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* Compact help trigger */
export function HelpTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-slate hover:text-ink hover:border-gold/40 hover:shadow-card transition-all"
      aria-label="How to use this page"
      title="How to use this page"
    >
      <Icons.CircleHelp className="h-3.5 w-3.5" strokeWidth={1.5} />
      <span className="hidden md:block">Help</span>
    </button>
  );
}
