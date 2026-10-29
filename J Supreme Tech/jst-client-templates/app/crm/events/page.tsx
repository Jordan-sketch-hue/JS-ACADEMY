"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { AppointmentsModule } from "@shared/components/crm/AppointmentsModule";

const DEMO_CHART = [
  { label: "Mon", value: 1 }, { label: "Tue", value: 3 }, { label: "Wed", value: 2 },
  { label: "Thu", value: 4 }, { label: "Fri", value: 5 }, { label: "Sat", value: 6 }, { label: "Sun", value: 2 },
];

export default function Page() {
  return (
    <CRMLayout title="Events CRM" extraNav={[{ href: "/crm/events/bookings", label: "Bookings" }, { href: "/crm/events/clients", label: "Clients" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Events Booked" value="0" change="+0%" positive={true} />
        <StatCard label="Revenue" value="J$0" change="+0%" positive={true} />
        <StatCard label="Qualified Leads" value="0" change="+0%" positive={true} />
        <StatCard label="Upcoming Events" value="0" />
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Inquiries This Week</h2>
        <BarChart data={DEMO_CHART} height={200} />
      </div>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Upcoming Events</h2>
        <AppointmentsModule appointments={[]} />
      </div>
    </CRMLayout>
  );
}