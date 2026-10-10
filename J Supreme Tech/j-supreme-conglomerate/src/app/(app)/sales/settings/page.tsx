import { requireBrandTenant } from "@/lib/sales/active-brand";
import { ensureSalesDefaults } from "@/lib/sales/defaults";
import { getSalesSettings } from "@/lib/sales/settings";
import { SettingsClient } from "@/components/sales/settings-client";

export const metadata = { title: "Sales Settings · J Supreme" };
export const dynamic = "force-dynamic";

export default async function SalesSettingsPage() {
  const owner = await requireBrandTenant();
  await ensureSalesDefaults(owner);
  const settings = await getSalesSettings(owner);
  return (
    <SettingsClient
      settings={settings}
      resendConfigured={Boolean(process.env.RESEND_API_KEY?.trim())}
      hunterConfigured={Boolean(process.env.HUNTER_API_KEY?.trim())}
    />
  );
}
