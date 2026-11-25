/**
 * category-config.ts — Single source of truth for all 20 JST category templates.
 *
 * Every CRM tab array, schema type, policy clauses, SEO defaults, LP type,
 * accent mood and industry modules live here. Add or change a category once;
 * every downstream consumer picks it up automatically.
 */

// ─── CRM Tab / Module Keys ────────────────────────────────────────────────────

export type CRMModuleKey =
  | "appointments" | "bookings" | "reservations" | "event_bookings"
  | "customers" | "leads" | "orders" | "custom_orders"
  | "products" | "inventory" | "kitchen_orders" | "deliveries"
  | "job_cards" | "projects" | "production_jobs" | "warranties"
  | "purchase_orders" | "suppliers" | "wholesale_accounts"
  | "quotes" | "payments" | "reports" | "tasks" | "staff"
  | "integrations" | "business_profile";

export type SchemaType =
  | "LocalBusiness" | "Restaurant" | "FoodEstablishment" | "CafeOrCoffeeShop"
  | "Bakery" | "AutoRepair" | "BeautySalon" | "HairSalon" | "NailSalon"
  | "HealthAndBeauty" | "LegalService" | "MedicalBusiness" | "Dentist"
  | "EventVenue" | "EntertainmentBusiness" | "ProfessionalService"
  | "TravelAgency" | "Store" | "ClothingStore" | "FurnitureStore"
  | "HomeGoodsStore" | "ElectronicsStore" | "GroceryStore" | "ConvenienceStore"
  | "Florist" | "MovingCompany" | "DeliveryService";

export type LPType =
  | "lead-capture" | "booking" | "service-spotlight" | "product-spotlight"
  | "offer-promo" | "quote-request" | "event-registration";

export type CategorySlug =
  | "automotive" | "bakery" | "beauty" | "branding" | "cafe"
  | "crafts" | "creative" | "events" | "fashion" | "accessories"
  | "florist" | "food" | "furniture" | "lifestyle" | "lighting"
  | "logistics" | "packaging" | "retail" | "tech-repair" | "variety";

export interface CategoryPolicyClauses {
  booking?: string;
  deposit?: string;
  returns?: string;
  allergen?: string;
  storage?: string;
  warranty?: string;
  disclaimer?: string;
  delivery?: string;
  custom?: string;
}

export interface CategoryConfig {
  label: string;
  crmTabs: CRMModuleKey[];
  dashboardStats: [string, string, string, string];
  schemaType: SchemaType;
  additionalSchemas?: SchemaType[];
  defaultLPType: LPType;
  policyClauses: CategoryPolicyClauses;
  accentMood: string;
  primaryKeyword: string;
  localModifier: string;
  bannerImage: string;
  crmSubtitle: string;
}

