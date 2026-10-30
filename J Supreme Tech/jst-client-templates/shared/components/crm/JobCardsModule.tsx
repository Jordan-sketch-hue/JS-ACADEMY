interface Job { id: string; customer: string; description: string; vehicle?: string; status?: string; createdAt?: string; }

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:     { bg: "#fef9c3", text: "#713f12" },
  "in-progress": { bg: "#dbeafe", text: "#1e3a8a" },
  completed:   { bg: "#d1fae5", text: "#065f46" },
  cancelled:   { bg: "#fee2e2", text: "#991b1b" },
};

export function JobCardsModule({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔧</div>
        <div style={{ fontWeight: 600 }}>No jobs yet</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Repair and service jobs will appear here.</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {jobs.map((job) => {
        const s = job.status ? STATUS_COLORS[job.status] ?? STATUS_COLORS.pending : STATUS_COLORS.pending;
        return (
          <div key={job.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{job.customer}</div>
                {job.vehicle && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{job.vehicle}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text }}>{job.status ?? "pending"}</span>
                {job.createdAt && <span style={{ fontSize: 12, color: "#9ca3af" }}>{job.createdAt}</span>}
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#374151", background: "#f9fafb", borderRadius: 8, padding: "8px 12px" }}>{job.description}</div>
          </div>
        );
      })}
    </div>
  );
}
