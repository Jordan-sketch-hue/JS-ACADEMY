"use client";
import { useEffect, useState } from "react";
import { supabase, Contract } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, FileText, Edit3, Check, X, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  Draft: "text-[#888] bg-[#1a1a1a] border border-[#2a2a2a]",
  Sent: "text-blue-400 bg-blue-900/30 border border-blue-800/40",
  Signed: "text-purple-400 bg-purple-900/30 border border-purple-800/40",
  Active: "text-green-400 bg-green-900/30 border border-green-800/40",
  Expired: "text-red-400 bg-red-900/30 border border-red-800/40",
  Terminated: "text-red-600 bg-red-900/20 border border-red-900/30",
};

const STATUSES = ["Draft", "Sent", "Signed", "Active", "Expired", "Terminated"];

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract & { leads: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editStatus, setEditStatus] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("tp2_contracts")
      .select("*, leads(business_name,phone,parish,category,contact_name,community)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setContract(data as any);
        setLoading(false);
      });
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!contract) return;
    setSaving(true);
    await supabase.from("tp2_contracts").update({ status: newStatus }).eq("id", id);
    setContract({ ...contract, status: newStatus });
    setEditStatus(false);
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9930C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!contract) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <FileText className="w-12 h-12 text-[#2a2a2a]" />
      <p className="text-[#555]">Contract not found</p>
      <Link href="/contracts" className="text-[#C9930C] text-sm">← Back to Contracts</Link>
    </div>
  );

  const lead = contract.leads;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-30 safe-top">
        <div className="px-4 py-3 flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="text-[#888]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[#C9930C] text-[10px] font-semibold tracking-widest uppercase">Contract</p>
            <h1 className="text-white font-bold text-sm truncate">{contract.title}</h1>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[contract.status] || STATUS_COLORS.Draft}`}>
            {contract.status}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Lead Info */}
        {lead && (
          <Link href={`/leads/${contract.lead_id}`}
            className="block bg-[#111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#C9930C]/40 transition-fast">
            <p className="text-[#888] text-[10px] uppercase tracking-widest mb-1">Client</p>
            <p className="text-white font-semibold">{lead.business_name}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-[#555] text-xs">
              {lead.contact_name && <span>👤 {lead.contact_name}</span>}
              {lead.parish && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{lead.community ? `${lead.community}, ` : ""}{lead.parish}
                </span>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 text-[#C9930C] hover:underline">
                  <Phone className="w-3 h-3" />{lead.phone}
                </a>
              )}
            </div>
          </Link>
        )}

        {/* Contract Details */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
          <p className="text-[#888] text-[10px] uppercase tracking-widest">Contract Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[#555] text-xs mb-0.5">Type</p>
              <p className="text-white text-sm">{contract.contract_type || "—"}</p>
            </div>
            <div>
              <p className="text-[#555] text-xs mb-0.5">Currency</p>
              <p className="text-white text-sm">{contract.currency || "JMD"}</p>
            </div>
            {contract.total_value && (
              <div>
                <p className="text-[#555] text-xs mb-0.5">Total Value</p>
                <p className="text-[#C9930C] text-sm font-semibold">
                  {contract.currency || "JMD"} {contract.total_value.toLocaleString()}
                </p>
              </div>
            )}
            {contract.payment_terms && (
              <div>
                <p className="text-[#555] text-xs mb-0.5">Payment Terms</p>
                <p className="text-white text-sm">{contract.payment_terms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        {(contract.start_date || contract.end_date) && (
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Duration</p>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-[#555]" />
              <span className="text-white">{contract.start_date || "—"}</span>
              <span className="text-[#555]">→</span>
              <span className="text-white">{contract.end_date || "Open-ended"}</span>
            </div>
          </div>
        )}

        {/* Products */}
        {contract.products && contract.products.length > 0 && (
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-[#888] text-[10px] uppercase tracking-widest mb-2">Products Covered</p>
            <div className="flex flex-wrap gap-2">
              {contract.products.map((p: string) => (
                <span key={p} className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] px-2 py-0.5 rounded-full">{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Terms + Notes */}
        {(contract.delivery_terms || contract.notes) && (
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
            {contract.delivery_terms && (
              <div>
                <p className="text-[#555] text-xs mb-1">Delivery Terms</p>
                <p className="text-white text-sm">{contract.delivery_terms}</p>
              </div>
            )}
            {contract.notes && (
              <div>
                <p className="text-[#555] text-xs mb-1">Notes</p>
                <p className="text-[#aaa] text-sm leading-relaxed">{contract.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Status Update */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#888] text-[10px] uppercase tracking-widest">Update Status</p>
            {editStatus && (
              <button onClick={() => setEditStatus(false)} className="text-[#555] hover:text-[#888]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {editStatus ? (
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(s => (
                <button key={s} onClick={() => updateStatus(s)} disabled={saving}
                  className={`text-sm py-2 px-3 rounded-lg border transition-fast text-left ${
                    contract.status === s
                      ? "border-[#C9930C] text-[#C9930C] bg-[#1a0f00]"
                      : "border-[#2a2a2a] text-[#888] hover:border-[#444]"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <button onClick={() => setEditStatus(true)}
              className="flex items-center gap-2 text-sm text-[#C9930C] hover:text-[#e0a010]">
              <Edit3 className="w-4 h-4" />
              Change status from &quot;{contract.status}&quot;
            </button>
          )}
        </div>

        {/* Document link */}
        {contract.document_url && (
          <a href={contract.document_url} target="_blank" rel="noopener noreferrer"
            className="block bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3 hover:border-[#C9930C]/40">
            <FileText className="w-5 h-5 text-[#C9930C]" />
            <span className="text-white text-sm">View Contract Document</span>
          </a>
        )}
      </main>
    </div>
  );
}
