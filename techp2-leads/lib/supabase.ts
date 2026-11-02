import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// Types
export type Parish = "St. Ann" | "Portland" | "St. Mary" | "St. Thomas" | "Other";
export type LeadStatus =
  | "New" | "Contacted" | "Interested" | "Proposal Sent"
  | "Negotiating" | "Converted" | "Not Interested" | "Follow Up" | "Cold";
export type LeadCategory = "Agriculture" | "Hardware" | "Both";

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  business_name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  parish?: Parish;
  community?: string;
  category: LeadCategory;
  business_type?: string;
  size?: "Small" | "Medium" | "Large";
  annual_spend_estimate?: string;
  status: LeadStatus;
  priority?: "High" | "Medium" | "Low";
  source?: string;
  preferred_contact?: string;
  best_time?: string;
  credit_terms?: string;
  payment_method?: string;
  price_agreement?: string;
  products_needed?: string[];
  volume_notes?: string;
  current_supplier?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  has_contract?: boolean;
  is_converted?: boolean;
  ai_summary?: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  created_at: string;
  note_type: string;
  content: string;
  created_by: string;
}

export interface CallLog {
  id: string;
  lead_id: string;
  created_at: string;
  duration_mins?: number;
  outcome?: string;
  summary?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  created_at: string;
  due_date: string;
  task_type?: string;
  description?: string;
  completed: boolean;
  completed_at?: string;
  priority?: string;
}

export interface Contract {
  id: string;
  lead_id: string;
  created_at: string;
  contract_type?: string;
  title: string;
  status: string;
  start_date?: string;
  end_date?: string;
  total_value?: number;
  currency?: string;
  payment_terms?: string;
  delivery_terms?: string;
  products?: string[];
  notes?: string;
  document_url?: string;
}

export interface Delivery {
  id: string;
  lead_id: string;
  contract_id?: string;
  created_at: string;
  delivery_date?: string;
  status: string;
  items?: string;
  value?: number;
  currency?: string;
  notes?: string;
  proof_url?: string;
}
