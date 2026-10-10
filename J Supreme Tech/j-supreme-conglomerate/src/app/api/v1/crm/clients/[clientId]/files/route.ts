import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import {
  deleteClientFileForOwner,
  listClientUploadsForOwner,
  uploadClientFileForOwner,
} from "@/lib/data/crm-client-files";

export const dynamic = "force-dynamic";
/** Large uploads rely on runtime body limits (set host / plan accordingly for 15 MB). */
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ clientId: string }> },
) {
  try {
    const owner = await requireOwnerClerkId();
    const { clientId } = await ctx.params;
    const result = await listClientUploadsForOwner(owner, clientId);
    if (!result.ok) {
      const status =
        result.error === "Client not found."
          ? 404
          : result.error.includes("not configured")
            ? 503
            : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ files: result.files });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ clientId: string }> },
) {
  try {
    const owner = await requireOwnerClerkId();
    const { clientId } = await ctx.params;
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Expected multipart/form-data body." },
        { status: 400 },
      );
    }
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Attach a binary field named "file".' },
        { status: 400 },
      );
    }
    const buf = new Uint8Array(await file.arrayBuffer());
    const res = await uploadClientFileForOwner({
      ownerClerkId: owner,
      clientId,
      declaredMime: file.type,
      originalFilename: file.name || "upload",
      buffer: buf,
    });
    if (!res.ok) {
      const status =
        res.error === "Client not found."
          ? 404
          : res.error.includes("not configured")
            ? 503
            : 400;
      return NextResponse.json({ error: res.error }, { status });
    }
    return NextResponse.json({ ok: true as const, file: res.file });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ clientId: string }> },
) {
  try {
    const owner = await requireOwnerClerkId();
    const { clientId } = await ctx.params;
    const url = new URL(req.url);
    const fileId = url.searchParams.get("fileId")?.trim();
    if (!fileId) {
      return NextResponse.json(
        { error: "Missing fileId query parameter." },
        { status: 400 },
      );
    }
    const result = await deleteClientFileForOwner(owner, clientId, fileId);
    if (!result.ok) {
      const status =
        result.error === "Client not found." || result.error === "File not found."
          ? 404
          : result.error.includes("not configured")
            ? 503
            : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ ok: true as const });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
