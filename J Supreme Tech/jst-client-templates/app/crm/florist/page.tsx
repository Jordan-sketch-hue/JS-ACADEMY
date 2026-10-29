"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { OrdersModule } from "@shared/components/crm/OrdersModule";

const DEMO_CHART = [
  { label: "Mon", value: 3 }, { label: "Tue", value: 6 }, { label: "Wed", value: 4 },
  { label: "Thu", value: 8 }, { label: "Fri", value: 9 }, { label: "Sat", value: 14 }, { label: "Sun", value: 5 },
];

export default function Page() {
  return (
    <CRMLayout title="Florist CRM" extraNav={[{ href: "/crm/florist/orders", label: "Orders" }, { href: "/crm/florist/events", label: "Events" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Orders Today" value="0" change="+0%" positive={true} />
        <StatCard label="Revenue" value="J$0" change="+0%" positive={true} />
        <StatCard label="New Leads" value="0" change="+0%" positive={true} />
        <StatCard label="Upcoming Events" value="0" />
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Orders This Week</h2>
        <BarChart data={DEMO_CHART} height={200} />
      </div>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>
        <OrdersModule orders={[]} />
      </div>
    </CRMLayout>
  );
}