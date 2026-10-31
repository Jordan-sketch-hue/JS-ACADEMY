"use client";
import { useState, useEffect } from "react";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "available" | "coming_soon";
  category: string;
  docsUrl?: string;
};

const GENERAL_INTEGRATIONS: Integration[] = [
  { id: "whatsapp", name: "WhatsApp Business", description: "Auto-notify customers on orders, appointments & deliveries via WhatsApp.", icon: "💬", status: "available", category: "Messaging" },
  { id: "google-calendar", name: "Google Calendar", description: "Sync appointments and bookings directly to Google Calendar.", icon: "📅", status: "available", category: "Scheduling" },
  { id: "stripe", name: "Stripe", description: "Accept card payments online. Auto-log to Payments tab.", icon: "💳", status: "available", category: "Payments" },
  { id: "wipay", name: "WiPay Jamaica", description: "Accept JMD card payments and bank transfers via WiPay.", icon: "🏦", status: "available", category: "Payments" },
  { id: "mailchimp", name: "Mailchimp", description: "Sync leads and customers to email marketing lists.", icon: "📧", status: "coming_soon", category: "Marketing" },
  { id: "google-sheets", name: "Google Sheets", description: "Export orders, leads and reports to a connected spreadsheet.", icon: "📊", status: "coming_soon", category: "Productivity" },
  { id: "zapier", name: "Zapier", description: "Connect 6,000+ apps using Zapier automation workflows.", icon: "⚡", status: "coming_soon", category: "Automation" },
  { id: "instagram", name: "Instagram Business", description: "Pull DM leads and product inquiries directly into Leads tab.", icon: "📸", status: "coming_soon", category: "Social" },
  { id: "tiktok", name: "TikTok Shop", description: "Sync TikTok Shop orders and product catalog automatically.", icon: "🎵", status: "coming_soon", category: "Social" },
  { id: "facebook", name: "Facebook Leads", description: "Capture Facebook Lead Ads directly into your CRM.", icon: "👥", status: "coming_soon", category: "Social" },
  { id: "quickbooks", name: "QuickBooks", description: "Sync invoices, expenses and payments with QuickBooks.", icon: "📒", status: "coming_soon", category: "Accounting" },
  { id: "google-business", name: "Google Business Profile", description: "Manage reviews and update hours from your CRM dashboard.", icon: "🗺️", status: "coming_soon", category: "Visibility" },
];

const AI_INTEGRATIONS: Integration[] = [
  { id: "claude-ai", name: "Claude AI Assistant", description: "AI-powered customer reply drafting, lead scoring and business insights.", icon: "🤖", status: "available", category: "AI" },
  { id: "ai-chat", name: "AI Website Chatbot", description: "Deploy a trained AI chatbot on your storefront to capture leads 24/7.", icon: "💭", status: "available", category: "AI" },
  { id: "ai-replies", name: "AI DM Responder", description: "Auto-reply to Instagram and WhatsApp DMs using your product catalog.", icon: "✨", status: "coming_soon", category: "AI" },
  { id: "ai-analytics", name: "AI Sales Insights", description: "Weekly AI-generated reports on revenue trends and top products.", icon: "📈", status: "coming_soon", category: "AI" },
  { id: "ai-content", name: "AI Content Generator", description: "Generate product descriptions, captions and promo posts automatically.", icon: "✍️", status: "coming_soon", category: "AI" },
];

