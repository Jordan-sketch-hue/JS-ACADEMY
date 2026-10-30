"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  currency: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sku: string | null;
};

export default function AdminProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const secret = searchParams?.get("secret") ?? "";

  const authHeader = secret ? { "x-admin-secret": secret } : {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", category: "", price: "", currency: "JMD", description: "", sku: "" });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/products?slug=${slug}`, { headers: authHeader })
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? []);
        setClientName(d.clientName ?? slug);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, category: p.category ?? "", price: p.price, currency: p.currency, description: p.description ?? "", sku: p.sku ?? "", active: p.active });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ id: editingId, ...editForm }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...updated.product } : p));
      setEditingId(null);
      flash("Product updated.");
    }
    setSaving(false);
  };

  const toggleActive = async (p: Product) => {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ id: p.id, active: !p.active }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !p.active } : x));
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", headers: authHeader });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      flash("Product deleted.");
    }
  };

  const addProduct = async () => {
    if (!addForm.name || !addForm.price) return;
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ slug, ...addForm, price: parseFloat(addForm.price) }),
    });
    if (res.ok) {
      const { product } = await res.json();
      setProducts((prev) => [product, ...prev]);
      setShowAdd(false);
      setAddForm({ name: "", category: "", price: "", currency: "JMD", description: "", sku: "" });
      flash("Product added.");
    }
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = { padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13, width: "100%" };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Admin Panel</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{clientName}</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href={`/t/${slug}/admin/orders`} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontWeight: 600, fontSize: 13, textDecoration: "none", color: "#374151" }}>Orders Inbox</Link>
          <Link href={`/t/${slug}/admin/bookings`} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontWeight: 600, fontSize: 13, textDecoration: "none", color: "#374151" }}>Bookings</Link>
          <Link href={`/t/${slug}`} style={{ padding: "10px 18px", borderRadius: 8, background: "#111", color: "#fff", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>View Site →</Link>
        </div>
      </div>

      {notice && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>{notice}</div>
      )}

      {/* Add product */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 24, overflow: "hidden" }}>
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ width: "100%", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, color: "#111", textAlign: "left" }}>
          <span>+ Add New Product</span>
          <span style={{ fontSize: 20, transform: showAdd ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
        </button>
        {showAdd && (
          <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Name *</label><input style={inputStyle} value={addForm.name} onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Category</label><input style={inputStyle} value={addForm.category} onChange={(e) => setAddForm(f => ({ ...f, category: e.target.value }))} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Price *</label><input type="number" style={inputStyle} value={addForm.price} onChange={(e) => setAddForm(f => ({ ...f, price: e.target.value }))} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Currency</label>
              <select style={inputStyle} value={addForm.currency} onChange={(e) => setAddForm(f => ({ ...f, currency: e.target.value }))}>
                <option>JMD</option><option>USD</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Description</label><textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={addForm.description} onChange={(e) => setAddForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
              <button onClick={addProduct} disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, background: "#111", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : "Add Product"}</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: "10px 18px", borderRadius: 8, background: "#f3f4f6", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Product table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Products</p>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{products.length} items</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No products yet — add one above.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["Name", "Category", "Price", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {editingId === p.id ? (
                      <>
                        <td style={{ padding: "8px 16px" }}><input style={{ ...inputStyle, width: 160 }} value={String(editForm.name ?? "")} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} /></td>
                        <td style={{ padding: "8px 16px" }}><input style={{ ...inputStyle, width: 120 }} value={String(editForm.category ?? "")} onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))} /></td>
                        <td style={{ padding: "8px 16px" }}><input type="number" style={{ ...inputStyle, width: 100 }} value={String(editForm.price ?? "")} onChange={(e) => setEditForm(f => ({ ...f, price: parseFloat(e.target.value) }))} /></td>
                        <td style={{ padding: "8px 16px" }}>
                          <select style={{ ...inputStyle, width: 100 }} value={editForm.active ? "active" : "hidden"} onChange={(e) => setEditForm(f => ({ ...f, active: e.target.value === "active" }))}>
                            <option value="active">Active</option>
                            <option value="hidden">Hidden</option>
                          </select>
                        </td>
                        <td style={{ padding: "8px 16px", whiteSpace: "nowrap" }}>
                          <button onClick={saveEdit} disabled={saving} style={{ marginRight: 8, padding: "6px 14px", borderRadius: 6, background: "#111", color: "#fff", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Save</button>
                          <button onClick={() => setEditingId(null)} style={{ padding: "6px 12px", borderRadius: 6, background: "#f3f4f6", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: "12px 16px", color: "#6b7280" }}>{p.category ?? "—"}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 700 }}>{p.currency} {p.price.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <button onClick={() => toggleActive(p)} style={{ padding: "4px 12px", borderRadius: 100, border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer", background: p.active ? "#d1fae5" : "#f3f4f6", color: p.active ? "#065f46" : "#6b7280" }}>
                            {p.active ? "Active" : "Hidden"}
                          </button>
                        </td>
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          <button onClick={() => startEdit(p)} style={{ marginRight: 8, padding: "6px 14px", borderRadius: 6, background: "#f3f4f6", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Edit</button>
                          <button onClick={() => deleteProduct(p.id)} style={{ padding: "6px 12px", borderRadius: 6, background: "#fee2e2", color: "#991b1b", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
