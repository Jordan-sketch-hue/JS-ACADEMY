interface Props {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
}

export function StatCard({ label, value, sub, trend }: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#111", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "#6b7280", marginTop: 6, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}
