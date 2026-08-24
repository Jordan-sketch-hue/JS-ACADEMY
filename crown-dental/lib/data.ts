// ─────────────────────────────────────────────────────────────
// Crown Dental OS — domain types and seed data.
// All demo arrays have been emptied for production.
// Real data comes from Supabase via lib/db.ts once env vars are set.
// ─────────────────────────────────────────────────────────────

export type Appointment = {
  id: string;
  patient: string;
  provider: string;
  chair: string;
  procedure: string;
  start: string; // HH:MM
  duration: number; // minutes
  status: "confirmed" | "checked-in" | "in-chair" | "completed" | "no-show";
  value: number;
  channel: "app" | "web" | "phone" | "ai-agent";
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  nextDue: string;
  risk: "low" | "moderate" | "high";
  balance: number;
  ltv: number;
  plan: string;
  tags: string[];
};

export const clinics: { id: string; name: string; region: string; chairs: number; tz: string }[] = [];

export const kpis: { label: string; value: string; delta: string; up: boolean; spark: number[] }[] = [];

export const revenueSeries: { m: string; production: number; collections: number; target: number }[] = [];

export const procedureMix: { name: string; value: number; color: string }[] = [];

export const appointments: Appointment[] = [];

export const patients: Patient[] = [];

export const aiActions: { id: string; title: string; detail: string; time: string; tag: string; tone: string }[] = [];

export const waitlist: { name: string; want: string; flex: string; value: number }[] = [];

export const modules = [
  { key: "scheduling", name: "Autonomous Scheduling", desc: "AI voice + chat agents book, confirm, and backfill 24/7 across every channel.", icon: "CalendarClock", href: "/platform/schedule" },
  { key: "clinical",   name: "Clinical Charting & Imaging", desc: "Voice-perio, AI radiograph reads, and treatment planning inside one canvas.", icon: "Stethoscope", href: "/platform/clinical" },
  { key: "rcm",        name: "Revenue Cycle Automation", desc: "Real-time eligibility, auto-claims, and collections that run themselves.", icon: "Banknote", href: "/platform/revenue" },
  { key: "experience", name: "Patient Experience OS", desc: "Branded app, digital forms, financing, and recall journeys that convert.", icon: "HeartPulse", href: "/portal" },
  { key: "analytics",  name: "Practice Intelligence", desc: "Live production, provider scorecards, and DSO roll-ups down to the chair.", icon: "LineChart", href: "/platform/analytics" },
  { key: "compliance", name: "Security & Compliance", desc: "HIPAA, GDPR, and SOC 2 with audit trails, RBAC, and data residency.", icon: "ShieldCheck", href: "/platform/compliance" },
];

export const globalStats = [
  { k: "Practices live", v: "1,240+" },
  { k: "Chairs orchestrated", v: "9,800" },
  { k: "Countries", v: "14" },
  { k: "Uptime", v: "99.98%" },
];
