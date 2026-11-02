"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, FollowUp } from "@/lib/supabase";
import Link from "next/link";
import { CheckCircle, Calendar, Phone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FollowUpsPage() {
  const [items, setItems] = useState<(FollowUp & { leads: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today" | "overdue" | "upcoming">("today");
  const router = useRouter();

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("follow_ups")
      .select("*, leads(business_name,phone,parish,category)")
      .eq("completed", false)
      .order("due_date");
    if (data) setItems(data as any);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().split("T")[0];
  const weekOut = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const filtered = items.filter(f => {
    if (filter === "overdue") return f.due_date < today;
    if (filter === "today") return f.due_date === today;
    if (filter === "upcoming") return f.due_date > today && f.due_date <= weekOut;
    return true;
  });

  const complete = async (id: string) => {
    await supabase.from("follow_ups").update({ completed: true, completed_at: new Date().toISOString() }).eq("id", id);
    load();
  };

  const counts = {
    overdue: items.filter(f => f.due_date < today).length,
    today: items.filter(f => f.due_date === today).length,
    upcoming: items.filter(f => f.due_date > today && f.due_date <= weekOut).length,
    all: items.length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-30 safe-top">
        <div className="px-4 py-3 flex items-center gap-3 max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="text-[#888]"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <p className="text-[#C9930C] text-[10px] font-semibold tracking-widest uppercase">TechP2</p>
            <h1 className="text-white font-bold">Follow-ups</h1>
          </div>
        </div>
        <div className="flex px-4 pb-3 gap-2 overflow-x-auto max-w-6xl mx-auto">
          {(["overdue","today","upcoming","all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-fast flex items-center gap-1 ${filter === f ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {counts[f] > 0 && <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${filter === f ? "bg-black/30 text-black" : f === "overdue" ? "bg-red-500 text-white" : "bg-[#333] text-[#888]"}`}>{counts[f]}</span>}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-2">
        {loading && <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#C9930C] border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
            <p className="text-[#555] text-sm">No follow-ups {filter === "today" ? "due today" : filter}</p>
          </div>
        )}
        {filtered.map(fu => {
          const isOverdue = fu.due_date < today;
          const lead = fu.leads;
          return (
            <div key={fu.id} className={`border rounded-xl p-4 ${isOverdue ? "bg-red-950/10 border-red-900/40" : "bg-[#111] border-[#2a2a2a]"}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => complete(fu.id)} className={`mt-0.5 flex-shrink-0 ${isOverdue ? "text-red-400 hover:text-red-300" : "text-[#444] hover:text-green-400"} transition-fast`}>
                  <CheckCircle className="w-5 h-5" />
                </button>
                <Link href={`/leads/${fu.lead_id}`} className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white font-semibold text-sm">{lead?.business_name}</p>
                    <span className={`text-xs font-semibold flex-shrink-0 ${isOverdue ? "text-red-400" : "text-[#C9930C]"}`}>
                      {isOverdue ? "OVERDUE" : fu.due_date === today ? "Today" : fu.due_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[#555] text-xs">{fu.task_type}</span>
                    {lead?.parish && <span className="text-[#444] text-xs">· {lead.parish}</span>}
                    {fu.priority === "High" && <span className="text-[10px] text-[#C9930C] font-semibold">● HIGH</span>}
                  </div>
                  {fu.description && <p className="text-[#888] text-xs mt-1">{fu.description}</p>}
                  {lead?.phone && (
                    <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-[#C9930C] text-xs mt-2 w-fit">
                      <Phone className="w-3 h-3" />{lead.phone}
                    </a>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
