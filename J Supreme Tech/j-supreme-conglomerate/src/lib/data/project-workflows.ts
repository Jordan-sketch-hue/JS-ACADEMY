import { getServiceSupabase } from "@/lib/supabase/admin";
import { createTodo } from "@/lib/data/todos";
import { appendClientDeployedSiteLink, getCrmClientById } from "@/lib/data/crm";
import { buildStaticSiteKitFileMap } from "@/lib/site-kit/build-site-kit";
import { deployStaticFilesToVercel } from "@/lib/site-kit/vercel-static-deploy";
import { slugProjectName, type SiteKitInput } from "@/lib/site-kit/types";
import {
  formatIntakeAnswersHumanReadable,
  getIntakeFormById,
  intakePrimaryFocusFromSubmission,
  intakeProblemPreviewFromSubmission,
  type ClientIntakeForm,
  type ClientIntakeSubmission,
} from "@/lib/data/intake-forms";

export type WorkflowStatus =
  | "discovery"
  | "planning"
  | "design"
  | "build"
  | "review"
  | "launched"
  | "support";

export type ProjectWorkflow = {
  id: string;
  owner_clerk_id: string;
  intake_submission_id: string | null;
  intake_form_id: string | null;
  referred_client_id: string | null;
  title: string;
  service_category: string | null;
  status: WorkflowStatus;
  priority: "low" | "normal" | "high" | "urgent";
  project_brief: string | null;
  brand_brief: Record<string, unknown>;
  deployment_url: string | null;
  preview_url: string | null;
  github_url: string | null;
  design_url: string | null;
  asset_folder_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectWorkflowTask = {
  id: string;
  workflow_id: string;
  owner_clerk_id: string;
  title: string;
  description: string | null;
  phase: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectWorkflowWithTasks = ProjectWorkflow & {
  tasks: ProjectWorkflowTask[];
};

export type WorkflowLinkInput = Partial<
  Pick<
    ProjectWorkflow,
    | "deployment_url"
    | "preview_url"
    | "github_url"
    | "design_url"
    | "asset_folder_url"
    | "status"
  >
>;

type IntakeSubmissionRow = Omit<ClientIntakeSubmission, "attachments" | "attachmentLinks">;

type WorkflowAutomationPackage = {
  generatedAt: string;
  mode: "deterministic" | "openai";
  productionStage: "brief_ready" | "deployed";
  brandIdentity: {
    positioning: string;
    personality: string[];
    visualDirection: string[];
    typography: string;
    colorSystem: string[];
  };
  buildPlan: {
    projectType: string;
    pages: string[];
    components: string[];
    integrations: string[];
    acceptanceCriteria: string[];
  };
  codexBuildPrompt: string;
  presentationOutline: string[];
  midjourneyPrompts: string[];
  adobeAssetChecklist: string[];
  deployment?: {
    provider: "vercel";
    url: string;
    deploymentId: string;
  };
  github?: {
    repoUrl: string;
    defaultBranch: string;
  };
  notes: string[];
};

const REFERRED_CLIENT_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mapWorkflow(row: Record<string, unknown>): ProjectWorkflow {
  return {
    id: String(row.id),
    owner_clerk_id: String(row.owner_clerk_id),
    intake_submission_id:
      row.intake_submission_id == null ? null : String(row.intake_submission_id),
    intake_form_id: row.intake_form_id == null ? null : String(row.intake_form_id),
    referred_client_id:
      row.referred_client_id == null ? null : String(row.referred_client_id),
    title: String(row.title ?? "Project workflow"),
    service_category: row.service_category == null ? null : String(row.service_category),
    status: (String(row.status ?? "discovery") as WorkflowStatus) || "discovery",
    priority: (String(row.priority ?? "normal") as ProjectWorkflow["priority"]) || "normal",
    project_brief: row.project_brief == null ? null : String(row.project_brief),
    brand_brief:
      row.brand_brief && typeof row.brand_brief === "object" && !Array.isArray(row.brand_brief)
        ? (row.brand_brief as Record<string, unknown>)
        : {},
    deployment_url: row.deployment_url == null ? null : String(row.deployment_url),
    preview_url: row.preview_url == null ? null : String(row.preview_url),
    github_url: row.github_url == null ? null : String(row.github_url),
    design_url: row.design_url == null ? null : String(row.design_url),
    asset_folder_url: row.asset_folder_url == null ? null : String(row.asset_folder_url),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

function mapTask(row: Record<string, unknown>): ProjectWorkflowTask {
  return {
    id: String(row.id),
    workflow_id: String(row.workflow_id),
    owner_clerk_id: String(row.owner_clerk_id),
    title: String(row.title ?? "Workflow task"),
    description: row.description == null ? null : String(row.description),
    phase: String(row.phase ?? "Delivery"),
    status: (String(row.status ?? "todo") as ProjectWorkflowTask["status"]) || "todo",
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

function parseAnswers(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    out[key] = value == null ? "" : String(value);
  }
  return out;
}

function parseMeta(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}

function referredClientIdFromMeta(meta: Record<string, unknown> | null): string | null {
  const raw = meta?.referred_client_id;
  if (typeof raw !== "string") return null;
  const id = raw.trim();
  return REFERRED_CLIENT_UUID_RE.test(id) ? id : null;
}

function pickBusinessName(form: ClientIntakeForm, answers: Record<string, string>): string | null {
  for (const section of form.sections) {
    for (const field of section.fields) {
      const label = field.label.toLowerCase();
      if (!label.includes("business") && !label.includes("company")) continue;
      const value = answers[field.id]?.trim();
      if (value) return value;
    }
  }
  return null;
}

function serviceTags(focus: string | null, brief: string): Set<string> {
  const text = `${focus ?? ""} ${brief}`.toLowerCase();
  const tags = new Set<string>();
  if (/website|landing|seo|portfolio|service site/.test(text)) tags.add("website");
  if (/app|android|ios|mobile|react native|flutter/.test(text)) tags.add("app");
  if (/commerce|store|catalog|checkout|inventory|payment/.test(text)) tags.add("commerce");
  if (/booking|reservation|appointment|calendar|airport|excursion/.test(text)) tags.add("booking");
  if (/crm|dashboard|database|lead|pipeline|report/.test(text)) tags.add("crm");
  if (/automation|workflow|api|internal tool|system architecture|analytics|ai/.test(text)) {
    tags.add("systems");
  }
  if (/brand|identity|logo|social|behance|presentation|ui\/ux|creative/.test(text)) {
    tags.add("branding");
  }
  if (!tags.size) tags.add("systems");
  return tags;
}

function workflowTags(workflow: ProjectWorkflow): Set<string> {
  return serviceTags(workflow.service_category, `${workflow.project_brief ?? ""} ${workflow.title}`);
}

function automationEnabled(name: string, defaultValue = true): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) return defaultValue;
  return !["0", "false", "off", "no"].includes(raw);
}

function cleanOneLine(raw: string | null | undefined, fallback: string): string {
  const value = raw?.replace(/\s+/g, " ").trim();
  return value || fallback;
}

function projectTypeFromTags(tags: Set<string>) {
  if (tags.has("app")) return "App / software system";
  if (tags.has("commerce")) return "E-commerce system";
  if (tags.has("booking")) return "Booking and reservation system";
  if (tags.has("crm")) return "CRM and dashboard system";
  if (tags.has("website")) return "Premium website";
  return "Creative technology system";
}

function buildAutomationPackage(workflow: ProjectWorkflow): WorkflowAutomationPackage {
  const tags = workflowTags(workflow);
  const projectType = projectTypeFromTags(tags);
  const clientBrief = workflow.project_brief ?? "No intake brief was stored.";
  const service = workflow.service_category ?? projectType;
  const baseName = workflow.title.replace(/\s+-\s+.+$/, "").trim() || workflow.title;
  const pages = tags.has("website") || tags.has("commerce") || tags.has("booking")
    ? ["Home", "Services", "Process", "Work / demos", "Pricing", "Contact"]
    : ["Dashboard", "Records", "Workflow detail", "Settings", "Reports"];
  const components = [
    "Premium hero with clear CTA",
    "Service/category cards",
    "Architecture or workflow diagram",
    "Dashboard preview",
    "Proof/demo cards",
    "Project inquiry/contact form",
  ];
  const integrations = [
    ...(tags.has("crm") ? ["Supabase CRM records", "Reporting dashboard"] : []),
    ...(tags.has("booking") ? ["Calendar availability", "Confirmation notifications"] : []),
    ...(tags.has("commerce") ? ["Payment provider", "Inventory/product catalogue"] : []),
    ...(tags.has("app") ? ["Clerk authentication", "API layer", "Supabase database"] : []),
    "Vercel deployment",
    "GitHub repository",
  ];

  return {
    generatedAt: new Date().toISOString(),
    mode: "deterministic",
    productionStage: "brief_ready",
    brandIdentity: {
      positioning: `${baseName} needs a ${service.toLowerCase()} that feels premium, structured, scalable, and easy to trust.`,
      personality: [
        "Futuristic",
        "Professional",
        "Systems-focused",
        "Conversion-minded",
        "Caribbean-to-global",
      ],
      visualDirection: [
        "Dark premium interface",
        "Purple/blue electric accents",
        "Glassmorphism cards",
        "Dashboard-style organization",
        "Sharp hierarchy with generous spacing",
      ],
      typography: "Use strong display headings with a clean SaaS body type such as Inter, Manrope, Sora, or Space Grotesk.",
      colorSystem: ["#050505", "#0D0D0D", "#7B2FFF", "#6D5BFF", "#FFFFFF", "#B3B3B3"],
    },
    buildPlan: {
      projectType,
      pages,
      components,
      integrations,
      acceptanceCriteria: [
        "Responsive on mobile, tablet, and desktop",
        "Clear primary CTA and contact path",
        "Premium typography hierarchy and spacing",
        "Fast loading and SEO-ready metadata",
        "All forms, links, and deployment URLs tested before client preview",
      ],
    },
    codexBuildPrompt: [
      `Build a ${projectType.toLowerCase()} for ${baseName}.`,
      `Service focus: ${service}.`,
      "Use Next.js, React, TypeScript, Tailwind CSS, and a premium dark technology visual identity.",
      "Create a complete responsive first version with real sections, reusable components, SEO metadata, and Vercel-ready deployment.",
      "Follow J Supreme Tech SOP: discovery, design, architecture, build, test, launch, support, and scale.",
      "",
      "Client intake brief:",
      clientBrief,
    ].join("\n"),
    presentationOutline: [
      "Client need and business goal",
      "Brand identity direction",
      "System architecture",
      "Screen/page mockups",
      "Automation and integration plan",
      "Deployment links and next actions",
    ],
    midjourneyPrompts: [
      `${baseName} premium futuristic technology brand identity, dark luxury interface, electric purple and blue accent lighting, glassmorphism dashboard panels, Caribbean-to-global business growth, high-end SaaS presentation`,
      `${baseName} website hero mockup on desktop and mobile devices, matte black background, neon purple edge glow, premium software architecture diagram, cinematic product render`,
    ],
    adobeAssetChecklist: [
      "Logo lockup and favicon",
      "Typography and color board",
      "Hero/device mockup",
      "Social preview graphic",
      "Client presentation slides",
      "Case-study cover image",
    ],
    notes: [
      "This automation package is generated from the intake and SOP manual.",
      "Review final creative direction before sending to client.",
    ],
  };
}

async function generateOpenAiPackage(
  workflow: ProjectWorkflow,
  fallback: WorkflowAutomationPackage,
): Promise<WorkflowAutomationPackage> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return fallback;

  try {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You create concise production-ready brand, build, and presentation plans for a premium creative technology agency. Return only JSON matching the requested shape.",
          },
          {
            role: "user",
            content: JSON.stringify({
              workflowTitle: workflow.title,
              serviceCategory: workflow.service_category,
              intakeBrief: workflow.project_brief,
              requiredShape: fallback,
            }),
          },
        ],
      }),
    });
    if (!res.ok) return fallback;
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) return fallback;
    const parsed = JSON.parse(content) as Partial<WorkflowAutomationPackage>;
    return {
      ...fallback,
      ...parsed,
      mode: "openai",
      generatedAt: new Date().toISOString(),
      brandIdentity: { ...fallback.brandIdentity, ...(parsed.brandIdentity ?? {}) },
      buildPlan: { ...fallback.buildPlan, ...(parsed.buildPlan ?? {}) },
      notes: [
        ...fallback.notes,
        ...(Array.isArray(parsed.notes) ? parsed.notes : []),
      ].slice(0, 8),
    };
  } catch {
    return fallback;
  }
}

