import { requireBrandTenant } from "@/lib/sales/active-brand";
import { ensureSalesDefaults } from "@/lib/sales/defaults";
import { listCampaigns } from "@/lib/sales/campaigns";
import { CampaignsClient } from "@/components/sales/campaigns-client";

export const metadata = { title: "Campaigns · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const owner = await requireBrandTenant();
  await ensureSalesDefaults(owner);
  const campaigns = await listCampaigns(owner);
  return <CampaignsClient campaigns={campaigns} />;
}
