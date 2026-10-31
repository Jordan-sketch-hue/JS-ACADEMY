"use client";
import { useState } from "react";
import { ServicesGrid } from "@shared/components/sections/ServicesGrid";
import type { ServiceItem } from "@shared/components/sections/ServicesGrid";

interface FilteredItem extends ServiceItem {
  subcategory?: string | null;
}

interface Props {
  items: FilteredItem[];
  heading?: string;
}

export function FilteredServicesGrid({ items, heading = "What We Offer" }: Props) {
  // Collect unique subcategories from items that have one
  const subcats = Array.from(new Set(items.map((i) => i.subcategory).filter(Boolean))) as string[];
  const hasFilter = subcats.length > 1;
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? items.filter((i) => i.subcategory === active) : items;

  return (
    <>
      {hasFilter && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", padding: "16px 24px 0", maxWidth: 1152, margin: "0 auto" }}>
          <button
            onClick={() => setActive(null)}
            style={{ padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
              background: active === null ? "var(--accent)" : "transparent",
              color: active === null ? "var(--accent-fg,#fff)" : "var(--text-secondary,#555)",
              borderColor: active === null ? "var(--accent)" : "var(--border,#e5e7eb)" }}
          >
            All
          </button>
          {subcats.map((sc) => (
            <button
              key={sc}
              onClick={() => setActive(sc)}
              style={{ padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
                background: active === sc ? "var(--accent)" : "transparent",
                color: active === sc ? "var(--accent-fg,#fff)" : "var(--text-secondary,#555)",
                borderColor: active === sc ? "var(--accent)" : "var(--border,#e5e7eb)" }}
            >
              {sc}
            </button>
          ))}
        </div>
      )}
      <ServicesGrid items={filtered} heading={heading} />
    </>
  );
}