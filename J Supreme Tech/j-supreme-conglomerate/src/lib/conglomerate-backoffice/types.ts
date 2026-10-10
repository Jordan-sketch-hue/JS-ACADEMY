export type BackofficeAuthKind =
  | "clerk"
  | "supabase"
  | "payload"
  | "key" // capability / magic-link key (e.g. Ship 2 Door /back-office?key=…)
  | "password" // single shared password (e.g. Language Cradle CMS)
  | "none";

export type BackofficePanel = {
  label: string;
  /** Absolute URL or app-relative path (when internal is true). */
  href: string;
  auth: BackofficeAuthKind;
  description?: string;
};

export type ProvisioningTarget =
  | "abo-tours"
  | "solid-trust"
  | "solace-auto"
  | "bp-courier-payload"
  | "language-cradle"
  | "ship2door";

export type BackofficeBrand = {
  id: string;
  name: string;
  websiteUrl: string;
  tagline?: string;
  /** Public path to the real brand logo, e.g. "/brands/language-cradle.webp". */
  logo?: string;
  vercelProjectName?: string;
  /** When true, same Clerk application as this OS (satellite domains in Clerk Dashboard). */
  clerkShared?: boolean;
  /** Keys to call POST /api/backoffice/credentials with from the "+ New credential" modal. */
  provisioningTargets?: ProvisioningTarget[];
  panels: BackofficePanel[];
};
