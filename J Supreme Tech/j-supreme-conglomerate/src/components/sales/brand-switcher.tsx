"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { SalesBrand } from "@/lib/sales/types";
import { switchBrandFormAction } from "@/app/(app)/sales/actions";

/**
 * The brand picker in the sticky bar. Selecting a brand switches it instantly —
 * the <select> submits the (server) switch action on change, so the dropdown can
 * never drift out of sync with the brand name shown on the left. A visible
 * "Switch" button is kept as a progressive-enhancement fallback for no-JS.
 */
export function BrandSwitcher({
  brands,
  active,
}: {
  brands: SalesBrand[];
  active: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={switchBrandFormAction}
      className="ml-auto flex items-center gap-1.5"
    >
      <label htmlFor="sales-brand-switch" className="sr-only">
        Switch active brand
      </label>
      <div className="relative">
        <select
          id="sales-brand-switch"
          name="slug"
          defaultValue={active}
          onChange={() => formRef.current?.requestSubmit()}
          className="appearance-none rounded-md border bg-background py-1 pl-2 pr-7 text-xs"
        >
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>
      {/* No-JS fallback: onChange can't fire a submit without JS, so keep a button. */}
      <noscript>
        <button className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent">
          Switch
        </button>
      </noscript>
    </form>
  );
}
