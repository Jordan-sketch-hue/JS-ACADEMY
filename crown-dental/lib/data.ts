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

export const clinics: { id: string; name: string; region: string; chairs: number; tz: string }[] = [
  { id: "c1", name: "Your Practice", region: "Main location", chairs: 8, tz: "America/New_York" },
];

export const kpis: { label: string; value: string; delta: string; up: boolean; spark: number[] }[] = [
  { label: "Production (today)", value: "$8,420",  delta: "+12% vs avg",  up: true,  spark: [62,70,65,80,75,88,92] },
  { label: "Collections (MTD)", value: "$41,800", delta: "+8% vs last mo", up: true,  spark: [70,74,69,78,82,80,87] },
  { label: "Chair utilization", value: "84%",     delta: "+6 pts",        up: true,  spark: [72,76,80,78,83,81,84] },
  { label: "Overdue recall",    value: "23 pts",  delta: "-4 this week",  up: true,  spark: [34,30,29,27,26,25,23] },
];

export const revenueSeries: { m: string; production: number; collections: number; target: number }[] = [
  { m: "Feb", production: 310, collections: 278, target: 320 },
  { m: "Mar", production: 342, collections: 305, target: 320 },
  { m: "Apr", production: 298, collections: 270, target: 320 },
  { m: "May", production: 365, collections: 330, target: 340 },
  { m: "Jun", production: 380, collections: 358, target: 340 },
  { m: "Jul", production: 402, collections: 378, target: 360 },
  { m: "Aug", production: 418, collections: 391, target: 380 },
];

export const procedureMix: { name: string; value: number; color: string }[] = [
  { name: "Preventive",   value: 38, color: "bg-teal" },
  { name: "Restorative",  value: 27, color: "bg-gold" },
  { name: "Endodontic",   value: 14, color: "bg-violet-400" },
  { name: "Surgical",     value: 12, color: "bg-slate-400" },
  { name: "Cosmetic",     value: 9,  color: "bg-gold-deep" },
];

export const appointments: Appointment[] = [];

export const patients: Patient[] = [];

export const demoPatients: Patient[] = [
  { id: "p1", name: "Patient #1041", age: 34, lastVisit: "Jun 12", nextDue: "Dec 12",  risk: "low",      balance: 0,    ltv: 6800, plan: "Crown Care+",  tags: ["VIP", "Implant"] },
  { id: "p2", name: "Patient #1042", age: 52, lastVisit: "Jul 5",  nextDue: "Overdue", risk: "moderate", balance: 320,  ltv: 4200, plan: "PPO — Delta",  tags: ["Recall Due"] },
  { id: "p3", name: "Patient #1043", age: 28, lastVisit: "Aug 1",  nextDue: "Feb 1",   risk: "low",      balance: 0,    ltv: 2100, plan: "PPO — Cigna",  tags: ["New Patient"] },
  { id: "p4", name: "Patient #1044", age: 45, lastVisit: "Apr 20", nextDue: "Overdue", risk: "high",     balance: 1240, ltv: 3900, plan: "Self-pay",     tags: ["High Balance", "Perio"] },
  { id: "p5", name: "Patient #1045", age: 61, lastVisit: "Mar 10", nextDue: "Overdue", risk: "high",     balance: 0,    ltv: 9600, plan: "HMO",          tags: ["Implant", "Perio"] },
  { id: "p6", name: "Patient #1046", age: 39, lastVisit: "Jul 28", nextDue: "Jan 28",  risk: "low",      balance: 180,  ltv: 5400, plan: "Crown Care+",  tags: ["Cosmetic"] },
  { id: "p7", name: "Patient #1047", age: 22, lastVisit: "Jun 30", nextDue: "Dec 30",  risk: "moderate", balance: 0,    ltv: 1200, plan: "PPO — Delta",  tags: ["No-Show Risk"] },
  { id: "p8", name: "Patient #1048", age: 48, lastVisit: "May 15", nextDue: "Nov 15",  risk: "low",      balance: 0,    ltv: 7200, plan: "PPO — Cigna",  tags: ["VIP"] },
];

export const aiActions: { id: string; title: string; detail: string; time: string; tag: string; tone: string }[] = [
  { id: "ai1", title: "3 recall gaps backfilled",        detail: "AI agent moved 3 waitlist patients into tomorrow's open chairs. Est. value: $840.",           time: "2 min ago",  tag: "Scheduling", tone: "teal"   },
  { id: "ai2", title: "$610 claim flagged for review",   detail: "Payer rejected code D2740 — Crown AI drafted a corrected narrative and resubmission.",         time: "18 min ago", tag: "RCM",        tone: "gold"   },
  { id: "ai3", title: "High no-show risk detected",      detail: "Patient #1047 has 3 prior no-shows. SMS confirmation sent; reminder scheduled for 7 AM.",       time: "34 min ago", tag: "Risk",       tone: "violet" },
  { id: "ai4", title: "Overdue recall outreach sent",    detail: "AI texted 12 patients who are 6+ months overdue. 4 have already clicked to book.",              time: "1 hr ago",   tag: "Recall",     tone: "teal"   },
  { id: "ai5", title: "Eligibility verified — 9 appts", detail: "All tomorrow's patients cleared with their carriers. 1 plan change noted on Patient #1044.",     time: "2 hr ago",   tag: "Insurance",  tone: "teal"   },
];

export const waitlist: { name: string; want: string; flex: string; value: number }[] = [
  { name: "Patient #1052", want: "Cleaning + exam",   flex: "Any morning", value: 280 },
  { name: "Patient #1053", want: "Crown delivery",    flex: "Mon or Wed",  value: 1400 },
  { name: "Patient #1054", want: "Composite ×2",      flex: "Flexible",    value: 420 },
  { name: "Patient #1055", want: "Implant placement", flex: "After 2 PM",  value: 2800 },
];

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
