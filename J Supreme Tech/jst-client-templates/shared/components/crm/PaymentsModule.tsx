"use client";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string | null;
  status: string;
  verified_at: string | null;
  created_at: string;
}

interface Props { payments: Payment[]; }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  verified: { bg: "#dcfce7", color: "#166534" },
  failed: { bg: "#fee2e2", color: "#991b1b" },
};

export function PaymentsModule({ payments }: Props) {
  if (payments.length === 0) return <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>No payments yet.</p>;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Amount</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Method</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Status</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(p => {
          const sc = STATUS_COLORS[p.status] ?? STATUS_COLORS.pending;
          return (
            <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{p.currency} {p.amount.toLocaleString()}</td>
              <td style={{ padding: "10px 12px", color: "#6b7280" }}>{p.method ?? "—"}</td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{ background: sc.bg, color: sc.color, borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{p.status}</span>
              </td>
              <td style={{ padding: "10px 12px", color: "#9ca3af" }}>{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
