// =====================================================================
// Demo data for the client portal + admin back-office (mock — no DB).
// =====================================================================

export type PkgStatus =
  | "Pre-alert"
  | "At U.S. warehouse"
  | "In transit"
  | "Customs"
  | "Ready for pickup"
  | "Delivered";

export const statusMeta: Record<PkgStatus, { tone: string; step: number }> = {
  "Pre-alert": { tone: "bg-slate-100 text-slate-600", step: 0 },
  "At U.S. warehouse": { tone: "bg-sky/15 text-blue", step: 1 },
  "In transit": { tone: "bg-blue/15 text-blue", step: 2 },
  Customs: { tone: "bg-gold/20 text-gold-deep", step: 3 },
  "Ready for pickup": { tone: "bg-emerald-100 text-emerald-700", step: 4 },
  Delivered: { tone: "bg-emerald-500/15 text-emerald-700", step: 5 },
};

// ----------------------------- Client (me) ----------------------------
export const me = {
  name: "Keisha Campbell",
  firstName: "Keisha",
  email: "keisha.campbell@gmail.com",
  memberSince: "Mar 2026",
  suite: "S2D-10472",
  usAddress: {
    line1: "8400 NW 25th St, Suite S2D-10472",
    line2: "Doral, FL 33122, USA",
    phone: "(305) 555-0142",
  },
  rewards: { stamps: 4, nextReward: "Free birthday shipment", nextAt: 7 },
};

export const myPackages: {
  id: string;
  store: string;
  desc: string;
  status: PkgStatus;
  weight: string;
  eta: string;
}[] = [
  { id: "S2D-88231", store: "Amazon", desc: "Wireless headphones", status: "In transit", weight: "2.4 lb", eta: "Jun 6" },
  { id: "S2D-88197", store: "SHEIN", desc: "Apparel (3 items)", status: "At U.S. warehouse", weight: "3.1 lb", eta: "Jun 9" },
  { id: "S2D-88054", store: "Nike", desc: "Running shoes", status: "Customs", weight: "2.0 lb", eta: "Jun 5" },
  { id: "S2D-87903", store: "Best Buy", desc: "USB-C charger", status: "Ready for pickup", weight: "0.8 lb", eta: "Today" },
  { id: "S2D-87740", store: "Walmart", desc: "Household goods", status: "Delivered", weight: "5.6 lb", eta: "Jun 1" },
];

// ------------------------------- Admin --------------------------------
export const adminKpis = [
  { label: "Active shipments", value: 128, delta: "+12%", icon: "package" },
  { label: "Customers", value: 742, delta: "+38", icon: "userCheck" },
  { label: "Pre-alerts (24h)", value: 26, delta: "+9", icon: "bell" },
  { label: "Ready for pickup", value: 41, delta: "—", icon: "home" },
];

export const monthlyVolume = [
  { m: "Jan", shipments: 210, revenue: 520 },
  { m: "Feb", shipments: 245, revenue: 610 },
  { m: "Mar", shipments: 320, revenue: 790 },
  { m: "Apr", shipments: 360, revenue: 905 },
  { m: "May", shipments: 430, revenue: 1080 },
  { m: "Jun", shipments: 498, revenue: 1240 },
];

export const statusBreakdown = [
  { name: "At warehouse", value: 38, color: "#27B9FF" },
  { name: "In transit", value: 52, color: "#1F6FD0" },
  { name: "Customs", value: 18, color: "#F5C04A" },
  { name: "Ready", value: 20, color: "#22C55E" },
];

export const adminShipments: {
  id: string;
  customer: string;
  store: string;
  status: PkgStatus;
  weight: string;
  updated: string;
}[] = [
  { id: "S2D-88231", customer: "Keisha Campbell", store: "Amazon", status: "In transit", weight: "2.4 lb", updated: "12m ago" },
  { id: "S2D-88230", customer: "Marlon Brown", store: "eBay", status: "At U.S. warehouse", weight: "1.2 lb", updated: "28m ago" },
  { id: "S2D-88229", customer: "Tashauna Reid", store: "Temu", status: "Pre-alert", weight: "—", updated: "41m ago" },
  { id: "S2D-88228", customer: "Andre Service", store: "Nike", status: "Customs", weight: "2.0 lb", updated: "1h ago" },
  { id: "S2D-88227", customer: "Shanice Walker", store: "SHEIN", status: "Ready for pickup", weight: "3.6 lb", updated: "2h ago" },
  { id: "S2D-88226", customer: "Devon Powell", store: "Best Buy", status: "Delivered", weight: "0.9 lb", updated: "3h ago" },
  { id: "S2D-88225", customer: "Camille Foster", store: "Amazon", status: "In transit", weight: "4.1 lb", updated: "4h ago" },
];

export const adminCustomers: {
  name: string;
  suite: string;
  shipments: number;
  status: "Active" | "New" | "VIP";
  joined: string;
}[] = [
  { name: "Keisha Campbell", suite: "S2D-10472", shipments: 6, status: "Active", joined: "Mar 2026" },
  { name: "Marlon Brown", suite: "S2D-10470", shipments: 2, status: "New", joined: "May 2026" },
  { name: "Andre Service", suite: "S2D-10455", shipments: 11, status: "VIP", joined: "Jan 2026" },
  { name: "Shanice Walker", suite: "S2D-10468", shipments: 4, status: "Active", joined: "Apr 2026" },
  { name: "Tashauna Reid", suite: "S2D-10474", shipments: 1, status: "New", joined: "Jun 2026" },
  { name: "Camille Foster", suite: "S2D-10461", shipments: 8, status: "VIP", joined: "Feb 2026" },
];

export const adminPreAlerts: {
  id: string;
  customer: string;
  store: string;
  desc: string;
  value: string;
  when: string;
}[] = [
  { id: "PA-3391", customer: "Tashauna Reid", store: "Temu", desc: "Phone accessories", value: "US$24", when: "41m ago" },
  { id: "PA-3390", customer: "Marlon Brown", store: "eBay", desc: "Vintage vinyl (2)", value: "US$60", when: "1h ago" },
  { id: "PA-3389", customer: "Keisha Campbell", store: "Amazon", desc: "Kitchen blender", value: "US$89", when: "2h ago" },
  { id: "PA-3388", customer: "Devon Powell", store: "ASOS", desc: "Jacket", value: "US$110", when: "5h ago" },
];
