"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
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

import { CustomOrdersModule } from "@shared/components/crm/CustomOrdersModule";
import { DeliveriesModule } from "@shared/components/crm/DeliveriesModule";
import { WarrantiesModule } from "@shared/components/crm/WarrantiesModule";
import { StaffModule } from "@shared/components/crm/StaffModule";
import { ReservationsModule } from "@shared/components/crm/ReservationsModule";
import { KitchenOrdersModule } from "@shared/components/crm/KitchenOrdersModule";
import { ProductionJobsModule } from "@shared/components/crm/ProductionJobsModule";
import { WholesaleAccountsModule } from "@shared/components/crm/WholesaleAccountsModule";
import { JobCardsModule } from "@shared/components/crm/JobCardsModule";
import { ProjectsModule } from "@shared/components/crm/ProjectsModule";
import { PurchaseOrdersModule } from "@shared/components/crm/PurchaseOrdersModule";
import { SuppliersModule } from "@shared/components/crm/SuppliersModule";
import { EventBookingsModule } from "@shared/components/crm/EventBookingsModule";
import { IntegrationsModule } from "@shared/components/crm/IntegrationsModule";
import { BusinessProfileModule } from "@shared/components/crm/BusinessProfileModule";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORY_ACCENT: Record<string, string> = {
  beauty: "#B4778A", automotive: "#1E3A5F", furniture: "#5C3D1E",
  fashion: "#2D1B69", accessories: "#B8860B", food: "#B45309",
  florist: "#4A7C59", events: "#7C3AED", "tech-repair": "#0F172A",
  packaging: "#0369A1", lighting: "#D97706", variety: "#047857",
  crafts: "#92400E", design: "#1A1A1A", bar: "#7C2D12",
  pizza: "#991B1B", baker: "#92400E", ceiling: "#1E40AF",
  baby: "#DB2777",
};

const CATEGORY_STAT1: Record<string, string> = {
  beauty: "Appointments Today", automotive: "Jobs Today", furniture: "Orders Today",
  fashion: "Orders Today", accessories: "Orders Today", food: "Orders Today",
  florist: "Orders Today", events: "Events This Month", "tech-repair": "Jobs Today",
  packaging: "Orders Today", lighting: "Jobs This Month", variety: "Sales Today",
  crafts: "Orders Today", design: "Projects This Month", bar: "Orders Today",
  pizza: "Orders Today", baker: "Orders Today", ceiling: "Projects This Month",
  baby: "Orders Today",
};

const CATEGORY_STAT4: Record<string, string> = {
  beauty: "Active Clients", automotive: "Active Vehicles", furniture: "Active Projects",
  fashion: "Active Clients", accessories: "Active Clients", food: "Active Tables",
  florist: "Active Clients", events: "Active Bookings", "tech-repair": "Active Devices",
  packaging: "Active Projects", lighting: "Active Projects", variety: "Active Customers",
  crafts: "Active Projects", design: "Active Clients", bar: "Active Customers",
  pizza: "Active Customers", baker: "Active Customers", ceiling: "Active Projects",
  baby: "Active Customers",
};

const CATEGORY_HERO_FALLBACK: Record<string, string> = {
  beauty: "/heroes/hero-beauty-desktop-v4.webp",
  automotive: "/heroes/hero-automotive-desktop.webp",
  furniture: "/heroes/hero-furniture-desktop.webp",
  fashion: "/heroes/hero-fashion-desktop.webp",
  accessories: "/heroes/hero-accessories-desktop.webp",
  food: "/heroes/hero-food-desktop-v1.webp",
  florist: "/heroes/hero-florist-desktop.webp",
  events: "/heroes/hero-events-desktop.webp",
  "tech-repair": "/heroes/hero-tech-repair-desktop.webp",
  packaging: "/heroes/hero-packaging-desktop.webp",
  lighting: "/heroes/hero-lighting-desktop.webp",
  variety: "/heroes/hero-variety-desktop.webp",
  crafts: "/heroes/hero-crafts-desktop.webp",
  design: "/heroes/hero-packaging-desktop.webp",
  bar: "/heroes/hero-bar-desktop.webp",
  pizza: "/heroes/hero-pizza-desktop.webp",
  baker: "/heroes/hero-baker-desktop-v2.webp",
  ceiling: "/heroes/hero-ceiling-desktop.webp",
  baby: "/heroes/hero-baby-desktop.webp",
};

