import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { listBrands } from "@/lib/sales/brands";
import { requireBrandTenant } from "@/lib/sales/active-brand";
import { BrandSwitcher } from "@/components/sales/brand-switcher";
import {
  toggleBrandLiveAction,
  reseedRosterAction,
} from "@/app/(app)/sales/actions";

const TABS = [
  { href: "/sales", label: "Overview" },
  { href: "/sales/prospects", label: "Prospects" },
  { href: "/sales/inbox", label: "Inbox" },
  { href: "/sales/emails", label: "Emails" },
  { href: "/sales/templates", label: "Templates" },
  { href: "/sales/campaigns", label: "Campaigns" },
  { href: "/sales/settings", label: "Settings" },
];

/**
 * Sticky bar on every /sales page: which brand you're driving, a switcher, the
 * per-brand go-live toggle, and section tabs. Rendered once from the layout.
 */
export async function BrandBar() {
  const brands = await listBrands({});
  const active = await requireBrandTenant();
  const current = brands.find((b) => b.slug === active);

  if (brands.length === 0) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm">
        <span className="text-muted-foreground">No brands seeded yet.</span>
        <form action={reseedRosterAction}>
          <button className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            Seed roster
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border bg-card p-3">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: current?.accent_color ?? "#888" }}
        />
        <span className="font-semibold">{current?.name ?? active}</span>
        {current?.sending_live ? (
          <Badge className="bg-emerald-600 text-[10px] hover:bg-emerald-600">LIVE</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px]">Pending domain</Badge>
        )}

        <BrandSwitcher brands={brands} active={active} />

        <form action={toggleBrandLiveAction}>
          <input type="hidden" name="live" value={current?.sending_live ? "0" : "1"} />
          <button
            className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent"
            title="Only flip live once this brand's outreach subdomain is verified in Resend"
          >
            {current?.sending_live ? "Pause sends" : "Go live"}
          </button>
        </form>
      </div>

      <nav className="flex flex-wrap gap-1 text-xs">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-md px-2.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
