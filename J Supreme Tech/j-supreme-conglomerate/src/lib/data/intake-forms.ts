import { getServiceSupabase } from "@/lib/supabase/admin";
import { createCrmDeal } from "@/lib/data/crm";
import { createTodo } from "@/lib/data/todos";
import type { CreateCrmDealInput } from "@/lib/data/crm-records";
import {
  INTAKE_FILE_BUCKET,
  parseAttachmentsColumn,
  signIntakeAttachments,
  uploadIntakeSubmissionFiles,
  type IntakeAttachmentMeta,
} from "@/lib/data/intake-attachments";

export type IntakeFieldType = "text" | "textarea" | "email" | "phone" | "select";

export type IntakeField = {
  id: string;
  label: string;
  type: IntakeFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

export type IntakeSection = {
  id: string;
  title: string;
  description?: string;
  fields: IntakeField[];
};

export type ClientIntakeForm = {
  id: string;
  owner_clerk_id: string;
  share_token: string;
  title: string;
  intro: string | null;
  sections: IntakeSection[];
  is_active: boolean;
  sync_to_crm: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientIntakeSubmission = {
  id: string;
  form_id: string;
  owner_clerk_id: string;
  answers: Record<string, string>;
  contact_name: string | null;
  contact_email: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  /** File metadata; signed download URLs added when listing for the workspace owner. */
  attachments: IntakeAttachmentMeta[];
  attachmentLinks?: Array<IntakeAttachmentMeta & { downloadUrl: string }>;
};

function iso(d = new Date()) {
  return d.toISOString();
}

function newId() {
  return crypto.randomUUID();
}

export function generateShareToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

/** Default sections: project type → contact → company → goals. */
export function legacyDefaultIntakeSections(): IntakeSection[] {
  return [
    {
      id: newId(),
      title: "What we’re helping with",
      description:
        "Pick the closest match — we route your answers to the right team.",
      fields: [
        {
          id: newId(),
          label: "Primary focus",
          type: "select",
          placeholder: "Choose a category",
          required: true,
          options: [
            "Websites",
            "Web & mobile apps",
            "Marketing & creative",
            "Finance & advisory",
            "SaaS / product",
            "General",
          ],
        },
        {
          id: newId(),
          label: "Project context (links, scope, or notes)",
          type: "textarea",
          placeholder:
            "Paste reference links, pasted briefs, or extra context — not for file uploads (use Supporting files near Submit).",
          required: false,
        },
      ],
    },
    {
      id: newId(),
      title: "Contact",
      description: "How we should follow up.",
      fields: [
        {
          id: newId(),
          label: "Your name",
          type: "text",
          placeholder: "Jane Doe",
          required: true,
        },
        {
          id: newId(),
          label: "Work email",
          type: "email",
          placeholder: "you@company.com",
          required: true,
        },
        {
          id: newId(),
          label: "Phone (optional)",
          type: "phone",
          placeholder: "+1 …",
          required: false,
        },
      ],
    },
    {
      id: newId(),
      title: "Company",
      description: "Who the engagement is for.",
      fields: [
        {
          id: newId(),
          label: "Company or brand name",
          type: "text",
          required: true,
        },
        {
          id: newId(),
          label: "Industry / niche",
          type: "text",
          required: false,
        },
        {
          id: newId(),
          label: "Website",
          type: "text",
          placeholder: "https://",
          required: false,
        },
      ],
    },
    {
      id: newId(),
      title: "Goals & fit",
      description: "What you need and when.",
      fields: [
        {
          id: newId(),
          label: "What problem are you solving?",
          type: "textarea",
          required: true,
        },
        {
          id: newId(),
          label: "Ideal timeline",
          type: "text",
          placeholder: "e.g. Launch in Q3",
          required: false,
        },
        {
          id: newId(),
          label: "Rough budget or range (optional)",
          type: "text",
          required: false,
        },
        {
          id: newId(),
          label: "How did you hear about us?",
          type: "select",
          options: ["Referral", "Search", "Social", "Event", "Other"],
          required: false,
        },
      ],
    },
  ];
}

export const PUBLIC_SUPPLEMENTAL_INTAKE_FIELDS: IntakeField[] = [
  {
    id: "__preferred_contact_method",
    label: "Best way to contact you",
    type: "select",
    required: false,
    options: ["WhatsApp", "Phone call", "Email", "Text message", "Any is fine"],
  },
  {
    id: "__support_or_accessibility_needs",
    label: "Anything we should know to make the process easier for you?",
    type: "textarea",
    placeholder:
      "Example: preferred meeting times, language preference, accessibility needs, help explaining technical terms, or someone else we should include.",
    required: false,
  },
  {
    id: "__anything_else",
    label: "Anything else you want to add?",
    type: "textarea",
    placeholder:
      "Share extra details, questions, links, ideas, concerns, or information you are not sure where to place.",
    required: false,
  },
];

export const PUBLIC_SUPPLEMENTAL_INTAKE_SECTION: IntakeSection = {
  id: "__extra_details",
  title: "Extra details",
  description:
    "Optional. Use this area if the questions above do not fully fit your situation.",
  fields: PUBLIC_SUPPLEMENTAL_INTAKE_FIELDS,
};

export function withPublicSupplementalSection(sections: IntakeSection[]): IntakeSection[] {
  if (sections.some((section) => section.id === PUBLIC_SUPPLEMENTAL_INTAKE_SECTION.id)) {
    return sections;
  }
  return [...sections, PUBLIC_SUPPLEMENTAL_INTAKE_SECTION];
}

const SUPPLEMENTAL_FIELD_LABELS = new Map(
  PUBLIC_SUPPLEMENTAL_INTAKE_FIELDS.map((field) => [field.id, field.label]),
);

/** Default sections for new public client intake forms. */
export function defaultIntakeSections(): IntakeSection[] {
  return [
    {
      id: newId(),
      title: "What do you need help with?",
      description:
        "Choose the closest match. If you are not sure, pick the option that feels closest and explain below.",
      fields: [
        {
          id: newId(),
          label: "Main things you want help with",
          type: "select",
          placeholder: "Choose a category",
          required: true,
          options: [
            "Website or landing page",
            "Mobile app",
            "Online store / e-commerce",
            "Booking or reservation system",
            "CRM, customer records, or dashboard",
            "Automation or internal business tool",
            "Branding, graphics, or presentation",
            "Full digital system",
            "Not sure yet",
          ],
        },
        {
          id: newId(),
          label: "What are you trying to build, fix, or improve?",
          type: "textarea",
          placeholder: "Tell us in your own words. Short answers are okay.",
          required: true,
        },
        {
          id: newId(),
          label: "Helpful links or examples",
          type: "textarea",
          placeholder:
            "Paste website links, social pages, examples you like, or competitor references. You can also upload files near Submit.",
          required: false,
        },
      ],
    },
    {
      id: newId(),
      title: "Contact information",
      description: "How we should follow up with you.",
      fields: [
        {
          id: newId(),
          label: "Your name",
          type: "text",
          placeholder: "Jane Doe",
          required: true,
        },
        {
          id: newId(),
          label: "Email",
          type: "email",
          placeholder: "you@company.com",
          required: true,
        },
        {
          id: newId(),
          label: "WhatsApp or phone number",
          type: "phone",
          placeholder: "+1 ...",
          required: false,
        },
      ],
    },
    {
      id: newId(),
      title: "Business or organization",
      description:
        "If this is for a personal brand, nonprofit, startup, or existing business, add what applies.",
      fields: [
        {
          id: newId(),
          label: "Company or brand name",
          type: "text",
          required: false,
        },
        {
          id: newId(),
          label: "Industry, niche, or type of work",
          type: "text",
          required: false,
        },
        {
          id: newId(),
          label: "Current website, Instagram, or social page",
          type: "text",
          placeholder: "https://",
          required: false,
        },
        {
          id: newId(),
          label: "Where do you serve customers?",
          type: "text",
          placeholder: "Example: Jamaica, Caribbean, worldwide, local community",
          required: false,
        },
      ],
    },
    {
      id: newId(),
      title: "Goals, audience, and features",
      description: "This helps us recommend the right system instead of guessing.",
      fields: [
        {
          id: newId(),
          label: "Who is this for?",
          type: "textarea",
          placeholder: "Describe your customers, audience, members, students, clients, or team.",
          required: false,
        },
        {
          id: newId(),
          label: "What should this help you achieve?",
          type: "textarea",
          required: true,
        },
        {
          id: newId(),
          label: "Features you may need",
          type: "textarea",
          placeholder:
            "Example: contact form, payments, booking, customer login, dashboard, reports, automations, emails, file uploads, inventory, admin panel.",
          required: false,
        },
      ],
    },
    {
      id: newId(),
      title: "Timeline and budget",
      description: "Estimates are okay. This helps us plan the right next step.",
      fields: [
        {
          id: newId(),
          label: "When would you like to launch?",
          type: "select",
          options: ["ASAP", "2-4 weeks", "1-3 months", "3+ months", "I am still planning"],
          required: false,
        },
        {
          id: newId(),
          label: "Budget range",
          type: "select",
          options: [
            "JMD $10,000 - $50,000",
            "JMD $50,000 - $150,000",
            "JMD $150,000+",
            "Custom / not sure yet",
          ],
          required: false,
        },
        {
          id: newId(),
          label: "How ready are you to start?",
          type: "select",
          options: [
            "Ready now",
            "Need advice first",
            "Comparing options",
            "Planning for later",
            "Just asking questions",
          ],
          required: false,
        },
      ],
    },
    PUBLIC_SUPPLEMENTAL_INTAKE_SECTION,
  ];
}

/** Stored on each submission `meta` so the problem statement stays readable without re-parsing field UUIDs. */
export const INTAKE_PROBLEM_META_KEY = "intake_problem_statement";
export const INTAKE_PRIMARY_FOCUS_META_KEY = "intake_primary_focus";

/**
 * Maps the default "What problem are you solving?" (or similar) textarea from saved answers using the form’s
 * section/field labels — works for historical rows as long as the form’s `sections` JSON still matches keys.
 */
export function extractIntakeProblemStatement(
  form: Pick<ClientIntakeForm, "sections"> | null | undefined,
  answers: Record<string, string>,
): string | null {
  if (!form?.sections?.length) return null;
  const sections = form.sections;

  const tryTextarea = (pred: (label: string) => boolean): string | null => {
    for (const s of sections) {
      for (const f of s.fields) {
        if (f.type !== "textarea") continue;
        const lab = f.label.toLowerCase();
        if (!pred(lab)) continue;
        const v = (answers[f.id] ?? "").trim();
        if (v) return v;
      }
    }
    return null;
  };

  const exact =
    tryTextarea(
      (lab) =>
        lab.includes("problem") && (lab.includes("solving") || lab.includes("fix") || lab.includes("solve")),
    ) ?? tryTextarea((lab) => lab.includes("what problem"));
  if (exact) return exact;

  for (const s of sections) {
    if (!s.title.toLowerCase().includes("goal")) continue;
    for (const f of s.fields) {
      if (f.type !== "textarea") continue;
      const v = (answers[f.id] ?? "").trim();
      if (v) return v;
    }
  }

  return tryTextarea((lab) => lab.includes("problem"));
}

/** "Primary focus" / category select in the first section, when present. */
export function extractIntakePrimaryFocus(
  form: Pick<ClientIntakeForm, "sections"> | null | undefined,
  answers: Record<string, string>,
): string | null {
  if (!form?.sections?.length) return null;
  for (const s of form.sections) {
    for (const f of s.fields) {
      if (f.type !== "select") continue;
      const lab = f.label.toLowerCase();
      if (!(lab.includes("primary") || lab.includes("focus") || lab.includes("category"))) continue;
      const v = (answers[f.id] ?? "").trim();
      if (v && v !== "__none__") return v;
    }
  }
  for (const s of form.sections) {
    for (const f of s.fields) {
      if (f.type !== "select") continue;
      const v = (answers[f.id] ?? "").trim();
      if (v && v !== "__none__") return v;
    }
  }
  return null;
}

export function intakeProblemPreviewFromSubmission(
  submission: Pick<ClientIntakeSubmission, "meta" | "answers">,
  form: ClientIntakeForm | null,
): string | null {
  const raw = submission.meta?.[INTAKE_PROBLEM_META_KEY];
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (form) return extractIntakeProblemStatement(form, submission.answers);
  return null;
}

export function intakePrimaryFocusFromSubmission(
  submission: Pick<ClientIntakeSubmission, "meta" | "answers">,
  form: ClientIntakeForm | null,
): string | null {
  const raw = submission.meta?.[INTAKE_PRIMARY_FOCUS_META_KEY];
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (form) return extractIntakePrimaryFocus(form, submission.answers);
  return null;
}

/** Full Q&A in reading order (markdown-ish headings). */
export function formatIntakeAnswersHumanReadable(
  form: ClientIntakeForm,
  answers: Record<string, string>,
): string {
  return flattenAnswersForNotes(form, answers);
}

/** Set on submission `meta` when the submitter opened `/intake/[token]?client=<uuid>`. */
export const INTAKE_REFERRED_CLIENT_META_KEY = "referred_client_id";

const REFERRED_CLIENT_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function referredClientIdFromMeta(meta: Record<string, unknown> | null | undefined): string | null {
  if (!meta) return null;
  const raw = meta[INTAKE_REFERRED_CLIENT_META_KEY];
  if (typeof raw !== "string") return null;
  const id = raw.trim();
  return REFERRED_CLIENT_UUID_RE.test(id) ? id : null;
}

function parseAnswersColumn(raw: unknown): Record<string, string> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, string>;
  }
  return {};
}

