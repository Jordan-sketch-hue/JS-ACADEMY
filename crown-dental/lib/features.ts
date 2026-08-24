// Comprehensive feature matrix benchmarked against:
// Dentrix, Eaglesoft, Curve Dental, Open Dental, NexHealth,
// Weave, Lighthouse 360, Carestream, Planet DDS (Denticon)

export type Tier = "yes" | "partial" | "no" | "exclusive";

export type Feature = {
  name: string;
  category: string;
  meridian: Tier;
  dentrix: Tier;
  curve: Tier;
  nexhealth: Tier;
  note?: string;
};

export const featureCategories = [
  "Scheduling & Access",
  "Clinical",
  "Revenue & Insurance",
  "Patient Experience",
  "Analytics & Reporting",
  "DSO & Multi-Site",
  "AI & Automation",
  "Compliance & Security",
];

export const features: Feature[] = [
  // ─── Scheduling & Access ───
  { category: "Scheduling & Access", name: "Online patient self-scheduling", meridian: "yes", dentrix: "partial", curve: "yes", nexhealth: "yes" },
  { category: "Scheduling & Access", name: "AI voice agent (books after hours)", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no", note: "Meridian-only" },
  { category: "Scheduling & Access", name: "AI chat widget on any website", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "partial", note: "Meridian-only" },
  { category: "Scheduling & Access", name: "Intelligent waitlist fill (real-time)", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no", note: "Meridian-only" },
  { category: "Scheduling & Access", name: "Family block scheduling", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "no" },
  { category: "Scheduling & Access", name: "Provider color-coded calendar", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "partial" },
  { category: "Scheduling & Access", name: "Recurring appointment series", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "no" },
  { category: "Scheduling & Access", name: "Room / operatory management", meridian: "yes", dentrix: "yes", curve: "partial", nexhealth: "no" },
  { category: "Scheduling & Access", name: "Mobile app for staff scheduling", meridian: "yes", dentrix: "no", curve: "partial", nexhealth: "partial" },

  // ─── Clinical ───
  { category: "Clinical", name: "Digital perio charting (voice input)", meridian: "exclusive", dentrix: "partial", curve: "partial", nexhealth: "no", note: "Meridian voice-perio is hands-free" },
  { category: "Clinical", name: "AI radiograph analysis & flagging", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no", note: "Meridian-only" },
  { category: "Clinical", name: "Treatment plan builder (visual)", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "no" },
  { category: "Clinical", name: "Digital consent & health history forms", meridian: "yes", dentrix: "partial", curve: "yes", nexhealth: "yes" },
  { category: "Clinical", name: "TWAIN imaging bridge (sensor, pan)", meridian: "yes", dentrix: "yes", curve: "partial", nexhealth: "no" },
  { category: "Clinical", name: "Referral & lab case tracking", meridian: "yes", dentrix: "yes", curve: "partial", nexhealth: "no" },
  { category: "Clinical", name: "Medication & allergy records", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "partial" },
  { category: "Clinical", name: "AI treatment plan narrative drafting", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no", note: "Meridian-only" },

  // ─── Revenue & Insurance ───
  { category: "Revenue & Insurance", name: "Real-time insurance eligibility", meridian: "yes", dentrix: "partial", curve: "yes", nexhealth: "partial", note: "Meridian runs batch + real-time" },
  { category: "Revenue & Insurance", name: "Electronic claims (EDI 837)", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "no" },
  { category: "Revenue & Insurance", name: "Auto EOB posting & reconciliation", meridian: "exclusive", dentrix: "partial", curve: "partial", nexhealth: "no", note: "Meridian AI-reconciles" },
  { category: "Revenue & Insurance", name: "Patient financing (Affirm / CareCredit)", meridian: "yes", dentrix: "partial", curve: "no", nexhealth: "partial" },
  { category: "Revenue & Insurance", name: "Automated A/R follow-up", meridian: "exclusive", dentrix: "partial", curve: "partial", nexhealth: "no", note: "Meridian AI calls & texts" },
  { category: "Revenue & Insurance", name: "In-house membership plan management", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "no" },
  { category: "Revenue & Insurance", name: "Multi-currency billing", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "no" },
  { category: "Revenue & Insurance", name: "Live production vs collection dashboard", meridian: "yes", dentrix: "partial", curve: "partial", nexhealth: "no" },

  // ─── Patient Experience ───
  { category: "Patient Experience", name: "Branded patient mobile app", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "yes" },
  { category: "Patient Experience", name: "Automated SMS / email reminders", meridian: "yes", dentrix: "partial", curve: "yes", nexhealth: "yes" },
  { category: "Patient Experience", name: "Two-way texting", meridian: "yes", dentrix: "partial", curve: "yes", nexhealth: "yes" },
  { category: "Patient Experience", name: "AI-driven recall journeys (multi-touch)", meridian: "exclusive", dentrix: "no", curve: "partial", nexhealth: "partial", note: "Meridian-only" },
  { category: "Patient Experience", name: "Post-visit automated review request", meridian: "yes", dentrix: "no", curve: "yes", nexhealth: "yes" },
  { category: "Patient Experience", name: "Patient satisfaction surveys", meridian: "yes", dentrix: "no", curve: "partial", nexhealth: "yes" },
  { category: "Patient Experience", name: "Telehealth / virtual consult", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "partial" },

  // ─── Analytics & Reporting ───
  { category: "Analytics & Reporting", name: "Pre-built KPI dashboards", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "partial" },
  { category: "Analytics & Reporting", name: "Provider production scorecards", meridian: "yes", dentrix: "partial", curve: "partial", nexhealth: "no" },
  { category: "Analytics & Reporting", name: "Case acceptance rate tracking", meridian: "yes", dentrix: "partial", curve: "no", nexhealth: "no" },
  { category: "Analytics & Reporting", name: "Recall effectiveness analytics", meridian: "yes", dentrix: "no", curve: "partial", nexhealth: "partial" },
  { category: "Analytics & Reporting", name: "Predictive patient LTV scoring", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no", note: "Meridian-only" },
  { category: "Analytics & Reporting", name: "Custom report builder", meridian: "yes", dentrix: "yes", curve: "partial", nexhealth: "no" },

  // ─── DSO & Multi-Site ───
  { category: "DSO & Multi-Site", name: "Multi-location roll-up view", meridian: "yes", dentrix: "partial", curve: "yes", nexhealth: "partial" },
  { category: "DSO & Multi-Site", name: "Centralized scheduling across locations", meridian: "yes", dentrix: "no", curve: "partial", nexhealth: "no" },
  { category: "DSO & Multi-Site", name: "Per-region data residency", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "no" },
  { category: "DSO & Multi-Site", name: "Cross-location patient record", meridian: "yes", dentrix: "partial", curve: "partial", nexhealth: "no" },
  { category: "DSO & Multi-Site", name: "Franchise / DSO white-labeling", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "no" },

  // ─── AI & Automation ───
  { category: "AI & Automation", name: "AI appointment agent (voice + chat)", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no" },
  { category: "AI & Automation", name: "Autonomous no-show prevention", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no" },
  { category: "AI & Automation", name: "AI insurance batch verification", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no" },
  { category: "AI & Automation", name: "Smart recall prioritization (risk-based)", meridian: "exclusive", dentrix: "no", curve: "no", nexhealth: "no" },
  { category: "AI & Automation", name: "Automated treatment follow-ups", meridian: "yes", dentrix: "no", curve: "partial", nexhealth: "partial" },
  { category: "AI & Automation", name: "Workflow automation builder", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "no" },

  // ─── Compliance & Security ───
  { category: "Compliance & Security", name: "HIPAA compliance", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "yes" },
  { category: "Compliance & Security", name: "GDPR / international compliance", meridian: "yes", dentrix: "no", curve: "no", nexhealth: "partial" },
  { category: "Compliance & Security", name: "SOC 2 Type II", meridian: "yes", dentrix: "no", curve: "yes", nexhealth: "yes" },
  { category: "Compliance & Security", name: "Role-based access control (RBAC)", meridian: "yes", dentrix: "partial", curve: "yes", nexhealth: "partial" },
  { category: "Compliance & Security", name: "Full audit trail", meridian: "yes", dentrix: "yes", curve: "yes", nexhealth: "partial" },
  { category: "Compliance & Security", name: "SSO / SAML for enterprise", meridian: "yes", dentrix: "no", curve: "partial", nexhealth: "partial" },
  { category: "Compliance & Security", name: "Automated security patches (cloud)", meridian: "yes", dentrix: "no", curve: "yes", nexhealth: "yes" },
];
