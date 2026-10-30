import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingNotification, sendEmail, buildAppointmentConfirmationEmail } from "@/lib/notify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { clientSlug, customerName, customerPhone, customerEmail, service, bookingDate, bookingTime, notes } = await req.json();
    if (!customerName || !clientSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: client, error: clientErr } = await supabase
      .from("ct_clients")
      .select("id, name")
      .eq("slug", clientSlug)
      .single();

    if (clientErr || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const { data: booking, error } = await supabase.from("ct_bookings").insert({
      client_id: client.id,
      customer_name: customerName,
      customer_phone: customerPhone || null,
      customer_email: customerEmail || null,
      service: service || null,
      booking_date: bookingDate || null,
      booking_time: bookingTime || null,
      status: "pending",
      notes: notes || null,
    }).select("id").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notifications — both non-blocking
    await sendBookingNotification({
      clientName: client.name,
      customerName,
      customerPhone: customerPhone || "",
      service: service || "Appointment",
      bookingDate,
      bookingTime,
    });

    if (customerEmail) {
      const { subject, html } = buildAppointmentConfirmationEmail({
        businessName: client.name,
        customerName,
        service: service || "Appointment",
        dateTime: [bookingDate, bookingTime].filter(Boolean).join(" at ") || "TBD",
      });
      await sendEmail({ clientId: client.id, to: customerEmail, subject, html, template: "booking_confirmation", relatedId: booking?.id });
    }

    return NextResponse.json({ ok: true, bookingId: booking?.id });
  } catch (err) {
    console.error("submit-booking error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
