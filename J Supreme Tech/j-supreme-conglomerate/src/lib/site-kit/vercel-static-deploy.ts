export type VercelStaticDeployResult =
  | { ok: true; deploymentUrl: string; deploymentId: string }
  | { ok: false; error: string; status?: number };

function readVercelError(json: Record<string, unknown>, fallback: string): string {
  const err = json.error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  const msg = json.message;
  if (typeof msg === "string") return msg;
  return fallback;
}

/** Create a Vercel deployment from UTF-8 text files (static HTML kits). */
export async function deployStaticFilesToVercel(opts: {
  deploymentName: string;
  files: Record<string, string>;
}): Promise<VercelStaticDeployResult> {
  const token = process.env.VERCEL_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  }

  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const name =
    opts.deploymentName
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "site-kit";

  const filePayload = Object.entries(opts.files).map(([file, content]) => ({
    file,
    data: Buffer.from(content, "utf8").toString("base64"),
  }));

  const params = new URLSearchParams();
  if (teamId) params.set("teamId", teamId);
  params.set("skipAutoDetectionConfirmation", "1");
  const qs = `?${params.toString()}`;
  const res = await fetch(`https://api.vercel.com/v13/deployments${qs}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      files: filePayload,
      projectSettings: { framework: null },
    }),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: readVercelError(json, res.statusText || "Vercel deployment failed."),
    };
  }

  const host = typeof json.url === "string" ? json.url : null;
  const id = typeof json.id === "string" ? json.id : "";
  if (!host) {
    return { ok: false, error: "Vercel response did not include a deployment URL." };
  }
  const deploymentUrl = host.startsWith("http") ? host : `https://${host}`;
  return { ok: true, deploymentUrl, deploymentId: id };
}
