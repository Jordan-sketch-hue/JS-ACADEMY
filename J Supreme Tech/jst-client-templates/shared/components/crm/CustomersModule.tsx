interface Customer { id: string; name: string; phone?: string; email?: string; lastVisit?: string; totalSpend?: string; }

export function CustomersModule({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>No customers yet</div>
        <div style={{ fontSize: 13 }}>Customers who submit orders or bookings will appear here.</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            {["Name", "Phone", "Email", "Last Visit", "Total Spend"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#374151" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>{c.name}</td>
              <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.phone ?? "—"}</td>
              <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.email ?? "—"}</td>
              <td style={{ padding: "12px 16px" }}>{c.lastVisit ?? "—"}</td>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>{c.totalSpend ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
