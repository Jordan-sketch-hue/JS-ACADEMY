"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Paperclip, FileCheck2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_INVOICE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";

/** Strip a filename down to a storage-safe slug while keeping its extension. */
function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "invoice";
  return ext ? `${base}.${ext}` : base;
}

export function PreAlertButton({ userId }: { userId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    description: "", merchant: "", tracking_number: "", mode: "Air Freight", weight_lbs: "", declared_value_usd: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function reset() {
    setForm({ description: "", merchant: "", tracking_number: "", mode: "Air Freight", weight_lbs: "", declared_value_usd: "" });
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_INVOICE_BYTES) {
      setError("Invoice file is too large — keep it under 10 MB.");
      if (fileRef.current) fileRef.current.value = "";
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();

    // 1. Create the package (return its id so the invoice path can reference it).
    const { data: pkg, error } = await supabase.from("st_packages").insert({
      user_id: userId,
      description: form.description.trim(),
      merchant: form.merchant.trim() || null,
      tracking_number: form.tracking_number.trim() || null,
      mode: form.mode,
      weight_lbs: form.weight_lbs ? Number(form.weight_lbs) : null,
      declared_value_usd: form.declared_value_usd ? Number(form.declared_value_usd) : null,
      status: "pre_alert",
      pre_alert: true,
    }).select("id").single();
    if (error || !pkg) { setBusy(false); setError(error?.message ?? "Could not create the pre-alert."); return; }

    // 2. Optionally upload the commercial invoice into the customer's own folder.
    if (file) {
      const path = `${userId}/${pkg.id}/${safeName(file.name)}`;
      const up = await supabase.storage.from("st-invoices").upload(path, file, { upsert: true, contentType: file.type || undefined });
      if (up.error) {
        // The package is already created; surface the upload problem but don't lose it.
        setBusy(false);
        setError(`Package saved, but the invoice didn't upload: ${up.error.message}. You can re-open and try again.`);
        await supabase.from("st_packages").update({ updated_at: new Date().toISOString() }).eq("id", pkg.id);
        router.refresh();
        return;
      }
      await supabase.from("st_packages").update({ invoice_url: path }).eq("id", pkg.id);
    }

    setBusy(false);
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <>
      <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setOpen(true)}>
        <Plus size={15} /> Pre-alert a package
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div onClick={() => !busy && setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(4,52,10,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="card-2" style={{ padding: 24, maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>Pre-alert a package</h2>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-3)" }}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit}>
              <div style={{ display: "grid", gap: 14 }}>
                <div><label className="label">Description</label><input className="input" required value={form.description} onChange={set("description")} placeholder="e.g. Laptop & accessories" /></div>
                <div className="split-2-even" style={{ gap: 12 }}>
                  <div><label className="label">Merchant / store</label><input className="input" value={form.merchant} onChange={set("merchant")} placeholder="e.g. Amazon" /></div>
                  <div><label className="label">Tracking #</label><input className="input" value={form.tracking_number} onChange={set("tracking_number")} placeholder="Carrier tracking" /></div>
                </div>
                <div className="split-2-even" style={{ gap: 12 }}>
                  <div><label className="label">Mode</label>
                    <select className="input" value={form.mode} onChange={set("mode")}>
                      <option>Air Freight</option><option>Sea Freight</option><option>Barrel</option><option>Assisted Shopping</option><option>Business Cargo</option>
                    </select>
                  </div>
                  <div><label className="label">Est. weight (lb)</label><input className="input" type="number" min="0" step="0.1" value={form.weight_lbs} onChange={set("weight_lbs")} placeholder="0" /></div>
                </div>
                <div><label className="label">Declared value (USD)</label><input className="input" type="number" min="0" step="0.01" value={form.declared_value_usd} onChange={set("declared_value_usd")} placeholder="0" /></div>

                {/* Commercial invoice upload — required by customs before clearance. */}
                <div>
                  <label className="label">Commercial invoice / receipt <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>— optional, speeds up customs (PDF or image, max 10 MB)</span></label>
                  <input ref={fileRef} type="file" accept={ACCEPT} onChange={pickFile} style={{ display: "none" }} id="invoice-file" />
                  <label htmlFor="invoice-file" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", padding: 11, cursor: "pointer", color: file ? "var(--brand-deep)" : undefined }}>
                    {file ? <><FileCheck2 size={16} /> {file.name}</> : <><Paperclip size={16} /> Attach invoice</>}
                  </label>
                </div>

                {error && <div style={{ fontSize: 13, color: "var(--danger)", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: 10, padding: "10px 12px" }}>{error}</div>}
                <label style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--fg-2)" }}>
                  <input type="checkbox" required /> I confirm this package contains no prohibited items.
                </label>
              </div>
              <button type="submit" disabled={busy} className="btn btn-primary" style={{ marginTop: 18, width: "100%", padding: 12 }}>
                {busy ? <Loader2 size={16} className="spin" /> : "Submit pre-alert"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