// Core tabs every category gets
const CORE_TABS = [
  { tabKey: "dashboard", label: "Dashboard" },
  { tabKey: "customers", label: "Customers" },
  { tabKey: "products", label: "Products" },
  { tabKey: "payments", label: "Payments" },
  { tabKey: "leads", label: "Leads" },
  { tabKey: "tasks", label: "Tasks" },
  { tabKey: "reports", label: "Reports" },
    { tabKey: "integrations", label: "Integrations" },
  { tabKey: "settings", label: "Settings" },
];

// Extra tabs by category
const EXTRA_TABS: Record<string, { tabKey: string; label: string }[]> = {
  beauty: [{ tabKey: "appointments", label: "Appointments" }, { tabKey: "staff", label: "Staff" }],
  automotive: [{ tabKey: "job-cards", label: "Job Cards" }, { tabKey: "warranties", label: "Warranties" }, { tabKey: "staff", label: "Staff" }],
  furniture: [{ tabKey: "custom-orders", label: "Custom Orders" }, { tabKey: "deliveries", label: "Deliveries" }, { tabKey: "projects", label: "Projects" }, { tabKey: "suppliers", label: "Suppliers" }],
  fashion: [{ tabKey: "inventory", label: "Inventory" }, { tabKey: "custom-orders", label: "Custom Orders" }, { tabKey: "wholesale-accounts", label: "Wholesale" }],
  accessories: [{ tabKey: "inventory", label: "Inventory" }, { tabKey: "wholesale-accounts", label: "Wholesale" }],
  food: [{ tabKey: "kitchen-orders", label: "Kitchen" }, { tabKey: "reservations", label: "Reservations" }, { tabKey: "staff", label: "Staff" }],
  florist: [{ tabKey: "custom-orders", label: "Custom Orders" }, { tabKey: "deliveries", label: "Deliveries" }],
  events: [{ tabKey: "event-bookings", label: "Event Bookings" }, { tabKey: "staff", label: "Staff" }],
  "tech-repair": [{ tabKey: "job-cards", label: "Job Cards" }, { tabKey: "warranties", label: "Warranties" }, { tabKey: "appointments", label: "Appointments" }],
  packaging: [{ tabKey: "production-jobs", label: "Production" }, { tabKey: "custom-orders", label: "Custom Orders" }, { tabKey: "suppliers", label: "Suppliers" }, { tabKey: "purchase-orders", label: "Purchase Orders" }],
  lighting: [{ tabKey: "projects", label: "Projects" }, { tabKey: "suppliers", label: "Suppliers" }, { tabKey: "purchase-orders", label: "Purchase Orders" }],
  variety: [{ tabKey: "inventory", label: "Inventory" }, { tabKey: "wholesale-accounts", label: "Wholesale" }],
  crafts: [{ tabKey: "custom-orders", label: "Custom Orders" }, { tabKey: "production-jobs", label: "Production" }],
  design: [{ tabKey: "projects", label: "Projects" }, { tabKey: "quotes", label: "Quotes" }],
  bar: [{ tabKey: "kitchen-orders", label: "Kitchen" }, { tabKey: "reservations", label: "Reservations" }, { tabKey: "staff", label: "Staff" }],
  pizza: [{ tabKey: "kitchen-orders", label: "Kitchen" }, { tabKey: "deliveries", label: "Deliveries" }, { tabKey: "staff", label: "Staff" }],
  baker: [{ tabKey: "custom-orders", label: "Custom Orders" }, { tabKey: "production-jobs", label: "Production" }],
  ceiling: [{ tabKey: "projects", label: "Projects" }, { tabKey: "quotes", label: "Quotes" }, { tabKey: "suppliers", label: "Suppliers" }],
  baby: [{ tabKey: "inventory", label: "Inventory" }, { tabKey: "wholesale-accounts", label: "Wholesale" }],
};

function buildNav(category: string) {
  const extras = EXTRA_TABS[category] ?? [];
  const all = [...CORE_TABS, ...extras];
  return all.map((t) => ({ href: "#", tabKey: t.tabKey, label: t.label }));
}

