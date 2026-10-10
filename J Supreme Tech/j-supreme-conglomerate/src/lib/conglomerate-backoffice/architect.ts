/**
 * Pre-provisioned operator identities that work on every back office we
 * manage from the J Supreme Conglomerate CRM.
 *
 * Each email is recognised by:
 *   - AbooTours admin   (Supabase auth · abo_admins.role)
 *   - Solace back office (Supabase auth · SOLACE_ADMIN_EMAILS env)
 *   - BP Courier /admin  (Payload CMS · courier.users.role = "super_admin")
 *   - BP Courier ops UI  (Clerk publicMetadata.role = "admin" — sign in via CRM)
 *
 * Rotate by updating BOTH this file AND each auth provider's record (run the
 * provisioning API at /api/backoffice/credentials with the new password).
 */

export type OperatorIdentity = {
  email: string;
  password: string;
  name: string;
  role: string;
  note?: string;
  accent: string;
};

export const OPERATORS: OperatorIdentity[] = [
  {
    email: "architect@jsupreme.cloud",
    password: "JSupreme-Architect-2026!",
    name: "Architect",
    role: "Owner / architect",
    accent: "from-purple-500 to-indigo-600",
    note: "Primary owner identity — super-admin everywhere.",
  },
  {
    email: "ops@jsupreme.cloud",
    password: "JSupreme-Ops-2026!",
    name: "Operations Manager",
    role: "Admin / operations",
    accent: "from-blue-500 to-cyan-600",
    note: "Day-to-day dispatch + customer operations across all brands.",
  },
  {
    email: "support@jsupreme.cloud",
    password: "JSupreme-Support-2026!",
    name: "Support Lead",
    role: "Admin / support",
    accent: "from-emerald-500 to-teal-600",
    note: "Customer support, content edits, and lead follow-up.",
  },
];

export const OPERATORS_NOTE =
  "These credentials are pre-provisioned and verified live against every back office below. Copy and store in your password manager — the password is shown here so any owner can sign in without help. Rotate by running + Credential with a new password.";
