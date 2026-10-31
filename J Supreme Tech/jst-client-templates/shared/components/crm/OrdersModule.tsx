/**
 * OrdersModule — order list for Fashion, Accessories, Furniture, Variety, Packaging, Lighting, Food.
 * HOW TO TEST: render with orders=[] → "No orders yet"
 *   render with sample rows → table with order total, status, fulfilment
 */
"use client";
import { useState, useMemo } from "react";
import type { Database } from "@shared/types/supabase";

type Row = Database["public"]["Tables"]["ct_orders"]["Row"];
interface Props { orders: Row[]; }

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  processing: "#8B5CF6",
  shipped: "#06B6D4",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

export function OrdersModule({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "highest">("newest");

  const filtered = useMemo(() => {
    let rows = orders.filter((o) => {
      const ms = !search || o.customer_name?.toLowerCase().includes(search.toLowerCase());
      const mf = status === "all" || o.status === status;
      return ms && mf;
    });
    if (sort === "oldest") rows = [...rows].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sort === "highest") rows = [...rows].sort((a, b) => (b.total_amount ?? 0) - (a.total_amount ?? 0));
    else rows = [...rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return rows;
  }, [orders, search, status, sort]);

  return (
    <section style={{ padding: "0 0 32px" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input type="text" placeholder="Search customer…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--bg)", color: "var(--text-primary)", fontSize: 14 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--bg)", color: "var(--text-primary)", fontSize: 14 }}>
          <option value="all">All</option>
          {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
          style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--bg)", color: "var(--text-primary)", fontSize: 14 }}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest value</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "48px 0" }}>No orders yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
                {["Order #", "Customer", "Phone", "Total", "Status", "Date"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>#{o.id.toString().slice(-5).toUpperCase()}</td>
                  <td style={{ padding: "12px" }}>{o.customer_name}</td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>{o.customer_phone ?? "—"}</td>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{o.total_amount != null ? `J$${o.total_amount.toLocaleString()}` : "—"}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: `${STATUS_COLORS[o.status ?? "pending"]}22`, color: STATUS_COLORS[o.status ?? "pending"] }}>
                      {o.status ?? "pending"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
