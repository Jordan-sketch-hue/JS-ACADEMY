"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { JobCardsModule } from "@shared/components/crm/JobCardsModule";

const DEMO_CHART = [
  { label: "Mon", value: 6 }, { label: "Tue", value: 9 }, { label: "Wed", value: 7 },
  { label: "Thu", value: 11 }, { label: "Fri", value: 13 }, { label: "Sat", value: 8 }, { label: "Sun", value: 2 },
];

export default function Page() {
  return (
    <CRMLayout title="Tech Repair CRM" extraNav={[{ href: "/crm/tech-repair/jobs", label: "Job Cards" }, { href: "/crm/tech-repair/inventory", label: "Inventory" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Open Job Cards" value="0" />
        <StatCard label="Revenue" value="J$0" change="+0%" positive={true} />
        <StatCard label="Avg Repair Value" value="J$0" />
        <StatCard label="Devices In" value="0" />
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Repairs This Week</h2>
        <BarChart data={DEMO_CHART} height={200} />
      </div>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Active Job Cards</h2>
        <JobCardsModule jobs={[]} />
      </div>
    </CRMLayout>
  );
}