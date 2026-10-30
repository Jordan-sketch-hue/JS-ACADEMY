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
  { href: "#", tabKey: "dashboard",    label: "Dashboard" },
  { href: "#", tabKey: "appointments", label: "Appointments" },
  { href: "#", tabKey: "customers",    label: "Customers" },
  { href: "#", tabKey: "products",     label: "Products" },
  { href: "#", tabKey: "payments",     label: "Payments" },
  { href: "#", tabKey: "quotes",       label: "Quotes" },
  { href: "#", tabKey: "leads",        label: "Leads" },
  { href: "#", tabKey: "reports",      label: "Reports" },
  { href: "#", tabKey: "tasks",        label: "Tasks" },
  { href: "#", tabKey: "inventory",    label: "Inventory" },
];

const REPORT_DATA = { period: "7d" as const, totalRevenue: 0, totalOrders: 0, newLeads: 0, newCustomers: 0, currency: "JMD", dailyRevenue: [] };

const DEMO_INVENTORY = [
  { id: "1", name: "Sample Item A", sku: "SKU-001", stock_qty: 12, product_name: "Product Line A" },
  { id: "2", name: "Sample Item B", sku: "SKU-002", stock_qty: 3,  product_name: "Product Line B" },
  { id: "3", name: "Sample Item C", sku: "SKU-003", stock_qty: 0,  product_name: "Product Line C" },
];

function stockBadge(qty: number) {
  if (qty === 0) return { label: "Out of Stock", bg: "#fee2e2", color: "#991b1b" };
  if (qty < 5)  return { label: "Low Stock",     bg: "#fef3c7", color: "#92400e" };
  return                { label: "In Stock",      bg: "#dcfce7", color: "#166534" };
}

export default function Page() {
  const [tab, setTab] = useState("dashboard");
  const [reportPeriod, setReportPeriod] = useState<"7d"|"30d"|"90d">("7d");
  const css = ":root{--accent:#5C3D1E;--accent-fg:#FFFFFF;}";
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <CRMLayout title="Furniture CRM" nav={NAV} brandColor="#5C3D1E" brandName="[CLIENT NAME]" activeTab={tab} onTabChange={setTab}>

        {tab === "dashboard" && (
          <>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 24, height: 180 }}>
              <img src="/crm-banners/furniture.jpg" alt="Furniture CRM" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 100%)", display: "flex", alignItems: "center", padding: "0 28px" }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Furniture CRM</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: "4px 0 0" }}>Custom furniture order management</p>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <StatCard label="Orders Today" value="0" />
              <StatCard label="Net Sales" value="J$0" />
              <StatCard label="New Leads" value="0" />
              <StatCard label="Active Projects" value="0" />
            </div>
          </>
        )}

        {tab === "appointments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Appointments</h2><AppointmentsModule appointments={[]} /></div>)}
        {tab === "customers"    && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Customers</h2><CustomersModule customers={[]} /></div>)}
        {tab === "products"     && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Products</h2><ProductsModule products={[]} /></div>)}
        {tab === "payments"     && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Payments</h2><PaymentsModule payments={[]} /></div>)}
        {tab === "quotes"       && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quotes</h2><QuotesModule quotes={[]} /></div>)}
        {tab === "leads"        && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Leads</h2><LeadsModule leads={[]} /></div>)}
        {tab === "reports"      && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reports</h2><ReportsModule data={{ ...REPORT_DATA, period: reportPeriod }} onPeriodChange={setReportPeriod} accentColor="#5C3D1E" /></div>)}
        {tab === "tasks"        && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Tasks</h2><TasksModule tasks={[]} /></div>)}

        {tab === "inventory" && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Inventory</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    {["Variant","Product","SKU","Qty","Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_INVENTORY.map(row => {
                    const badge = stockBadge(row.stock_qty);
                    return (
                      <tr key={row.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.name}</td>
                        <td style={{ padding: "10px 12px", color: "#6b7280" }}>{row.product_name}</td>
                        <td style={{ padding: "10px 12px", color: "#6b7280", fontFamily: "monospace", fontSize: 12 }}>{row.sku}</td>
                        <td style={{ padding: "10px 12px" }}>{row.stock_qty}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: badge.bg, color: badge.color }}>{badge.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 12 }}>Demo data — live inventory populates from provisioned client.</p>
            </div>
          </div>
        )}

      </CRMLayout>
    </>
  );
}