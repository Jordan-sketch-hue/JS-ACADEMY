import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { getSalesSettings } from "@/lib/sales/settings";
import { DEFAULT_TEMPLATES } from "@/lib/sales/templates";
import { brandSeedFor, ensureBrandSeeded } from "@/lib/sales/brands";

/**
 * Idempotently seed a brand's Sales Department on first use: settings row,
 * starter templates, and one default campaign per enabled region. `owner` is the
 * brand slug. Safe to call on every page load / engine tick — it no-ops once
 * seeded. For a registered brand it seeds brand-specific settings + copy; for any
 * other tenant it falls back to the generic starter templates.
 */
export async function ensureSalesDefaults(owner: string): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;

  // Brand-specific settings + templates land BEFORE getSalesSettings would create
  // a generic row, so each brand keeps its own from-address, copy and ICP.
  const seed = brandSeedFor(owner);
  if (seed) await ensureBrandSeeded(seed);

  // getSalesSettings creates the settings row (if still missing) + stamps warmup.
  const settings = await getSalesSettings(owner);

  // Templates — generic fallback only for non-registered tenants.
  if (!seed) {
    const { count: tplCount } = await sb
      .from("sales_templates")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", owner);

    if ((tplCount ?? 0) === 0) {
      await sb.from("sales_templates").insert(
        DEFAULT_TEMPLATES.map((t) => ({ ...t, owner_clerk_id: owner })),
      );
    }
  }

  // Campaigns: one per enabled region, pointed at step-1 / follow-up templates.
  const { count: campCount } = await sb
    .from("sales_campaigns")
    .select("id", { count: "exact", head: true })
    .eq("owner_clerk_id", owner);

  if ((campCount ?? 0) === 0) {
    const { data: tpls } = await sb
      .from("sales_templates")
      .select("id,step,service_focus")
      .eq("owner_clerk_id", owner);
    const step1 = (tpls ?? []).find(
      (t: { step: number; service_focus: string }) =>
        t.step === 1 && t.service_focus === "both",
    ) as { id: string } | undefined;
    const step2 = (tpls ?? []).find(
      (t: { step: number }) => t.step === 2,
    ) as { id: string } | undefined;

    const labels: Record<string, string> = {
      local: "Jamaica Outreach",
      caribbean: "Caribbean Outreach",
      europe: "Europe Outreach",
      americas: "Americas Outreach",
    };
    await sb.from("sales_campaigns").insert(
      settings.regions.map((region) => ({
        owner_clerk_id: owner,
        name: labels[region] ?? `${region} Outreach`,
        region,
        service_focus: "both",
        status: "active",
        daily_cap: Math.ceil(settings.daily_target / settings.regions.length) + 5,
        template_id: step1?.id ?? null,
        followup_template_id: step2?.id ?? null,
        followup_days: 3,
        max_steps: 3,
      })),
    );
  }
}
