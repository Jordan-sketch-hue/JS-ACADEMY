import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || !anon) {
  // Soft-fail in demo mode — app continues with mock data
  console.warn("[Crown] Supabase env vars not set — running in demo mode.");
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// ─── typed helpers ──────────────────────────────────────────────────────────
export type Tables = {
  clinics:             { id: string; name: string; region: string; chairs: number; timezone: string };
  patients:            { id: string; clinic_id: string; mrn: string; first_name: string; last_name: string; risk: string; balance: number; ltv: number; tags: string[] };
  appointments:        { id: string; clinic_id: string; patient_id: string; provider_id: string; chair: string; procedure: string; starts_at: string; duration_min: number; status: string; value: number; channel: string };
  invoices:            { id: string; clinic_id: string; patient_id: string; invoice_number: string; total_amount: number; patient_portion: number; insurance_portion: number; status: string; service_date: string };
  treatment_plans:     { id: string; clinic_id: string; patient_id: string; title: string; status: string; total_fee: number };
  lab_cases:           { id: string; clinic_id: string; patient_id: string; lab_name: string; item_type: string; status: string; ordered_at: string; due_at: string };
  communications:      { id: string; clinic_id: string; patient_id: string; channel: string; direction: string; body: string; sent_at: string; thread_id: string };
  ai_actions:          { id: string; clinic_id: string; action_type: string; title: string; detail: string; created_at: string };
};