function siteKitInputForWorkflow(
  workflow: ProjectWorkflow,
  pkg: WorkflowAutomationPackage,
): SiteKitInput {
  const contactEmail =
    typeof workflow.brand_brief?.contactEmail === "string"
      ? workflow.brand_brief.contactEmail
      : undefined;
  return {
    kitKind: "website",
    projectName: workflow.title.replace(/\s+Workflow$/i, ""),
    tagline: cleanOneLine(workflow.service_category, "Digital Solutions. Real Growth."),
    description: cleanOneLine(
      pkg.brandIdentity.positioning,
      "A premium, scalable digital system built from client intake.",
    ),
    primaryColor: "#7B2FFF",
    contactEmail,
  };
}

function appOrigin(): string | null {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  return vercel ? `https://${vercel.replace(/\/$/, "")}` : null;
}

async function appendWorkflowLinksToClient(
  ownerClerkId: string,
  clientId: string | null,
  workflow: ProjectWorkflow,
): Promise<void> {
  if (!clientId) return;
  const links = [
    workflow.deployment_url
      ? { label: "Finished product / live preview", url: workflow.deployment_url }
      : null,
    workflow.preview_url && workflow.preview_url !== workflow.deployment_url
      ? { label: "Preview sample", url: workflow.preview_url }
      : null,
    workflow.github_url ? { label: "GitHub project repo", url: workflow.github_url } : null,
    workflow.design_url ? { label: "Presentation / design file", url: workflow.design_url } : null,
    workflow.asset_folder_url ? { label: "Client assets folder", url: workflow.asset_folder_url } : null,
  ].filter((x): x is { label: string; url: string } => Boolean(x));

  const origin = appOrigin();
  if (origin) {
    links.unshift({
      label: "Project workflow / presentation brief",
      url: `${origin}/projects?workflow=${workflow.id}`,
    });
  }

  for (const link of links) {
    await appendClientDeployedSiteLink(ownerClerkId, clientId, link);
  }
}

