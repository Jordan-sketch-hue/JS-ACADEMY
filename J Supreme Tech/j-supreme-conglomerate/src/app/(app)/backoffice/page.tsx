import { ConglomerateBackofficeHub } from "@/components/backoffice/conglomerate-backoffice-hub";
import { OPERATORS, OPERATORS_NOTE } from "@/lib/conglomerate-backoffice/architect";
import { getExternalAccess } from "@/lib/conglomerate-backoffice/external-access";
import { isClerkConfigured } from "@/lib/env/clerk";

export const dynamic = "force-dynamic";

export default function BackofficePage() {
  return (
    <ConglomerateBackofficeHub
      operators={OPERATORS}
      operatorsNote={OPERATORS_NOTE}
      externalAccess={getExternalAccess()}
      clerkEnabled={isClerkConfigured()}
    />
  );
}
