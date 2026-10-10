"use client";

import type { ClientHyperlink } from "@/lib/data/crm-records";
import { normalizeExternalHref } from "@/lib/crm/client-links";
import { cn } from "@/lib/utils";
import { Clapperboard } from "lucide-react";

/** Compact outbound chips for hosted creative / product URLs (images, video, Drive, etc.). */
export function ClientMediaChips({
  links,
  className,
  compact,
}: {
  links: ClientHyperlink[] | undefined;
  className?: string;
  compact?: boolean;
}) {
  const items = (links ?? []).filter((l) => l.label?.trim() && l.url?.trim());
  if (!items.length) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {items.map((item, i) => {
        const href = normalizeExternalHref(item.url.trim());
        if (!href) return null;
        return (
          <a
            key={`${i}-${item.label}-${href}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex max-w-full items-center gap-1 truncate rounded-md border border-violet-500/35 bg-violet-500/5 px-2 py-0.5 text-xs font-medium text-violet-700 underline-offset-2 hover:underline dark:border-violet-400/35 dark:bg-violet-500/10 dark:text-violet-200",
              compact && "px-1.5 py-0 text-[10px]",
            )}
            title={href}
          >
            <Clapperboard className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
            <span className="truncate">{item.label}</span>
          </a>
        );
      })}
    </div>
  );
}
