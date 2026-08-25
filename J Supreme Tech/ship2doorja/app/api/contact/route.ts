import { NextResponse } from "next/server";
import { sendContact } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b?.name || !b?.email || !b?.message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    const result = await sendContact({
      name: String(b.name),
      email: String(b.email),
      phone: b.phone ? String(b.phone) : undefined,
      message: String(b.message),
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
