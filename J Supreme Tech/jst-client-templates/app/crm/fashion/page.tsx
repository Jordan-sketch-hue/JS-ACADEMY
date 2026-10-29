"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { OrdersModule } from "@shared/components/crm/OrdersModule";

const DEMO_CHART = [
  { label: "Mon", value: 4 }, { label: "Tue", value: 7 }, { label: "Wed", value: 3 },
  { label: "Thu", value: 9 }, { label: "Fri", value: 6 }, { label: "Sat", value: 11 }, { label: "Sun", value: 5 },
];

export default function Page() {
  return (
    <CRMLayout title="Fashion CRM" extraNav={[{ href: "/crm/fashion/orders", label: "Orders" }, { href: "/crm/fashion/products", label: "Products" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Orders Today" value="0" change="+0%" positive={true} />
        <StatCard label="Revenue" value="J$0" change="+0%" positive={true} />
        <StatCard label="New Leads" value="0" change="+0%" positive={true} />
        <StatCard label="Low Stock" value="0" />
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Sales This Week</h2>
        <BarChart data={DEMO_CHART} height={200} />
      </div>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>
        <OrdersModule orders={[]} />
      </div>
    </CRMLayout>
  );
}