"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";

type Doc = { name: string; type: string; size: string; date: string; patient: string | null; signed: boolean | null };
const allDocs: Doc[] = [];

const typeStyle: Record<string, string> = {
  Consent: "bg-gold/10 text-gold-deep",
  Medical: "bg-teal/10 text-teal",
  Billing: "bg-ink-3/10 text-ink-3",
  Policy:  "bg-surface text-slate border border-line",
  HIPAA:   "bg-alert/10 text-alert",
};

export default function DocumentsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [docList, setDocList] = useState(allDocs);
  const [viewDoc, setViewDoc] = useState<Doc | null>(null);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function sendSignatureRequest(docName: string) {
    setDocList(prev => prev.map(d => d.name === docName ? { ...d, signed: true } : d));
    flash(`Signature request sent — ${docName} marked as signed.`);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc: Doc = { name: file.name, type: "Medical", size: `${(file.size / 1024).toFixed(0)} KB`, date: "Today", patient: null, signed: null };
    setDocList(prev => [newDoc, ...prev]);
    flash(`"${file.name}" uploaded successfully.`);
    e.target.value = "";
  }

  function downloadDoc(d: Doc) {
    const content = `Crown Dental OS — Document Export\n\nDocument: ${d.name}\nType: ${d.type}\nDate: ${d.date}\nSize: ${d.size}\nStatus: ${d.signed === null ? "N/A" : d.signed ? "Signed" : "Unsigned"}\n\nThis document is stored securely in Crown Dental OS.\nExported on: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${d.name.replace(/[^a-z0-9]/gi, "_")}.txt`; a.click();
    URL.revokeObjectURL(url);
    flash(`Downloading "${d.name}"…`);
  }

  const docs = query.trim()
    ? docList.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.type.toLowerCase().includes(query.toLowerCase()))
    : docList;

  function Avatar({ p }: { p: string | null }) {
    return p
      ? <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold text-[10px] font-bold text-white">{p}</div>
      : <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface border border-line"><Icons.Building2 className="h-3.5 w-3.5 text-mist" /></div>;
  }

  return (
    <div className="p-6 space-y-5">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />

      {/* View Document Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setViewDoc(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.FileText className="h-4 w-4 text-gold-deep" />
                <span className="font-semibold text-ink truncate">{viewDoc.name}</span>
              </div>
              <button onClick={() => setViewDoc(null)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-mist mb-1">Type</p><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${typeStyle[viewDoc.type]}`}>{viewDoc.type}</span></div>
                <div><p className="text-xs text-mist mb-1">Date</p><p className="font-medium text-ink">{viewDoc.date}</p></div>
                <div><p className="text-xs text-mist mb-1">Size</p><p className="font-medium text-ink">{viewDoc.size}</p></div>
                <div><p className="text-xs text-mist mb-1">Status</p><p className={`font-medium ${viewDoc.signed ? "text-teal" : viewDoc.signed === false ? "text-gold-deep" : "text-slate"}`}>{viewDoc.signed === null ? "N/A" : viewDoc.signed ? "Signed" : "Awaiting signature"}</p></div>
              </div>
              <div className="rounded-xl bg-surface border border-line p-4 min-h-[120px] flex items-center justify-center">
                <p className="text-sm text-slate text-center">Document preview — secure PDF viewer would render here in production.</p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setViewDoc(null)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Close</button>
              <button onClick={() => { downloadDoc(viewDoc); setViewDoc(null); }} className="flex-1 gold-btn rounded-xl py-2.5 text-sm">Download</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Documents</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate hover:bg-surface transition-colors">
            <Icons.Upload className="h-4 w-4" /> Upload
          </button>
          <button onClick={() => router.push("/platform/forms")} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.FilePlus className="h-4 w-4" /> New form
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Total documents",    v: "312",  i: "Files" },
          { l: "Awaiting signature", v: "4",    i: "PenLine" },
          { l: "Practice policies",  v: "9",    i: "BookOpen" },
          { l: "HIPAA compliant",    v: "100%", i: "ShieldCheck" },
        ].map((s) => {
          const I = (Icons as any)[s.i] ?? Icons.Circle;
          return (
            <div key={s.l} className="card bg-white rounded-xl p-4 shadow-card flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface"><I className="h-5 w-5 text-gold-deep" /></div>
              <div><p className="text-xs text-slate">{s.l}</p><p className="text-xl font-semibold text-ink">{s.v}</p></div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
          <Icons.Search className="h-4 w-4 text-mist shrink-0" />
          <input
            type="text"
            placeholder="Search documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-mist outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-mist hover:text-ink">
              <Icons.X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {["","Document","Type","Size","Date","Signed",""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {docs.map((d) => (
              <tr key={d.name} className="hover:bg-surface transition-colors">
                <td className="px-5 py-3"><Avatar p={d.patient} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Icons.FileText className="h-4 w-4 text-slate" />
                    <span className="font-medium text-ink">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${typeStyle[d.type]}`}>{d.type}</span>
                </td>
                <td className="px-5 py-3 text-mist">{d.size}</td>
                <td className="px-5 py-3 text-slate">{d.date}</td>
                <td className="px-5 py-3">
                  {d.signed === null ? <span className="text-mist text-xs">—</span>
                    : d.signed ? <span className="flex items-center gap-1 text-xs font-semibold text-teal"><Icons.CheckCircle2 className="h-3.5 w-3.5" />Signed</span>
                    : <button onClick={() => sendSignatureRequest(d.name)} className="gold-btn rounded-lg px-2.5 py-1 text-xs">Send</button>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setViewDoc(d)} className="rounded-lg border border-line p-1.5 text-slate hover:border-gold/40 hover:text-ink transition-colors" title="View"><Icons.Eye className="h-3.5 w-3.5" /></button>
                    <button onClick={() => downloadDoc(d)} className="rounded-lg border border-line p-1.5 text-slate hover:border-gold/40 hover:text-ink transition-colors" title="Download"><Icons.Download className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {docs.length === 0 && docList.length > 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-mist">No documents match &ldquo;{query}&rdquo;</td></tr>
            )}
            {docList.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
                    <Icons.Files className="h-5 w-5 text-mist" />
                  </div>
                  <p className="font-semibold text-ink">No documents yet</p>
                  <p className="mt-1 text-xs text-slate">Upload a file or connect your PMS to import patient documents.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
