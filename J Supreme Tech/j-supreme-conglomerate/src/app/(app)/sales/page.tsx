import { requireOwnerClerkId } from "@/lib/session";
import { requireBrandTenant } from "@/lib/sales/active-brand";
import { ensureSalesDefaults } from "@/lib/sales/defaults";
import { getSalesDashboard, getBrandSummaries } from "@/lib/sales/stats";
import { getSalesSettings } from "@/lib/sales/settings";
import { listBrands, seedAllBrands } from "@/lib/sales/brands";
import { SalesDashboard } from "@/components/sales/sales-dashboard";
import { SalesOverview } from "@/components/sales/sales-overview";

export const metadata = { title: "Sales Department · J Supreme" };
export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const operator = await requireOwnerClerkId();

  // Provision the roster from code on first ever load (idempotent).
  let brands = await listBrands({});
  if (brands.length === 0) {
    await seedAllBrands(operator);
    brands = await listBrands({});
  }

  const activeSlug = await requireBrandTenant();
  await ensureSalesDefaults(activeSlug);

  const [summaries, dashboard, settings] = await Promise.all([
    getBrandSummaries(brands.map((b) => b.slug)),
    getSalesDashboard(activeSlug),
    getSalesSettings(activeSlug),
  ]);

  return (
    <div className="space-y-8">
      <SalesOverview brands={brands} summaries={summaries} activeSlug={activeSlug} />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {settings.brand_name ?? activeSlug} · live numbers
        </h2>
        <SalesDashboard
          data={dashboard}
          fromEmail={settings.from_email}
          dailyTarget={settings.daily_target}
        />
      </div>
    </div>
  );
}
