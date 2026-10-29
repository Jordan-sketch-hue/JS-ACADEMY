"use client";
export const dynamic = 'force-dynamic';
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { BarChart } from "@shared/components/charts/BarChart";
import { OrdersModule } from "@shared/components/crm/OrdersModule";

const DEMO_CHART = [
  { label: "Mon", value: 3 }, { label: "Tue", value: 5 }, { label: "Wed", value: 8 },
  { label: "Thu", value: 4 }, { label: "Fri", value: 7 }, { label: "Sat", value: 10 }, { label: "Sun", value: 2 },
];

export default function Page() {
  return (
    <CRMLayout title="Accessories CRM" extraNav={[{ href: "/crm/accessories/orders", label: "Orders" }, { href: "/crm/accessories/products", label: "Products" }]}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Orders" value="0" change="+0%" positive={true} />
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