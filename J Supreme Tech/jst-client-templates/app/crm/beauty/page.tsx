"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { AppointmentsModule } from "@shared/components/crm/AppointmentsModule";

const DEMO_CHART = [
  { label: "Mon", value: 5 }, { label: "Tue", value: 8 }, { label: "Wed", value: 6 },
  { label: "Thu", value: 10 }, { label: "Fri", value: 12 }, { label: "Sat", value: 15 }, { label: "Sun", value: 3 },
];

export default function Page() {
  return (
    <CRMLayout title="Beauty CRM" extraNav={[{ href: "/crm/beauty/appointments", label: "Appointments" }, { href: "/crm/beauty/clients", label: "Clients" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Appointments Today" value="0" change="+0%" positive={true} />
        <StatCard label="Revenue" value="J$0" change="+0%" positive={true} />
        <StatCard label="New Leads" value="0" change="+0%" positive={true} />
        <StatCard label="Active Clients" value="0" />
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Bookings This Week</h2>
        <BarChart data={DEMO_CHART} height={200} />
      </div>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Upcoming Appointments</h2>
        <AppointmentsModule appointments={[]} />
      </div>
    </CRMLayout>
  );
}