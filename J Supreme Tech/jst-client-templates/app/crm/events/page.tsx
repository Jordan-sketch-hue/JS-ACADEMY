"use client";
import { useState } from "react";
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { AppointmentsModule } from "@shared/components/crm/AppointmentsModule";
import { CustomersModule } from "@shared/components/crm/CustomersModule";
import { ProductsModule } from "@shared/components/crm/ProductsModule";
import { PaymentsModule } from "@shared/components/crm/PaymentsModule";
import { QuotesModule } from "@shared/components/crm/QuotesModule";
import { LeadsModule } from "@shared/components/crm/LeadsModule";
import { ReportsModule } from "@shared/components/crm/ReportsModule";
import { TasksModule } from "@shared/components/crm/TasksModule";

const NAV = [
  { href: "#", tabKey: "dashboard", label: "Dashboard" },
  { href: "#", tabKey: "appointments", label: "Bookings" },
  { href: "#", tabKey: "customers", label: "Clients" },
  { href: "#", tabKey: "products", label: "Packages" },
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
      <CRMLayout title="Events CRM" nav={NAV} brandColor="#1A1A1A" brandName="[CLIENT NAME]" activeTab={tab} onTabChange={setTab}>
        {tab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <StatCard label="Bookings This Week" value="0" /><StatCard label="Net Revenue" value="J$0" /><StatCard label="New Inquiries" value="0" /><StatCard label="Active Clients" value="0" />
          </div>
        )}
        {tab === "appointments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Bookings</h2><AppointmentsModule appointments={[]} /></div>)}
        {tab === "customers" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Clients</h2><CustomersModule customers={[]} /></div>)}
        {tab === "products" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Packages</h2><ProductsModule products={[]} /></div>)}
        {tab === "payments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Payments</h2><PaymentsModule payments={[]} /></div>)}
        {tab === "quotes" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quotes</h2><QuotesModule quotes={[]} /></div>)}
        {tab === "leads" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Leads</h2><LeadsModule leads={[]} /></div>)}
        {tab === "reports" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reports</h2><ReportsModule data={REPORT_DATA} /></div>)}
        {tab === "tasks" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Tasks</h2><TasksModule tasks={[]} /></div>)}
      </CRMLayout>
    </>
  );
}