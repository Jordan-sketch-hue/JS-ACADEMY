import { AccessDeniedClient } from "@/components/auth/access-denied-client";
import { getAllowedOperatorEmail } from "@/lib/auth/allowed-operator";

export const dynamic = "force-dynamic";

export default function AccessDeniedPage() {
  return <AccessDeniedClient allowedEmail={getAllowedOperatorEmail()} />;
}
