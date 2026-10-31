"use client";
import { useState } from "react";

export interface ReportData {
  period: "7d" | "30d" | "90d";
  totalRevenue: number;
  totalOrders: number;
  newLeads: number;
  newCustomers: number;
  currency: string;
  dailyRevenue: Array<{ date: string; amount: number }>;
}

interface Props { data: ReportData; onPeriodChange?: (p: "7d" | "30d" | "90d") => void; accentColor?: string; }

export function ReportsModule({ data, onPeriodChange, accentColor = "#111" }: Props) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">(data.period);

  const handlePeriod = (p: "7d" | "30d" | "90d") => {
    setPeriod(p);
    onPeriodChange?.(p);
  };

  const maxRev = Math.max(...data.dailyRevenue.map(d => d.amount), 1);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["7d", "30d", "90d"] as const).map(p => (
          <button key={p} onClick={() => handlePeriod(p)} style={{ padding: "6px 16px", borderRadius: 999, border: "1px solid #e5e7eb", background: period === p ? accentColor : "#fff", color: period === p ? "#fff" : "#111", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: 20 }}><p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>REVENUE</p><p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700 }}>{data.currency} {data.totalRevenue.toLocaleString()}</p></div>
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: 20 }}><p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>ORDERS</p><p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700 }}>{data.totalOrders}</p></div>
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: 20 }}><p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>NEW LEADS</p><p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700 }}>{data.newLeads}</p></div>
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: 20 }}><p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>NEW CUSTOMERS</p><p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700 }}>{data.newCustomers}</p></div>
      </div>
      <div>
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Revenue trend</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
          {data.dailyRevenue.slice(-14).map((d, i) => (
            <div key={i} style={{ flex: 1, background: accentColor, opacity: 0.7 + (d.amount / maxRev) * 0.3, borderRadius: "3px 3px 0 0", height: `${Math.max(4, (d.amount / maxRev) * 100)}%`, minWidth: 8 }} title={`${d.date}: ${data.currency} ${d.amount.toLocaleString()}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
