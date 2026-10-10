import { NextResponse } from "next/server";
import { appendClientDeployedSiteLink, getCrmClientById } from "@/lib/data/crm";
import { buildStaticSiteKitFileMap } from "@/lib/site-kit/build-site-kit";
import { getOwnerClerkId } from "@/lib/session";
import type { SiteKitInput } from "@/lib/site-kit/types";
import { slugProjectName } from "@/lib/site-kit/types";
import { deployStaticFilesToVercel } from "@/lib/site-kit/vercel-static-deploy";

export async function POST(req: Request) {
  const owner = await getOwnerClerkId();
  if (!owner) {
    return NextResponse.json({ error: "No workspace owner resolved." }, { status: 401 });
  }

  if (!process.env.VERCEL_ACCESS_TOKEN?.trim()) {
    return NextResponse.json(
      { error: "Deploy is not configured — set VERCEL_ACCESS_TOKEN on the server." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  const projectName = typeof rec.projectName === "string" ? rec.projectName.trim() : "";
  if (!projectName) {
    return NextResponse.json({ error: "projectName is required." }, { status: 400 });
  }

  const kitKind =
    rec.kitKind === "react-app" || rec.kitKind === "website" ? rec.kitKind : "website";
  if (kitKind !== "website") {
    return NextResponse.json(
      { error: "Deploy only supports the static website kit. Download the React kit as a ZIP." },
      { status: 400 },
    );
  }

  const clientIdRaw = typeof rec.clientId === "string" ? rec.clientId.trim() : "";
  const attachToClient = rec.attachToClient === true;

  const input: SiteKitInput = {
    kitKind,
    projectName,
    tagline: typeof rec.tagline === "string" ? rec.tagline : undefined,
    description: typeof rec.description === "string" ? rec.description : undefined,
    primaryColor: typeof rec.primaryColor === "string" ? rec.primaryColor : undefined,
    baseUrl: typeof rec.baseUrl === "string" ? rec.baseUrl : undefined,
    logoUrl: typeof rec.logoUrl === "string" ? rec.logoUrl : undefined,
    contactEmail: typeof rec.contactEmail === "string" ? rec.contactEmail : undefined,
  };

  const files = buildStaticSiteKitFileMap(input);
  const slug = slugProjectName(projectName);

  try {
    const deployed = await deployStaticFilesToVercel({
      deploymentName: slug,
      files,
    });
    if (!deployed.ok) {
      return NextResponse.json(
        { error: deployed.error },
        { status: deployed.status && deployed.status >= 400 ? deployed.status : 502 },
      );
    }

    let crmLinkSaved = false;
    let crmLinkError: string | undefined;
    if (attachToClient && clientIdRaw) {
      const row = await getCrmClientById(owner, clientIdRaw);
      if (!row) {
        crmLinkError = "CRM client not found — deployment link was not saved.";
      } else {
        const label =
          typeof rec.deployLinkLabel === "string" && rec.deployLinkLabel.trim()
            ? rec.deployLinkLabel.trim()
            : `Deployed site · ${projectName}`.slice(0, 120);
        const appended = await appendClientDeployedSiteLink(owner, clientIdRaw, {
          label,
          url: deployed.deploymentUrl,
        });
        if (!appended.ok) {
          crmLinkError = appended.error;
        } else {
          crmLinkSaved = true;
        }
      }
    }

    return NextResponse.json({
      deploymentUrl: deployed.deploymentUrl,
      deploymentId: deployed.deploymentId,
      crmLinkSaved,
      ...(crmLinkError ? { crmLinkError } : {}),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Deploy failed." },
      { status: 500 },
    );
  }
}
