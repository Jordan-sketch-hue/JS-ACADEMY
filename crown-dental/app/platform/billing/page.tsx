"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { supabase } from "@/lib/supabase";

const LS_KEY = "crown_invoices";

type Invoice = {
  id: string;
  patient: string;
  proc: string;
  amount: string;
  ins: string;
  pt: string;
  date: string;
  status: string;
};

const statusStyle: Record<string, string> = {
  Paid:    "bg-teal/10 text-teal",
  Pending: "bg-gold/15 text-gold-deep",
  Overdue: "bg-alert/10 text-alert",
};

const STATUS_CYCLE: Record<string, string> = {
  Pending: "Paid",
  Overdue: "Paid",
  Paid:    "Pending",
};

function loadFromStorage(): Invoice[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(list: Invoice[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* quota */ }
}

export default function BillingPage() {
  const [reminded, setReminded]   = useState(false);
  const [exported, setExported]   = useState(false);
  const [toast, setToast]         = useState<string | null>(null);
  const [invoiceList, setInvoices] = useState<Invoice[]>([]);
  const [showNew, setShowNew]     = useState(false);
  const [inv, setInv] = useState({
    patient: "", procedure: "", amount: "", insurance: "", patient_portion: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // ── Load persisted invoices on mount ─────────────────────────
  useEffect(() => {
    let local = loadFromStorage();

    // Also try Supabase (non-blocking)
    supabase
      .from("invoices")
      .select("*")
      .order("service_date", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped: Invoice[] = data.map((r) => ({
            id:      r.invoice_number ?? r.id,
            patient: r.patient_id ?? "—",
            proc:    r.procedure ?? "—",
            amount:  `$${(r.total_amount ?? 0).toLocaleString()}`,
            ins:     `$${(r.insurance_portion ?? 0).toLocaleString()}`,
            pt:      `$${(r.patient_portion ?? 0).toLocaleString()}`,
            date:    r.service_date
              ? new Date(r.service_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "—",
            status: r.status ?? "Pending",
          }));
          setInvoices(mapped);
          saveToStorage(mapped);
        } else if (local.length > 0) {
          setInvoices(local);
        }
      })
      .catch(() => {
        // Demo mode — fall back to localStorage
        if (local.length > 0) setInvoices(local);
      });
  }, []);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function persistUpdate(next: Invoice[]) {
    setInvoices(next);
    saveToStorage(next);
  }

  // ── Toggle invoice status (Pending/Overdue → Paid, Paid → Pending) ──
  function toggleStatus(id: string) {
    const target = invoiceList.find((i) => i.id === id);
    if (!target) return;
    const newStatus = STATUS_CYCLE[target.status] ?? "Pending";
    const next = invoiceList.map((i) => i.id === id ? { ...i, status: newStatus } : i);
    persistUpdate(next);
    flash(`${id} marked as ${newStatus}.`);

    // Persist to Supabase if connected
    supabase
      .from("invoices")
      .update({ status: newStatus })
      .or(`invoice_number.eq.${id},id.eq.${id}`)
      .then(({ error }) => {
        if (error) console.warn("[Crown] Supabase status update failed:", error.message);
      });
  }

  function addInvoice() {
    if (!inv.patient || !inv.procedure || !inv.amount) return;
    const id = `INV-${2063 + invoiceList.length}`;
    const newInvoice: Invoice = {
      id,
      patient: inv.patient,
      proc: inv.procedure,
      amount: `$${inv.amount}`,
      ins: `$${inv.insurance || "0"}`,
      pt: `$${inv.patient_portion || inv.amount}`,
      date: new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "Pending",
    };
    const next = [newInvoice, ...invoiceList];
    persistUpdate(next);
    setInv({ patient: "", procedure: "", amount: "", insurance: "", patient_portion: "", date: new Date().toISOString().slice(0, 10) });
    setShowNew(false);
    flash(`Invoice ${id} created for ${inv.patient}.`);
  }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Billing & Invoices</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const rows = [
                "Invoice ID,Patient,Procedure,Amount,Insurance,Patient Portion,Date,Status",
                ...invoiceList.map((i) => `${i.id},${i.patient},"${i.proc}",${i.amount},${i.ins},${i.pt},${i.date},${i.status}`),
              ];
              const blob = new Blob([rows.join("\n")], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "crown-billing.csv"; a.click();
              URL.revokeObjectURL(url);
              flash("Billing export downloaded.");
            }}
            className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate hover:bg-surface transition-colors"
          >
            <Icons.Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.Plus className="h-4 w-4" /> New invoice
          </button>
        </div>
      </div>

      {showNew && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowNew(false)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.FileText className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">New Invoice</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink">
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">
                  Patient <span className="text-alert">*</span>
                </label>
                <input
                  type="text"
                  value={inv.patient}
                  onChange={(e) => setInv((f) => ({ ...f, patient: e.target.value }))}
                  placeholder="e.g. Patient #1041"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">
                  Procedure <span className="text-alert">*</span>
                </label>
                <input
                  type="text"
                  value={inv.procedure}
                  onChange={(e) => setInv((f) => ({ ...f, procedure: e.target.value }))}
                  placeholder="e.g. Crown seat #14, Hygiene..."
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">
                    Total ($) <span className="text-alert">*</span>
                  </label>
                  <input
                    type="number"
                    value={inv.amount}
                    onChange={(e) => setInv((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Insurance ($)</label>
                  <input
                    type="number"
                    value={inv.insurance}
                    onChange={(e) => setInv((f) => ({ ...f, insurance: e.target.value }))}
                    placeholder="0"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Patient ($)</label>
                  <input
                    type="number"
                    value={inv.patient_portion}
                    onChange={(e) => setInv((f) => ({ ...f, patient_portion: e.target.value }))}
                    placeholder="0"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Service date</label>
                <input
                  type="date"
                  value={inv.date}
                  onChange={(e) => setInv((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">
                Cancel
              </button>
              <button
                onClick={addInvoice}
                disabled={!inv.patient || !inv.procedure || !inv.amount}
                className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Revenue MTD",     v: "$84,200", i: "DollarSign",  delta: "+12%" },
          { l: "Insurance A/R",   v: "$28,400", i: "FileText",    delta: null   },
          { l: "Patient A/R",     v: "$6,700",  i: "Users",       delta: null   },
          { l: "Collection rate", v: "94.2%",   i: "TrendingUp",  delta: "+1.8%" },
        ].map((s) => {
          const I = (Icons as any)[s.i] ?? Icons.Circle;
          return (
            <div key={s.l} className="card bg-white rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface">
                  <I className="h-4 w-4 text-gold-deep" />
                </div>
                {s.delta && (
                  <span className="ml-auto rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-semibold text-teal">{s.delta}</span>
                )}
              </div>
              <p className="text-xs text-slate">{s.l}</p>
              <p className="text-xl font-semibold text-ink">{s.v}</p>
            </div>
          );
        })}
      </div>

      {invoiceList.filter((i) => i.status === "Overdue").length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-alert/30 bg-alert/5 p-4">
          <Icons.AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-alert" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">
              {invoiceList.filter((i) => i.status === "Overdue").length} overdue invoice(s)
            </p>
            <p className="text-xs text-slate mt-0.5">Crown AI can send automated payment reminders for overdue balances.</p>
          </div>
          <button
            onClick={() => setReminded(true)}
            disabled={reminded}
            className="shrink-0 gold-btn rounded-lg px-3 py-1.5 text-xs disabled:opacity-60"
          >
            {reminded ? "Sent" : "Send reminder"}
          </button>
        </div>
      )}

      <div className="card overflow-hidden bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {["Invoice", "Patient", "Procedure", "Total", "Insurance", "Patient", "Date", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoiceList.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                      <Icons.FileText className="h-7 w-7 text-mist" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-ink">No invoices yet</p>
                    <p className="mt-1 text-sm text-slate">Data will appear here once connected to your practice system.</p>
                  </div>
                </td>
              </tr>
            ) : (
              invoiceList.map((item) => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-mist">{item.id}</td>
                  <td className="px-5 py-3 font-medium text-ink">{item.patient}</td>
                  <td className="px-5 py-3 text-slate">{item.proc}</td>
                  <td className="px-5 py-3 font-semibold text-ink">{item.amount}</td>
                  <td className="px-5 py-3 text-slate">{item.ins}</td>
                  <td className="px-5 py-3 text-slate">{item.pt}</td>
                  <td className="px-5 py-3 text-mist">{item.date}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[item.status] ?? "bg-ink/8 text-ink"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                          item.status === "Paid"
                            ? "border-line text-slate hover:bg-surface"
                            : "border-teal/40 bg-teal/5 text-teal hover:bg-teal/10"
                        }`}
                        title={item.status === "Paid" ? "Mark as Pending" : "Mark as Paid"}
                      >
                        {item.status === "Paid" ? "Revert" : "Mark Paid"}
                      </button>
                      <Link
                        href={`/platform/patients/search`}
                        className="rounded-lg border border-line px-3 py-1 text-xs text-ink hover:bg-surface hover:border-gold/40 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Crown Care+ */}
      <div className="card bg-white p-5 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10">
            <Icons.Star className="h-5 w-5 text-gold-deep" />
          </div>
          <div>
            <p className="font-semibold text-ink">Crown Care+ In-House Plan</p>
            <p className="text-xs text-slate">Replace third-party insurance with your own membership program</p>
          </div>
          <span className="ml-auto rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">Active</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { l: "Members", v: "48" },
            { l: "MRR",     v: "$3,840" },
            { l: "Avg LTV", v: "$2,200" },
          ].map((m) => (
            <div key={m.l} className="rounded-xl bg-surface p-3">
              <p className="text-xs text-slate">{m.l}</p>
              <p className="text-lg font-semibold text-ink">{m.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
