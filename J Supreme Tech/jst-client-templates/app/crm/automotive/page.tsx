"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { JobCardsModule } from "@shared/components/crm/JobCardsModule";

const DEMO_CHART = [
  { label: "Mon", value: 4 }, { label: "Tue", value: 7 }, { label: "Wed", value: 5 },
  { label: "Thu", value: 9 }, { label: "Fri", value: 11 }, { label: "Sat", value: 6 }, { label: "Sun", value: 1 },
];

export default function Page() {
  return (
    <CRMLayout title="Automotive CRM" extraNav={[{ href: "/crm/automotive/jobs", label: "Repair Orders" }, { href: "/crm/automotive/vehicles", label: "Vehicles" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Open Repair Orders" value="0" />
        <StatCard label="Revenue" value="J$0" change="+0%" positive={true} />
        <StatCard label="Vehicles In Shop" value="0" />
        <StatCard label="New Leads" value="0" change="+0%" positive={true} />
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Repair Orders This Week</h2>
        <BarChart data={DEMO_CHART} height={200} />
      </div>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Active Repair Orders</h2>
        <JobCardsModule jobs={[]} />
      </div>
    </CRMLayout>
  );
}