const INDUSTRY_INTEGRATIONS: Record<string, Integration[]> = {
  beauty: [
    { id: "fresha", name: "Fresha", description: "Sync bookings from Fresha online booking platform.", icon: "💅", status: "available", category: "Booking" },
    { id: "vagaro", name: "Vagaro", description: "Import client history and appointments from Vagaro.", icon: "🌸", status: "coming_soon", category: "Booking" },
    { id: "square-appts", name: "Square Appointments", description: "Two-way sync with Square Appointments calendar.", icon: "📆", status: "coming_soon", category: "Booking" },
    { id: "mindbody", name: "Mindbody", description: "Sync class bookings and memberships from Mindbody.", icon: "🧘", status: "coming_soon", category: "Booking" },
  ],
  automotive: [
    { id: "repair-shopr", name: "RepairShopr", description: "Import job cards and repair history from RepairShopr.", icon: "🔧", status: "coming_soon", category: "Workshop" },
    { id: "shop-ware", name: "Shop-Ware", description: "Auto-sync vehicle inspections and digital health reports.", icon: "🚗", status: "coming_soon", category: "Workshop" },
    { id: "carfax", name: "CarFax", description: "Pull vehicle history reports directly into job cards.", icon: "📋", status: "coming_soon", category: "Records" },
    { id: "parts-tech", name: "PartsTech", description: "Order OEM and aftermarket parts directly from Job Cards.", icon: "🔩", status: "coming_soon", category: "Parts" },
  ],
  food: [
    { id: "ubereats", name: "Uber Eats", description: "Receive Uber Eats orders directly into your Kitchen tab.", icon: "🛵", status: "coming_soon", category: "Delivery" },
    { id: "doordash", name: "DoorDash", description: "Pull DoorDash orders into Kitchen Orders automatically.", icon: "🍕", status: "coming_soon", category: "Delivery" },
    { id: "square-pos", name: "Square POS", description: "Sync Square point-of-sale orders and daily reports.", icon: "🟦", status: "coming_soon", category: "POS" },
    { id: "clover", name: "Clover POS", description: "Import Clover transactions into Payments automatically.", icon: "🍀", status: "coming_soon", category: "POS" },
    { id: "opentable", name: "OpenTable", description: "Sync restaurant reservations from OpenTable in real time.", icon: "🍽️", status: "coming_soon", category: "Reservations" },
  ],
  fashion: [
    { id: "shopify", name: "Shopify", description: "Sync Shopify orders, inventory and customers into CRM.", icon: "🛍️", status: "available", category: "eCommerce" },
    { id: "woocommerce", name: "WooCommerce", description: "Pull WooCommerce orders and customers automatically.", icon: "🛒", status: "coming_soon", category: "eCommerce" },
    { id: "printful", name: "Printful", description: "Manage print-on-demand orders and production status.", icon: "👕", status: "coming_soon", category: "Fulfillment" },
    { id: "faire", name: "Faire Wholesale", description: "Sync wholesale orders from Faire marketplace.", icon: "📦", status: "coming_soon", category: "Wholesale" },
  ],
  accessories: [
    { id: "shopify", name: "Shopify", description: "Sync Shopify orders, inventory and customers into CRM.", icon: "🛍️", status: "available", category: "eCommerce" },
    { id: "etsy", name: "Etsy", description: "Import Etsy orders and customer messages into CRM.", icon: "🎨", status: "coming_soon", category: "Marketplace" },
    { id: "amazon", name: "Amazon Seller", description: "Sync Amazon orders and inventory levels automatically.", icon: "📦", status: "coming_soon", category: "Marketplace" },
  ],
  variety: [
    { id: "shopify", name: "Shopify", description: "Sync Shopify orders, inventory and customers into CRM.", icon: "🛍️", status: "available", category: "eCommerce" },
    { id: "square-pos", name: "Square POS", description: "Import all in-person sales from Square automatically.", icon: "🟦", status: "coming_soon", category: "POS" },
    { id: "woocommerce", name: "WooCommerce", description: "Pull WooCommerce orders and customer data.", icon: "🛒", status: "coming_soon", category: "eCommerce" },
  ],
  florist: [
    { id: "teleflora", name: "Teleflora", description: "Receive Teleflora wire orders directly into Custom Orders.", icon: "🌸", status: "coming_soon", category: "Orders" },
    { id: "ftd", name: "FTD", description: "Pull FTD floral orders into your orders dashboard.", icon: "🌺", status: "coming_soon", category: "Orders" },
    { id: "bloom-nation", name: "BloomNation", description: "Sync BloomNation marketplace orders and deliveries.", icon: "🌷", status: "coming_soon", category: "Marketplace" },
  ],
  events: [
    { id: "eventbrite", name: "Eventbrite", description: "Sync event ticket sales and attendee lists from Eventbrite.", icon: "🎟️", status: "coming_soon", category: "Ticketing" },
    { id: "calendly", name: "Calendly", description: "Pull Calendly bookings into Event Bookings tab.", icon: "📅", status: "available", category: "Scheduling" },
    { id: "zoom", name: "Zoom", description: "Auto-create Zoom links for virtual events and consultations.", icon: "📹", status: "coming_soon", category: "Virtual" },
  ],
  "tech-repair": [
    { id: "repair-desk", name: "RepairDesk", description: "Import repair tickets and customer history from RepairDesk.", icon: "🔧", status: "coming_soon", category: "Repair" },
    { id: "cell-smart-pos", name: "CellSmart POS", description: "Sync device repair jobs and parts inventory.", icon: "📱", status: "coming_soon", category: "Repair" },
    { id: "parts-tech", name: "PartsTech", description: "Order replacement parts directly from your Job Cards.", icon: "🔩", status: "coming_soon", category: "Parts" },
  ],
  packaging: [
    { id: "shopify", name: "Shopify", description: "Sync bulk packaging orders from Shopify store.", icon: "📦", status: "available", category: "eCommerce" },
    { id: "alibaba", name: "Alibaba Trade", description: "Track supplier orders and shipments from Alibaba.", icon: "🌏", status: "coming_soon", category: "Sourcing" },
  ],
  lighting: [
    { id: "autocad", name: "AutoCAD", description: "Attach lighting layout drawings to Projects.", icon: "📐", status: "coming_soon", category: "Design" },
    { id: "dialux", name: "DIALux", description: "Import lighting plans and specifications into Projects.", icon: "💡", status: "coming_soon", category: "Design" },
  ],
  crafts: [
    { id: "etsy", name: "Etsy", description: "Import Etsy orders and customer messages into CRM.", icon: "🎨", status: "coming_soon", category: "Marketplace" },
    { id: "shopify", name: "Shopify", description: "Sync Shopify orders and product catalog.", icon: "🛍️", status: "available", category: "eCommerce" },
    { id: "printful", name: "Printful", description: "Manage print-on-demand production status.", icon: "🖨️", status: "coming_soon", category: "Fulfillment" },
  ],
  furniture: [
    { id: "shopify", name: "Shopify", description: "Sync Shopify furniture orders and custom order forms.", icon: "🛍️", status: "available", category: "eCommerce" },
    { id: "houzz", name: "Houzz Pro", description: "Import Houzz project leads and client briefs.", icon: "🛋️", status: "coming_soon", category: "Design" },
    { id: "wayfair", name: "Wayfair Partner", description: "Sync Wayfair supplier orders and inventory.", icon: "🏠", status: "coming_soon", category: "Marketplace" },
  ],
};