async function createGithubRepoWithFiles(opts: {
  workflow: ProjectWorkflow;
  files: Record<string, string>;
}): Promise<{ repoUrl: string; defaultBranch: string } | null> {
  const token = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim();
  const owner = process.env.GITHUB_OWNER?.trim();
  if (!token || !owner) return null;

  const repoName = `${slugProjectName(opts.workflow.title)}-${opts.workflow.id.slice(0, 8)}`.slice(0, 80);
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  try {
    const createRes = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: repoName,
        private: true,
        auto_init: true,
        description: `Generated project package for ${opts.workflow.title}`,
      }),
    });
    if (!createRes.ok && createRes.status !== 422) return null;
    const repoUrl = `https://github.com/${owner}/${repoName}`;
    const entries = Object.entries(opts.files).slice(0, 80);
    for (const [path, content] of entries) {
      await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Add ${path}`,
          content: Buffer.from(content, "utf8").toString("base64"),
          branch: "main",
        }),
      });
    }
    return { repoUrl, defaultBranch: "main" };
  } catch {
    return null;
  }
}

function generateSopTasks(tags: Set<string>): Array<{
  title: string;
  description: string;
  phase: string;
}> {
  const tasks = [
    {
      phase: "Discover",
      title: "Review intake and confirm business goals",
      description: "Clarify target audience, desired outcome, timeline, budget, and success metrics.",
    },
    {
      phase: "Discover",
      title: "Create client brief and requirement map",
      description: "Turn answers into a structured brief with scope, integrations, content needs, and risks.",
    },
    {
      phase: "Design",
      title: "Define visual direction and brand system",
      description: "Set typography, colors, layout style, assets, and presentation standards.",
    },
    {
      phase: "Architect",
      title: "Map system architecture and data flow",
      description: "Plan frontend, backend, database, authentication, dashboards, automations, and analytics.",
    },
  ];

  if (tags.has("website")) {
    tasks.push(
      {
        phase: "Architect",
        title: "Create responsive website structure",
        description: "Plan sitemap, page sections, conversion CTAs, SEO structure, and mobile behavior.",
      },
      {
        phase: "Build",
        title: "Build website interface and content sections",
        description: "Implement responsive pages with premium spacing, clear hierarchy, and contact paths.",
      },
    );
  }

  if (tags.has("app")) {
    tasks.push(
      {
        phase: "Design",
        title: "Map app screens and user flow",
        description: "Define onboarding, core actions, navigation, empty states, and account experience.",
      },
      {
        phase: "Build",
        title: "Develop app frontend, backend, APIs, and authentication",
        description: "Connect app UI to secure data, account logic, and required third-party APIs.",
      },
    );
  }

  if (tags.has("commerce")) {
    tasks.push(
      {
        phase: "Architect",
        title: "Structure products, inventory, checkout, and payment flow",
        description: "Define catalogue fields, checkout steps, provider needs, and order management.",
      },
      {
        phase: "Build",
        title: "Build commerce dashboard and transaction checks",
        description: "Implement admin controls, test checkout, and verify mobile purchase behavior.",
      },
    );
  }

  if (tags.has("booking")) {
    tasks.push(
      {
        phase: "Architect",
        title: "Define booking logic and confirmation workflow",
        description: "Map calendar rules, availability, deposits, notifications, and cancellation handling.",
      },
      {
        phase: "Build",
        title: "Build reservation dashboard and notification automation",
        description: "Create booking controls, confirmations, reminders, and optional payment connection.",
      },
    );
  }

  if (tags.has("crm")) {
    tasks.push(
      {
        phase: "Architect",
        title: "Design CRM data model and pipeline stages",
        description: "Define client records, lead tracking, sales stages, reports, and admin permissions.",
      },
      {
        phase: "Build",
        title: "Build dashboard views, records, and reporting",
        description: "Implement searchable data tables, status tracking, analytics, and operator workflows.",
      },
    );
  }

  if (tags.has("systems")) {
    tasks.push(
      {
        phase: "Architect",
        title: "Design automation and integration pipeline",
        description: "Plan API connections, data movement, notifications, analytics, and internal tools.",
      },
      {
        phase: "Build",
        title: "Implement scalable system infrastructure",
        description: "Build secure workflows, dashboards, automations, and documentation for operations.",
      },
    );
  }

  if (tags.has("branding")) {
    tasks.push(
      {
        phase: "Design",
        title: "Create brand identity and presentation assets",
        description: "Develop typography, color system, creative direction, social assets, and case-study visuals.",
      },
      {
        phase: "Review",
        title: "Package brand assets for client review",
        description: "Prepare organized links, previews, and presentation notes for feedback.",
      },
    );
  }

  tasks.push(
    {
      phase: "Test",
      title: "Run quality control across devices and workflows",
      description: "Check responsiveness, forms, integrations, performance, accessibility, and visual consistency.",
    },
    {
      phase: "Launch",
      title: "Deploy project and record live links",
      description: "Publish to Vercel or required hosting, then add deployment, preview, repository, and design links.",
    },
    {
      phase: "Support & Scale",
      title: "Train client and document next steps",
      description: "Share usage guidance, support notes, optimization backlog, and growth opportunities.",
    },
  );

  return tasks;
}

async function fetchSubmission(
  ownerClerkId: string,
  formId: string,
  submissionId: string,
): Promise<IntakeSubmissionRow | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("client_intake_submissions")
    .select("id,form_id,owner_clerk_id,answers,contact_name,contact_email,meta,created_at")
    .eq("id", submissionId)
    .eq("form_id", formId)
    .eq("owner_clerk_id", ownerClerkId)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  return {
    id: String(row.id),
    form_id: String(row.form_id),
    owner_clerk_id: String(row.owner_clerk_id),
    answers: parseAnswers(row.answers),
    contact_name: row.contact_name == null ? null : String(row.contact_name),
    contact_email: row.contact_email == null ? null : String(row.contact_email),
    meta: parseMeta(row.meta),
    created_at: String(row.created_at ?? ""),
  };
}

export async function listProjectWorkflows(
  ownerClerkId: string,
): Promise<ProjectWorkflowWithTasks[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("project_workflows")
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .eq("owner_clerk_id", ownerClerkId)
      .order("updated_at", { ascending: false });
    if (error || !data) return [];
    const workflows = (data as Record<string, unknown>[]).map(mapWorkflow);
    if (!workflows.length) return [];
    const ids = workflows.map((w) => w.id);
    const { data: taskData } = await sb
      .from("project_workflow_tasks")
      .select("id,workflow_id,owner_clerk_id,title,description,phase,status,sort_order,created_at,updated_at")
      .eq("owner_clerk_id", ownerClerkId)
      .in("workflow_id", ids)
      .order("sort_order", { ascending: true });
    const tasks = (taskData ?? []).map((r) => mapTask(r as Record<string, unknown>));
    const tasksByWorkflow = new Map<string, ProjectWorkflowTask[]>();
    for (const task of tasks) {
      const list = tasksByWorkflow.get(task.workflow_id) ?? [];
      list.push(task);
      tasksByWorkflow.set(task.workflow_id, list);
    }
    return workflows.map((workflow) => ({
      ...workflow,
      tasks: tasksByWorkflow.get(workflow.id) ?? [],
    }));
  } catch {
    return [];
  }
}

export async function workflowStatusForSubmissions(
  ownerClerkId: string,
  submissionIds: string[],
): Promise<Record<string, Pick<ProjectWorkflow, "id" | "status" | "title">>> {
  const ids = [...new Set(submissionIds.filter(Boolean))];
  if (!ids.length) return {};
  const sb = getServiceSupabase();
  if (!sb) return {};
  try {
    const { data, error } = await sb
      .from("project_workflows")
      .select("id,intake_submission_id,status,title")
      .eq("owner_clerk_id", ownerClerkId)
      .in("intake_submission_id", ids);
    if (error || !data) return {};
    const out: Record<string, Pick<ProjectWorkflow, "id" | "status" | "title">> = {};
    for (const row of data as Record<string, unknown>[]) {
      const submissionId = row.intake_submission_id ? String(row.intake_submission_id) : "";
      if (!submissionId) continue;
      out[submissionId] = {
        id: String(row.id),
        status: (String(row.status ?? "discovery") as WorkflowStatus) || "discovery",
        title: String(row.title ?? "Project workflow"),
      };
    }
    return out;
  } catch {
    return {};
  }
}

export async function startWorkflowFromIntake(
  ownerClerkId: string,
  formId: string,
  submissionId: string,
): Promise<{ ok: true; workflow: ProjectWorkflowWithTasks } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  try {
    const { data: existing } = await sb
      .from("project_workflows")
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .eq("owner_clerk_id", ownerClerkId)
      .eq("intake_submission_id", submissionId)
      .maybeSingle();

    if (existing) {
      const workflow = mapWorkflow(existing as Record<string, unknown>);
      const { data: tasks } = await sb
        .from("project_workflow_tasks")
        .select("id,workflow_id,owner_clerk_id,title,description,phase,status,sort_order,created_at,updated_at")
        .eq("owner_clerk_id", ownerClerkId)
        .eq("workflow_id", workflow.id)
        .order("sort_order", { ascending: true });
      return {
        ok: true,
        workflow: {
          ...workflow,
          tasks: (tasks ?? []).map((r) => mapTask(r as Record<string, unknown>)),
        },
      };
    }

    const form = await getIntakeFormById(ownerClerkId, formId);
    if (!form) return { ok: false, error: "Intake form not found." };
    const submission = await fetchSubmission(ownerClerkId, formId, submissionId);
    if (!submission) return { ok: false, error: "Intake submission not found." };

    const fullBrief = formatIntakeAnswersHumanReadable(form, submission.answers);
    const focus = intakePrimaryFocusFromSubmission(submission, form);
    const problem = intakeProblemPreviewFromSubmission(submission, form);
    const businessName = pickBusinessName(form, submission.answers);
    const clientLabel = businessName || submission.contact_name || "Client";
    const tags = serviceTags(focus, fullBrief);
    const title = `${clientLabel} - ${focus || "Digital System"} Workflow`;
    const brandBrief = {
      standard: "Premium, intentional, scalable, futuristic, and professionally engineered.",
      source: "pipeline_intake",
      client: clientLabel,
      contactName: submission.contact_name,
      contactEmail: submission.contact_email,
      primaryFocus: focus,
      problem,
      serviceTags: Array.from(tags),
      sopManual: [
        "Discovery and brand research",
        "Design direction and system architecture",
        "Responsive build and integrations",
        "Quality control, deployment, training, support, and scale",
      ],
    };

    const { data: inserted, error: insertError } = await sb
      .from("project_workflows")
      .insert({
        owner_clerk_id: ownerClerkId,
        intake_submission_id: submission.id,
        intake_form_id: form.id,
        referred_client_id: referredClientIdFromMeta(submission.meta),
        title,
        service_category: focus,
        status: "discovery",
        priority: "normal",
        project_brief: fullBrief,
        brand_brief: brandBrief,
      })
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .single();

    if (insertError || !inserted) {
      const msg = insertError?.message ?? "Could not create workflow.";
      const hint =
        /relation|does not exist|schema cache|42P01/i.test(msg)
          ? " Run migration 20260517210000_project_workflows.sql in Supabase, then try again."
          : "";
      return { ok: false, error: `${msg}${hint}` };
    }

    const workflow = mapWorkflow(inserted as Record<string, unknown>);
    const taskInputs = generateSopTasks(tags).map((task, index) => ({
      workflow_id: workflow.id,
      owner_clerk_id: ownerClerkId,
      title: task.title,
      description: task.description,
      phase: task.phase,
      status: "todo",
      sort_order: index,
    }));

    const { data: taskRows, error: taskError } = await sb
      .from("project_workflow_tasks")
      .insert(taskInputs)
      .select("id,workflow_id,owner_clerk_id,title,description,phase,status,sort_order,created_at,updated_at")
      .order("sort_order", { ascending: true });

    if (taskError) {
      return { ok: false, error: taskError.message };
    }

    for (const task of taskInputs.slice(0, 6)) {
      await createTodo(ownerClerkId, {
        title: `[Workflow] ${clientLabel}: ${task.title}`,
        notes: `${task.phase}\n\n${task.description}\n\nWorkflow: ${workflow.title}`,
        priority: task.phase === "Discover" ? 3 : 2,
      });
    }

    return {
      ok: true,
      workflow: {
        ...workflow,
        tasks: (taskRows ?? []).map((r) => mapTask(r as Record<string, unknown>)),
      },
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown workflow error." };
  }
}

export async function startWorkflowFromCrmClient(
  ownerClerkId: string,
  clientId: string,
): Promise<{ ok: true; workflow: ProjectWorkflowWithTasks } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  try {
    const client = await getCrmClientById(ownerClerkId, clientId);
    if (!client) return { ok: false, error: "CRM client not found." };

    const { data: existing } = await sb
      .from("project_workflows")
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .eq("owner_clerk_id", ownerClerkId)
      .eq("referred_client_id", client.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const workflow = mapWorkflow(existing as Record<string, unknown>);
      const { data: tasks } = await sb
        .from("project_workflow_tasks")
        .select("id,workflow_id,owner_clerk_id,title,description,phase,status,sort_order,created_at,updated_at")
        .eq("owner_clerk_id", ownerClerkId)
        .eq("workflow_id", workflow.id)
        .order("sort_order", { ascending: true });
      return {
        ok: true,
        workflow: {
          ...workflow,
          tasks: (tasks ?? []).map((r) => mapTask(r as Record<string, unknown>)),
        },
      };
    }

    const projectBrief = [
      `Business: ${client.business_name}`,
      client.contact_name ? `Contact: ${client.contact_name}` : null,
      client.email ? `Email: ${client.email}` : null,
      client.phone ? `Phone: ${client.phone}` : null,
      client.industry ? `Industry: ${client.industry}` : null,
      client.website ? `Existing website: ${client.website}` : null,
      client.services_needed ? `Services needed: ${client.services_needed}` : null,
      client.project_deadline ? `Deadline: ${client.project_deadline}` : null,
      client.budget_amount != null ? `Budget: ${client.budget_amount}` : null,
      client.notes ? `Notes: ${client.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const serviceCategory = client.services_needed || client.service_category;
    const tags = serviceTags(serviceCategory, projectBrief);
    const title = `${client.business_name} - ${serviceCategory || "Digital System"} Workflow`;
    const brandBrief = {
      standard: "Premium, intentional, scalable, futuristic, and professionally engineered.",
      source: "crm_roster",
      client: client.business_name,
      contactName: client.contact_name,
      contactEmail: client.email,
      primaryFocus: serviceCategory,
      serviceTags: Array.from(tags),
    };

    const { data: inserted, error: insertError } = await sb
      .from("project_workflows")
      .insert({
        owner_clerk_id: ownerClerkId,
        referred_client_id: client.id,
        title,
        service_category: serviceCategory,
        status: "discovery",
        priority: "normal",
        project_brief: projectBrief,
        brand_brief: brandBrief,
      })
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .single();

    if (insertError || !inserted) {
      return { ok: false, error: insertError?.message ?? "Could not create workflow." };
    }

    const workflow = mapWorkflow(inserted as Record<string, unknown>);
    const taskInputs = generateSopTasks(tags).map((task, index) => ({
      workflow_id: workflow.id,
      owner_clerk_id: ownerClerkId,
      title: task.title,
      description: task.description,
      phase: task.phase,
      status: "todo",
      sort_order: index,
    }));
    const { data: taskRows, error: taskError } = await sb
      .from("project_workflow_tasks")
      .insert(taskInputs)
      .select("id,workflow_id,owner_clerk_id,title,description,phase,status,sort_order,created_at,updated_at")
      .order("sort_order", { ascending: true });
    if (taskError) return { ok: false, error: taskError.message };

    for (const task of taskInputs.slice(0, 6)) {
      await createTodo(ownerClerkId, {
        title: `[Workflow] ${client.business_name}: ${task.title}`,
        notes: `${task.phase}\n\n${task.description}\n\nWorkflow: ${workflow.title}`,
        priority: task.phase === "Discover" ? 3 : 2,
      });
    }

    return {
      ok: true,
      workflow: {
        ...workflow,
        tasks: (taskRows ?? []).map((r) => mapTask(r as Record<string, unknown>)),
      },
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown workflow error." };
  }
}

export async function updateProjectWorkflowLinks(
  ownerClerkId: string,
  workflowId: string,
  input: WorkflowLinkInput,
): Promise<{ ok: true; workflow: ProjectWorkflow } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const allowedStatuses: WorkflowStatus[] = [
    "discovery",
    "planning",
    "design",
    "build",
    "review",
    "launched",
    "support",
  ];
  const payload: Record<string, string | null> = {
    deployment_url: input.deployment_url?.trim() || null,
    preview_url: input.preview_url?.trim() || null,
    github_url: input.github_url?.trim() || null,
    design_url: input.design_url?.trim() || null,
    asset_folder_url: input.asset_folder_url?.trim() || null,
  };
  if (input.status && allowedStatuses.includes(input.status)) {
    payload.status = input.status;
  }

  try {
    const { data, error } = await sb
      .from("project_workflows")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", workflowId)
      .eq("owner_clerk_id", ownerClerkId)
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "Workflow not found." };
    return { ok: true, workflow: mapWorkflow(data as Record<string, unknown>) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown workflow error." };
  }
}

