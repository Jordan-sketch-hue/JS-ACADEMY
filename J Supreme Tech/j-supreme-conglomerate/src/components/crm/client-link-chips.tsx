"use client";

import type { CrmClientRecord } from "@/lib/data/crm-records";
import { flattenClientLinks } from "@/lib/crm/client-links";
import { cn } from "@/lib/utils";

export function ClientLinkChips({
  client,
  className,
  compact,
}: {
  client: CrmClientRecord;
  className?: string;
  compact?: boolean;
}) {
  const items = flattenClientLinks(client);
  if (!items.length) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {items.map((item, i) => (
        <a
          key={`${i}-${item.label}-${item.href}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex max-w-full truncate rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary underline-offset-2 hover:underline",
            compact && "px-1.5 text-[10px]",
          )}
          title={item.href}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
