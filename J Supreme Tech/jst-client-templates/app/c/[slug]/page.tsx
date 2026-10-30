"use client";
import { useState, useEffect } from "react";
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORY_ACCENT: Record<string, string> = {
  beauty: "#B4778A",
  automotive: "#1E3A5F",
  furniture: "#5C3D1E",
  fashion: "#2D1B69",
  accessories: "#B8860B",
  food: "#B45309",
  florist: "#4A7C59",
  events: "#7C3AED",
  "tech-repair": "#0F172A",
  packaging: "#0369A1",
  lighting: "#D97706",
  variety: "#047857",
  crafts: "#92400E",
  design: "#1A1A1A",
};

const CATEGORY_STAT1: Record<string, string> = {
  beauty: "Appointments Today",
  automotive: "Jobs Today",
  furniture: "Orders Today",
  fashion: "Orders Today",
  accessories: "Orders Today",
  food: "Orders Today",
  florist: "Orders Today",
  events: "Events This Month",
  "tech-repair": "Jobs Today",
  packaging: "Orders Today",
  lighting: "Jobs This Month",
  variety: "Sales Today",
  crafts: "Orders Today",
  design: "Projects This Month",
};

const CATEGORY_STAT4: Record<string, string> = {
  beauty: "Active Clients",
  automotive: "Active Vehicles",
  furniture: "Active Projects",
  fashion: "Active Clients",
  accessories: "Active Clients",
  food: "Active Tables",
  florist: "Active Clients",
  events: "Active Bookings",
  "tech-repair": "Active Devices",
  packaging: "Active Projects",
  lighting: "Active Projects",
  variety: "Active Customers",
  crafts: "Active Projects",
  design: "Active Clients",
};

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

type Client = {
  slug: string;
  name: string;
  category: string;
  accent?: string | null;
  crm_banner_url?: string | null;
  currency?: string | null;
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [tab, setTab] = useState("dashboard");
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    params.then(({ slug: s }) => {
      setSlug(s);
      supabase
        .from("ct_clients")
        .select("slug,name,category,accent,crm_banner_url,currency")
        .eq("slug", s)
        .single()
        .then(({ data }) => {
          setClient(data as Client | null);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
        <p style={{ color: "#999", fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  const category = client?.category ?? "beauty";
  const accent = client?.accent ?? CATEGORY_ACCENT[category] ?? "#1A1A1A";
  const bannerUrl = client?.crm_banner_url ?? `/crm-banners/${category}.jpg`;
  const brandName = client?.name ?? "[CLIENT NAME]";
  const stat1Label = CATEGORY_STAT1[category] ?? "Activity Today";
  const stat4Label = CATEGORY_STAT4[category] ?? "Active Clients";
  const titleLabel = `${brandName} CRM`;
  const css = `:root{--accent:${accent};--accent-fg:#FFFFFF;}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <CRMLayout title={titleLabel} nav={NAV} brandColor={accent} brandName={brandName} activeTab={tab} onTabChange={setTab}>
        {tab === "dashboard" && (
          <>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 24, height: 180 }}>
              <img src={bannerUrl} alt={titleLabel} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 100%)", display: "flex", alignItems: "center", padding: "0 28px" }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>{brandName}</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: "4px 0 0" }}>Business management dashboard</p>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <StatCard label={stat1Label} value="0" />
              <StatCard label="Net Sales" value={`${client?.currency ?? "JMD"} 0`} />
              <StatCard label="New Leads" value="0" />
              <StatCard label={stat4Label} value="0" />
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