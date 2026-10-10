import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { requireOwnerClerkId } from "@/lib/session";
import { listEodReports, type EodReport } from "@/lib/data/eod-reports";
import { ReportsClient } from "@/components/reports/reports-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const owner = await requireOwnerClerkId();
  const persistLocally = !isSupabasePersistenceEnabled();

  let reports: EodReport[] = [];
  if (!persistLocally) reports = await listEodReports(owner);

  return <ReportsClient persistLocally={persistLocally} initialReports={reports} />;
}
