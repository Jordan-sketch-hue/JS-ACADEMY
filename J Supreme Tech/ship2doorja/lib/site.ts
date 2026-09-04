// =====================================================================
// SHIP 2 DOOR JA — single source of truth for brand, contact & content.
// Edit values here and they update across the whole site.
// =====================================================================

export const site = {
  name: "Ship 2 Door JA",
  shortName: "Ship2Door",
  tagline: "Transport · Transition · Modern Delivery",
  promises: ["Economical", "Reliable", "Accountable"],
  // Conversion hook (no active % discount — removed 2026-06-01)
  hook: "Free U.S. shipping address",
  hookSub: "No sign-up fee — pay only when you ship.",

  url: "https://ship2doorja.com",

  contact: {
    phone: "(876) 360-2586",
    phoneHref: "tel:+18763602586",
    whatsappHref: "https://wa.me/18763602586",
    instagram: "@ship.2doorja",
    instagramHref: "https://instagram.com/ship.2doorja",
    email: "ship2door@outlook.com",
    emailHref: "mailto:ship2door@outlook.com",
    location: "Montego Bay, St James",
    locationNote: "Drop-off / pickup point",
  },

  // Existing WordPress customer login/portal is preserved on a subdomain.
  // Update this to the final portal URL at DNS cutover.
  portal: {
    loginHref: "https://ship2doorja.com/wp-login.php",
    signupHref: "https://ship2doorja.com/wp-login.php?action=register",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Rates", href: "/rates" },
  { label: "Rewards", href: "/rewards" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const steps = [
  {
    icon: "warehouse",
    title: "Get your free U.S. address",
    body: "Sign up and we give you your own U.S. shipping address — free. No membership fee.",
  },
  {
    icon: "package",
    title: "Shop & ship to it",
    body: "Buy from Amazon, SHEIN, eBay — any U.S. store. Use your S2D address at checkout.",
  },
  {
    icon: "home",
    title: "We deliver to your door",
    body: "We receive it, clear customs, and forward it straight to your door in Jamaica.",
  },
] as const;

export const whyUs = [
  {
    icon: "dollar",
    title: "Economical",
    body: "Clear per-pound pricing with no hidden surprises — ever.",
  },
  {
    icon: "shield",
    title: "Reliable",
    body: "Your packages handled with care and delivered on time, every time.",
  },
  {
    icon: "userCheck",
    title: "Accountable",
    body: "Real tracking, real notifications, and real people when you need us.",
  },
  {
    icon: "chat",
    title: "Live support",
    body: "Message us any time on WhatsApp or Instagram — we actually reply.",
  },
] as const;

export const services = [
  { icon: "warehouse", title: "Free U.S. warehouse address", body: "Your own address to shop the entire U.S." },
  { icon: "plane", title: "Air freight forwarding", body: "Fast forwarding from the U.S. to Jamaica." },
  { icon: "shield", title: "Customs clearance", body: "We handle the paperwork and clearing for you." },
  { icon: "truck", title: "Door-to-door delivery", body: "Delivered right to your doorstep islandwide." },
  { icon: "search", title: "Online tracking", body: "Follow your package from warehouse to door." },
  { icon: "bell", title: "Status notifications", body: "Get alerts the moment your package moves." },
] as const;

export const rewards = [
  {
    icon: "cake",
    when: "7 shipments a year",
    reward: "FREE birthday shipment",
    limit: "under 20 lb",
  },
  {
    icon: "gift",
    when: "10 shipments a year",
    reward: "FREE Christmas shipment",
    limit: "under 17 lb",
  },
] as const;

export const faqs = [
  {
    q: "How do I get a U.S. address?",
    a: "Sign up for a free account and we issue your personal U.S. shipping address instantly. There's no membership fee — you only pay when you actually ship a package.",
  },
  {
    q: "How long does shipping take?",
    a: "Air freight from our U.S. warehouse to Jamaica is fast. Once your package arrives at the warehouse, we process, clear customs, and forward it to your door. Reach out for current turnaround times.",
  },
  {
    q: "How much does it cost?",
    a: "We charge clear per-pound rates with no hidden fees. Message us with your package details for an exact quote before you ship.",
  },
  {
    q: "Where do I collect my package?",
    a: "We deliver door-to-door across Jamaica. You can also collect at our pickup point in Montego Bay, St James.",
  },
  {
    q: "What can I ship?",
    a: "Most everyday online purchases — fashion, electronics, household goods and more. Message us first about restricted or oversized items so we can advise.",
  },
  {
    q: "Do you reward repeat customers?",
    a: "Yes — every shipment earns a stamp on your Ship2Door Rewards card. Hit 7 shipments in a year for a free birthday shipment (≤20lb), and 10 for a free Christmas shipment (≤17lb).",
  },
] as const;
