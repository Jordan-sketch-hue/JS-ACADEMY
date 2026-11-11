import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for shopping at Mine & Yours Shop.",
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: "rgba(0,0,0,0.45)", fontSize: 13, marginBottom: 48 }}>Effective date: November 10, 2026</p>

      <Section title="1. Acceptance">
        By accessing or using mineandyoursshop.online (&ldquo;Site&rdquo;) you agree to these Terms of Service.
        If you do not agree, please do not use the Site. The Site is operated by J Supreme Tech.
      </Section>

      <Section title="2. Products &amp; Pricing">
        All prices are displayed in JMD or USD based on your region. We reserve the right to modify prices at any time.
        Product descriptions and images are provided in good faith; minor variations may occur. We reserve the right
        to refuse or cancel any order at our discretion.
      </Section>

      <Section title="3. Orders &amp; Payment">
        Orders are confirmed by email after payment is processed. Payment is accepted via our secure checkout.
        By placing an order you represent that you are at least 18 years old or have parental consent.
      </Section>

      <Section title="4. Shipping &amp; Delivery">
        We ship across Jamaica and internationally. Delivery times and costs are shown at checkout. Risk of loss
        passes to you upon delivery to the carrier. We are not responsible for customs fees or import duties.
      </Section>

      <Section title="5. Returns &amp; Refunds">
        If you receive a damaged or incorrect item, contact us within 7 days of delivery at{" "}
        <a href="tel:+16582182282" style={{ color: "var(--gold)" }}>(658) 218-2282</a>. We will arrange a replacement
        or refund at our discretion. Items must be unused and in original packaging.
      </Section>

      <Section title="6. Accounts">
        You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us
        immediately of any unauthorised use. We may suspend or terminate accounts that violate these terms.
      </Section>

      <Section title="7. Intellectual Property">
        All content on this Site — including images, text, logos, and design — is owned by or licensed to J Supreme Tech
        and may not be reproduced without written permission.
      </Section>

      <Section title="8. Limitation of Liability">
        To the fullest extent permitted by law, J Supreme Tech is not liable for any indirect, incidental, or
        consequential damages arising from your use of the Site or purchase of products.
      </Section>

      <Section title="9. Governing Law">
        These terms are governed by the laws of Jamaica. Disputes will be resolved in the courts of Jamaica.
      </Section>

      <Section title="10. Contact">
        Mine &amp; Yours Shop — J Supreme Tech<br />
        Phone: <a href="tel:+16582182282" style={{ color: "var(--gold)" }}>(658) 218-2282</a><br />
        Website: <a href="https://mineandyoursshop.online" style={{ color: "var(--gold)" }}>mineandyoursshop.online</a>
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
