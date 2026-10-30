import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface CTClient {
  id: string;
  slug: string;
  name: string;
  category: string;
  logo_url: string | null;
  accent: string;
  accent_fg: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  headline: string | null;
  subline: string | null;
  currency: string;
  active: boolean;
  created_at: string;
}

export interface CTAppointment {
  id: string; client_id: string; customer_name: string;
  service: string | null; phone: string | null;
  scheduled_at: string | null; status: string;
  notes: string | null; created_at: string;
}

export interface CTOrder {
  id: string; client_id: string; customer_name: string;
  item: string | null; quantity: number; amount: number;
  status: string; notes: string | null; created_at: string;
}

export interface CTJob {
  id: string; client_id: string; customer_name: string;
  description: string | null; vehicle_device: string | null;
  amount: number; status: string; notes: string | null; created_at: string;
}

export interface CTLead {
  id: string; client_id: string; name: string;
  phone: string | null; email: string | null;
  source: string | null; status: string; created_at: string;
}

export async function getClient(slug: string): Promise<CTClient | null> {
  const { data, error } = await supabase
    .from("ct_clients").select("*").eq("slug", slug).eq("active", true).single();
  if (error || !data) return null;
  return data as CTClient;
}

export async function listClients(): Promise<CTClient[]> {
  const { data } = await supabase
    .from("ct_clients").select("*").order("created_at", { ascending: false });
  return (data ?? []) as CTClient[];
}

export async function createClientRecord(
  input: Omit<CTClient, "id" | "created_at">
): Promise<CTClient | null> {
  const { data, error } = await supabase
    .from("ct_clients").insert(input).select().single();
  if (error || !data) return null;
  return data as CTClient;
}

export async function updateClientRecord(
  id: string,
  input: Partial<Omit<CTClient, "id" | "created_at">>
): Promise<boolean> {
  const { error } = await supabase.from("ct_clients").update(input).eq("id", id);
  return !error;
}

export async function getClientAppointments(clientId: string, limit = 20): Promise<CTAppointment[]> {
  const { data } = await supabase.from("ct_appointments")
    .select("*").eq("client_id", clientId)
    .order("scheduled_at", { ascending: true }).limit(limit);
  return (data ?? []) as CTAppointment[];
}

export async function getClientOrders(clientId: string, limit = 20): Promise<CTOrder[]> {
  const { data } = await supabase.from("ct_orders")
    .select("*").eq("client_id", clientId)
    .order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as CTOrder[];
}

export async function getClientJobs(clientId: string, limit = 20): Promise<CTJob[]> {
  const { data } = await supabase.from("ct_jobs")
    .select("*").eq("client_id", clientId)
    .order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as CTJob[];
}

export async function getClientLeads(clientId: string, limit = 20): Promise<CTLead[]> {
  const { data } = await supabase.from("ct_leads")
    .select("*").eq("client_id", clientId)
    .order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as CTLead[];
}

export async function getClientStats(clientId: string, category: string) {
  const appointmentCats = ["beauty", "florist", "events"];
  const jobCats = ["automotive", "tech-repair"];

  if (appointmentCats.includes(category)) {
    const today = new Date(); today.setHours(0,0,0,0);
    const [todayR, totalR, leadsR] = await Promise.all([
      supabase.from("ct_appointments").select("id",{count:"exact",head:true}).eq("client_id",clientId).gte("scheduled_at",today.toISOString()),
      supabase.from("ct_appointments").select("id",{count:"exact",head:true}).eq("client_id",clientId),
      supabase.from("ct_leads").select("id",{count:"exact",head:true}).eq("client_id",clientId),
    ]);
    return [
      { label: "Today", value: String(todayR.count ?? 0) },
      { label: "Total Bookings", value: String(totalR.count ?? 0) },
      { label: "Leads", value: String(leadsR.count ?? 0) },
    ];
  }

  if (jobCats.includes(category)) {
    const [openR, doneR, leadsR] = await Promise.all([
      supabase.from("ct_jobs").select("id",{count:"exact",head:true}).eq("client_id",clientId).in("status",["open","in-progress"]),
      supabase.from("ct_jobs").select("amount").eq("client_id",clientId).eq("status","completed"),
      supabase.from("ct_leads").select("id",{count:"exact",head:true}).eq("client_id",clientId),
    ]);
    const rev = (doneR.data ?? []).reduce((s:number,j:{amount:number})=>s+j.amount,0);
    return [
      { label: "Active Jobs", value: String(openR.count ?? 0) },
      { label: "Revenue", value: `J$${rev.toLocaleString()}` },
      { label: "Leads", value: String(leadsR.count ?? 0) },
    ];
  }

  const [activeR, allR, leadsR] = await Promise.all([
    supabase.from("ct_orders").select("id",{count:"exact",head:true}).eq("client_id",clientId).in("status",["pending","processing"]),
    supabase.from("ct_orders").select("amount").eq("client_id",clientId),
    supabase.from("ct_leads").select("id",{count:"exact",head:true}).eq("client_id",clientId),
  ]);
  const rev = (allR.data ?? []).reduce((s:number,o:{amount:number})=>s+o.amount,0);
  return [
    { label: "Active Orders", value: String(activeR.count ?? 0) },
    { label: "Revenue", value: `J$${rev.toLocaleString()}` },
    { label: "Leads", value: String(leadsR.count ?? 0) },
  ];
}