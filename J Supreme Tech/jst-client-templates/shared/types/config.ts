/**
 * shared/types/config.ts — backwards-compat re-export.
 *
 * The authoritative ClientConfig now lives in shared/lib/client-config.ts.
 * This file is kept so existing imports don't break while templates migrate.
 *
 * New code: import from "../../shared/lib/client-config"
 */

export type {
  ClientConfig,
  IdentityConfig,
  SEOConfig,
  LocationConfig,
  I18nConfig,
  LegalConfig,
  CookieConsentConfig,
  AnalyticsConfig,
  LandingConfig,
  ConversionConfig,
  CategoryModuleConfig,
  ContentConfig,
  FooterConfig,
  AccessibilityConfig,
  IntegrationsConfig,
  TrustConfig,
  PaymentsConfig,
  PaymentTier,
  PaymentGateway,
  NotificationsConfig,
  AutomationConfig,
  EnterpriseConfig,
} from "../lib/client-config";

export {
  resolveClientName,
  resolveAccent,
  resolveCategorySlug,
  DEFAULT_I18N_JM,
  DEFAULT_I18N_USD,
} from "../lib/client-config";

export type { CategorySlug } from "../lib/category-config";
