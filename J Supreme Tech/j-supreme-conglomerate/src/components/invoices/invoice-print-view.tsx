"use client";

import { useEffect } from "react";
import { CheckCircle2, Printer } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { formatCurrencyAmount } from "@/lib/utils";
import {
  computeInvoiceTotals,
  DEFAULT_ISSUING_COMPANY,
  DEFAULT_ISSUING_EMAIL,
  DEFAULT_ISSUING_PHONE,
  type InvoiceWithLines,
} from "@/lib/data/invoices";

export function InvoicePrintView({ bundle }: { bundle: InvoiceWithLines }) {
  const { invoice: inv, lines, client_business_name, deposit_invoice } = bundle;

  const totals = computeInvoiceTotals(
    lines.map((l) => ({
      description: l.description,
      quantity: l.quantity,
      unit_rate: l.unit_rate,
    })),
    inv.tax_rate_percent,
    inv.discount_amount > 0 ? inv.discount_amount : null,
  );

  const currency = inv.currency ?? "USD";
  const companyName = inv.company_name ?? DEFAULT_ISSUING_COMPANY;
  const isDeposit = inv.is_deposit;
  const totalProjectNumber = inv.total_project_amount;
  const remainingBalance =
    isDeposit && totalProjectNumber != null
      ? Math.max(0, Math.round((totalProjectNumber - totals.amount) * 100) / 100)
      : null;

  const invoiceType = isDeposit
    ? "Deposit Invoice"
    : deposit_invoice
      ? "Final Invoice"
      : "Invoice";

  // Auto-trigger the browser print dialog after a short delay
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Screen-only toolbar — hidden when printing */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#f8f8f8",
          borderBottom: "1px solid #e5e5e5",
          fontSize: 13,
        }}
      >
        <span style={{ color: "#555" }}>
          {invoiceType} · {inv.number}
        </span>
        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#0a0a0a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Printer size={14} />
          Print / Save PDF
        </button>
      </div>

      {/* Spacer so content isn't behind the toolbar */}
      <div className="no-print" style={{ height: 52 }} />

      {/* ── Invoice document ─────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "32px 32px 48px",
          background: "#fff",
          minHeight: "100vh",
          fontFamily: "inherit",
          color: "#0a0a0a",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 24,
            borderBottom: "2px solid #0a0a0a",
            paddingBottom: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ height: 52, width: 52, flexShrink: 0 }}>
              <Logo className="h-full w-full text-neutral-900" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {companyName}
              </p>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#777",
                  marginTop: 3,
                }}
              >
                Digital infrastructure studio
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#777",
                margin: 0,
              }}
            >
              {invoiceType}
            </p>
            <p
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: "4px 0 0",
              }}
            >
              {inv.number}
            </p>
          </div>
        </div>

        {/* Bill to + dates */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#777", margin: 0 }}>
              Bill to
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>
              {client_business_name ?? "—"}
            </p>
          </div>
          <table style={{ fontSize: 12, borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Issued", inv.issued_at ?? "—"],
                ["Due", inv.due_date ?? "—"],
                ["Status", inv.status],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ color: "#777", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", paddingRight: 16, paddingBottom: 3 }}>
                    {label}
                  </td>
                  <td style={{ textAlign: "right", textTransform: "capitalize", fontFeatureSettings: '"tnum"', paddingBottom: 3 }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Services rendered */}
        {inv.services_rendered.length > 0 ? (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#777", margin: "0 0 8px" }}>
              Services rendered
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {inv.services_rendered.map((s) => (
                <span
                  key={s}
                  style={{
                    border: "1px solid #d4d4d4",
                    borderRadius: 99,
                    background: "#f9f9f9",
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Line items */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32, fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e5e5", background: "#fafafa" }}>
              {["Description", "Qty", "Rate", "Line"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#777",
                    textAlign: i === 0 ? "left" : "right",
                    padding: "8px 12px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "10px 12px", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>{line.description}</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontFeatureSettings: '"tnum"' }}>
                  {line.quantity}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontFeatureSettings: '"tnum"' }}>
                  {formatCurrencyAmount(line.unit_rate, currency)}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                  {formatCurrencyAmount(line.line_total, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Thank you + Totals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 32, marginBottom: 24 }}>
          {/* Left: thank you */}
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "#333" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#777", margin: "0 0 8px" }}>
              Thank you
            </p>
            <p style={{ margin: 0 }}>
              We appreciate your partnership with {companyName}.{" "}
              {isDeposit
                ? "Settling this deposit secures your slot and starts production."
                : deposit_invoice
                  ? `This is the final balance for your project. Your deposit (${deposit_invoice.number}) has already been received and applied above.`
                  : "Settling this invoice keeps your delivery on schedule."}
            </p>
            {inv.notes?.trim() && !deposit_invoice ? (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#777", margin: "0 0 6px" }}>
                  Notes
                </p>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{inv.notes}</p>
              </div>
            ) : null}
          </div>

          {/* Right: totals */}
          <div>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", marginBottom: 8 }}>
              <tbody>
                <tr>
                  <td style={{ color: "#777", paddingBottom: 4 }}>Subtotal</td>
                  <td style={{ textAlign: "right", fontFeatureSettings: '"tnum"', paddingBottom: 4 }}>
                    {formatCurrencyAmount(totals.subtotal, currency)}
                  </td>
                </tr>
                {totals.discount_amount > 0 ? (
                  <tr>
                    <td style={{ color: "#777", paddingBottom: 4 }}>Discount</td>
                    <td style={{ textAlign: "right", fontFeatureSettings: '"tnum"', paddingBottom: 4 }}>
                      −{formatCurrencyAmount(totals.discount_amount, currency)}
                    </td>
                  </tr>
                ) : null}
                {totals.tax_amount > 0 ? (
                  <tr>
                    <td style={{ color: "#777", paddingBottom: 4 }}>Tax</td>
                    <td style={{ textAlign: "right", fontFeatureSettings: '"tnum"', paddingBottom: 4 }}>
                      {formatCurrencyAmount(totals.tax_amount, currency)}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>

            {/* Total bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 8,
                padding: "10px 14px",
                background: inv.status === "paid" ? "#047857" : "#0a0a0a",
                color: "#fff",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              } as React.CSSProperties}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                {inv.status === "paid"
                  ? (isDeposit ? "Deposit paid · Cleared" : "Paid in full · Cleared")
                  : (isDeposit ? "Deposit due now" : "Total due")}
              </span>
              <span style={{ fontSize: 17, fontWeight: 800, fontFeatureSettings: '"tnum"' }}>
                {formatCurrencyAmount(totals.amount, currency)}
              </span>
            </div>

            {/* Deposit balance box */}
            {isDeposit && totalProjectNumber != null ? (
              <div style={{ marginTop: 10, border: "1px solid #d4d4d4", borderRadius: 8, background: "#fafafa", padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666", marginBottom: 6 }}>
                  <span>Full project price</span>
                  <span style={{ fontFeatureSettings: '"tnum"' }}>{formatCurrencyAmount(totalProjectNumber, currency)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                  <span>Balance remaining</span>
                  <span style={{ fontFeatureSettings: '"tnum"' }}>{formatCurrencyAmount(remainingBalance!, currency)}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Payment history (final invoices only) */}
        {deposit_invoice ? (
          <div
            style={{
              border: "1px solid #d4d4d4",
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 32,
            }}
          >
            <div style={{ background: "#f0f0f0", borderBottom: "1px solid #d4d4d4", padding: "8px 16px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#555", margin: 0 }}>
                Payment history — full transaction record
              </p>
            </div>

            {/* Deposit row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #ebebeb", fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#777", width: 70 }}>
                  ① Deposit
                </span>
                <span style={{ fontWeight: 600 }}>{deposit_invoice.number}</span>
                {deposit_invoice.issued_at ? (
                  <span style={{ color: "#777" }}>received {deposit_invoice.issued_at.slice(0, 10)}</span>
                ) : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontFeatureSettings: '"tnum"' }}>
                  {formatCurrencyAmount(deposit_invoice.amount, deposit_invoice.currency)}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", border: "1px solid #6ee7b7", borderRadius: 99, background: "#ecfdf5", color: "#065f46", padding: "2px 8px" }}>
                  {deposit_invoice.status}
                </span>
              </div>
            </div>

            {/* Balance row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #ebebeb", fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#777", width: 70 }}>
                  ② Balance
                </span>
                <span style={{ fontWeight: 600 }}>{inv.number}</span>
                <span style={{ color: "#777" }}>this invoice · due now</span>
              </div>
              <span style={{ fontWeight: 700, fontFeatureSettings: '"tnum"' }}>
                {formatCurrencyAmount(totals.amount, currency)}
              </span>
            </div>

            {/* Total row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#fafafa", fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#444" }}>Total project value</span>
              <span style={{ fontWeight: 800, fontFeatureSettings: '"tnum"' }}>
                {formatCurrencyAmount(
                  deposit_invoice.total_project_amount ??
                    deposit_invoice.amount + totals.amount,
                  currency,
                )}
              </span>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 12, textAlign: "center", fontSize: 9, color: "#888", letterSpacing: "0.02em" }}>
          <p style={{ letterSpacing: "0.25em", textTransform: "uppercase", margin: 0 }}>
            {companyName} · {inv.number}
          </p>
          <p style={{ marginTop: 4, color: "#999" }}>
            {DEFAULT_ISSUING_PHONE} · {DEFAULT_ISSUING_EMAIL}
          </p>
        </div>
      </div>
    </>
  );
}