// ─── Category Configurations ──────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<CategorySlug, CategoryConfig> = {

  automotive: {
    label: "Automotive CRM",
    crmTabs: ["job_cards","customers","appointments","products","warranties","quotes","payments","leads","reports","tasks","inventory"],
    dashboardStats: ["Jobs Today","Net Sales","New Leads","Active Vehicles"],
    schemaType: "AutoRepair",
    defaultLPType: "booking",
    policyClauses: {
      booking:    "A diagnostic fee applies to all vehicle inspections regardless of repair outcome.",
      storage:    "Vehicles uncollected within 7 days of completion notice will incur daily storage charges.",
      warranty:   "Parts and labour carry a 90-day warranty from the date of service unless otherwise stated.",
      disclaimer: "The business accepts no liability for pre-existing faults not disclosed at drop-off.",
    },
    accentMood: "#1E3A5F",
    primaryKeyword: "auto repair and mechanic services",
    localModifier:  "in Kingston Jamaica",
    bannerImage:    "/crm-banners/automotive.jpg",
    crmSubtitle:    "Workshop and vehicle job tracker",
  },

  bakery: {
    label: "Bakery CRM",
    crmTabs: ["custom_orders","kitchen_orders","customers","products","deliveries","payments","leads","reports","tasks","suppliers"],
    dashboardStats: ["Orders Today","Net Sales","Pending Custom Orders","New Leads"],
    schemaType: "Bakery",
    defaultLPType: "lead-capture",
    policyClauses: {
      deposit:  "A 50% non-refundable deposit is required to confirm all custom cake and baked-goods orders.",
      allergen: "Our kitchen handles wheat, eggs, dairy, nuts and soy. We cannot guarantee allergen-free preparation.",
      returns:  "Custom orders are non-refundable once baking has commenced. Quality concerns must be raised within 24 hours of collection.",
      delivery: "Delivery availability and fees vary by location. The business is not liable for damage occurring after handover.",
    },
    accentMood: "#7B3F20",
    primaryKeyword: "custom cakes and bakery",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/bakery.jpg",
    crmSubtitle:    "Custom cake and baked-goods tracker",
  },

  beauty: {
    label: "Beauty CRM",
    crmTabs: ["appointments","customers","leads","payments","quotes","reports","tasks","staff","business_profile"],
    dashboardStats: ["Appointments Today","Net Sales","New Bookings","Active Clients"],
    schemaType: "BeautySalon",
    additionalSchemas: ["HealthAndBeauty"],
    defaultLPType: "booking",
    policyClauses: {
      booking:    "A 24-hour cancellation notice is required. No-shows will be charged 50% of the booked service cost.",
      deposit:    "A deposit may be required to secure appointments for high-demand services.",
      returns:    "Services are non-refundable once performed. The business will address documented quality concerns at its discretion.",
      disclaimer: "Clients with known skin conditions or allergies must disclose this prior to treatment.",
    },
    accentMood: "#C9A96E",
    primaryKeyword: "beauty salon and spa services",
    localModifier:  "in Kingston Jamaica",
    bannerImage:    "/crm-banners/beauty.jpg",
    crmSubtitle:    "Appointments and beauty service tracker",
  },

  branding: {
    label: "Branding & Design CRM",
    crmTabs: ["projects","customers","leads","quotes","payments","production_jobs","reports","tasks","integrations"],
    dashboardStats: ["Active Projects","Net Sales","New Enquiries","Pending Deliverables"],
    schemaType: "ProfessionalService",
    defaultLPType: "quote-request",
    policyClauses: {
      deposit:    "A 50% deposit is required before project commencement. The remaining balance is due upon final delivery.",
      disclaimer: "Creative work is provided as-is upon final approval. The business does not guarantee specific business outcomes from design work.",
      returns:    "Revisions are limited to the number stated in the agreed scope. Additional revisions are billed at the standard rate.",
      custom:     "Intellectual property transfers to the client upon receipt of full payment.",
    },
    accentMood: "#2D2D2D",
    primaryKeyword: "branding design and creative services",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/branding.jpg",
    crmSubtitle:    "Design project and client tracker",
  },

  cafe: {
    label: "Café CRM",
    crmTabs: ["kitchen_orders","reservations","customers","products","payments","leads","reports","tasks","suppliers"],
    dashboardStats: ["Orders Today","Net Sales","Table Reservations","New Customers"],
    schemaType: "CafeOrCoffeeShop",
    additionalSchemas: ["FoodEstablishment"],
    defaultLPType: "booking",
    policyClauses: {
      allergen: "Menu items may contain nuts, dairy, gluten, eggs and soy. Please inform staff of dietary requirements.",
      booking:  "Table reservations held for 15 minutes past the confirmed time. Walk-ins are accommodated based on availability.",
      returns:  "Food and beverage complaints must be raised with staff before leaving the premises.",
    },
    accentMood: "#5C3D1E",
    primaryKeyword: "café and coffee shop",
    localModifier:  "in Kingston Jamaica",
    bannerImage:    "/crm-banners/cafe.jpg",
    crmSubtitle:    "Orders, reservations and café tracker",
  },

  crafts: {
    label: "Crafts & Handmade CRM",
    crmTabs: ["custom_orders","customers","products","production_jobs","payments","leads","reports","tasks","suppliers"],
    dashboardStats: ["Active Orders","Net Sales","Custom Requests","New Leads"],
    schemaType: "Store",
    defaultLPType: "lead-capture",
    policyClauses: {
      deposit:  "Custom handmade orders require a 50% deposit. Production begins upon payment confirmation.",
      returns:  "Custom items are non-refundable. Ready-made items may be exchanged within 7 days if unused.",
      delivery: "Shipping timelines are estimates. The business is not liable for carrier delays.",
    },
    accentMood: "#8B5E3C",
    primaryKeyword: "handmade crafts and custom gifts",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/crafts.jpg",
    crmSubtitle:    "Custom orders and production tracker",
  },

  creative: {
    label: "Creative Services CRM",
    crmTabs: ["projects","customers","leads","quotes","payments","production_jobs","reports","tasks"],
    dashboardStats: ["Active Projects","Net Sales","New Enquiries","Deadlines This Week"],
    schemaType: "ProfessionalService",
    defaultLPType: "quote-request",
    policyClauses: {
      deposit:    "50% upfront deposit required. Balance due on delivery.",
      disclaimer: "Content produced is based on client-approved briefs. The client assumes responsibility for accuracy of provided materials.",
      custom:     "All intellectual property transfers to the client upon full payment.",
    },
    accentMood: "#1A1A2E",
    primaryKeyword: "creative services and content production",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/creative.jpg",
    crmSubtitle:    "Creative project and deliverables tracker",
  },

  events: {
    label: "Events CRM",
    crmTabs: ["event_bookings","customers","leads","quotes","payments","reports","tasks","staff","suppliers"],
    dashboardStats: ["Upcoming Events","Net Sales","New Enquiries","Confirmed Bookings"],
    schemaType: "EventVenue",
    additionalSchemas: ["EntertainmentBusiness"],
    defaultLPType: "event-registration",
    policyClauses: {
      booking: "A deposit is required to confirm event bookings. Full payment must be received 7 days before the event date.",
      returns: "Event deposits are non-refundable. Cancellations within 48 hours of the event forfeit the full booking fee.",
      custom:  "The business reserves the right to cancel events due to unforeseen circumstances, with full refund provided.",
    },
    accentMood: "#1A1A1A",
    primaryKeyword: "event planning and venue booking",
    localModifier:  "in Kingston Jamaica",
    bannerImage:    "/crm-banners/events.jpg",
    crmSubtitle:    "Event bookings and coordination tracker",
  },

  fashion: {
    label: "Fashion CRM",
    crmTabs: ["orders","customers","products","deliveries","payments","leads","reports","tasks","inventory"],
    dashboardStats: ["Orders Today","Net Sales","New Customers","Low Stock Items"],
    schemaType: "ClothingStore",
    additionalSchemas: ["Store"],
    defaultLPType: "product-spotlight",
    policyClauses: {
      returns:    "Items may be returned within 14 days in original condition with tags attached and receipt. Sale items are final.",
      delivery:   "Delivery times are estimates. The business is not liable for carrier delays.",
      disclaimer: "Product photography may vary slightly from actual items due to lighting and screen calibration.",
    },
    accentMood: "#1A1A1A",
    primaryKeyword: "fashion clothing and style",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/fashion.jpg",
    crmSubtitle:    "Orders, inventory and fashion tracker",
  },

  accessories: {
    label: "Accessories CRM",
    crmTabs: ["orders","customers","products","deliveries","payments","leads","reports","tasks","inventory"],
    dashboardStats: ["Orders Today","Net Sales","New Customers","Low Stock Items"],
    schemaType: "Store",
    defaultLPType: "product-spotlight",
    policyClauses: {
      returns:  "Accessories may be returned within 14 days in original unused condition with proof of purchase.",
      delivery: "Delivery timelines are estimates only. The business is not responsible for carrier delays.",
    },
    accentMood: "#B8860B",
    primaryKeyword: "fashion accessories and jewellery",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/accessories.jpg",
    crmSubtitle:    "Orders and accessories inventory tracker",
  },

  florist: {
    label: "Florist CRM",
    crmTabs: ["custom_orders","customers","deliveries","products","payments","leads","reports","tasks","suppliers"],
    dashboardStats: ["Orders Today","Net Sales","Deliveries Scheduled","New Enquiries"],
    schemaType: "Florist",
    defaultLPType: "lead-capture",
    policyClauses: {
      deposit:  "Custom floral arrangements require a deposit to confirm. Deposits are non-refundable after arrangement production begins.",
      allergen: "Some flowers may cause allergic reactions. Please inform us of known sensitivities.",
      delivery: "Delivery times are estimates. The business is not liable for delays caused by third-party couriers.",
      returns:  "Perishable items cannot be returned or exchanged once delivered.",
    },
    accentMood: "#7B3F7B",
    primaryKeyword: "florist and flower delivery",
    localModifier:  "in Kingston Jamaica",
    bannerImage:    "/crm-banners/florist.jpg",
    crmSubtitle:    "Floral orders and delivery tracker",
  },

  food: {
    label: "Food & Restaurant CRM",
    crmTabs: ["kitchen_orders","reservations","deliveries","customers","products","payments","leads","reports","tasks","suppliers"],
    dashboardStats: ["Orders Today","Net Sales","Table Reservations","Pending Deliveries"],
    schemaType: "Restaurant",
    additionalSchemas: ["FoodEstablishment"],
    defaultLPType: "booking",
    policyClauses: {
      allergen: "Our kitchen handles common allergens including nuts, dairy, gluten, eggs and shellfish. We cannot guarantee allergen-free preparation.",
      booking:  "Reservations are held for 15 minutes. Walk-ins are subject to availability.",
      returns:  "Food and beverage concerns must be raised with staff before leaving. No refunds on consumed items.",
      delivery: "Delivery coverage and fees apply. Estimated delivery times may vary with traffic and demand.",
    },
    accentMood: "#B22222",
    primaryKeyword: "restaurant and food delivery",
    localModifier:  "in Kingston Jamaica",
    bannerImage:    "/crm-banners/food.jpg",
    crmSubtitle:    "Orders, kitchen and delivery tracker",
  },

  furniture: {
    label: "Furniture CRM",
    crmTabs: ["custom_orders","customers","products","production_jobs","deliveries","payments","quotes","leads","reports","tasks","suppliers"],
    dashboardStats: ["Active Orders","Net Sales","In Production","Pending Deliveries"],
    schemaType: "FurnitureStore",
    additionalSchemas: ["HomeGoodsStore"],
    defaultLPType: "quote-request",
    policyClauses: {
      deposit:    "Custom furniture orders require a minimum 50% deposit. Balance is due before delivery or collection.",
      returns:    "Custom-made items are non-returnable. Ready-made furniture may be returned within 7 days if undamaged and in original packaging.",
      warranty:   "Structural defects reported within 30 days of delivery will be assessed and addressed at the business's discretion.",
      delivery:   "Delivery and installation are available at quoted rates. The customer is responsible for ensuring adequate access.",
      disclaimer: "Natural wood items may display natural grain variations. These are characteristics, not defects.",
    },
    accentMood: "#5C4A1E",
    primaryKeyword: "custom furniture and home furnishings",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/furniture.jpg",
    crmSubtitle:    "Custom furniture orders and production",
  },

  lifestyle: {
    label: "Lifestyle & Wellness CRM",
    crmTabs: ["appointments","customers","leads","payments","quotes","reports","tasks","staff"],
    dashboardStats: ["Appointments Today","Net Sales","New Bookings","Active Clients"],
    schemaType: "HealthAndBeauty",
    defaultLPType: "booking",
    policyClauses: {
      booking:    "24-hour cancellation notice required. Late cancellations and no-shows may incur a fee.",
      disclaimer: "Services are not a substitute for medical advice. Clients with health conditions should consult their physician before booking.",
      returns:    "Sessions are non-refundable once commenced.",
    },
    accentMood: "#2D6A4F",
    primaryKeyword: "wellness and lifestyle services",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/lifestyle.jpg",
    crmSubtitle:    "Wellness appointments and client tracker",
  },

  lighting: {
    label: "Lighting & Electrical CRM",
    crmTabs: ["job_cards","quotes","customers","products","payments","purchase_orders","leads","reports","tasks","suppliers"],
    dashboardStats: ["Jobs This Week","Net Sales","Pending Quotes","New Leads"],
    schemaType: "HomeGoodsStore",
    additionalSchemas: ["Store"],
    defaultLPType: "quote-request",
    policyClauses: {
      deposit:    "A deposit is required to confirm installation or supply orders.",
      warranty:   "Products carry manufacturer warranty. Installation workmanship carries a 30-day warranty.",
      disclaimer: "Electrical installation must comply with local safety regulations. The business does not assume liability for client modifications after handover.",
    },
    accentMood: "#F4A900",
    primaryKeyword: "lighting and electrical supplies",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/lighting.jpg",
    crmSubtitle:    "Lighting jobs and supply tracker",
  },

  logistics: {
    label: "Logistics & Courier CRM",
    crmTabs: ["deliveries","customers","orders","payments","leads","reports","tasks","staff","wholesale_accounts"],
    dashboardStats: ["Deliveries Today","Net Sales","Pending Pickups","Active Routes"],
    schemaType: "DeliveryService",
    additionalSchemas: ["MovingCompany"],
    defaultLPType: "quote-request",
    policyClauses: {
      delivery:   "Delivery timelines are estimates. The business is not liable for delays caused by weather, traffic or force majeure events.",
      returns:    "Claims for damaged or lost packages must be filed within 24 hours of delivery or expected delivery date.",
      disclaimer: "Prohibited items as listed in our terms may not be shipped. The sender is responsible for accurate contents declaration.",
    },
    accentMood: "#003366",
    primaryKeyword: "courier and logistics delivery",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/logistics.jpg",
    crmSubtitle:    "Deliveries, routes and logistics tracker",
  },

  packaging: {
    label: "Packaging & Print CRM",
    crmTabs: ["custom_orders","production_jobs","customers","quotes","products","payments","purchase_orders","leads","reports","tasks","suppliers"],
    dashboardStats: ["Jobs in Production","Net Sales","Pending Quotes","New Enquiries"],
    schemaType: "ProfessionalService",
    defaultLPType: "quote-request",
    policyClauses: {
      deposit:    "Print and packaging orders require a deposit before production. No refunds once printing commences.",
      returns:    "Errors in client-approved artwork are not the responsibility of the business. Proof approval constitutes acceptance.",
      disclaimer: "Printed colours may vary slightly from on-screen previews due to printing process characteristics.",
    },
    accentMood: "#1A3A5C",
    primaryKeyword: "custom packaging and printing",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/packaging.jpg",
    crmSubtitle:    "Print and packaging production tracker",
  },

  retail: {
    label: "Retail CRM",
    crmTabs: ["orders","customers","products","deliveries","payments","leads","purchase_orders","reports","tasks","inventory","suppliers"],
    dashboardStats: ["Orders Today","Net Sales","New Customers","Low Stock Alerts"],
    schemaType: "Store",
    additionalSchemas: ["GroceryStore","ConvenienceStore"],
    defaultLPType: "product-spotlight",
    policyClauses: {
      returns:  "Items may be returned within 14 days in original condition with proof of purchase. Perishables and intimate items are excluded.",
      delivery: "Delivery fees and timelines apply. The business is not liable for delays caused by third-party carriers.",
    },
    accentMood: "#1A1A1A",
    primaryKeyword: "retail store and shopping",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/retail.jpg",
    crmSubtitle:    "Sales, inventory and retail tracker",
  },

  "tech-repair": {
    label: "Tech Repair CRM",
    crmTabs: ["job_cards","customers","products","warranties","payments","quotes","leads","reports","tasks","inventory"],
    dashboardStats: ["Jobs Today","Net Sales","Devices In","Ready for Collection"],
    schemaType: "ElectronicsStore",
    defaultLPType: "booking",
    policyClauses: {
      booking:    "A diagnostic fee applies to all devices regardless of whether repair proceeds.",
      storage:    "Devices uncollected after 14 days of completion notice will be subject to storage fees and eventual disposal.",
      warranty:   "Repairs carry a 30-day warranty on parts and labour. Physical damage after repair voids the warranty.",
      disclaimer: "The business accepts no responsibility for data loss. Clients should back up devices before submission.",
    },
    accentMood: "#0A2342",
    primaryKeyword: "phone and device repair",
    localModifier:  "in Kingston Jamaica",
    bannerImage:    "/crm-banners/tech-repair.jpg",
    crmSubtitle:    "Device repair jobs and job-card tracker",
  },

  variety: {
    label: "Variety Store CRM",
    crmTabs: ["orders","customers","products","payments","leads","purchase_orders","reports","tasks","inventory","suppliers"],
    dashboardStats: ["Sales Today","Net Sales","New Customers","Low Stock Items"],
    schemaType: "ConvenienceStore",
    additionalSchemas: ["Store"],
    defaultLPType: "product-spotlight",
    policyClauses: {
      returns:  "Returns accepted within 7 days with proof of purchase. Items must be unused and in original condition.",
      delivery: "Local delivery available at quoted rates.",
    },
    accentMood: "#C0392B",
    primaryKeyword: "variety store and general goods",
    localModifier:  "in Jamaica",
    bannerImage:    "/crm-banners/variety.jpg",
    crmSubtitle:    "Sales and variety store tracker",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as CategorySlug[];

export function getCategoryConfig(slug: string): CategoryConfig {
  const config = CATEGORY_CONFIG[slug as CategorySlug];
  if (!config) throw new Error(`Unknown category slug: "${slug}". Valid slugs: ${ALL_CATEGORIES.join(", ")}`);
  return config;
}

export const MODULE_LABELS: Record<CRMModuleKey, string> = {
  appointments:       "Appointments",
  bookings:           "Bookings",
  reservations:       "Reservations",
  event_bookings:     "Event Bookings",
  customers:          "Customers",
  leads:              "Leads",
  orders:             "Orders",
  custom_orders:      "Custom Orders",
  products:           "Products",
  inventory:          "Inventory",
  kitchen_orders:     "Kitchen Orders",
  deliveries:         "Deliveries",
  job_cards:          "Job Cards",
  projects:           "Projects",
  production_jobs:    "Production",
  warranties:         "Warranties",
  purchase_orders:    "Purchase Orders",
  suppliers:          "Suppliers",
  wholesale_accounts: "Wholesale",
  quotes:             "Quotes",
  payments:           "Payments",
  reports:            "Reports",
  tasks:              "Tasks",
  staff:              "Staff",
  integrations:       "Integrations",
  business_profile:   "Profile",
};
