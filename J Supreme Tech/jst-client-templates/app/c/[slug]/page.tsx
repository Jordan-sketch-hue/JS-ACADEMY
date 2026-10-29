export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getClient, getClientAppointments, getClientOrders, getClientJobs, getClientLeads, getClientStats } from "@/lib/ct-client";
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { StatCard } from "@shared/components/charts/StatCard";
import { AppointmentsModule } from "@shared/components/crm/AppointmentsModule";
import { OrdersModule } from "@shared/components/crm/OrdersModule";
import { JobCardsModule } from "@shared/components/crm/JobCardsModule";
import { LeadsModule } from "@shared/components/crm/LeadsModule";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) return { title: "Not Found" };
  return { title: `${client.name} — CRM` };
}

function buildNav(slug: string, category: string) {
  const base = `/c/${slug}`;
  const appointmentCats = ["beauty", "florist", "events"];
  const jobCats = ["automotive", "tech-repair"];
  const links = [
    { href: base, label: "Overview" },
  ];
  if (appointmentCats.includes(category)) links.push({ href: base + "#appointments", label: "Appointments" });
  else if (jobCats.includes(category)) links.push({ href: base + "#jobs", label: "Jobs" });
  else links.push({ href: base + "#orders", label: "Orders" });
  links.push(
    { href: base + "/customers", label: "Customers" },
    { href: base + "/products", label: "Products" },
    { href: base + "/quotes", label: "Quotes" },
    { href: base + "/payments", label: "Payments" },
    { href: base + "/tasks", label: "Tasks" },
    { href: base + "/reports", label: "Reports" },
    { href: base + "/settings", label: "Settings" },
  );
  return links;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) notFound();

  const appointmentCats = ["beauty", "florist", "events"];
  const jobCats = ["automotive", "tech-repair"];

  const [stats, appointments, orders, jobs, leads] = await Promise.all([
    getClientStats(client.id, client.category),
    appointmentCats.includes(client.category) ? getClientAppointments(client.id) : Promise.resolve([]),
    !appointmentCats.includes(client.category) && !jobCats.includes(client.category) ? getClientOrders(client.id) : Promise.resolve([]),
    jobCats.includes(client.category) ? getClientJobs(client.id) : Promise.resolve([]),
    getClientLeads(client.id),
  ]);

  const nav = buildNav(slug, client.category);
  const css = `:root{--accent:${client.accent};--accent-fg:${client.accent_fg};}`;
  const bannerUrl = (client as Record<string, unknown>).crm_banner_url as string | null ?? `/crm-banners/${client.category}.jpg`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <CRMLayout title={`${client.name} — CRM`} nav={nav} brandColor={client.accent} brandName={client.name}>
        {/* CRM Banner */}
        <div style={{
          marginBottom: 28,
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
          height: 140,
          background: client.accent,
        }}>
          <img
            src={bannerUrl}
            alt={`${client.category} banner`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
          }} />
          <div style={{ position: "absolute", bottom: 16, left: 20 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{client.category.replace("-", " ")}</p>
            <p style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 800, color: "#fff" }}>{client.name}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>

        {appointmentCats.includes(client.category) && (
          <div id="appointments" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Upcoming Appointments</h2>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <AppointmentsModule appointments={appointments as any[]} clientId={client.id} businessWhatsapp={client.whatsapp} />
          </div>
        )}

        {jobCats.includes(client.category) && (
          <div id="jobs" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Active Jobs</h2>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <JobCardsModule jobs={jobs as any[]} clientId={client.id} />
          </div>
        )}

        {!appointmentCats.includes(client.category) && !jobCats.includes(client.category) && (
          <div id="orders" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <OrdersModule orders={orders as any[]} />
          </div>
        )}

        <div id="leads" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Leads</h2>
          <LeadsModule clientId={client.id} leads={leads.map(l => ({
            id: l.id,
            name: l.name,
            phone: l.phone ?? "",
            source: l.source ?? "website",
            status: l.status as "new" | "contacted" | "converted" | "lost",
            createdAt: l.created_at,
          }))} />
        </div>
      </CRMLayout>
    </>
  );
}
