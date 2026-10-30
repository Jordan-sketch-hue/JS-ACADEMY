"use client";
import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface NavItem { href: string; tabKey: string; label: string; }

interface Props {
  title: string;
  nav: NavItem[];
  brandColor: string;
  brandName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export function CRMLayout({ title, nav, brandColor, brandName: defaultName, activeTab, onTabChange, children }: Props) {
  const searchParams = useSearchParams();
  const slug = searchParams?.get("slug");
  const [brandName, setBrandName] = useState(defaultName);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/products?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.clientName) setBrandName(d.clientName); })
      .catch(() => {});
  }, [slug]);
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#111", color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #222" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>CRM</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{brandName}</div>
        </div>
        <nav style={{ padding: "12px 0", flex: 1 }}>
          {nav.map((item) => (
            <button key={item.tabKey} onClick={() => onTabChange(item.tabKey)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 20px", background: activeTab === item.tabKey ? brandColor : "none", color: activeTab === item.tabKey ? "#fff" : "#aaa", border: "none", cursor: "pointer", fontSize: 14, fontWeight: activeTab === item.tabKey ? 600 : 400, borderLeft: activeTab === item.tabKey ? `3px solid ${brandColor === "#111" || brandColor === "#1A1A1A" ? "#fff" : brandColor}` : "3px solid transparent", transition: "all 0.15s" }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #222", fontSize: 11, color: "#555" }}>
          Powered by JST
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111" }}>{title}</h1>
          <div style={{ fontSize: 13, color: "#888" }}>{new Date().toLocaleDateString("en-JM", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        </header>
        <div style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
