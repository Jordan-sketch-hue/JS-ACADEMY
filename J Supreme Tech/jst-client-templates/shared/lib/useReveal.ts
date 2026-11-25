"use client";

/**
 * useReveal — shared IntersectionObserver hook for scroll-triggered reveals.
 *
 * Attaches data-reveal="visible" to observed elements once they enter the
 * viewport. Animate with animations.css: add class "animate-up", "animate-scale"
 * etc. and optionally set style={{ "--i": index }} for stagger.
 *
 * Usage:
 *   const ref = useReveal<HTMLDivElement>();
 *   <div ref={ref} data-reveal className="animate-up" style={{ "--i": 0 }} />
 *
 * Respects prefers-reduced-motion — animations.css handles the skip.
 * The hook itself still fires so components mount at their final visual state.
 */

import { useEffect, useRef } from "react";

interface UseRevealOptions {
  /** IntersectionObserver threshold (0–1). Default: 0.15 */
  threshold?: number;
  /** Root margin. Default: "0px 0px -60px 0px" (trigger slightly before bottom) */
  rootMargin?: string;
  /** Disconnect after first fire — prevents re-animation on scroll back up. Default: true */
  once?: boolean;
}

export function useReveal<T extends HTMLElement = HTMLElement>(
  options: UseRevealOptions = {}
): React.RefObject<T> {
  const {
    threshold  = 0.15,
    rootMargin = "0px 0px -60px 0px",
    once       = true,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial hidden state if not already set by CSS [data-reveal]
    if (el.dataset.reveal === undefined) {
      el.dataset.reveal = "";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = "visible";
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            (entry.target as HTMLElement).dataset.reveal = "";
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * useRevealChildren — observe multiple children inside a container.
 *
 * Usage:
 *   const containerRef = useRevealChildren<HTMLDivElement>(".card");
 *   <div ref={containerRef}>
 *     {items.map((_, i) => <div className="card animate-up" style={{ "--i": i }} data-reveal />)}
 *   </div>
 */
export function useRevealChildren<T extends HTMLElement = HTMLElement>(
  childSelector: string,
  options: UseRevealOptions = {}
): React.RefObject<T> {
  const {
    threshold  = 0.1,
    rootMargin = "0px 0px -40px 0px",
    once       = true,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll<HTMLElement>(childSelector);
    if (!children.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = "visible";
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            (entry.target as HTMLElement).dataset.reveal = "";
          }
        });
      },
      { threshold, rootMargin }
    );

    const observeChild = (child: HTMLElement) => {
      if (child.dataset.reveal === undefined) child.dataset.reveal = "";
      observer.observe(child);
    };

    children.forEach(observeChild);

    // Re-observe children added after a filter/category change (React mounts new nodes
    // without changing our deps, so the IntersectionObserver never sees them otherwise).
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(childSelector)) observeChild(node);
          node.querySelectorAll<HTMLElement>(childSelector).forEach(observeChild);
        });
      }
    });
    mo.observe(container, { childList: true, subtree: true });

    return () => { observer.disconnect(); mo.disconnect(); };
  }, [childSelector, threshold, rootMargin, once]);

  return ref;
}
