interface Lead { id: string; name: string; contact?: string; message: string; createdAt?: string; }

export function LeadsModule({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
        <div style={{ fontWeight: 600 }}>No leads yet</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>New inquiries from the storefront will appear here.</div>
      </div>
    );
  }
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      {leads.map((lead, i) => (
        <div key={lead.id} style={{ padding: "16px 20px", borderBottom: i < leads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.name}</div>
            {lead.createdAt && <div style={{ fontSize: 12, color: "#9ca3af" }}>{lead.createdAt}</div>}
          </div>
          {lead.contact && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{lead.contact}</div>}
          <div style={{ fontSize: 13, color: "#374151", background: "#f9fafb", borderRadius: 8, padding: "8px 12px" }}>{lead.message}</div>
        </div>
      ))}
    </div>
  );
}
