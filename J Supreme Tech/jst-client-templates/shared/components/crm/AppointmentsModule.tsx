interface Appointment { id: string; customerName: string; service: string; date: string; time?: string; status: string; }

export function AppointmentsModule({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>No appointments yet</div>
        <div style={{ fontSize: 13 }}>Bookings submitted via the site will appear here.</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            {["Customer", "Service", "Date", "Time", "Status"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#374151" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>{a.customerName}</td>
              <td style={{ padding: "12px 16px", color: "#6b7280" }}>{a.service}</td>
              <td style={{ padding: "12px 16px" }}>{a.date}</td>
              <td style={{ padding: "12px 16px", color: "#6b7280" }}>{a.time ?? "—"}</td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: a.status === "confirmed" ? "#d1fae5" : a.status === "cancelled" ? "#fee2e2" : "#fef9c3", color: a.status === "confirmed" ? "#065f46" : a.status === "cancelled" ? "#991b1b" : "#713f12" }}>{a.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
