import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mine & Yours Shop collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "rgba(0,0,0,0.45)", fontSize: 13, marginBottom: 48 }}>Effective date: November 10, 2026</p>

      <Section title="1. Who We Are">
        Mine &amp; Yours Shop is an online retail store operated by J Supreme Tech, serving customers in Jamaica and
        internationally. Website:{" "}
        <a href="https://mineandyoursshop.online" style={{ color: "var(--gold)" }}>mineandyoursshop.online</a>.
        Contact: <a href="tel:+16582182282" style={{ color: "var(--gold)" }}>(658) 218-2282</a>.
      </Section>

      <Section title="2. Information We Collect">
        We collect information you give us directly when you create an account, sign in with Google, place an order,
        subscribe to our newsletter, or contact us. When you sign in with Google we receive your name, email, and
        profile picture from Google — your Google credentials are never stored on our servers. We also collect
        basic technical data (IP address, browser type, pages viewed) automatically.
      </Section>

      <Section title="3. How We Use Your Information">
        We use your information to process and fulfil orders, manage your account, send order confirmations and
        shipping updates, send our newsletter (only if you opted in), improve our site, and comply with legal
        obligations. We do not sell your personal data to third parties.
      </Section>

      <Section title="4. Data Storage &amp; Security">
        Account data is stored securely via Supabase (United States). We use HTTPS/TLS encryption in transit and
        encryption at rest. Data is retained as long as your account is active or as required by law.
      </Section>

      <Section title="5. Cookies">
        We use essential cookies to keep you signed in and remember your cart. We do not use advertising or tracking
        cookies. Disabling cookies may affect site functionality.
      </Section>

      <Section title="6. Your Rights">
        You may access, correct, or delete your personal information at any time by contacting us at{" "}
        <a href="tel:+16582182282" style={{ color: "var(--gold)" }}>(658) 218-2282</a>. We respond within 30 days.
      </Section>

      <Section title="7. Changes">
        We may update this policy. The effective date above will reflect any changes. Continued use of the site
        constitutes acceptance of the updated policy.
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 20, marginBottom: 12 }}>{title}</h2>
      <div style={{ lineHeight: 1.8, color: "rgba(0,0,0,0.75)", fontSize: 15 }}>{children}</div>
    </section>
  )
}
