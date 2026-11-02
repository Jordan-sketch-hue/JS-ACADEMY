"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, Lead } from "@/lib/supabase";
import Link from "next/link";
import { Search, Plus, Filter, Phone, MapPin, Wheat, Hammer, ChevronRight } from "lucide-react";

const PARISHES = ["All", "St. Ann", "Portland", "St. Mary", "St. Thomas"];
const STATUSES = ["All","New","Contacted","Interested","Proposal Sent","Negotiating","Converted","Not Interested","Follow Up","Cold"];
const CATS = ["All", "Agriculture", "Hardware", "Both"];

const STATUS_COLORS: Record<string, string> = {
  New: "badge-new", Contacted: "badge-contacted", Interested: "badge-interested",
  "Proposal Sent": "badge-proposal", Negotiating: "badge-negotiating",
  Converted: "badge-converted", "Not Interested": "badge-notinterested",
  "Follow Up": "badge-followup", Cold: "badge-cold",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [parish, setParish] = useState("All");
  const [status, setStatus] = useState("All");
  const [cat, setCat] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("tp2_leads")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });
    if (data) { setLeads(data); setFiltered(data); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let f = leads;
    if (search) f = f.filter(l =>
      l.business_name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      l.community?.toLowerCase().includes(search.toLowerCase())
    );
    if (parish !== "All") f = f.filter(l => l.parish === parish);
    if (status !== "All") f = f.filter(l => l.status === status);
    if (cat !== "All") f = f.filter(l => l.category === cat);
    setFiltered(f);
  }, [search, parish, status, cat, leads]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9930C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-30 safe-top">
        <div className="px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <p className="text-[#C9930C] text-[10px] font-semibold tracking-widest uppercase">Agri-H Leads</p>
            <h1 className="text-white font-bold">All Leads <span className="text-[#C9930C]">{filtered.length}</span></h1>
          </div>
          <Link href="/leads/new" className="flex items-center gap-1 bg-[#C9930C] text-black text-sm font-bold px-3 py-1.5 rounded-lg">
            <Plus className="w-4 h-4" /> Add
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 pb-3 max-w-6xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search business, phone, community..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#C9930C]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-fast ${showFilters ? "bg-[#C9930C] border-[#C9930C] text-black" : "bg-[#1a1a1a] border-[#2a2a2a] text-[#888]"}`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Filter row */}
          {showFilters && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {PARISHES.map(p => (
                  <button key={p} onClick={() => setParish(p)}
                    className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-fast ${parish === p ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {CATS.map(c => (
                  <button key={c} onClick={() => setCat(c)}
                    className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-fast ${cat === c ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                    {c === "Agriculture" ? "🌾 " : c === "Hardware" ? "🔨 " : ""}{c}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {STATUSES.slice(0, 6).map(s => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-fast ${status === s ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Lead list */}
      <main className="max-w-6xl mx-auto px-4 py-3 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#555] text-sm">No leads match your filters</p>
            <Link href="/leads/new" className="text-[#C9930C] text-sm mt-2 inline-block">+ Add first lead</Link>
          </div>
        )}
        {filtered.map(lead => (
          <Link
            key={lead.id}
            href={`/leads/${lead.id}`}
            className="block bg-[#111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#C9930C]/40 transition-fast"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {lead.category === "Agriculture"
                    ? <Wheat className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    : lead.category === "Hardware"
                    ? <Hammer className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    : <span className="text-[10px]">🌾🔨</span>
                  }
                  <span className="text-white font-semibold text-sm truncate">{lead.business_name}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status] || ""}`}>
                    {lead.status}
                  </span>
                  {lead.parish && (
                    <span className="text-[#555] text-xs flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />{lead.community || lead.parish}
                    </span>
                  )}
                  {lead.priority === "High" && (
                    <span className="text-[10px] text-[#C9930C] font-semibold">● HIGH</span>
                  )}
                </div>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-[#C9930C] text-xs mt-2 w-fit"
                  >
                    <Phone className="w-3 h-3" />{lead.phone}
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <ChevronRight className="w-4 h-4 text-[#444]" />
                {lead.follow_up_required && (
                  <span className="text-[9px] bg-amber-900/40 text-amber-400 px-1.5 py-0.5 rounded font-semibold">FOLLOW UP</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
