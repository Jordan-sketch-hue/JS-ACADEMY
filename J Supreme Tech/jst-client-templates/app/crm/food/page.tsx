"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { OrdersModule } from "@shared/components/crm/OrdersModule";

const DEMO_CHART = [
  { label: "Mon", value: 12 }, { label: "Tue", value: 18 }, { label: "Wed", value: 15 },
  { label: "Thu", value: 22 }, { label: "Fri", value: 30 }, { label: "Sat", value: 45 }, { label: "Sun", value: 28 },
];

export default function Page() {
  return (
    <CRMLayout title="Food CRM" extraNav={[{ href: "/crm/food/orders", label: "Orders" }, { href: "/crm/food/menu", label: "Menu" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Orders Today" value="0" change="+0%" positive={true} />
        <StatCard label="Revenue Today" value="J$0" change="+0%" positive={true} />
        <StatCard label="Catering Jobs" value="0" />
        <StatCard label="Menu Items" value="0" />
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