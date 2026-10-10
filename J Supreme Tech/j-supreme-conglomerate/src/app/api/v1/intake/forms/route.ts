import { NextResponse } from "next/server";
import { listIntakeForms } from "@/lib/data/intake-forms";
import { requireOwnerClerkId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const owner = await requireOwnerClerkId();
    const forms = await listIntakeForms(owner);
    return NextResponse.json({
      forms: forms.map((f) => ({
        id: f.id,
        title: f.title,
        share_token: f.share_token,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