function fallbackAnswersPlain(answers: Record<string, string>): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(answers)) {
    const t = (v ?? "").trim();
    if (t) lines.push(`- ${k}: ${t}`);
  }
  return lines.length ? lines.join("\n") : "(No captured answers)";
}

/** Latest pipeline intake submission tagged for a roster client (via `?client=` deep link). */
export type ClientIntakeRosterSummary = {
  submissionId: string;
  formId: string;
  formTitle: string | null;
  submittedAt: string;
  primaryFocus: string | null;
  problem: string | null;
  fullAnswersText: string;
};

/**
 * Loads the most recent intake submission per client id where `meta.referred_client_id` matches.
 * Submissions without that tag (anonymous public link) are not included — use `clients.services_needed`
 * for auto-synced deals from intake.
 */
export async function batchLatestIntakeSummariesForReferredClients(
  ownerClerkId: string,
  clientIds: string[],
): Promise<Record<string, ClientIntakeRosterSummary>> {
  const deduped = [...new Set(clientIds.map((id) => id.trim()).filter(Boolean))];
  if (!deduped.length) return {};

  const sb = getServiceSupabase();
  if (!sb) return {};

  const allowed = new Set(deduped);
  type Row = {
    id: string;
    form_id: string;
    meta: Record<string, unknown> | null;
    answers: Record<string, string>;
    created_at: string;
  };

  const rows: Row[] = [];
  const chunkSize = 40;
  try {
    for (let i = 0; i < deduped.length; i += chunkSize) {
      const chunk = deduped.slice(i, i + chunkSize);
      const orFilter = chunk
        .map((id) => `meta->>${INTAKE_REFERRED_CLIENT_META_KEY}.eq.${id}`)
        .join(",");
      const { data, error } = await sb
        .from("client_intake_submissions")
        .select("id,form_id,meta,answers,created_at")
        .eq("owner_clerk_id", ownerClerkId)
        .or(orFilter)
        .order("created_at", { ascending: false })
        .limit(600);
      if (error || !data) continue;
      for (const r of data as Record<string, unknown>[]) {
        rows.push({
          id: String(r.id),
          form_id: String(r.form_id),
          meta:
            r.meta && typeof r.meta === "object" && !Array.isArray(r.meta)
              ? (r.meta as Record<string, unknown>)
              : null,
          answers: parseAnswersColumn(r.answers),
          created_at: String(r.created_at ?? ""),
        });
      }
    }
  } catch {
    return {};
  }

  rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

  const latestRowByClient = new Map<string, Row>();
  for (const row of rows) {
    const ref = referredClientIdFromMeta(row.meta);
    if (!ref || !allowed.has(ref) || latestRowByClient.has(ref)) continue;
    latestRowByClient.set(ref, row);
  }

  const forms = await listIntakeForms(ownerClerkId);
  const formById = new Map(forms.map((f) => [f.id, f]));

  const out: Record<string, ClientIntakeRosterSummary> = {};
  for (const [clientId, row] of latestRowByClient) {
    const form = formById.get(row.form_id) ?? null;
    const fullAnswersText = form
      ? formatIntakeAnswersHumanReadable(form, row.answers)
      : fallbackAnswersPlain(row.answers);
    out[clientId] = {
      submissionId: row.id,
      formId: row.form_id,
      formTitle: form?.title ?? null,
      submittedAt: row.created_at,
      primaryFocus: intakePrimaryFocusFromSubmission(row, form),
      problem: intakeProblemPreviewFromSubmission(row, form),
      fullAnswersText,
    };
  }
  return out;
}

