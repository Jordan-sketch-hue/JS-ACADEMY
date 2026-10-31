"use client";

export interface Quote {
  id: string;
  customer_id: string | null;
  total: number;
  status: string;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
}

interface Props { quotes: Quote[]; currency?: string; }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: "#f3f4f6", color: "#6b7280" },
  sent: { bg: "#dbeafe", color: "#1d4ed8" },
  approved: { bg: "#dcfce7", color: "#166534" },
  declined: { bg: "#fee2e2", color: "#991b1b" },
  expired: { bg: "#fef3c7", color: "#92400e" },
};

export function QuotesModule({ quotes, currency = "JMD" }: Props) {
  if (quotes.length === 0) return <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>No quotes yet.</p>;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Quote</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Total</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Status</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Expires</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Created</th>
        </tr>
      </thead>
      <tbody>
        {quotes.map(q => {
          const sc = STATUS_COLORS[q.status] ?? STATUS_COLORS.draft;
          return (
            <tr key={q.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 12, color: "#6b7280" }}>{q.id.slice(0, 8).toUpperCase()}</td>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{currency} {q.total.toLocaleString()}</td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{ background: sc.bg, color: sc.color, borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{q.status}</span>
              </td>
              <td style={{ padding: "10px 12px", color: "#9ca3af" }}>{q.expires_at ? new Date(q.expires_at).toLocaleDateString() : "—"}</td>
              <td style={{ padding: "10px 12px", color: "#9ca3af" }}>{new Date(q.created_at).toLocaleDateString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
