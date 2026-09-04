import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS } from "@/lib/access";
import { sendStatusUpdate } from "@/lib/email";

export async function POST(req: Request) {
  // Only an authenticated back-office session can email customers.
  const jar = await cookies();
  if (jar.get(ACCESS.admin.cookie)?.value !== ACCESS.admin.key) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const b = await req.json();
    if (!b?.to || !b?.packageId || !b?.status) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    const result = await sendStatusUpdate({
      to: String(b.to),
      name: b.name ? String(b.name) : "there",
      packageId: String(b.packageId),
      store: b.store ? String(b.store) : "",
      status: String(b.status),
      eta: b.eta ? String(b.eta) : undefined,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
