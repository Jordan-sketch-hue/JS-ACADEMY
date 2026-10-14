import { Database } from "lucide-react";
import { fetchLeads } from "./actions";
import { LeadsClient } from "@/components/sales/leads-client";

export const metadata = { title: "Leads · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { stats, leads } = await fetchLeads();

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Database className="h-6 w-6" /> Lead Pipeline
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Businesses scraped from OpenStreetMap — no website, ready to call. Run the scraper to populate, then launch Alex.
        </p>
      </div>

      <LeadsClient initialStats={stats} initialLeads={leads} />
    </div>
  );
}
