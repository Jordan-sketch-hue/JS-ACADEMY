"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireOwnerClerkId } from "@/lib/session";
import { requireBrandTenant, ACTIVE_BRAND_COOKIE } from "@/lib/sales/active-brand";
import { listBrands, updateBrand, seedAllBrands } from "@/lib/sales/brands";
import { runSalesEngine } from "@/lib/sales/engine";
import { updateSalesSettings, getSalesSettings } from "@/lib/sales/settings";
import {
  upsertProspects,
  updateProspect,
  deleteProspect,
  type NewProspect,
} from "@/lib/sales/prospects";
import { setCampaignStatus } from "@/lib/sales/campaigns";
import { updateTemplate } from "@/lib/sales/templates";
import { addSuppression, removeSuppression } from "@/lib/sales/suppressions";
import { insertMessage, markThreadRead } from "@/lib/sales/messages";
import { insertEmail } from "@/lib/sales/emails";
import { sendSalesEmail } from "@/lib/sales/send";
import { escapeHtml } from "@/lib/sales/compliance";
import type { Region, SalesSettings, ServiceFocus } from "@/lib/sales/types";

const REGIONS = new Set(["local", "caribbean", "europe", "americas"]);
const FOCUS = new Set(["tech", "marketing", "both", "promo"]);

function revalidateSales() {
  for (const p of ["/sales", "/sales/prospects", "/sales/inbox", "/sales/campaigns", "/sales/templates", "/sales/settings"]) {
    revalidatePath(p);
  }
}

export async function runSalesEngineNowAction() {
  const owner = await requireBrandTenant();
  const result = await runSalesEngine(owner, { ignoreWindow: true });
  revalidateSales();
  return { ok: true as const, result };
}

export async function updateSalesSettingsAction(patch: Partial<SalesSettings>) {
  const owner = await requireBrandTenant();
  const res = await updateSalesSettings(owner, patch);
  revalidateSales();
  return res.ok ? { ok: true as const } : { ok: false as const, error: res.error };
}

/** Parse pasted lines: email[,company[,contact_name[,region[,country[,industry[,focus]]]]]] */
export async function addProspectsAction(raw: string, defaultRegion?: Region) {
  const owner = await requireBrandTenant();
  const rows: NewProspect[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const cols = t.split(",").map((c) => c.trim());
    const email = cols[0];
    if (!email || !/.+@.+\..+/.test(email)) continue;
    const region = (cols[3] && REGIONS.has(cols[3]) ? cols[3] : defaultRegion || "local") as Region;
    const focus = (cols[6] && FOCUS.has(cols[6]) ? cols[6] : "both") as ServiceFocus;
    rows.push({
      email,
      company: cols[1] || email.split("@")[1] || "Unknown",
      contact_name: cols[2] || null,
      first_name: cols[2] ? cols[2].split(/\s+/)[0] : null,
      region,
      country: cols[4] || null,
      industry: cols[5] || null,
      service_focus: focus,
      source: "csv",
      email_status: "unverified",
    });
  }
  if (!rows.length) return { ok: false as const, error: "No valid email rows found." };
  const r = await upsertProspects(owner, rows);
  revalidateSales();
  return { ok: true as const, ...r };
}

export async function deleteProspectAction(id: string) {
  const owner = await requireBrandTenant();
  await deleteProspect(owner, id);
  revalidateSales();
  return { ok: true as const };
}

export async function suppressProspectAction(email: string) {
  const owner = await requireBrandTenant();
  await addSuppression(owner, email, "manual", "operator");
  revalidateSales();
  return { ok: true as const };
}

export async function removeSuppressionAction(email: string) {
  const owner = await requireBrandTenant();
  await removeSuppression(owner, email);
  revalidateSales();
  return { ok: true as const };
}

export async function disqualifyProspectAction(id: string) {
  const owner = await requireBrandTenant();
  await updateProspect(owner, id, { status: "disqualified", next_action_at: null });
  revalidateSales();
  return { ok: true as const };
}