export async function runProjectWorkflowAutomation(
  ownerClerkId: string,
  workflowId: string,
): Promise<
  | { ok: true; workflow: ProjectWorkflow; package: WorkflowAutomationPackage }
  | { ok: false; error: string }
> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  try {
    const { data, error } = await sb
      .from("project_workflows")
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .eq("id", workflowId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();
    if (error || !data) return { ok: false, error: error?.message ?? "Workflow not found." };

    const workflow = mapWorkflow(data as Record<string, unknown>);
    const fallback = buildAutomationPackage(workflow);
    let pkg = await generateOpenAiPackage(workflow, fallback);
    const tags = workflowTags(workflow);
    const files =
      tags.has("website") || tags.has("commerce") || tags.has("booking") || tags.has("branding")
        ? buildStaticSiteKitFileMap(siteKitInputForWorkflow(workflow, pkg))
        : null;

    let deploymentUrl = workflow.deployment_url;
    let previewUrl = workflow.preview_url;
    let githubUrl = workflow.github_url;
    let nextStatus: WorkflowStatus = workflow.status;
    const notes = [...pkg.notes];

    if (
      files &&
      automationEnabled("WORKFLOW_AUTO_DEPLOY", true) &&
      process.env.VERCEL_ACCESS_TOKEN?.trim()
    ) {
      const deployed = await deployStaticFilesToVercel({
        deploymentName: slugProjectName(workflow.title),
        files,
      });
      if (deployed.ok) {
        deploymentUrl = deployed.deploymentUrl;
        previewUrl = deployed.deploymentUrl;
        nextStatus = "review";
        pkg = {
          ...pkg,
          productionStage: "deployed",
          deployment: {
            provider: "vercel",
            url: deployed.deploymentUrl,
            deploymentId: deployed.deploymentId,
          },
        };
      } else {
        notes.push(`Vercel deploy skipped/failed: ${deployed.error}`);
      }
    } else if (files) {
      notes.push("Vercel deploy not run. Add VERCEL_ACCESS_TOKEN or enable WORKFLOW_AUTO_DEPLOY.");
    }

    if (
      files &&
      automationEnabled("WORKFLOW_AUTO_GITHUB", true) &&
      (process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim()) &&
      process.env.GITHUB_OWNER?.trim()
    ) {
      const github = await createGithubRepoWithFiles({ workflow, files });
      if (github) {
        githubUrl = github.repoUrl;
        pkg = { ...pkg, github };
      } else {
        notes.push("GitHub repo creation was attempted but did not complete.");
      }
    } else if (files) {
      notes.push("GitHub repo not created. Add GITHUB_TOKEN and GITHUB_OWNER to enable it.");
    }

    pkg = { ...pkg, notes };
    const nextBrandBrief = {
      ...workflow.brand_brief,
      automation: pkg,
    };

    const { data: updated, error: updateError } = await sb
      .from("project_workflows")
      .update({
        brand_brief: nextBrandBrief,
        deployment_url: deploymentUrl,
        preview_url: previewUrl,
        github_url: githubUrl,
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workflow.id)
      .eq("owner_clerk_id", ownerClerkId)
      .select(
        "id,owner_clerk_id,intake_submission_id,intake_form_id,referred_client_id,title,service_category,status,priority,project_brief,brand_brief,deployment_url,preview_url,github_url,design_url,asset_folder_url,created_at,updated_at",
      )
      .single();
    if (updateError || !updated) {
      return { ok: false, error: updateError?.message ?? "Could not save automation package." };
    }
    const updatedWorkflow = mapWorkflow(updated as Record<string, unknown>);
    await appendWorkflowLinksToClient(ownerClerkId, updatedWorkflow.referred_client_id, updatedWorkflow);

    await createTodo(ownerClerkId, {
      title: `[Automation] Review generated package for ${updatedWorkflow.title}`,
      notes: [
        `Workflow: ${updatedWorkflow.title}`,
        deploymentUrl ? `Deployment: ${deploymentUrl}` : null,
        githubUrl ? `GitHub: ${githubUrl}` : null,
        "",
        "Next: review the generated brief, mockup direction, and client presentation outline before sending.",
      ]
        .filter(Boolean)
        .join("\n"),
      priority: 3,
    });

    return { ok: true, workflow: updatedWorkflow, package: pkg };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown automation error." };
  }
}