type Client = {
  id: string; slug: string; name: string; category: string;
  accent?: string | null; crm_banner_url?: string | null; currency?: string | null;
  whatsapp?: string | null; hero_url?: string | null; logo_url?: string | null;
  headline?: string | null; subline?: string | null;
  phone?: string | null; address?: string | null; tagline?: string | null;
  business_hours?: Record<string, unknown> | null;
};

function periodToDays(p: "7d" | "30d" | "90d") { return p === "7d" ? 7 : p === "30d" ? 30 : 90; }

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [tab, setTab] = useState("dashboard");
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [reportPeriod, setReportPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const [reportData, setReportData] = useState({ totalRevenue: 0, totalOrders: 0, newLeads: 0, newCustomers: 0, dailyRevenue: [] as { date: string; amount: number }[] });
  const [inventory, setInventory] = useState<any[]>([]);
  const [statsToday, setStatsToday] = useState({ activity: 0, leads: 0, active: 0 });

  const fetchReports = useCallback(async (clientId: string, period: "7d" | "30d" | "90d", currency: string) => {
    const days = periodToDays(period);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const [ordersRes, leadsRes, customersRes, paymentsRes] = await Promise.all([
      supabase.from("ct_orders").select("amount,created_at").eq("client_id", clientId).gte("created_at", since),
      supabase.from("ct_leads").select("id,created_at").eq("client_id", clientId).gte("created_at", since),
      supabase.from("ct_customers").select("id,created_at").eq("client_id", clientId).gte("created_at", since),
      supabase.from("ct_payments").select("amount,created_at").eq("client_id", clientId).eq("status", "completed").gte("created_at", since),
    ]);
    const orders = ordersRes.data ?? [];
    const rev = (paymentsRes.data ?? []).reduce((s: number, p: any) => s + (p.amount ?? 0), 0);
    const dailyMap: Record<string, number> = {};
    (paymentsRes.data ?? []).forEach((p: any) => {
      const d = p.created_at?.slice(0, 10);
      if (d) dailyMap[d] = (dailyMap[d] ?? 0) + (p.amount ?? 0);
    });
    const dailyRevenue = Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => ({ date, amount }));
    setReportData({ totalRevenue: rev / 100, totalOrders: orders.length, newLeads: (leadsRes.data ?? []).length, newCustomers: (customersRes.data ?? []).length, dailyRevenue });
  }, []);

  useEffect(() => {
    params.then(async ({ slug: s }) => {
      const { data: cl } = await supabase.from("ct_clients").select("id,slug,name,category,accent,crm_banner_url,currency,whatsapp,hero_url,logo_url,headline,subline,phone,address,tagline,business_hours").eq("slug", s).single();
      setClient(cl as Client | null);
      if (!cl) { setLoading(false); return; }
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const [apptRes, custRes, prodRes, payRes, quoteRes, leadsRes, tasksRes, invRes, todayAppt, todayOrders, activeCust] = await Promise.all([
        supabase.from("ct_appointments").select("*").eq("client_id", cl.id).order("scheduled_at", { ascending: false }).limit(50),
        supabase.from("ct_customers").select("*").eq("client_id", cl.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("ct_products").select("*").eq("client_id", cl.id).order("created_at", { ascending: false }),
        supabase.from("ct_payments").select("*").eq("client_id", cl.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("ct_quotes").select("*").eq("client_id", cl.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("ct_leads").select("*").eq("client_id", cl.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("ct_tasks").select("*").eq("client_id", cl.id).order("due_at", { ascending: true }).limit(50),
        supabase.from("ct_product_variants").select("id,name,sku,price,stock_qty,product_id,created_at,ct_products!inner(name,client_id)").eq("ct_products.client_id", cl.id).limit(100),
        supabase.from("ct_appointments").select("id", { count: "exact", head: true }).eq("client_id", cl.id).gte("scheduled_at", todayStart.toISOString()),
        supabase.from("ct_orders").select("id", { count: "exact", head: true }).eq("client_id", cl.id).gte("created_at", todayStart.toISOString()),
        supabase.from("ct_customers").select("id", { count: "exact", head: true }).eq("client_id", cl.id),
      ]);
      setAppointments(apptRes.data ?? []);
      setCustomers((custRes.data ?? []).map((c: any) => ({ id: c.id, name: c.name, phone: c.phone, email: c.email, notes: c.notes, created_at: c.created_at })));
      setProducts((prodRes.data ?? []).map((p: any) => ({ id: p.id, name: p.name, category: p.category, sku: p.sku, price: p.price, currency: p.currency ?? cl.currency ?? "JMD", active: p.active, created_at: p.created_at })));
      setPayments((payRes.data ?? []).map((p: any) => ({ id: p.id, amount: p.amount, currency: p.currency ?? cl.currency ?? "JMD", method: p.method, status: p.status, verified_at: p.verified_at, created_at: p.created_at })));
      setQuotes(quoteRes.data ?? []);
      setLeads((leadsRes.data ?? []).map((l: any) => ({ id: l.id, name: l.name, phone: l.phone ?? "", source: l.source ?? "website", status: l.status ?? "new", createdAt: l.created_at })));
      setTasks((tasksRes.data ?? []).map((t: any) => ({ id: t.id, title: t.title, due_at: t.due_at, status: t.status, created_at: t.created_at })));
      setInventory(invRes.data ?? []);
      setStatsToday({ activity: (todayAppt.count ?? 0) + (todayOrders.count ?? 0), leads: (leadsRes.data ?? []).filter((l: any) => l.status === "new").length, active: activeCust.count ?? 0 });
      await fetchReports(cl.id, "7d", cl.currency ?? "JMD");
      setLoading(false);
    });
  }, [params, fetchReports]);

  const handlePeriodChange = async (p: "7d" | "30d" | "90d") => {
    setReportPeriod(p);
    if (client) await fetchReports(client.id, p, client.currency ?? "JMD");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
        <p style={{ color: "#999", fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
        <p style={{ color: "#999", fontSize: 14 }}>Client not found.</p>
      </div>
    );
  }

  const category = client.category ?? "beauty";
  const accent = client.accent ?? CATEGORY_ACCENT[category] ?? "#1A1A1A";
  // Priority: crm_banner_url → hero_url (brand-specific) → category hero fallback → category crm banner
  const bannerUrl = client.crm_banner_url ?? client.hero_url ?? CATEGORY_HERO_FALLBACK[category] ?? `/crm-banners/${category}.jpg`;
  const logoUrl = client.logo_url;
  const brandName = client.name;
  const stat1Label = CATEGORY_STAT1[category] ?? "Activity Today";
  const stat4Label = CATEGORY_STAT4[category] ?? "Active Clients";
  const titleLabel = `${brandName} CRM`;
  const css = `:root{--accent:${accent};--accent-fg:#FFFFFF;}`;
  const currency = client.currency ?? "JMD";
  const subline = client.subline ?? client.headline ?? "Business management dashboard";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <CRMLayout title={titleLabel} nav={buildNav(category)} brandColor={accent} brandName={brandName} activeTab={tab} onTabChange={setTab}>
        {tab === "dashboard" && (
          <>
            {/* Brand hero banner — uses client's actual storefront hero for brand consistency */}
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: 24, height: 220 }}>
              <img src={bannerUrl} alt={brandName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} loading="lazy" />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accent}DD 0%, ${accent}88 40%, rgba(0,0,0,0.2) 100%)` }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                  {logoUrl && (
                    <img src={logoUrl} alt={brandName} style={{ width: 52, height: 52, borderRadius: 10, objectFit: "contain", background: "#fff", padding: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", flexShrink: 0 }} />
                  )}
                  <div>
                    <p style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.03em", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{brandName}</p>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "3px 0 0", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{subline}</p>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "6px 14px", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <p style={{ color: "#fff", fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Live CRM</p>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 8 }}>
              <StatCard label={stat1Label} value={String(statsToday.activity)} />
              <StatCard label="Net Sales" value={`${currency} ${reportData.totalRevenue.toLocaleString()}`} />
              <StatCard label="New Leads" value={String(statsToday.leads)} />
              <StatCard label={stat4Label} value={String(statsToday.active)} />
            </div>
          </>
        )}
        {tab === "appointments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Appointments</h2><AppointmentsModule appointments={appointments} clientId={client.id} businessWhatsapp={client.whatsapp} /></div>)}
        {tab === "customers" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Customers</h2><CustomersModule customers={customers} clientId={client.id} accentColor={accent} /></div>)}
        {tab === "products" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Products</h2><ProductsModule products={products} clientId={client.id} accentColor={accent} currency={currency} /></div>)}
        {tab === "payments" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Payments</h2><PaymentsModule payments={payments} /></div>)}
        {tab === "quotes" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quotes</h2><QuotesModule quotes={quotes} clientId={client.id} accentColor={accent} /></div>)}
        {tab === "leads" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Leads</h2><LeadsModule leads={leads} clientId={client.id} accentColor={accent} /></div>)}
        {tab === "reports" && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reports</h2>
            <ReportsModule
              data={{ period: reportPeriod, totalRevenue: reportData.totalRevenue, totalOrders: reportData.totalOrders, newLeads: reportData.newLeads, newCustomers: reportData.newCustomers, currency, dailyRevenue: reportData.dailyRevenue }}
              onPeriodChange={handlePeriodChange}
              accentColor={accent}
            />
          </div>
        )}
        {tab === "tasks" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Tasks</h2><TasksModule tasks={tasks} clientId={client.id} accentColor={accent} /></div>)}
        {tab === "inventory" && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Inventory</h2>
            {inventory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                <p style={{ fontSize: 14 }}>No inventory variants yet. Add products first, then add variants with stock quantities.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                      {["Product", "Variant", "SKU", "Price", "Stock", "Status"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((v: any) => {
                      const low = v.stock_qty !== null && v.stock_qty < 5;
                      const out = v.stock_qty !== null && v.stock_qty === 0;
                      return (
                        <tr key={v.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "10px 12px", fontWeight: 500 }}>{v.ct_products?.name ?? "---"}</td>
                          <td style={{ padding: "10px 12px" }}>{v.name}</td>
                          <td style={{ padding: "10px 12px", color: "#9ca3af", fontFamily: "monospace" }}>{v.sku ?? "---"}</td>
                          <td style={{ padding: "10px 12px" }}>{currency} {((v.price ?? 0) / 100).toLocaleString()}</td>
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: out ? "#ef4444" : low ? "#f59e0b" : "#111" }}>{v.stock_qty ?? "---"}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: out ? "#fee2e2" : low ? "#fef3c7" : "#dcfce7", color: out ? "#dc2626" : low ? "#d97706" : "#16a34a" }}>
                              {out ? "Out of Stock" : low ? "Low Stock" : "In Stock"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === "job-cards" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Job Cards</h2><JobCardsModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "warranties" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Warranties</h2><WarrantiesModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "staff" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Staff</h2><StaffModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "custom-orders" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Custom Orders</h2><CustomOrdersModule clientId={client.id} accentColor={accent} currency={currency} /></div>)}
        {tab === "deliveries" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Deliveries</h2><DeliveriesModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "reservations" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reservations</h2><ReservationsModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "kitchen-orders" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Kitchen Orders</h2><KitchenOrdersModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "production-jobs" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Production Jobs</h2><ProductionJobsModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "wholesale-accounts" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Wholesale Accounts</h2><WholesaleAccountsModule clientId={client.id} accentColor={accent} currency={currency} /></div>)}
        {tab === "projects" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Projects</h2><ProjectsModule clientId={client.id} accentColor={accent} currency={currency} /></div>)}
        {tab === "suppliers" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Suppliers</h2><SuppliersModule clientId={client.id} accentColor={accent} /></div>)}
        {tab === "purchase-orders" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Purchase Orders</h2><PurchaseOrdersModule clientId={client.id} accentColor={accent} currency={currency} /></div>)}
        {tab === "event-bookings" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Event Bookings</h2><EventBookingsModule clientId={client.id} accentColor={accent} currency={currency} /></div>)}
        {tab === "quotes" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quotes</h2><QuotesModule quotes={quotes} clientId={client.id} accentColor={accent} /></div>)}
        {tab === "integrations" && (<div><h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Integrations</h2><IntegrationsModule clientId={client.id} clientSlug={client.slug} category={category} accentColor={accent} /></div>)}
        {tab === "settings" && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Business Settings</h2>
            <BusinessProfileModule client={{ id: client.id, name: client.name, phone: client.phone ?? null, whatsapp: client.whatsapp ?? null, address: client.address ?? null, headline: client.headline ?? null, subline: client.subline ?? null, tagline: client.tagline ?? null, currency: client.currency ?? "JMD", business_hours: client.business_hours ?? null }} accentColor={accent} />
          </div>
        )}
      </CRMLayout>
    </>
  );
}