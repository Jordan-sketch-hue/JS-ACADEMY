import { requireBrandTenant } from "@/lib/sales/active-brand";
import { ensureSalesDefaults } from "@/lib/sales/defaults";
import { listProspects } from "@/lib/sales/prospects";
import { listSuppressions } from "@/lib/sales/suppressions";
import { ProspectsClient } from "@/components/sales/prospects-client";

export const metadata = { title: "Prospects · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function ProspectsPage() {
  const owner = await requireBrandTenant();
  await ensureSalesDefaults(owner);
  const [prospects, suppressions] = await Promise.all([
    listProspects(owner, { limit: 500 }),
    listSuppressions(owner, 200),
  ]);
  return <ProspectsClient prospects={prospects} suppressions={suppressions} />;
}
