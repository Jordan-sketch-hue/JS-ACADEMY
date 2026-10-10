import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/cyber/rate-limit";
import {
  attachUploadedFilesToIntakeSubmission,
  finalizeIntakeOwnerNotification,
  getIntakeFormByToken,
  publicFormPayload,
  submitIntakeByToken,
} from "@/lib/data/intake-forms";
import { INTAKE_MAX_FILES_PER_SUBMISSION } from "@/lib/data/intake-attachments";
import { CLIENT_FILE_MAX_BYTES } from "@/lib/crm/client-file-rules";
import {
  runProjectWorkflowAutomation,
  startWorkflowFromIntake,
} from "@/lib/data/project-workflows";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function looksLikeUuid(raw: unknown): raw is string {
  return typeof raw === "string" && UUID_RE.test(raw.trim());
}

function referralMetaFromFields(
  idRaw: unknown,
  sourceHint: unknown,
): Record<string, unknown> | null {
  if (!looksLikeUuid(idRaw)) return null;
  const id = idRaw.trim();
  const source =
    sourceHint === "query" || sourceHint === "body" ? sourceHint : "body";
  return {
    referred_client_id: id,
    referred_client_id_source: source,
  };
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  const form = await getIntakeFormByToken(token);
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ form: publicFormPayload(form) });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  // Public, unauthenticated form submission — rate-limit per IP to stop spam
  // and resource abuse (file uploads make these expensive).
  const gate = rateLimit(req, { limit: 8, windowMs: 10 * 60_000, key: "intake-submit" });
  if (!gate.ok) return gate.response;

  const { token } = await ctx.params;
  const referer = req.headers.get("referer") ?? undefined;
  const ua = req.headers.get("user-agent") ?? undefined;
  const baseMeta = {
    referer,
    user_agent: ua,
    received_at: new Date().toISOString(),
  };

  let answers: Record<string, string> = {};
  const files: File[] = [];
  let deferNotify = false;
  let referralExtras: Record<string, unknown> = {};
  const ct = req.headers.get("content-type") ?? "";

  if (ct.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    const answersRaw = formData.get("answers");
    if (typeof answersRaw === "string") {
      try {
        const parsed = JSON.parse(answersRaw) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          answers = parsed as Record<string, string>;
        }
      } catch {
        return NextResponse.json({ error: "Invalid answers JSON" }, { status: 400 });
      }
    }
    const ref = referralMetaFromFields(
      formData.get("referred_client_id"),
      formData.get("referred_client_id_source"),
    );
    if (ref) referralExtras = ref;
    for (const v of formData.getAll("files")) {
      if (v instanceof File && v.size > 0) files.push(v);
    }
    if (files.length > INTAKE_MAX_FILES_PER_SUBMISSION) {
      return NextResponse.json(
        { error: `You can attach at most ${INTAKE_MAX_FILES_PER_SUBMISSION} files.` },
        { status: 400 },
      );
    }
    for (const f of files) {
      if (f.size > CLIENT_FILE_MAX_BYTES) {
        return NextResponse.json(
          { error: `“${f.name}” exceeds the upload size limit.` },
          { status: 400 },
        );
      }
    }
    deferNotify = files.length > 0;
  } else {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const rec = body as Record<string, unknown>;
    answers =
      rec.answers && typeof rec.answers === "object" && !Array.isArray(rec.answers)
        ? (rec.answers as Record<string, string>)
        : {};
    deferNotify = false;
    const ref = referralMetaFromFields(
      rec.referred_client_id,
      rec.referred_client_id_source,
    );
    if (ref) referralExtras = ref;
  }

  const res = await submitIntakeByToken(token, {
    answers,
    meta: { ...baseMeta, ...referralExtras },
    deferNotify,
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: res.error },
      { status: res.status ?? 500 },
    );
  }

  let warning: string | undefined;

  if (deferNotify) {
    let attachCount = 0;
    let uploadError: string | null = null;
    if (files.length > 0) {
      const parts = await Promise.all(
        files.map(async (f) => ({
          filename: f.name,
          declaredMime: f.type,
          buffer: Buffer.from(await f.arrayBuffer()),
        })),
      );
      const att = await attachUploadedFilesToIntakeSubmission(
        res.submissionId,
        res.form.owner_clerk_id,
        res.form.id,
        parts,
      );
      if (!att.ok) {
        uploadError = att.error;
      } else {
        attachCount = att.count;
      }
    }
    await finalizeIntakeOwnerNotification(
      res.form.owner_clerk_id,
      res.form,
      res.submissionId,
      res.contactHint,
      res.answers,
      { attachmentCount: attachCount, uploadError },
    );
    if (uploadError) warning = uploadError;
  }

  if (process.env.INTAKE_AUTO_START_WORKFLOWS?.trim().toLowerCase() !== "false") {
    const workflow = await startWorkflowFromIntake(
      res.form.owner_clerk_id,
      res.form.id,
      res.submissionId,
    );
    if (workflow.ok) {
      const auto = await runProjectWorkflowAutomation(
        res.form.owner_clerk_id,
        workflow.workflow.id,
      );
      if (!auto.ok) warning = warning ? `${warning} ${auto.error}` : auto.error;
    } else {
      warning = warning ? `${warning} ${workflow.error}` : workflow.error;
    }
  }

  return NextResponse.json({
    ok: true as const,
    submissionId: res.submissionId,
    ...(warning ? { warning } : {}),
  });
}