function parseSections(raw: unknown): IntakeSection[] {
  if (!Array.isArray(raw)) return [];
  return raw as IntakeSection[];
}

function mapFormRow(row: Record<string, unknown>): ClientIntakeForm {
  return {
    id: String(row.id),
    owner_clerk_id: String(row.owner_clerk_id),
    share_token: String(row.share_token),
    title: String(row.title),
    intro: row.intro == null ? null : String(row.intro),
    sections: parseSections(row.sections),
    is_active: Boolean(row.is_active),
    sync_to_crm: row.sync_to_crm == null ? true : Boolean(row.sync_to_crm),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function listIntakeForms(ownerClerkId: string): Promise<ClientIntakeForm[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("client_intake_forms")
      .select(
        "id,owner_clerk_id,share_token,title,intro,sections,is_active,sync_to_crm,created_at,updated_at",
      )
      .eq("owner_clerk_id", ownerClerkId)
      .order("updated_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r) => mapFormRow(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getIntakeFormByToken(
  shareToken: string,
): Promise<ClientIntakeForm | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const token = shareToken.trim();
  if (!token) return null;
  try {
    const { data, error } = await sb
      .from("client_intake_forms")
      .select(
        "id,owner_clerk_id,share_token,title,intro,sections,is_active,sync_to_crm,created_at,updated_at",
      )
      .eq("share_token", token)
      .maybeSingle();
    if (error || !data) return null;
    const form = mapFormRow(data as Record<string, unknown>);
    if (!form.is_active) return null;
    return form;
  } catch {
    return null;
  }
}

export async function getIntakeFormById(
  ownerClerkId: string,
  formId: string,
): Promise<ClientIntakeForm | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const id = formId.trim();
  if (!id) return null;
  try {
    const { data, error } = await sb
      .from("client_intake_forms")
      .select(
        "id,owner_clerk_id,share_token,title,intro,sections,is_active,sync_to_crm,created_at,updated_at",
      )
      .eq("id", id)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();
    if (error || !data) return null;
    return mapFormRow(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export type CreateIntakeFormInput = {
  title: string;
  intro?: string | null;
  sync_to_crm?: boolean;
};

export async function createIntakeForm(
  ownerClerkId: string,
  input: CreateIntakeFormInput,
): Promise<{ ok: true; form: ClientIntakeForm } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) {
    return {
      ok: false,
      error:
        "Supabase is required for shareable intake links. Add NEXT_PUBLIC_SUPABASE_URL and a service key in Settings.",
    };
  }
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required." };
  const now = iso();
  const share_token = generateShareToken();
  const sections = defaultIntakeSections();
  try {
    const { data, error } = await sb
      .from("client_intake_forms")
      .insert({
        owner_clerk_id: ownerClerkId,
        share_token,
        title,
        intro: input.intro?.trim() || null,
        sections,
        is_active: true,
        sync_to_crm: input.sync_to_crm !== false,
        created_at: now,
        updated_at: now,
      })
      .select(
        "id,owner_clerk_id,share_token,title,intro,sections,is_active,sync_to_crm,created_at,updated_at",
      )
      .single();
    if (error || !data) {
      const msg = error?.message ?? "Could not create intake form.";
      const hint =
        /relation|does not exist|42P01/i.test(msg) || ("code" in (error ?? {}) && String((error as { code?: string }).code) === "42P01")
          ? " Run supabase/migrations/20260514200000_client_intake.sql in your project."
          : "";
      return { ok: false, error: `${msg}${hint}` };
    }
    return { ok: true, form: mapFormRow(data as Record<string, unknown>) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function listIntakeSubmissions(
  ownerClerkId: string,
  formId: string,
): Promise<ClientIntakeSubmission[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("client_intake_submissions")
      .select(
        "id,form_id,owner_clerk_id,answers,contact_name,contact_email,meta,attachments,created_at",
      )
      .eq("owner_clerk_id", ownerClerkId)
      .eq("form_id", formId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data) return [];
    const rows = await Promise.all(
      (data as Record<string, unknown>[]).map(async (row) => {
        const attachments = parseAttachmentsColumn(row.attachments);
        const attachmentLinks =
          attachments.length > 0
            ? await signIntakeAttachments(sb, attachments)
            : [];
        return {
          id: String(row.id),
          form_id: String(row.form_id),
          owner_clerk_id: String(row.owner_clerk_id),
          answers:
            row.answers && typeof row.answers === "object" && !Array.isArray(row.answers)
              ? (row.answers as Record<string, string>)
              : {},
          contact_name: row.contact_name == null ? null : String(row.contact_name),
          contact_email: row.contact_email == null ? null : String(row.contact_email),
          meta:
            row.meta && typeof row.meta === "object"
              ? (row.meta as Record<string, unknown>)
              : null,
          attachments,
          attachmentLinks: attachmentLinks.length ? attachmentLinks : undefined,
          created_at: String(row.created_at),
        };
      }),
    );
    return rows;
  } catch {
    return [];
  }
}

/**
 * Operator-only: rewrite answers + denormalized contact columns; refreshes derived meta fields.
 */
export async function updateIntakeSubmission(
  ownerClerkId: string,
  formId: string,
  submissionId: string,
  answers: Record<string, string>,
): Promise<{ ok: true; submission: ClientIntakeSubmission } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const form = await getIntakeFormById(ownerClerkId, formId);
  if (!form) return { ok: false, error: "Form not found." };

  const v = validateIntakeAnswers(form, answers);
  if (!v.ok) return { ok: false, error: v.error };

  const { contact_name, contact_email } = resolveIntakeContacts(form, answers);
  const problemSaved = extractIntakeProblemStatement(form, answers);
  const focusSaved = extractIntakePrimaryFocus(form, answers);

  try {
    const { data: row, error: fetchErr } = await sb
      .from("client_intake_submissions")
      .select("id,attachments,meta,created_at")
      .eq("id", submissionId)
      .eq("form_id", formId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();

    if (fetchErr || !row) {
      return { ok: false, error: fetchErr?.message ?? "Submission not found." };
    }

    const rowRec = row as Record<string, unknown>;
    const createdAt = String(rowRec.created_at ?? "");

    const prevMeta =
      rowRec.meta && typeof rowRec.meta === "object" && !Array.isArray(rowRec.meta)
        ? { ...(rowRec.meta as Record<string, unknown>) }
        : {};

    const mergedMeta: Record<string, unknown> = {
      ...prevMeta,
      ...(problemSaved ? { [INTAKE_PROBLEM_META_KEY]: problemSaved } : {}),
      ...(focusSaved ? { [INTAKE_PRIMARY_FOCUS_META_KEY]: focusSaved } : {}),
    };

    const { error: upErr } = await sb
      .from("client_intake_submissions")
      .update({
        answers,
        contact_name,
        contact_email,
        meta: mergedMeta,
      })
      .eq("id", submissionId)
      .eq("form_id", formId)
      .eq("owner_clerk_id", ownerClerkId);

    if (upErr) return { ok: false, error: upErr.message };

    const attachments = parseAttachmentsColumn(rowRec.attachments);
    const attachmentLinks =
      attachments.length > 0 ? await signIntakeAttachments(sb, attachments) : [];

    const submission: ClientIntakeSubmission = {
      id: submissionId,
      form_id: formId,
      owner_clerk_id: ownerClerkId,
      answers,
      contact_name,
      contact_email,
      meta: mergedMeta,
      attachments,
      attachmentLinks: attachmentLinks.length ? attachmentLinks : undefined,
      created_at: createdAt,
    };

    return { ok: true, submission };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

async function removeIntakeAttachmentsFromStorage(
  sb: NonNullable<ReturnType<typeof getServiceSupabase>>,
  attachments: IntakeAttachmentMeta[],
): Promise<void> {
  const paths = attachments.map((a) => a.storage_path).filter(Boolean);
  if (paths.length === 0) return;
  const chunk = 90;
  for (let i = 0; i < paths.length; i += chunk) {
    const slice = paths.slice(i, i + chunk);
    const { error } = await sb.storage.from(INTAKE_FILE_BUCKET).remove(slice);
    if (error) {
      /* best-effort: row delete should still proceed */
      console.warn("[intake] storage remove:", error.message);
    }
  }
}

/** Delete one submission and optional Storage objects in `attachments`. */
export async function deleteIntakeSubmission(
  ownerClerkId: string,
  formId: string,
  submissionId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  try {
    const { data: row, error: fetchErr } = await sb
      .from("client_intake_submissions")
      .select("id,attachments")
      .eq("id", submissionId)
      .eq("form_id", formId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();

    if (fetchErr || !row) {
      return { ok: false, error: fetchErr?.message ?? "Submission not found." };
    }

    const attachments = parseAttachmentsColumn(
      (row as Record<string, unknown>).attachments,
    );
    await removeIntakeAttachmentsFromStorage(sb, attachments);

    const { error: delErr } = await sb
      .from("client_intake_submissions")
      .delete()
      .eq("id", submissionId)
      .eq("form_id", formId)
      .eq("owner_clerk_id", ownerClerkId);

    if (delErr) return { ok: false, error: delErr.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Delete the form and all its submissions; removes Storage files from each submission. */
export async function deleteIntakeFormAndSubmissions(
  ownerClerkId: string,
  formId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  try {
    const { data: formRow, error: formErr } = await sb
      .from("client_intake_forms")
      .select("id")
      .eq("id", formId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();
    if (formErr || !formRow) {
      return { ok: false, error: formErr?.message ?? "Form not found." };
    }

    const { data: subs, error: subsErr } = await sb
      .from("client_intake_submissions")
      .select("id,attachments")
      .eq("form_id", formId)
      .eq("owner_clerk_id", ownerClerkId);

    if (subsErr) return { ok: false, error: subsErr.message };

    for (const r of (subs ?? []) as Record<string, unknown>[]) {
      const attachments = parseAttachmentsColumn(r.attachments);
      await removeIntakeAttachmentsFromStorage(sb, attachments);
    }

    const { error: delSubsErr } = await sb
      .from("client_intake_submissions")
      .delete()
      .eq("form_id", formId)
      .eq("owner_clerk_id", ownerClerkId);
    if (delSubsErr) return { ok: false, error: delSubsErr.message };

    const { error: delFormErr } = await sb
      .from("client_intake_forms")
      .delete()
      .eq("id", formId)
      .eq("owner_clerk_id", ownerClerkId);
    if (delFormErr) return { ok: false, error: delFormErr.message };

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

function collectFieldIds(sections: IntakeSection[]): Map<string, IntakeField> {
  const m = new Map<string, IntakeField>();
  for (const s of sections) {
    for (const f of s.fields) {
      m.set(f.id, f);
    }
  }
  return m;
}

export function validateIntakeAnswers(
  form: ClientIntakeForm,
  answers: Record<string, string>,
): { ok: true } | { ok: false; error: string } {
  const fields = collectFieldIds(form.sections);
  for (const [id, field] of fields) {
    if (!field.required) continue;
    const v = (answers[id] ?? "").trim();
    if (!v) {
      return { ok: false, error: `Please fill: ${field.label}.` };
    }
    if (field.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(v)) {
      return { ok: false, error: `Invalid email for: ${field.label}.` };
    }
  }
  return { ok: true };
}

function flattenAnswersForNotes(form: ClientIntakeForm, answers: Record<string, string>): string {
  const lines: string[] = [];
  const knownIds = new Set<string>();
  for (const s of form.sections) {
    lines.push(`## ${s.title}`);
    for (const f of s.fields) {
      knownIds.add(f.id);
      const v = (answers[f.id] ?? "").trim();
      lines.push(`- ${f.label}: ${v || "—"}`);
    }
  }
  const extras: string[] = [];
  for (const [id, value] of Object.entries(answers)) {
    if (knownIds.has(id)) continue;
    const v = (value ?? "").trim();
    if (!v) continue;
    extras.push(`- ${SUPPLEMENTAL_FIELD_LABELS.get(id) ?? id}: ${v}`);
  }
  if (extras.length) {
    lines.push("## Additional details", ...extras);
  }
  return lines.join("\n");
}

function buildCrmDraftFromIntake(
  form: ClientIntakeForm,
  answers: Record<string, string>,
): CreateCrmDealInput {
  const fields = collectFieldIds(form.sections);
  let business_name = "";
  let contact_name: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;
  let industry: string | null = null;
  let website: string | null = null;

  for (const [id, field] of fields) {
    const raw = (answers[id] ?? "").trim();
    if (!raw) continue;
    const lab = field.label.toLowerCase();
    if (field.type === "email") email = raw;
    else if (field.type === "phone") phone = raw;
    else if (lab.includes("company") || lab.includes("brand name")) business_name = raw;
    else if (lab.includes("industry")) industry = raw;
    else if (lab.includes("website")) website = raw;
    else if (lab.includes("your name") || (lab.includes("name") && !lab.includes("company"))) {
      contact_name = raw;
    }
  }

  if (!business_name) {
    business_name =
      contact_name || email?.split("@")[0] || `Intake — ${form.title.slice(0, 80)}`;
  }

  const notes = [`Source: intake form “${form.title}”`, "", flattenAnswersForNotes(form, answers)].join(
    "\n",
  );

  const problem = extractIntakeProblemStatement(form, answers);
  const servicesCap = 8000;

  return {
    business_name: business_name.slice(0, 200),
    contact_name,
    email,
    phone,
    industry,
    website: website || null,
    services_needed: problem ? problem.slice(0, servicesCap) : null,
    budget_amount: null,
    project_deadline: null,
    notes: notes.slice(0, 12000),
    stage: "cold",
  };
}

export type SubmitIntakePayload = {
  answers: Record<string, string>;
  /** Submitter user-agent / referer for audit */
  meta?: Record<string, unknown>;
  /**
   * When true, skips task/notification until the caller runs {@link finalizeIntakeOwnerNotification}
   * (e.g. after optional file uploads complete).
   */
  deferNotify?: boolean;
};

function resolveIntakeContacts(
  form: ClientIntakeForm,
  answers: Record<string, string>,
): {
  contact_name: string | null;
  contact_email: string | null;
  contactHint: string;
} {
  const fields = collectFieldIds(form.sections);
  let contact_name: string | null = null;
  let contact_email: string | null = null;
  for (const [id, field] of fields) {
    const raw = (answers[id] ?? "").trim();
    if (!raw) continue;
    const lab = field.label.toLowerCase();
    if (field.type === "email") contact_email = raw;
    if (lab.includes("your name")) contact_name = raw;
  }
  if (!contact_name) {
    for (const [id, field] of fields) {
      const raw = (answers[id] ?? "").trim();
      if (!raw) continue;
      if (field.label.toLowerCase().includes("name")) {
        contact_name = raw;
        break;
      }
    }
  }
  const contactHint = contact_name || contact_email || "Anonymous";
  return { contact_name, contact_email, contactHint };
}

/** Persist uploaded files and set `attachments` on the submission row. */
export async function attachUploadedFilesToIntakeSubmission(
  submissionId: string,
  ownerClerkId: string,
  formId: string,
  parts: Array<{
    filename: string;
    declaredMime: string | null | undefined;
    buffer: Buffer;
  }>,
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  if (parts.length === 0) return { ok: true, count: 0 };

  const up = await uploadIntakeSubmissionFiles(sb, {
    ownerClerkId,
    formId,
    submissionId,
    parts,
  });
  if (!up.ok) return { ok: false, error: up.error };

  const { error } = await sb
    .from("client_intake_submissions")
    .update({ attachments: up.attachments })
    .eq("id", submissionId)
    .eq("owner_clerk_id", ownerClerkId);

  if (error) {
    const hint = /column|attachments|42703|42P01/i.test(error.message)
      ? " Apply supabase/migrations/20260516120000_intake_attachments.sql (attachments column + intake-form-files bucket)."
      : "";
    return { ok: false, error: `${error.message}${hint}` };
  }

  return { ok: true, count: up.attachments.length };
}

export async function finalizeIntakeOwnerNotification(
  ownerClerkId: string,
  form: ClientIntakeForm,
  submissionId: string,
  contactHint: string,
  answers: Record<string, string>,
  opts?: { attachmentCount?: number; uploadError?: string | null },
) {
  const problem = extractIntakeProblemStatement(form, answers);
  const focus = extractIntakePrimaryFocus(form, answers);
  const summary = flattenAnswersForNotes(form, answers);
  const preview =
    summary.length > 1200 ? `${summary.slice(0, 1200)}…` : summary || "(no answers captured)";
  const attachLines: string[] = [];
  if (opts?.attachmentCount != null && opts.attachmentCount > 0) {
    attachLines.push(
      "",
      `Attachments: ${opts.attachmentCount} file(s) — Pipeline intake → this form’s inbox (signed links, ~1h).`,
    );
  }
  if (opts?.uploadError) {
    attachLines.push("", `File upload note: ${opts.uploadError}`);
  }
  const title = `[Intake] ${form.title} — ${contactHint}`;
  const notes = [
    `Submission: ${submissionId}`,
    `Review: Pipeline intake → ${form.title}`,
    "",
    ...(focus ? [`Primary focus: ${focus}`, ""] : []),
    ...(problem
      ? [
          "What they’re trying to solve / fix:",
          problem,
          "",
          "---",
          "",
        ]
      : []),
    preview,
    ...attachLines,
  ].join("\n");
  await createTodo(ownerClerkId, {
    title,
    notes,
    category_id: null,
    priority: 2,
  });

  const sb = getServiceSupabase();
  if (sb) {
    try {
      const bodyParts = [`New response on “${form.title}” (${contactHint}).`];
      if (focus) bodyParts.push(` Focus: ${focus}.`);
      if (problem) {
        const snip = problem.length > 280 ? `${problem.slice(0, 280)}…` : problem;
        bodyParts.push(` Problem: ${snip}`);
      }
      if (opts?.attachmentCount) bodyParts.push(` ${opts.attachmentCount} file(s) attached.`);
      if (opts?.uploadError) bodyParts.push(` (${opts.uploadError})`);
      await sb.from("notifications").insert({
        owner_clerk_id: ownerClerkId,
        title: "Pipeline intake",
        body: bodyParts.join(""),
        type: "intake",
      });
    } catch {
      /* notifications table optional */
    }
  }
}

export async function submitIntakeByToken(
  shareToken: string,
  payload: SubmitIntakePayload,
): Promise<
  | {
      ok: true;
      submissionId: string;
      form: ClientIntakeForm;
      contactHint: string;
      answers: Record<string, string>;
    }
  | { ok: false; error: string; status?: number }
> {
  const form = await getIntakeFormByToken(shareToken);
  if (!form) {
    return { ok: false, status: 404, error: "This intake link is inactive or does not exist." };
  }
  const answers = payload.answers ?? {};
  const v = validateIntakeAnswers(form, answers);
  if (!v.ok) return { ok: false, status: 400, error: v.error };

  const sb = getServiceSupabase();
  if (!sb) {
    return { ok: false, status: 503, error: "Intake submissions require Supabase to be configured." };
  }

  const { contact_name, contact_email, contactHint } = resolveIntakeContacts(form, answers);

  const baseMeta: Record<string, unknown> =
    payload.meta && typeof payload.meta === "object" && !Array.isArray(payload.meta)
      ? { ...(payload.meta as Record<string, unknown>) }
      : {};
  const problemSaved = extractIntakeProblemStatement(form, answers);
  const focusSaved = extractIntakePrimaryFocus(form, answers);
  const mergedMeta: Record<string, unknown> = {
    ...baseMeta,
    ...(problemSaved ? { [INTAKE_PROBLEM_META_KEY]: problemSaved } : {}),
    ...(focusSaved ? { [INTAKE_PRIMARY_FOCUS_META_KEY]: focusSaved } : {}),
  };
  const metaForRow = Object.keys(mergedMeta).length > 0 ? mergedMeta : null;

  try {
    const { data: sub, error: subErr } = await sb
      .from("client_intake_submissions")
      .insert({
        form_id: form.id,
        owner_clerk_id: form.owner_clerk_id,
        answers,
        contact_name,
        contact_email,
        meta: metaForRow,
        attachments: [],
        created_at: iso(),
      })
      .select("id")
      .single();

    if (subErr || !sub) {
      const msg = subErr?.message ?? "Could not save submission.";
      const hint =
        /column|attachments|42703/i.test(msg)
          ? " Run supabase/migrations/20260516120000_intake_attachments.sql on your Supabase project."
          : "";
      return { ok: false, error: `${msg}${hint}` };
    }

    const submissionId = String((sub as { id: string }).id);

    if (form.sync_to_crm) {
      const draft = buildCrmDraftFromIntake(form, answers);
      const deal = await createCrmDeal(form.owner_clerk_id, draft);
      if (!deal.ok) {
        await sb
          .from("client_intake_submissions")
          .update({
            meta: { ...mergedMeta, crm_error: deal.error },
          })
          .eq("id", submissionId);
      }
    }

    const defer = payload.deferNotify === true;
    if (!defer) {
      await finalizeIntakeOwnerNotification(
        form.owner_clerk_id,
        form,
        submissionId,
        contactHint,
        answers,
      );
    }

    return { ok: true, submissionId, form, contactHint, answers };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export function publicFormPayload(form: ClientIntakeForm) {
  return {
    title: form.title,
    intro: form.intro,
    sections: form.sections,
  };
}
