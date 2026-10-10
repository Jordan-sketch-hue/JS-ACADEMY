import { requireBrandTenant } from "@/lib/sales/active-brand";
import { ensureSalesDefaults } from "@/lib/sales/defaults";
import { listTemplates } from "@/lib/sales/templates";
import { TemplatesClient } from "@/components/sales/templates-client";

export const metadata = { title: "Templates · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const owner = await requireBrandTenant();
  await ensureSalesDefaults(owner);
  const templates = await listTemplates(owner);
  return <TemplatesClient templates={templates} />;
}
