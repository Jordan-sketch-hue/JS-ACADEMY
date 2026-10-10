import type { LeadStage } from "@/lib/data/seed";

export interface LeadCard {
  id: string;
  company: string;
  contact: string;
  value: number;
  tags: string[];
  stage: LeadStage;
}

export interface ClientRow {
  id: string;
  business: string;
  industry: string;
  email: string;
  outstanding: number;
}

export const seedLeads: LeadCard[] = [];

export const seedClients: ClientRow[] = [];
