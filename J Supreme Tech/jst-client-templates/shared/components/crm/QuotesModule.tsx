interface Quote { id: string; customerName: string; phone?: string; email?: string; message: string; date: string; status: string; }

export function QuotesModule({ quotes }: { quotes: Quote[] }) {
  if (quotes.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>No quote requests yet</div>
        <div style={{ fontSize: 13 }}>Quote requests submitted via the site will appear here.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {quotes.map((q) => (
        <div key={q.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{q.customerName}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{q.phone} {q.email ? `· ${q.email}` : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{q.date}</span>
              <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: q.status === "converted" ? "#d1fae5" : q.status === "new" ? "#dbeafe" : "#f3f4f6", color: q.status === "converted" ? "#065f46" : q.status === "new" ? "#1d4ed8" : "#6b7280" }}>{q.status}</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#374151", background: "#f9fafb", borderRadius: 8, padding: "10px 14px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{q.message}</div>
        </div>
      ))}
    </div>
  );
}
