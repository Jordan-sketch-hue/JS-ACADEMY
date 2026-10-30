interface Payment { id: string; customerName: string; amount: string; method?: string; date: string; status: string; reference?: string; }

export function PaymentsModule({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>No payments recorded</div>
        <div style={{ fontSize: 13 }}>Confirmed orders and payments will appear here.</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            {["Customer", "Amount", "Method", "Date", "Reference", "Status"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#374151" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.customerName}</td>
              <td style={{ padding: "12px 16px", fontWeight: 700 }}>{p.amount}</td>
              <td style={{ padding: "12px 16px", color: "#6b7280" }}>{p.method ?? "—"}</td>
              <td style={{ padding: "12px 16px" }}>{p.date}</td>
              <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}>{p.reference ?? "—"}</td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: p.status === "paid" ? "#d1fae5" : p.status === "pending" ? "#fef9c3" : "#fee2e2", color: p.status === "paid" ? "#065f46" : p.status === "pending" ? "#713f12" : "#991b1b" }}>{p.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
