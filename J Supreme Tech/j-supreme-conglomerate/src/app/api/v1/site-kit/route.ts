import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { buildSiteKitArchive } from "@/lib/site-kit/build-site-kit";
import type { SiteKitInput } from "@/lib/site-kit/types";

export async function POST(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.json({ error: "No workspace owner resolved." }, { status: 401 });
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

  try {
    const { buffer, filename } = await buildSiteKitArchive(input);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not build archive." },
      { status: 500 },
    );
  }
}