const STATUS_CONFIG = {
  connected: { label: "Connected", bg: "#dcfce7", color: "#16a34a" },
  available: { label: "Connect", bg: "#eff6ff", color: "#2563eb" },
  coming_soon: { label: "Coming Soon", bg: "#f3f4f6", color: "#9ca3af" },
};

function IntegrationCard({ integration, accent, onToggle }: {
  integration: Integration;
  accent: string;
  onToggle: (id: string) => void;
}) {
  const statusKey = integration.status;
  const cfg = STATUS_CONFIG[statusKey];

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${statusKey === "connected" ? "#bbf7d0" : "#e5e7eb"}`,
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        transition: "box-shadow 0.15s, transform 0.15s",
        boxShadow: statusKey === "connected" ? "0 0 0 2px #22c55e22" : "none",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = statusKey === "connected" ? "0 0 0 2px #22c55e22" : "none";
        (e.currentTarget as HTMLDivElement).style.transform = "none";
      }}
    >
      <div style={{ fontSize: 26, lineHeight: 1, flexShrink: 0, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", borderRadius: 10 }}>
        {integration.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "#111" }}>{integration.name}</p>
          <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: "#f3f4f6", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.04em" }}>{integration.category}</span>
        </div>
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{integration.description}</p>
      </div>
      <button
        onClick={() => statusKey !== "coming_soon" && onToggle(integration.id)}
        disabled={statusKey === "coming_soon"}
        style={{
          flexShrink: 0,
          padding: "7px 14px",
          borderRadius: 8,
          border: "none",
          fontSize: 12,
          fontWeight: 700,
          cursor: statusKey === "coming_soon" ? "default" : "pointer",
          background: statusKey === "connected" ? "#dcfce7" : statusKey === "available" ? accent : "#f3f4f6",
          color: statusKey === "connected" ? "#16a34a" : statusKey === "available" ? "#fff" : "#9ca3af",
          transition: "opacity 0.15s",
        }}
      >
        {statusKey === "connected" ? "✓ Connected" : statusKey === "available" ? "Connect" : "Soon"}
      </button>
    </div>
  );
}

interface Props {
  clientId: string;
  clientSlug: string;
  category: string;
  accentColor?: string;
}

export function IntegrationsModule({ clientId, clientSlug, category, accentColor = "#111" }: Props) {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<"general" | "ai" | "industry">("general");
  const storageKey = `integrations_${clientSlug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setConnected(new Set(JSON.parse(saved)));
    } catch {}
  }, [storageKey]);

  function toggleIntegration(id: string) {
    setConnected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  function hydrateStatus(integrations: Integration[]): Integration[] {
    return integrations.map(i => ({
      ...i,
      status: connected.has(i.id) ? "connected" : i.status === "coming_soon" ? "coming_soon" : "available",
    }));
  }

  const industryApps = INDUSTRY_INTEGRATIONS[category] ?? [];
  const connectedCount = connected.size;
  const totalAvailable =
    GENERAL_INTEGRATIONS.filter(i => i.status !== "coming_soon").length +
    AI_INTEGRATIONS.filter(i => i.status !== "coming_soon").length +
    industryApps.filter(i => i.status !== "coming_soon").length;

  const sections = [
    { key: "general" as const, label: "General", count: GENERAL_INTEGRATIONS.length },
    { key: "ai" as const, label: "AI Tools", count: AI_INTEGRATIONS.length },
    { key: "industry" as const, label: "Industry Apps", count: industryApps.length },
  ];

  const cardGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 12 };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Connected", value: String(connectedCount), bg: "#dcfce7", color: "#16a34a" },
          { label: "Available Now", value: String(totalAvailable), bg: "#eff6ff", color: "#2563eb" },
          { label: "Total Integrations", value: String(GENERAL_INTEGRATIONS.length + AI_INTEGRATIONS.length + industryApps.length), bg: "#f5f3ff", color: "#7c3aed" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: s.color, margin: "2px 0 0", opacity: 0.75, fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "2px solid",
              borderColor: activeSection === s.key ? accentColor : "#e5e7eb",
              background: activeSection === s.key ? accentColor : "#fff",
              color: activeSection === s.key ? "#fff" : "#374151",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {s.label}
            <span style={{
              background: activeSection === s.key ? "rgba(255,255,255,0.25)" : "#f3f4f6",
              color: activeSection === s.key ? "#fff" : "#6b7280",
              borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 700,
            }}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* General */}
      {activeSection === "general" && (
        <div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
            Core business tools that work for every industry — connect your most-used apps in one place.
          </p>
          <div style={cardGrid}>
            {hydrateStatus(GENERAL_INTEGRATIONS).map(i => (
              <IntegrationCard key={i.id} integration={i} accent={accentColor} onToggle={toggleIntegration} />
            ))}
          </div>
        </div>
      )}

      {/* AI */}
      {activeSection === "ai" && (
        <div>
          <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", borderRadius: 14, padding: "20px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 36 }}>🤖</div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: 0 }}>AI-Powered Business Tools</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: "4px 0 0" }}>
                Built on Claude AI — automate replies, generate content, and get intelligent business insights.
              </p>
            </div>
          </div>
          <div style={cardGrid}>
            {hydrateStatus(AI_INTEGRATIONS).map(i => (
              <IntegrationCard key={i.id} integration={i} accent={accentColor} onToggle={toggleIntegration} />
            ))}
          </div>
        </div>
      )}

      {/* Industry */}
      {activeSection === "industry" && (
        <div>
          {industryApps.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "#9ca3af" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🔌</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Industry apps coming soon</p>
              <p style={{ fontSize: 13 }}>We are building category-specific integrations for your industry.</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                Apps and platforms built specifically for your industry.
              </p>
              <div style={cardGrid}>
                {hydrateStatus(industryApps).map(i => (
                  <IntegrationCard key={i.id} integration={i} accent={accentColor} onToggle={toggleIntegration} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 28, padding: "14px 18px", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
          <strong style={{ color: "#374151" }}>Need a custom integration?</strong> Contact your J Supreme Tech account manager and we will build it for you. All integrations are managed securely.
        </p>
      </div>
    </div>
  );
}
