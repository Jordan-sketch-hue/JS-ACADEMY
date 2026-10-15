import { Bot } from "lucide-react";
import { fetchLeads, fetchFollowUps, fetchCallLogs } from "./actions";
import { LeadsClient } from "@/components/sales/leads-client";

export const metadata = { title: "Leads · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const [{ stats, leads }, followUps, callLogs] = await Promise.all([
    fetchLeads(), fetchFollowUps(), fetchCallLogs(),
  ]);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Bot className="h-6 w-6" /> Kai Sales Agent
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI outbound caller — follow-ups, tier pipeline, and call queue.
        </p>
      </div>

      <LeadsClient initialStats={stats} initialLeads={leads} initialFollowUps={followUps} initialCallLogs={callLogs} />
    </div>
  );
}
