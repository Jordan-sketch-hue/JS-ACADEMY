interface ReportData {
  period: "7d" | "30d" | "90d";
  totalRevenue: number;
  totalOrders: number;
  newLeads: number;
  newCustomers: number;
  currency: string;
  dailyRevenue: { date: string; amount: number }[];
}

export function ReportsModule({ data }: { data: ReportData }) {
  const fmt = (n: number) => `${data.currency} ${n.toLocaleString()}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {[
          { label: "Total Revenue", value: data.totalRevenue > 0 ? fmt(data.totalRevenue) : "—" },
          { label: "Total Orders", value: data.totalOrders > 0 ? String(data.totalOrders) : "—" },
          { label: "New Leads", value: data.newLeads > 0 ? String(data.newLeads) : "—" },
          { label: "New Customers", value: data.newCustomers > 0 ? String(data.newCustomers) : "—" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {data.dailyRevenue.length > 0 ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Daily Revenue</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {data.dailyRevenue.map((d) => {
              const max = Math.max(...data.dailyRevenue.map((x) => x.amount), 1);
              return (
                <div key={d.date} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#6b7280", width: 80, flexShrink: 0 }}>{d.date}</span>
                  <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 4, height: 12 }}>
                    <div style={{ width: `${(d.amount / max) * 100}%`, background: "#111", borderRadius: 4, height: "100%" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, width: 80, textAlign: "right" }}>{fmt(d.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
          No revenue data for this period.
        </div>
      )}
    </div>
  );
}
