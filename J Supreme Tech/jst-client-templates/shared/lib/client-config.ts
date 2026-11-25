/**
 * client-config.ts — 19-module enterprise ClientConfig schema (JBOS Level 1–6).
 *
 * This replaces the thin shared/types/config.ts ClientConfig.
 * Import ClientConfig from here everywhere — the old file re-exports from here
 * for backwards compatibility.
 *
 * Module map:
 *  1. identity      — brand, logo, colors
 *  2. seo           — metadata, keywords, Open Graph
 *  3. location      — address, service area, map
 *  4. i18n          — locale, currency, time zone
 *  5. legal         — jurisdiction, policy toggles
 *  6. cookie        — consent banner config
 *  7. analytics     — GA4, GTM, Meta Pixel
 *  8. landing       — LP slug, CTA, offer
 *  9. conversion    — UTM, A/B experiment IDs
 * 10. category      — slug → drives CRM tabs and schema
 * 11. content       — blog, CMS, gallery feeds
 * 12. footer        — links, trust marks, socials
 * 13. accessibility — WCAG tier, focus-visible, skip-nav
 * 14. integrations  — WiPay, Stripe, WhatsApp, Resend
 * 15. trust         — badges, awards, review counts
 * 16. payments      — tiers, currencies, gateways
 * 17. notifications — WA, email, SMS
 * 18. automation    — lead routing, follow-up sequences
 * 19. enterprise    — SSO, RBAC, multi-tenant, SLA
 */

import type { CategorySlug } from "./category-config";

// ─── 1. Identity ──────────────────────────────────────────────────────────────

export interface IdentityConfig {
  name: string;
  tagline?: string;
  logo: string;
  logoAlt?: string;
  favicon?: string;
  colors: {
    accent: string;
    accentFg: string;
    bg?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
}

// ─── 2. SEO ───────────────────────────────────────────────────────────────────

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  twitterHandle?: string;
  canonicalBase?: string;
  robots?: "index,follow" | "noindex,nofollow" | "noindex,follow";
  schemaOrg?: Record<string, unknown>;
}

// ─── 3. Location ──────────────────────────────────────────────────────────────

export interface LocationConfig {
  address?: string;
  city?: string;
  parish?: string;
  country?: string;
  postalCode?: string;
  coordinates?: { lat: number; lng: number };
  serviceAreas?: string[];
  googleMapsUrl?: string;
}

// ─── 4. i18n ──────────────────────────────────────────────────────────────────

export interface I18nConfig {
  locale: string;          // e.g. "en-JM"
  currency: string;        // e.g. "JMD"
  currencySymbol: string;  // e.g. "J$"
  timezone: string;        // e.g. "America/Jamaica"
  dateFormat?: string;     // e.g. "DD/MM/YYYY"
  markets?: string[];      // additional market locales
}

// ─── 5. Legal ─────────────────────────────────────────────────────────────────

export interface LegalConfig {
  jurisdiction: string;        // e.g. "Jamaica"
  registeredName?: string;
  registrationNumber?: string;
  policies: {
    privacyPolicy: boolean;
    termsOfService: boolean;
    cookiePolicy: boolean;
    refundPolicy: boolean;
    bookingPolicy: boolean;
    shippingPolicy: boolean;
  };
  gdprApplicable?: boolean;
  dataProtectionOfficer?: string;
}

// ─── 6. Cookie Consent ────────────────────────────────────────────────────────

export interface CookieConsentConfig {
  enabled: boolean;
  provider?: "custom" | "cookieyes" | "onetrust";
  analyticsConsentRequired: boolean;
  marketingConsentRequired: boolean;
  position?: "bottom" | "bottom-left" | "bottom-right";
}

// ─── 7. Analytics ─────────────────────────────────────────────────────────────

export interface AnalyticsConfig {
  ga4MeasurementId?: string;
  gtmContainerId?: string;
  metaPixelId?: string;
  clarityProjectId?: string;
  hotjarId?: string;
  serverSideEvents?: boolean;
  metaConversionsApiToken?: string;
}

// ─── 8. Landing Pages ─────────────────────────────────────────────────────────

export interface LandingConfig {
  defaultSlug?: string;
  defaultCTA?: string;
  heroHeadline?: string;
  heroSubline?: string;
  offerBadge?: string;
  urgencyDeadline?: string;
}

// ─── 9. Conversion ────────────────────────────────────────────────────────────

export interface ConversionConfig {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  abTestId?: string;
  conversionGoals?: string[];
}

// ─── 10. Category ─────────────────────────────────────────────────────────────

export interface CategoryModuleConfig {
  slug: CategorySlug;
  overrideSchemaType?: string;
  overrideCRMTabs?: string[];
}

// ─── 11. Content ──────────────────────────────────────────────────────────────

export interface ContentConfig {
  blogEnabled?: boolean;
  blogSlug?: string;
  galleryEnabled?: boolean;
  galleryBucket?: string;
  cmsProvider?: "supabase" | "sanity" | "contentful";
  menuEnabled?: boolean;
}

// ─── 12. Footer ───────────────────────────────────────────────────────────────

export interface FooterConfig {
  copyrightName?: string;
  privacyUrl?: string;
  termsUrl?: string;
  links?: Array<{ label: string; href: string }>;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  trustMarks?: string[];
}

// ─── 13. Accessibility ────────────────────────────────────────────────────────

