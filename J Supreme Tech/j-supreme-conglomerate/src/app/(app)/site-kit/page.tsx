import { SiteKitGeneratorClient } from "@/components/site-kit/site-kit-generator-client";
import { getCrmClientById } from "@/lib/data/crm";
import { getOwnerClerkId } from "@/lib/session";

export default async function SiteKitPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const owner = await getOwnerClerkId();
  const params = await searchParams;
  const rawClientId = typeof params.clientId === "string" ? params.clientId.trim() : "";
  const initialClient =
    owner && rawClientId ? await getCrmClientById(owner, rawClientId) : null;

  const deployEnabled = Boolean(process.env.VERCEL_ACCESS_TOKEN?.trim());

  const notes = initialClient?.notes?.trim();
  const services = initialClient?.services_needed?.trim();

  return (
    <SiteKitGeneratorClient
      deployEnabled={deployEnabled}
      initialClientId={rawClientId || undefined}
      initialFromClient={
        initialClient
          ? {
              projectName: initialClient.business_name,
              description: notes || services || undefined,
              baseUrl: initialClient.website?.trim() || undefined,
              contactEmail: initialClient.email?.trim() || undefined,
            }
          : undefined
      }
    />
  );
}