export async function setCampaignStatusAction(id: string, status: "active" | "paused") {
  const owner = await requireBrandTenant();
  await setCampaignStatus(owner, id, status);
  revalidateSales();
  return { ok: true as const };
}

export async function updateTemplateAction(
  id: string,
  patch: { subject?: string; body_md?: string; name?: string },
) {
  const owner = await requireBrandTenant();
  await updateTemplate(owner, id, patch);
  revalidateSales();
  return { ok: true as const };
}

export async function markThreadReadAction(threadId: string) {
  const owner = await requireBrandTenant();
  await markThreadRead(owner, threadId);
  revalidatePath("/sales/inbox");
  return { ok: true as const };
}

/** Reply to a prospect from the in-app inbox (1:1 — light wrapper, still BCCs you). */
export async function sendReplyAction(
  toEmail: string,
  subject: string,
  body: string,
  prospectId?: string | null,
) {
  const owner = await requireBrandTenant();
  const s = await getSalesSettings(owner);
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1f2937;">${body
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("")}</div>`;

  const res = await sendSalesEmail({
    from: s.from_email,
    fromName: s.from_name,
    to: toEmail,
    subject: subject || "Re: your enquiry",
    html,
    text: body,
    replyTo: s.reply_to,
    bcc: s.bcc_email,
    tags: [{ name: "kind", value: "sales_reply" }],
  });
  if (!res.ok) return { ok: false as const, error: res.error };

  const emailId = await insertEmail(owner, {
    prospect_id: prospectId ?? null,
    thread_id: toEmail.toLowerCase(),
    to_email: toEmail,
    from_email: s.from_email,
    reply_to: s.reply_to,
    subject: subject || "Re: your enquiry",
    html,
    text: body,
    status: "sent",
  });
  await insertMessage(owner, {
    direction: "outbound",
    prospect_id: prospectId ?? null,
    email_id: emailId,
    thread_id: toEmail.toLowerCase(),
    from_email: s.from_email,
    to_email: toEmail,
    subject: subject || "Re: your enquiry",
    text: body,
    html,
  });
  revalidatePath("/sales/inbox");
  return { ok: true as const, id: res.id };
}

/* ----------------------- Multi-brand controls ----------------------- */

/** Switch the active brand (cookie) and optionally redirect. Form action. */
export async function switchBrandFormAction(formData: FormData) {
  await requireOwnerClerkId();
  const slug = String(formData.get("slug") || "");
  const to = String(formData.get("redirect") || "");
  // Accept any brand the switcher/cards can show (the full roster), so no option
  // is ever a silent no-op.
  const brands = await listBrands({});
  if (brands.some((b) => b.slug === slug)) {
    (await cookies()).set(ACTIVE_BRAND_COOKIE, slug, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  revalidateSales();
  if (to) redirect(to);
}

/** Flip the active brand's per-brand sending_live switch. Form action. */
export async function toggleBrandLiveAction(formData: FormData) {
  const slug = await requireBrandTenant();
  const live = String(formData.get("live") || "") === "1";
  await updateBrand(slug, { sending_live: live });
  revalidateSales();
}

/** Re-seed / refresh the whole roster from code (BRAND_SEEDS). Form action. */
export async function reseedRosterAction() {
  const operator = await requireOwnerClerkId();
  await seedAllBrands(operator);
  revalidateSales();
}

/** Import opt-in B2C contacts (email[,first_name]) — tagged promo + consented. */
export async function addOptinContactsAction(raw: string) {
  const owner = await requireBrandTenant();
  const rows: NewProspect[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const cols = t.split(",").map((c) => c.trim());
    const email = cols[0];
    if (!email || !/.+@.+\..+/.test(email)) continue;
    const name = cols[1] || null;
    rows.push({
      email,
      company: name || "Customer",
      contact_name: name,
      first_name: name ? name.split(/\s+/)[0] : null,
      region: "local",
      service_focus: "promo",
      source: "manual",
      email_status: "verified",
      notes: "opt-in import",
    });
  }
  if (!rows.length) return { ok: false as const, error: "No valid emails found." };
  const r = await upsertProspects(owner, rows);
  revalidateSales();
  return { ok: true as const, ...r };
}
