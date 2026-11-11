const RESEND_API_KEY = process.env.RESEND_API_KEY ?? ""
const FROM = "Mine & Yours Shop <shop@jsupremetech.online>"

interface OrderItem { name: string; qty: number; price_usd: number }

interface OrderConfirmationData {
  to: string
  customerName?: string
  orderRef: string
  items: OrderItem[]
  totalUsd: number
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  if (!RESEND_API_KEY) {
    console.warn("[resend] RESEND_API_KEY not set — skipping order confirmation email")
    return
  }

  const greeting = data.customerName ? `Hi ${data.customerName.split(" ")[0]},` : "Hi there,"
  const itemRows = data.items.map(i =>
    `<tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ede6;font-size:14px;color:#1a1a1a">${i.name}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0ede6;font-size:14px;color:#888;text-align:center">×${i.qty}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0ede6;font-size:14px;font-weight:700;color:#1a1a1a;text-align:right">$${(i.price_usd * i.qty).toFixed(2)}</td>
    </tr>`
  ).join("")

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:'Georgia',serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:#0a0f1e;padding:32px 40px;text-align:center">
          <p style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.01em">
            Mine &amp; Yours<span style="color:#c8a84b"> Shop</span>
          </p>
          <p style="margin:8px 0 0;font-size:10px;letter-spacing:.22em;color:rgba(255,255,255,0.4);text-transform:uppercase">Order Confirmation</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#fff;padding:40px">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#c8a84b;font-family:Arial,sans-serif">Order Received</p>
          <h1 style="margin:0 0 20px;font-size:28px;font-weight:900;color:#0a0f1e;line-height:1.1">${greeting}</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#666;line-height:1.7">
            Thank you for your order. We've received your payment and your items are being prepared for delivery across Jamaica.
          </p>

          <!-- Order ref -->
          <div style="background:#f5f4f0;border-left:3px solid #c8a84b;padding:16px 20px;margin-bottom:32px">
            <p style="margin:0;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#888;font-family:Arial,sans-serif">Order Reference</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:900;color:#0a0f1e;letter-spacing:.08em">#${data.orderRef.toUpperCase()}</p>
          </div>

          <!-- Items -->
          <p style="margin:0 0 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;border-bottom:1px solid #f0ede6;padding-bottom:12px">Your Items</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
            <tr>
              <td colspan="2" style="padding:16px 0 0;font-size:13px;color:#888;font-family:Arial,sans-serif">Total (USD)</td>
              <td style="padding:16px 0 0;font-size:20px;font-weight:900;color:#0a0f1e;text-align:right">$${data.totalUsd.toFixed(2)}</td>
            </tr>
          </table>

          <!-- Delivery steps -->
          <div style="margin:40px 0 32px;border-top:1px solid #f0ede6;padding-top:32px">
            <p style="margin:0 0 20px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#888;font-family:Arial,sans-serif">What Happens Next</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:32px;vertical-align:top;padding-top:2px">
                  <div style="width:24px;height:24px;background:#c8a84b;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#0a0f1e;text-align:center;line-height:24px">1</div>
                </td>
                <td style="padding:0 0 20px 12px">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#0a0f1e">Order Confirmed</p>
                  <p style="margin:3px 0 0;font-size:12px;color:#888">Payment received and order logged.</p>
                </td>
              </tr>
              <tr>
                <td style="width:32px;vertical-align:top;padding-top:2px">
                  <div style="width:24px;height:24px;background:#f0ede6;border-radius:50%;font-size:11px;font-weight:800;color:#0a0f1e;text-align:center;line-height:24px">2</div>
                </td>
                <td style="padding:0 0 20px 12px">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#0a0f1e">Processing & Dispatch</p>
                  <p style="margin:3px 0 0;font-size:12px;color:#888">Items are picked, packed and handed to courier.</p>
                </td>
              </tr>
              <tr>
                <td style="width:32px;vertical-align:top;padding-top:2px">
                  <div style="width:24px;height:24px;background:#f0ede6;border-radius:50%;font-size:11px;font-weight:800;color:#0a0f1e;text-align:center;line-height:24px">3</div>
                </td>
                <td style="padding:0 0 0 12px">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#0a0f1e">Delivered to Your Door</p>
                  <p style="margin:3px 0 0;font-size:12px;color:#888">Island-wide delivery across Jamaica.</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA -->
          <p style="margin:0 0 32px;font-size:14px;color:#666;line-height:1.7">
            Questions about your order? Call us at <a href="tel:+16582182282" style="color:#c8a84b;font-weight:700">(658) 218-2282</a> or reply to this email.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0a0f1e;padding:24px 40px;text-align:center">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif">
            Mine &amp; Yours Shop · Powered by <a href="https://jsupremetech.online" style="color:#c8a84b;text-decoration:none">J Supreme Tech</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [data.to],
      subject: `Order Confirmed — #${data.orderRef.toUpperCase()} | Mine & Yours Shop`,
      html,
    }),
  })
}
