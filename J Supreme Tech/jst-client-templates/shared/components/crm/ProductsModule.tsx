interface Product { id: string; name: string; category?: string; price: number; currency: string; active: boolean; sku?: string; }

export function ProductsModule({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>No products yet</div>
        <div style={{ fontSize: 13 }}>Add products via the Admin panel to manage them here.</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            {["Name", "Category", "Price", "SKU", "Status"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#374151" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.name}</td>
              <td style={{ padding: "12px 16px", color: "#6b7280" }}>{p.category ?? "—"}</td>
              <td style={{ padding: "12px 16px", fontWeight: 700 }}>{p.currency} {p.price.toLocaleString()}</td>
              <td style={{ padding: "12px 16px", color: "#9ca3af", fontFamily: "monospace", fontSize: 12 }}>{p.sku ?? "—"}</td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: p.active ? "#d1fae5" : "#f3f4f6", color: p.active ? "#065f46" : "#6b7280" }}>{p.active ? "Active" : "Hidden"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
