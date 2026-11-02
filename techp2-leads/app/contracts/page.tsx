"use client";
import { useEffect, useState } from "react";
import { supabase, Contract } from "@/lib/supabase";
import Link from "next/link";
import { Plus, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  Draft: "text-[#888] bg-[#1a1a1a]",
  Sent: "text-blue-400 bg-blue-900/30",
  Signed: "text-purple-400 bg-purple-900/30",
  Active: "text-green-400 bg-green-900/30",
  Expired: "text-red-400 bg-red-900/30",
  Terminated: "text-red-600 bg-red-900/20",
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<(Contract & { leads: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase
      .from("tp2_contracts")
      .select("*, leads(business_name,parish,category)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setContracts(data as any);
        setLoading(false);
      });
  }, []);

  const totalActive = contracts.filter(c => c.status === "Active").reduce((sum, c) => sum + (c.total_value || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-30 safe-top">
        <div className="px-4 py-3 flex items-center gap-3 max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="text-[#888]"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <p className="text-[#C9930C] text-[10px] font-semibold tracking-widest uppercase">Agri-H Leads</p>
            <h1 className="text-white font-bold">Contracts & Agreements</h1>
          </div>
          <Link href="/contracts/new" className="flex items-center gap-1 bg-[#C9930C] text-black text-sm font-bold px-3 py-1.5 rounded-lg">
            <Plus className="w-4 h-4" /> New
          </Link>
        </div>
      </header>

      {totalActive > 0 && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-[#0d1a0d] border border-[#1a3a1a] rounded-xl p-4">
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-1">Active Contract Value</p>
            <p className="text-white text-2xl font-bold">JMD {totalActive.toLocaleString()}</p>
            <p className="text-[#555] text-xs mt-0.5">{contracts.filter(c => c.status === "Active").length} active agreements</p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-2">
        {loading && <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#C9930C] border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && contracts.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
            <p className="text-[#555] text-sm">No contracts yet</p>
            <Link href="/contracts/new" className="text-[#C9930C] text-sm mt-2 inline-block">+ Create first contract</Link>
          </div>
        )}
        {contracts.map(c => (
          <Link key={c.id} href={`/contracts/${c.id}`}
            className="block bg-[#111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#C9930C]/40 transition-fast">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{c.title}</p>
                <p className="text-[#555] text-xs mt-0.5">{c.leads?.business_name} · {c.leads?.parish}</p>
                <p className="text-[#444] text-xs mt-0.5">{c.contract_type}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] || "text-[#888] bg-[#1a1a1a]"}`}>{c.status}</span>
                {c.total_value && (
                  <span className="text-[#C9930C] text-xs font-semibold">{c.currency} {c.total_value.toLocaleString()}</span>
                )}
              </div>
            </div>
            {(c.start_date || c.end_date) && (
              <p className="text-[#444] text-xs mt-2">{c.start_date} → {c.end_date || "Open"}</p>
            )}
          </Link>
        ))}
      </main>
    </div>
  );
}
