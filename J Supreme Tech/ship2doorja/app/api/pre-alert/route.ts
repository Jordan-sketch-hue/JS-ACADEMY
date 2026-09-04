import { NextResponse } from "next/server";
import { sendPreAlert } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b?.store || !b?.desc) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    const result = await sendPreAlert({
      name: b.name ? String(b.name) : "Customer",
      email: b.email ? String(b.email) : undefined,
      store: String(b.store),
      desc: String(b.desc),
      tracking: b.tracking ? String(b.tracking) : undefined,
      value: b.value ? String(b.value) : undefined,
      weight: b.weight ? String(b.weight) : undefined,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
