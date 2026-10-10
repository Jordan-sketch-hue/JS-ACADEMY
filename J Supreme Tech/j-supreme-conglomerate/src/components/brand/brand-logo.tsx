"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a client/brand logo image with a graceful fallback to gradient
 * initials when no `src` is provided or the image fails to load. Used wherever
 * a brand identity mark appears (showcase, marketing playbook/chips, back-office)
 * so every surface stays in sync from the data layer.
 */
export function BrandLogo({
  src,
  name,
  initials,
  className,
  fallbackClassName,
  rounded = "full",
  fit = "cover",
}: {
  src?: string;
  /** Brand name — used for alt text and to derive initials when none given. */
  name: string;
  /** Explicit fallback initials; otherwise derived from `name`. */
  initials?: string;
  /** Sizing utilities, e.g. "h-10 w-10". */
  className?: string;
  /** Tailwind gradient classes for the initials fallback, e.g. "from-red-600 to-green-600". */
  fallbackClassName?: string;
  rounded?: "full" | "xl" | "lg" | "md";
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);

  const radius =
    rounded === "full" ? "rounded-full" : rounded === "xl" ? "rounded-xl" : rounded === "lg" ? "rounded-lg" : "rounded-md";

  const derivedInitials =
    initials ??
    name
      .replace(/^the\s+/i, "")
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local brand logos, no remote loader needed
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 bg-white ring-1 ring-border/60",
          fit === "cover" ? "object-cover" : "object-contain",
          radius,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br font-bold text-white",
        radius,
        className,
        fallbackClassName,
      )}
    >
      {derivedInitials}
    </div>
  );
}
