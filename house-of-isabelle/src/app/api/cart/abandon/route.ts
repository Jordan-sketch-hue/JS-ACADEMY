/**
 * GET /api/cart/abandon
 *
 * Vercel Cron — runs hourly via vercel.json:
 *   { "crons": [{ "path": "/api/cart/abandon", "schedule": "0 * * * *" }] }
 *
 * Finds carts abandoned for 1–24 hours with an email and no prior reminder,
 * then sends a Resend abandoned cart email.
 *
 * Protected by CRON_SECRET header (set in Vercel env).
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendAbandonedCartReminder } from "@/lib/resend";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabaseAdmin();
  const now      = new Date();
  const hourAgo  = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const dayAgo   = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Find eligible abandoned carts
  const { data: carts, error } = await db
    .from("hi_carts")
    .select("id, email, updated_at, total_jmd, items:hi_cart_items(*, variant:hi_product_variants(*, product:hi_products(name)))")
    .eq("status", "active")
    .not("email", "is", null)
    .lt("updated_at", hourAgo.toISOString())
    .gt("updated_at", dayAgo.toISOString());

  if (error) {
    console.error("[abandon cron] DB error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!carts || carts.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;

  for (const cart of carts) {
    // Check if we already sent a reminder for this cart in this window (24h cooldown)
    const { count } = await db
      .from("hi_abandoned_cart_log")
      .select("id", { count: "exact", head: true })
      .eq("cart_id", cart.id)
      .gt("sent_at", dayAgo.toISOString());

    if ((count ?? 0) > 0) continue;

    const items = cart.items as any[];
    if (!items || items.length === 0) continue;

    const cartItems = items
      .map((i: any) => `${i.variant?.product?.name ?? "Hair Product"} ×${i.quantity}`)
      .join(", ");

    const resendId = await sendAbandonedCartReminder({
      to:          cart.email!,
      customerName: cart.email!.split("@")[0],
      cartItems,
      totalJMD:    cart.total_jmd ?? 0,
      cartUrl:     `${process.env.NEXT_PUBLIC_SITE_URL}/cart?restore=${cart.id}`,
    });

    if (resendId) {
      await db.from("hi_abandoned_cart_log").insert({
        cart_id:    cart.id,
        email:      cart.email,
        resend_id:  resendId,
      });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent });
}
