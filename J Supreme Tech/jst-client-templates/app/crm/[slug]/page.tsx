"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { OrdersModule } from "@shared/components/crm/OrdersModule";
import { CustomersModule } from "@shared/components/crm/CustomersModule";
import { ProductsModule } from "@shared/components/crm/ProductsModule";
import { PaymentsModule } from "@shared/components/crm/PaymentsModule";
import { LeadsModule } from "@shared/components/crm/LeadsModule";
import { ReportsModule } from "@shared/components/crm/ReportsModule";
import { TasksModule } from "@shared/components/crm/TasksModule";
import { AppointmentsModule } from "@shared/components/crm/AppointmentsModule";
import { JobCardsModule } from "@shared/components/crm/JobCardsModule";

const NAV = [
  { href: "#", tabKey: "dashboard", label: "Dashboard" },
  { href: "#", tabKey: "leads", label: "Leads" },
  { href: "#", tabKey: "orders", label: "Orders" },
  { href: "#", tabKey: "customers", label: "Customers" },
  { href: "#", tabKey: "products", label: "Products" },
  { href: "#", tabKey: "payments", label: "Payments" },
  { href: "#", tabKey: "appointments", label: "Appointments" },
  { href: "#", tabKey: "jobs", label: "Job Cards" },
  { href: "#", tabKey: "reports", label: "Reports" },
  { href: "#", tabKey: "tasks", label: "Tasks" },
];

interface ClientData {
  name: string;
  accent: string;
  accent_fg: string;
  category: string;
}

interface Lead { id: string; name: string; contact?: string; message: string; createdAt?: string; }

export default function ClientCRMPage() {
  const params = useParams();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) ?? "";
  const [tab, setTab] = useState("dashboard");
  const [client, setClient] = useState<ClientData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, revenue: 0, newLeads: 0, customers: 0 });

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch(`/api/crm/client?slug=${slug}`).then((r) => r.json()).catch(() => ({})),
      fetch(`/api/admin/leads?slug=${slug}`).then((r) => r.json()).catch(() => ({ leads: [] })),
    ]).then(([clientData, leadsData]) => {
      if (clientData.name) {
        setClient({
          name: clientData.name ?? slug,
          accent: clientData.accent ?? "#1A1A1A",
          accent_fg: clientData.accent_fg ?? "#FFFFFF",
          category: clientData.category ?? "variety",
        });
      }
      const rawLeads: Lead[] = (leadsData.leads ?? []).map((l: { id: string; name: string; phone?: string; email?: string; message: string; created_at?: string }) => ({
        id: l.id,
        name: l.name,
        contact: l.phone ?? l.email ?? undefined,
        message: l.message,
        createdAt: l.created_at ? new Date(l.created_at).toLocaleDateString("en-JM") : undefined,
      }));
      setLeads(rawLeads);
      setStats({
        orders: rawLeads.filter((l) => l.message?.startsWith("ORDER:")).length,
        revenue: 0,
        newLeads: rawLeads.length,
        customers: new Set(rawLeads.map((l) => l.name)).size,
      });
    }).finally(() => setLoading(false));
  }, [slug]);

  const accent = client?.accent ?? "#1A1A1A";
  const accentFg = client?.accent_fg ?? "#FFFFFF";
  const title = client ? `${client.name} — CRM` : `Loading...`;

  const REPORT_DATA = {
    period: "7d" as const,
    totalRevenue: stats.revenue,
    totalOrders: stats.orders,
    newLeads: stats.newLeads,
    newCustomers: stats.customers,
    currency: "JMD",
    dailyRevenue: [] as { date: string; revenue: number }[],
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `:root{--accent:${accent};--accent-fg:${accentFg};}` }} />
      <CRMLayout title={title} nav={NAV} brandColor={accent} brandName={client?.name ?? "—"} activeTab={tab} onTabChange={setTab}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#9ca3af" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{ fontWeight: 600 }}>Loading {slug}...</div>
          </div>
        ) : (
          <>
            {tab === "dashboard" && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{client?.name ?? slug}</h2>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
                    Category: {client?.category ?? "—"} · <a href={`/t/${slug}`} target="_blank" rel="noreferrer" style={{ color: accent }}>View Storefront ↗</a>
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
                  <StatCard label="Total Leads" value={String(stats.newLeads)} />
                  <StatCard label="Orders" value={String(stats.orders)} />
                  <StatCard label="Unique Customers" value={String(stats.customers)} />
                  <StatCard label="Net Revenue" value="—" />
                </div>
                {leads.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Recent Activity</h3>
                    <LeadsModule leads={leads.slice(0, 5)} />
                  </div>
                )}
              </div>
            )}
            {tab === "leads" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>All Leads</h2><LeadsModule leads={leads} /></div>)}
            {tab === "orders" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Orders</h2><OrdersModule orders={[]} /></div>)}
            {tab === "customers" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Customers</h2><CustomersModule customers={[]} /></div>)}
            {tab === "products" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Products</h2><ProductsModule products={[]} /></div>)}
            {tab === "payments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Payments</h2><PaymentsModule payments={[]} /></div>)}
            {tab === "appointments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Appointments</h2><AppointmentsModule appointments={[]} /></div>)}
            {tab === "jobs" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Job Cards</h2><JobCardsModule jobs={[]} /></div>)}
            {tab === "reports" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reports</h2><ReportsModule data={REPORT_DATA} /></div>)}
            {tab === "tasks" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Tasks</h2><TasksModule tasks={[]} /></div>)}
          </>
        )}
      </CRMLayout>
    </>
  );
}
