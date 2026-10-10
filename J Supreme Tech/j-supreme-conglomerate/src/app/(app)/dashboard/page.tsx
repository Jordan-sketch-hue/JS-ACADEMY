import { requireOwnerClerkId } from "@/lib/session";
import { loadDashboardBundle } from "@/lib/data/dashboard";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const owner = await requireOwnerClerkId();
  const data = await loadDashboardBundle(owner);
  return <DashboardClient data={data} />;
}