export interface AccessibilityConfig {
  wcagTier: "A" | "AA" | "AAA";
  skipNavEnabled: boolean;
  focusVisibleEnabled: boolean;
  ariaLandmarks: boolean;
  colorContrastAuditPassed?: boolean;
}

// ─── 14. Integrations ─────────────────────────────────────────────────────────

export interface IntegrationsConfig {
  whatsappNumber?: string;
  whatsappGreeting?: string;
  calendarProvider?: "google" | "calendly" | "acuity";
  calendarUrl?: string;
  crmExternalId?: string;
}

// ─── 15. Trust ────────────────────────────────────────────────────────────────

export interface TrustConfig {
  reviewCount?: number;
  averageRating?: number;      // 1–5
  reviewSource?: string;       // "Google", "Facebook" — human-verified only
  badges?: string[];
  yearsInBusiness?: number;
  clientCount?: number;
}

// ─── 16. Payments ─────────────────────────────────────────────────────────────

export type PaymentTier = "starter" | "growth" | "enterprise";
export type PaymentGateway = "wipay" | "handypay" | "stripe" | "cash";

export interface PaymentsConfig {
  tier: PaymentTier;
  gateways: PaymentGateway[];
  primaryCurrency: string;
  passFeesToCustomer?: boolean;
  depositPercent?: number;
}

// ─── 17. Notifications ────────────────────────────────────────────────────────

export interface NotificationsConfig {
  whatsappEnabled?: boolean;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  notifyOnNewLead?: boolean;
  notifyOnNewBooking?: boolean;
  notifyOnNewOrder?: boolean;
  recipientEmail?: string;
}

// ─── 18. Automation ───────────────────────────────────────────────────────────

export interface AutomationConfig {
  leadRoutingEnabled?: boolean;
  followUpSequenceEnabled?: boolean;
  followUpDelayHours?: number;
  autoAckWhatsApp?: boolean;
  aiDraftReplies?: boolean;
}

// ─── 19. Enterprise ───────────────────────────────────────────────────────────

export interface EnterpriseConfig {
  multiTenant?: boolean;
  tenantId?: string;
  ssoProvider?: "clerk" | "okta" | "azure-ad";
  rbacEnabled?: boolean;
  auditLogEnabled?: boolean;
  slaTarget?: "99.5" | "99.9" | "99.99";
  whitelabelEnabled?: boolean;
}

// ─── Full ClientConfig ────────────────────────────────────────────────────────

export interface ClientConfig {
  // Module 1 (required)
  identity: IdentityConfig;
  // Module 2
  seo?: SEOConfig;
  // Module 3
  location?: LocationConfig;
  // Module 4
  i18n?: Partial<I18nConfig>;
  // Module 5
  legal?: Partial<LegalConfig>;
  // Module 6
  cookieConsent?: Partial<CookieConsentConfig>;
  // Module 7
  analytics?: Partial<AnalyticsConfig>;
  // Module 8
  landing?: Partial<LandingConfig>;
  // Module 9
  conversion?: Partial<ConversionConfig>;
  // Module 10 (required)
  category: CategoryModuleConfig;
  // Module 11
  content?: Partial<ContentConfig>;
  // Module 12
  footer?: Partial<FooterConfig>;
  // Module 13
  accessibility?: Partial<AccessibilityConfig>;
  // Module 14
  integrations?: Partial<IntegrationsConfig>;
  // Module 15
  trust?: Partial<TrustConfig>;
  // Module 16
  payments?: Partial<PaymentsConfig>;
  // Module 17
  notifications?: Partial<NotificationsConfig>;
  // Module 18
  automation?: Partial<AutomationConfig>;
  // Module 19
  enterprise?: Partial<EnterpriseConfig>;

  // ── Legacy flat fields (kept for backwards compat with existing templates) ──
  /** @deprecated Use identity.name */
  name?: string;
  /** @deprecated Use category.slug */
  categorySlug?: string;
  /** @deprecated Use identity.logo */
  logo?: string;
  /** @deprecated Use identity.colors */
  colors?: { accent: string; accentFg: string; bg?: string; text?: string };
  contact?: {
    phone: string;
    whatsapp: string;
    email?: string;
    address?: string;
  };
  socials?: { tiktok?: string; instagram?: string; facebook?: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve the effective name, supporting both legacy flat field and new module */
export function resolveClientName(config: ClientConfig): string {
  return config.identity?.name ?? config.name ?? "Business";
}

/** Resolve the effective accent color */
export function resolveAccent(config: ClientConfig): string {
  return config.identity?.colors?.accent ?? config.colors?.accent ?? "#000000";
}

/** Resolve the effective category slug */
export function resolveCategorySlug(config: ClientConfig): CategorySlug {
  return config.category?.slug ?? (config.categorySlug as CategorySlug) ?? "retail";
}

/** Default i18n for Jamaica market */
export const DEFAULT_I18N_JM: I18nConfig = {
  locale:         "en-JM",
  currency:       "JMD",
  currencySymbol: "J$",
  timezone:       "America/Jamaica",
  dateFormat:     "DD/MM/YYYY",
};

/** Default i18n for USD growth market */
export const DEFAULT_I18N_USD: I18nConfig = {
  locale:         "en-US",
  currency:       "USD",
  currencySymbol: "$",
  timezone:       "America/New_York",
  dateFormat:     "MM/DD/YYYY",
};
