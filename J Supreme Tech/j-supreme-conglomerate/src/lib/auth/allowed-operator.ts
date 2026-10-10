/** Only this email may use the operator app when Clerk is enabled. */
const DEFAULT_ALLOWED_OPERATOR_EMAIL = "jordanmorrisr@gmail.com";

export function getAllowedOperatorEmail(): string {
  return (
    process.env.ALLOWED_OPERATOR_EMAIL?.trim().toLowerCase() ||
    DEFAULT_ALLOWED_OPERATOR_EMAIL
  );
}

export function isAllowedOperatorEmail(
  email: string | null | undefined,
): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === getAllowedOperatorEmail();
}
