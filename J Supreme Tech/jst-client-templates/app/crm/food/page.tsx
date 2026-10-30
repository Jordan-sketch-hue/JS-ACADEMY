"use client";
import { useState } from "react";
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { OrdersModule } from "@shared/components/crm/OrdersModule";
import { CustomersModule } from "@shared/components/crm/CustomersModule";
import { ProductsModule } from "@shared/components/crm/ProductsModule";
import { PaymentsModule } from "@shared/components/crm/PaymentsModule";
import { QuotesModule } from "@shared/components/crm/QuotesModule";
import { LeadsModule } from "@shared/components/crm/LeadsModule";
import { ReportsModule } from "@shared/components/crm/ReportsModule";
import { TasksModule } from "@shared/components/crm/TasksModule";

const NAV = [
  { href: "#", tabKey: "dashboard", label: "Dashboard" },
  { href: "#", tabKey: "orders", label: "Orders" },
  { href: "#", tabKey: "customers", label: "Customers" },
  { href: "#", tabKey: "products", label: "Menu Items" },
  { href: "#", tabKey: "payments", label: "Payments" },
  { href: "#", tabKey: "quotes", label: "Quotes" },
  { href: "#", tabKey: "leads", label: "Leads" },
  { href: "#", tabKey: "reports", label: "Reports" },
  { href: "#", tabKey: "tasks", label: "Tasks" },
];

const REPORT_DATA = { period: "7d" as const, totalRevenue: 0, totalOrders: 0, newLeads: 0, newCustomers: 0, currency: "JMD", dailyRevenue: [] };

export default function Page() {
  const [tab, setTab] = useState("dashboard");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ":root{--accent:#1A1A1A;--accent-fg:#FFFFFF;}" }} />
      <CRMLayout title="Food CRM" nav={NAV} brandColor="#1A1A1A" brandName="[CLIENT NAME]" activeTab={tab} onTabChange={setTab}>
        {tab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <StatCard label="Orders Today" value="0" /><StatCard label="Net Sales" value="J$0" /><StatCard label="New Leads" value="0" /><StatCard label="Items Sold" value="0" />
          </div>
        )}
        {tab === "orders" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Orders</h2><OrdersModule orders={[]} /></div>)}
        {tab === "customers" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Customers</h2><CustomersModule customers={[]} /></div>)}
        {tab === "products" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Menu Items</h2><ProductsModule products={[]} /></div>)}
        {tab === "payments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Payments</h2><PaymentsModule payments={[]} /></div>)}
        {tab === "quotes" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quotes</h2><QuotesModule quotes={[]} /></div>)}
        {tab === "leads" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Leads</h2><LeadsModule leads={[]} /></div>)}
        {tab === "reports" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reports</h2><ReportsModule data={REPORT_DATA} /></div>)}
        {tab === "tasks" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Tasks</h2><TasksModule tasks={[]} /></div>)}
      </CRMLayout>
    </>
  );
}