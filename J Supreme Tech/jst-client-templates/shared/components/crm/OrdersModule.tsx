interface Order { id: string; customer: string; items?: string; total?: string; status?: string; createdAt?: string; }

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "#fef9c3", text: "#713f12" },
  confirmed:  { bg: "#d1fae5", text: "#065f46" },
  completed:  { bg: "#ede9fe", text: "#4c1d95" },
  cancelled:  { bg: "#fee2e2", text: "#991b1b" },
};

export function OrdersModule({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
        <div style={{ fontWeight: 600 }}>No orders yet</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Orders placed through the storefront will appear here.</div>
      </div>
    );
  }
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: 0, background: "#f9fafb", padding: "10px 20px", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8 }}>
        <span>Customer</span><span>Items</span><span>Total</span><span>Status</span><span>Date</span>
      </div>
      {orders.map((o, i) => {
        const s = o.status ? STATUS_COLORS[o.status] ?? STATUS_COLORS.pending : STATUS_COLORS.pending;
        return (
          <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: 0, padding: "14px 20px", borderTop: "1px solid #f3f4f6", alignItems: "center", fontSize: 14 }}>
            <span style={{ fontWeight: 600 }}>{o.customer}</span>
            <span style={{ color: "#6b7280" }}>{o.items ?? "—"}</span>
            <span style={{ fontWeight: 600 }}>{o.total ?? "—"}</span>
            <span style={{ padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text, whiteSpace: "nowrap" }}>{o.status ?? "pending"}</span>
            <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 16 }}>{o.createdAt ?? ""}</span>
          </div>
        );
      })}
    </div>
  );
}
