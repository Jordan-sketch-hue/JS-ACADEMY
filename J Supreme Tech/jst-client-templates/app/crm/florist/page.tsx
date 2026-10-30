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
  { href: "#", tabKey: "appointments", label: "Appointments" },
  { href: "#", tabKey: "customers", label: "Customers" },
  { href: "#", tabKey: "products", label: "Products" },
  { href: "#", tabKey: "payments", label: "Payments" },
  { href: "#", tabKey: "quotes", label: "Quotes" },
  { href: "#", tabKey: "leads", label: "Leads" },
  { href: "#", tabKey: "reports", label: "Reports" },
  { href: "#", tabKey: "tasks", label: "Tasks" },
];

const REPORT_DATA = { period: "7d" as const, totalRevenue: 0, totalOrders: 0, newLeads: 0, newCustomers: 0, currency: "JMD", dailyRevenue: [] };

export default function Page() {
  const [tab, setTab] = useState("dashboard");
  const css = ":root{--accent:#4A7C59;--accent-fg:#FFFFFF;}";
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <CRMLayout title="Florist CRM" nav={NAV} brandColor="#4A7C59" brandName="[CLIENT NAME]" activeTab={tab} onTabChange={setTab}>
        {tab === "dashboard" && (
          <>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 24, height: 180 }}>
              <img src="/crm-banners/florist.jpg" alt="Florist CRM" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 100%)", display: "flex", alignItems: "center", padding: "0 28px" }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Florist CRM</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: "4px 0 0" }}>Orders and arrangements overview</p>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <StatCard label="Orders Today" value="0" /><StatCard label="Net Sales" value="J$0" /><StatCard label="New Leads" value="0" /><StatCard label="Active Clients" value="0" />
            </div>
          </>
        )}
        {tab === "appointments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Appointments</h2><AppointmentsModule appointments={[]} /></div>)}
        {tab === "customers" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Customers</h2><CustomersModule customers={[]} /></div>)}
        {tab === "products" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Products</h2><ProductsModule products={[]} /></div>)}
        {tab === "payments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Payments</h2><PaymentsModule payments={[]} /></div>)}
        {tab === "quotes" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quotes</h2><QuotesModule quotes={[]} /></div>)}
        {tab === "leads" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Leads</h2><LeadsModule leads={[]} /></div>)}
        {tab === "reports" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reports</h2><ReportsModule data={REPORT_DATA} /></div>)}
        {tab === "tasks" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Tasks</h2><TasksModule tasks={[]} /></div>)}
      </CRMLayout>
    </>
  );
}