export interface GuideStep {
  title: string;
  body: string;
  spotlight?: string; // CSS selector — element to highlight and point at
}

export interface PageGuide {
  key: string;
  title: string;
  subtitle: string;
  steps: GuideStep[];
  nextPage?: { label: string; href: string };
}

export const guides: Record<string, PageGuide> = {
  "/platform": {
    key: "dashboard",
    title: "Welcome to Crown OS",
    subtitle: "Your practice command centre — everything starts here.",
    steps: [
      { title: "Morning snapshot", body: "The KPI row shows today's production, chair utilisation, no-show rate, and net collections at a glance — updated live as the day runs.", spotlight: "[data-guide='kpi-row']" },
      { title: "Quick actions", body: "These six cards are your fastest shortcuts — Huddle, Messages, Revenue Pulse, Compliance, Referrals, and Intake Forms. One tap to where you need to be.", spotlight: "[data-guide='quick-actions']" },
      { title: "Today's schedule", body: "Each row is a live appointment. Click a patient name to open their full chart, or click Chart to jump directly to Clinical.", spotlight: "[data-guide='schedule-panel']" },
      { title: "Crown AI feed", body: "Crown AI reports every automated action here — cancellation fills, recall waves, insurance verifications. Review each one before acting.", spotlight: "[data-guide='ai-feed']" },
      { title: "Waitlist", body: "Click Book next to a waiting patient to instantly open the booking modal pre-filled with their name.", spotlight: "[data-guide='waitlist']" },
    ],
    nextPage: { label: "View full schedule", href: "/platform/schedule" },
  },

  "/platform/schedule": {
    key: "schedule",
    title: "Schedule",
    subtitle: "Book, manage, and track every appointment across all chairs.",
    steps: [
      { title: "Navigate days", body: "Use Prev / Today / Next to move between days. The grid shows all operatories and hygiene chairs for the selected date.", spotlight: "[data-guide='day-nav']" },
      { title: "Book an appointment", body: "Click the gold Book button — or click any empty slot in the grid — to open the booking modal pre-filled with that time and chair.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Open a patient record", body: "Click any patient name in the appointment list to open their full profile. Click Chart to jump directly to their clinical encounter.", spotlight: "[data-guide='appt-list']" },
      { title: "No-show predictor", body: "Crown AI scores each patient's no-show risk. High-risk patients show a Call button — use it before the appointment window closes.", spotlight: "[data-guide='risk-panel']" },
      { title: "Waitlist gap fill", body: "When AI detects an open slot, it surfaces a waitlist suggestion below the schedule. Click Book now to fill it instantly.", spotlight: "[data-guide='waitlist-fill']" },
    ],
    nextPage: { label: "Open Clinical for an encounter", href: "/platform/clinical" },
  },

  "/platform/patients": {
    key: "patients",
    title: "Patient Records",
    subtitle: "Your full patient database — searchable, filterable, actionable.",
    steps: [
      { title: "Search and filter", body: "Type in the search bar to filter by name, insurance plan, or tag (e.g. Implant, VIP, Perio). Results update as you type.", spotlight: "input[type='text'], input[type='search'], input[placeholder*='Search'], input[placeholder*='search']" },
      { title: "Crown Score", body: "Each patient has a Crown Score from 0-100 reflecting visit frequency, balance health, and recall compliance. Green = healthy relationship.", spotlight: "table thead" },
      { title: "Open a chart", body: "Click a patient name or the Open button to access their full profile — demographics, appointments, treatment plans, documents, and perio chart.", spotlight: "table tbody tr:first-child" },
      { title: "Add a new patient", body: "Click New Patient to enter demographics, insurance, and assign a provider. They appear in the table and become bookable immediately.", spotlight: "button.gold-btn, [class*='gold-btn']" },
    ],
    nextPage: { label: "Book this patient", href: "/platform/schedule" },
  },

  "/platform/clinical": {
    key: "clinical",
    title: "Clinical",
    subtitle: "Charting, treatment scripting, and imaging — all in one canvas.",
    steps: [
      { title: "Select a patient", body: "Use the patient selector at the top to switch between today's appointments. The odontogram and notes update for that patient automatically.", spotlight: "select, [data-guide='patient-select']" },
      { title: "Odontogram — click any tooth", body: "Click any tooth to cycle its status: healthy → needs work → treated → missing. Colour-coded at a glance. Click Save chart to persist.", spotlight: "[data-guide='odontogram']" },
      { title: "Treatment script", body: "The AI-generated script below gives you a starting point for the patient conversation — procedure, insurance breakdown, and patient portion.", spotlight: "[data-guide='tx-script']" },
      { title: "Clinical note", body: "The note area is pre-drafted from your chart data. Edit it freely, click Regenerate to refresh from current findings, or Accept Note to save.", spotlight: "[data-guide='clinical-note']" },
    ],
    nextPage: { label: "Create a Treatment Plan", href: "/platform/treatment-plans" },
  },

  "/platform/labs": {
    key: "labs",
    title: "Lab Cases",
    subtitle: "Track every case from impression to delivery.",
    steps: [
      { title: "Case lifecycle", body: "Cases move through: Ordered → Sent to Lab → In Production → Ready → Received. Each stage is tracked in this table.", spotlight: "table" },
      { title: "Create a case", body: "Click New Case and enter the patient, tooth, case type, lab, and due date. It appears in the active list immediately.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Update status", body: "Click the status badge on any case row to advance it to the next stage.", spotlight: "table tbody tr:first-child" },
      { title: "Due date alerts", body: "Cases overdue are highlighted in amber. Filter by Overdue to prioritise lab follow-up calls.", spotlight: "[data-guide='filter-row'], [class*='filter']" },
    ],
    nextPage: { label: "Schedule the restorative appointment", href: "/platform/schedule" },
  },

  "/platform/treatment-plans": {
    key: "treatment-plans",
    title: "Treatment Plans",
    subtitle: "Create, present, and track patient-accepted treatment.",
    steps: [
      { title: "Create a plan", body: "Click New Plan, select the patient, and add procedures. Crown auto-calculates insurance estimates and patient responsibility.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Active plans table", body: "Each row shows the patient, procedure count, total amount, insurance vs. patient split, and current status.", spotlight: "table thead" },
      { title: "Present to patient", body: "Click Present on any plan to generate a patient-facing view with plain-language cost breakdown and payment options.", spotlight: "table tbody tr:first-child" },
      { title: "Track acceptance", body: "When a patient agrees, click Accept to lock the plan. Rejected plans are archived, not deleted — you can always reference them.", spotlight: "table tbody tr:nth-child(2)" },
    ],
    nextPage: { label: "Generate billing after treatment", href: "/platform/billing" },
  },

  "/platform/billing": {
    key: "billing",
    title: "Billing",
    subtitle: "Invoices, payments, and collections — all in one place.",
    steps: [
      { title: "Invoice table", body: "Every completed procedure generates an invoice. The table shows total amount, insurance portion, patient portion, and current status.", spotlight: "table thead" },
      { title: "Status at a glance", body: "Paid (teal) = collected. Pending (gold) = awaiting payment. Overdue (red) = past due — act immediately on these.", spotlight: "table tbody tr:first-child" },
      { title: "Create an invoice", body: "Click New Invoice to manually create a charge — useful for same-day walk-in procedures not yet in the system.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Export for accounting", body: "Click Export to download the invoice register as CSV for your accounting system or DSO reporting.", spotlight: "[data-guide='export-btn'], button:not(.gold-btn):first-of-type" },
    ],
    nextPage: { label: "Submit insurance claims", href: "/platform/insurance" },
  },

  "/platform/insurance": {
    key: "insurance",
    title: "Insurance",
    subtitle: "Eligibility, claims, and remittance management.",
    steps: [
      { title: "Verify eligibility", body: "Select a patient from the dropdown and click Verify Eligibility to check their current coverage, deductible status, and annual maximum remaining.", spotlight: "[data-guide='elig-row'], .flex.items-center.gap-3:first-of-type" },
      { title: "Reading the result", body: "The verification panel shows plan type, coverage percentages by category, deductible met/remaining, and lifetime maximums.", spotlight: "table thead" },
      { title: "Submit a claim", body: "After a completed procedure, click Submit Claim. Crown pre-fills CDT codes, tooth numbers, and diagnosis codes from the clinical record.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Track adjudication", body: "Claims move: Submitted → In Review → Adjudicated → Paid. Flagged claims show a reason code — click to view and resubmit.", spotlight: "table tbody tr:first-child" },
    ],
    nextPage: { label: "Reconcile in Revenue", href: "/platform/revenue" },
  },

  "/platform/communications": {
    key: "communications",
    title: "Communications",
    subtitle: "SMS, email, and in-app messages — one unified inbox.",
    steps: [
      { title: "Conversation threads", body: "Each patient has one unified thread combining SMS, email, and app messages in chronological order. Select a name on the left to open it.", spotlight: "[data-guide='thread-list']" },
      { title: "Compose a message", body: "With a thread selected, type your message in the compose box at the bottom, then press Enter or click Send.", spotlight: "[data-guide='compose-area']" },
      { title: "New message", body: "Click the pencil icon to start a message to a patient who isn't already in your recent threads.", spotlight: "[data-guide='new-msg-btn']" },
      { title: "Automation status", body: "The Automation panel shows which recurring message sequences are active — appointment reminders, recall, and payment follow-ups.", spotlight: "[data-guide='automation-panel']" },
    ],
    nextPage: { label: "Send intake forms", href: "/platform/intake" },
  },

  "/platform/intake": {
    key: "intake",
    title: "Intake",
    subtitle: "Digital patient intake — paperless, fast, HIPAA-compliant.",
    steps: [
      { title: "Send intake package", body: "Select a patient and click Send Intake. They receive a link via SMS and email to complete forms on any device before their appointment.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Track completion", body: "This table shows which patients have opened, started, and completed their forms. Incomplete forms are flagged in amber.", spotlight: "table" },
      { title: "Review on arrival", body: "Click View Intake on any row to see a patient's completed health history, medications, allergies, and consents.", spotlight: "table tbody tr:first-child" },
    ],
    nextPage: { label: "Review digital forms", href: "/platform/forms" },
  },

  "/platform/forms": {
    key: "forms",
    title: "Forms",
    subtitle: "Send, track, and review digital consent and clinical forms.",
    steps: [
      { title: "Form library", body: "Browse pre-built forms: Health History, HIPAA Consent, Treatment Consent, Financial Policy, and more. All are e-signature ready.", spotlight: "h1" },
      { title: "Preview any form", body: "Click Preview on any row to see exactly what patients will see before you send it.", spotlight: ".card:first-of-type, .card" },
      { title: "Send to a patient", body: "Click Send to deliver any form via SMS to a patient. They receive a secure link to sign on their own device.", spotlight: ".card .gold-btn, [class*='gold-btn']" },
      { title: "Create a new form", body: "Click New Form to build a custom form from scratch. Choose the type, name it, and it's ready to assign.", spotlight: "button.gold-btn, [class*='gold-btn']" },
    ],
    nextPage: { label: "Store documents in the vault", href: "/platform/documents" },
  },

  "/platform/documents": {
    key: "documents",
    title: "Documents",
    subtitle: "Secure document vault for every patient.",
    steps: [
      { title: "Upload a document", body: "Click Upload, select a file from your device, and choose the patient. The document is stored securely and linked to their profile.", spotlight: "button:not(.gold-btn)" },
      { title: "Browse and filter", body: "Use the filter tabs to view All documents, or filter by type (X-ray, Consent, Insurance). Click any document to preview or download.", spotlight: "[data-guide='filter-tabs'], .flex.gap-2" },
      { title: "Download a document", body: "Click Download on any row to save a copy to your device.", spotlight: "table tbody tr:first-child" },
    ],
  },

  "/platform/reviews": {
    key: "reviews",
    title: "Reviews",
    subtitle: "Request, monitor, and respond to patient reviews.",
    steps: [
      { title: "Request a review", body: "Click Request Review to select a patient and send them an SMS with a direct link to leave a Google review for your practice.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Rating breakdown", body: "The bar chart shows your distribution across 1-5 stars. Click any bar to filter the review list to that rating.", spotlight: "[data-guide='rating-chart'], .card:nth-of-type(2)" },
      { title: "Respond to a review", body: "Click Reply on any review that hasn't been responded to. Type your response and click Post Reply — it stays logged here.", spotlight: ".card:nth-of-type(4)" },
    ],
  },

  "/platform/marketing": {
    key: "marketing",
    title: "Marketing",
    subtitle: "Campaigns, leads, and attribution tied to real appointments.",
    steps: [
      { title: "Campaign table", body: "Each row shows campaign name, channel, messages sent, open rate, and bookings attributed. These numbers reflect real patient actions.", spotlight: "table thead" },
      { title: "Pause or resume", body: "Use the Pause / Resume toggle on any active campaign to control when it runs. Draft campaigns don't send until activated.", spotlight: "table tbody tr:first-child" },
      { title: "Create a campaign", body: "Click New Campaign, give it a name, choose the channel (SMS, Email, or both), and save. You can activate it immediately or leave it as a draft.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Channel stats", body: "The cards below show delivery and open rates across SMS, Email, and Social — so you can see which channel performs best for your practice.", spotlight: ".grid.sm\\:grid-cols-3, .grid" },
    ],
  },

  "/platform/inventory": {
    key: "inventory",
    title: "Inventory",
    subtitle: "Supplies, materials, and reorder tracking.",
    steps: [
      { title: "Stock levels at a glance", body: "Items below their reorder threshold appear in gold. Items out of stock are in red and trigger a Huddle alert.", spotlight: "table thead" },
      { title: "Reorder a low-stock item", body: "Click Reorder on any item in the Low or Out column. This logs the reorder and updates the status. The item will be flagged until marked received.", spotlight: "table tbody tr:first-child" },
      { title: "Add a new item", body: "Click Add Item to enter a supply's name, category, unit, PAR level (minimum safe quantity), and preferred vendor.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Export inventory", body: "Click Export to download the current stock list as a CSV for your supply management system or purchase order.", spotlight: "[data-guide='export-btn'], button:not([class*='gold-btn']):first-of-type" },
    ],
  },

  "/platform/staff": {
    key: "staff",
    title: "Staff",
    subtitle: "Staff records, credentials, and compliance tracking.",
    steps: [
      { title: "Staff roster", body: "Each card shows a staff member's name, role, NPI (if applicable), and credential expiry status. Amber = expiring within 60 days.", spotlight: ".grid .card:first-of-type, .grid > div:first-child" },
      { title: "Expiry alerts", body: "Expired credentials block scheduling and trigger a Compliance alert. Click Edit on any card to update their details and upload the renewed document.", spotlight: ".grid > div:nth-child(2)" },
      { title: "Add a staff member", body: "Click Invite Member to enter their details, assign a role, and send them an invitation to set up their login.", spotlight: "button.gold-btn, [class*='gold-btn']" },
    ],
    nextPage: { label: "Manage roles in Team", href: "/platform/team" },
  },

  "/platform/team": {
    key: "team",
    title: "Team",
    subtitle: "Users, roles, and access control.",
    steps: [
      { title: "Team member cards", body: "Each card shows name, role, type (Provider / Clinical / Admin), and MTD production metrics for providers.", spotlight: ".grid .card:first-of-type, .grid > div:first-child" },
      { title: "Edit a member", body: "Click Edit on any card to update their name, role, or status. Changes take effect immediately.", spotlight: ".grid > div:first-child button:first-of-type" },
      { title: "View their schedule", body: "Click Schedule on any card to jump to the schedule filtered to that provider's appointments.", spotlight: ".grid > div:first-child button:last-of-type" },
      { title: "Invite a new member", body: "Click Invite Member, enter their name, email, role, and type. They receive an invitation email with a secure login link.", spotlight: "button.gold-btn, [class*='gold-btn']" },
    ],
  },

  "/platform/huddle": {
    key: "huddle",
    title: "Huddle",
    subtitle: "Your AI-prepared daily morning briefing.",
    steps: [
      { title: "Role tabs", body: "Switch between All staff, Front desk, Providers, and Hygienists to see the briefing relevant to each role.", spotlight: ".flex.gap-2.flex-wrap, [data-guide='role-tabs']" },
      { title: "Briefing cards", body: "Each card covers a key area: today's schedule, flags, AI overnight actions, and role-specific patient prep.", spotlight: ".grid .card:first-of-type, .grid > div:first-child" },
      { title: "Send to team", body: "Click Send to team to distribute today's huddle notes to all staff via SMS so everyone starts the day aligned.", spotlight: "button:not([class*='gold-btn']):last-of-type" },
      { title: "Export notes", body: "Click Export PDF to download the day's huddle as a text file for your records or for sharing with staff not present.", spotlight: "button:not([class*='gold-btn']):first-of-type" },
    ],
    nextPage: { label: "Open today's schedule", href: "/platform/schedule" },
  },

  "/platform/compliance": {
    key: "compliance",
    title: "Compliance",
    subtitle: "HIPAA, OSHA, and practice compliance — always audit-ready.",
    steps: [
      { title: "Compliance scores", body: "The KPI cards at the top show your overall posture: items overdue (red), expiring soon (amber), and all-clear items (teal).", spotlight: ".grid.grid-cols-3, .grid.sm\\:grid-cols-3" },
      { title: "Compliance table", body: "Each row is a regulatory requirement with its category, due date, days remaining, and assignee. Red rows are overdue — act immediately.", spotlight: "table" },
      { title: "Edit a record", body: "Click Edit on any row to update the notes field — useful for logging renewal steps or linking to uploaded documentation.", spotlight: "table tbody tr:first-child" },
      { title: "Send an alert", body: "Click Remind on any overdue item to send a direct notification to the assigned team member.", spotlight: "table tbody tr:nth-child(5)" },
      { title: "Add a deadline", body: "Click Add Deadline to track a new compliance requirement — OSHA, HIPAA, licensing, or a custom item.", spotlight: "button.gold-btn, [class*='gold-btn']" },
    ],
  },

  "/platform/referrals": {
    key: "referrals",
    title: "Referrals",
    subtitle: "Track referrals in and out — never lose a patient in transit.",
    steps: [
      { title: "Referral table", body: "Each row is a referral case showing patient, specialist, reason, status, and days in transit.", spotlight: "table thead" },
      { title: "Create a referral", body: "Click New Referral to open the referral form. Attach the letter, select the specialist, and set the urgency. Crown auto-sends a follow-up if no response in 5 days.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Track status", body: "Cases move: Created → Sent → Appointment Booked → Completed. Click any row to update its status manually.", spotlight: "table tbody tr:first-child" },
    ],
  },

  "/platform/analytics": {
    key: "analytics",
    title: "Analytics",
    subtitle: "Provider scorecards, procedure mix, and practice performance.",
    steps: [
      { title: "Period selector", body: "Switch between Month, Quarter, and Year views using the tabs. All charts and KPIs update to the selected period.", spotlight: "[data-guide='period-tabs'], .flex.rounded-lg.border.border-line" },
      { title: "KPI scorecards", body: "These four cards show the headline numbers for the selected period — production, collections, new patients, and average treatment value.", spotlight: ".grid.grid-cols-2, .grid.sm\\:grid-cols-4" },
      { title: "Revenue trend chart", body: "The bar chart compares production (gold) against collections (teal). The gap between them is your outstanding A/R.", spotlight: ".card:nth-of-type(3), [data-guide='revenue-chart']" },
      { title: "Procedure mix", body: "The breakdown below shows revenue by procedure type. Use this to guide case acceptance coaching and marketing focus.", spotlight: ".card:nth-of-type(4)" },
    ],
    nextPage: { label: "See live revenue in Pulse", href: "/platform/pulse" },
  },

  "/platform/pulse": {
    key: "pulse",
    title: "Revenue Pulse",
    subtitle: "Real-time revenue, collections, and financial performance.",
    steps: [
      { title: "Live KPIs", body: "These cards show today's production and collections, updated in real-time as appointments complete and payments are recorded.", spotlight: ".grid .card:first-of-type, .grid > div:first-child" },
      { title: "Daily target bar", body: "The progress bar shows where today's production sits against your daily target. Gold = on track; falling behind triggers an alert.", spotlight: "[data-guide='target-bar'], .card:nth-of-type(2)" },
      { title: "Revenue chart", body: "The bar chart below shows production vs. collections by month. The gap is outstanding A/R to recover.", spotlight: ".card:nth-of-type(3)" },
    ],
    nextPage: { label: "Full financial reporting", href: "/platform/revenue" },
  },

  "/platform/revenue": {
    key: "revenue",
    title: "Revenue",
    subtitle: "Production, collections, adjustments, and financial summaries.",
    steps: [
      { title: "Revenue chart", body: "The bar chart compares monthly production (work done) against collections (cash received). Hover any bar to see exact figures.", spotlight: ".card:first-of-type" },
      { title: "Revenue by location", body: "The table below breaks revenue by clinic location and period — useful if you manage multiple sites.", spotlight: "table" },
      { title: "Export a summary", body: "Click Export Report to download a full financial summary as a text file for your accountant or DSO reporting.", spotlight: "button:not([class*='gold-btn'])" },
    ],
    nextPage: { label: "Custom reports", href: "/platform/reports" },
  },

  "/platform/reports": {
    key: "reports",
    title: "Reports",
    subtitle: "Pre-built and custom reports for every area of your practice.",
    steps: [
      { title: "Period selector", body: "Switch between Month, Quarter, and Year. All report data updates to the selected period automatically.", spotlight: ".flex.rounded-lg.border.border-line" },
      { title: "KPI cards", body: "The four headline numbers for the selected period — production, collections, new patients, and average treatment value.", spotlight: ".grid.grid-cols-2, .grid.sm\\:grid-cols-4" },
      { title: "Revenue trend", body: "The chart compares production (gold bars) against collections (teal bars). Download any view using the Export PDF button.", spotlight: "button.gold-btn, [class*='gold-btn']" },
      { title: "Report library", body: "Click any report type (Revenue, Production, Collections, Procedures, Patients, Insurance) to export a CSV of that dataset.", spotlight: ".card:last-of-type, .grid.sm\\:grid-cols-3" },
    ],
  },

  "/platform/automation": {
    key: "automation",
    title: "Automation",
    subtitle: "Rules that run your practice on autopilot.",
    steps: [
      { title: "Live automations", body: "Each card shows the automation's trigger, action, total runs, and on/off toggle. Green ring = currently active.", spotlight: ".grid .card:first-of-type, .grid > div:first-child" },
      { title: "Toggle on/off", body: "Click the toggle switch on any card to pause or resume an automation instantly. No data is lost when paused.", spotlight: ".grid > div:first-child button" },
      { title: "Edit an automation", body: "Click Edit on any card to rename it. Trigger and action editing is available in the full automation builder (coming soon).", spotlight: ".grid > div:first-child" },
      { title: "Create a new automation", body: "Click New Automation to add a custom rule. Choose a trigger, set the action, and it goes live immediately.", spotlight: "button.gold-btn, [class*='gold-btn']" },
    ],
  },

  "/platform/ai-agent": {
    key: "ai-agent",
    title: "Crown AI",
    subtitle: "Your autonomous dental practice agent — working 24/7.",
    steps: [
      { title: "What Crown AI does", body: "Crown AI handles scheduling gaps, recall campaigns, insurance verification, and treatment plan drafting — autonomously, around the clock.", spotlight: "h1" },
      { title: "Action feed", body: "Every AI action is listed here — what it did, which patient was affected, and when. Approved actions are logged permanently.", spotlight: ".card:first-of-type" },
      { title: "Approve or reject", body: "Actions requiring your sign-off appear with Approve / Reject buttons. Crown AI proposes; you decide — nothing irreversible happens without your approval.", spotlight: ".card:nth-of-type(2)" },
      { title: "Configure boundaries", body: "In Settings, you control exactly what Crown AI may do autonomously and what always requires human review.", spotlight: ".card:last-of-type" },
    ],
    nextPage: { label: "Configure AI in Settings", href: "/platform/settings" },
  },

  "/platform/training": {
    key: "training",
    title: "Training",
    subtitle: "Role-based onboarding and ongoing staff education.",
    steps: [
      { title: "Role filter", body: "Select your role (Front Desk, Clinical, Billing, Management) using the tabs to see a tailored learning path covering the modules you use most.", spotlight: "[data-guide='role-tabs'], .flex.gap-2" },
      { title: "Video library", body: "Each card is a training module with a title, duration, and skill level. Click Play to watch.", spotlight: ".grid .card:first-of-type, .grid > div:first-child" },
      { title: "Track progress", body: "Progress bars show completion per module. Modules visited via the Help button in-app are automatically marked complete.", spotlight: ".grid > div:nth-child(2)" },
    ],
  },

  "/platform/integrations": {
    key: "integrations",
    title: "Integrations",
    subtitle: "Connect Crown to your existing tools.",
    steps: [
      { title: "Connected integrations", body: "These are currently connected to Crown. The status chip shows when data last synced. Click the toggle to disconnect.", spotlight: ".grid.gap-3:first-of-type" },
      { title: "Available integrations", body: "These are ready to connect. Click Connect, enter your API key or credentials, and Crown will begin syncing automatically.", spotlight: ".grid.gap-3:nth-of-type(2)" },
      { title: "Browse marketplace", body: "Click Browse Marketplace to see additional connectors — practice management, imaging, payment, and marketing platform plugins.", spotlight: "button:not([class*='gold-btn'])" },
    ],
  },

  "/platform/settings": {
    key: "settings",
    title: "Settings",
    subtitle: "Practice configuration, AI rules, and system preferences.",
    steps: [
      { title: "Practice information", body: "Set your practice name, NPI, timezone, and currency. These populate on claims, receipts, and patient communications.", spotlight: ".card:first-of-type" },
      { title: "AI agent configuration", body: "Control the Crown AI greeting script, how far out it can schedule, and which recall cadence it uses.", spotlight: ".card:nth-of-type(2)" },
      { title: "Insurance and billing", body: "Configure your clearinghouse, default provider NPI, and in-house membership plan name.", spotlight: ".card:nth-of-type(3)" },
      { title: "Save changes", body: "Click Save Changes at the bottom after editing any field. Your changes are applied immediately across the entire platform.", spotlight: "button.gold-btn, [class*='gold-btn']" },
    ],
  },
};
