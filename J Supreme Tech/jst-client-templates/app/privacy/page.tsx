export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>JST Client Templates</p>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "#6b7280", marginBottom: 40 }}>Last updated: {new Date().toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" })}</p>

      {[
        ["1. Information We Collect", "We collect information you provide when placing orders, making booking requests, or submitting quote inquiries. This includes your name, phone number, email address, and any message content you submit through our forms."],
        ["2. How We Use Your Information", "We use your information to process orders and bookings, contact you regarding your requests, improve our services, and comply with legal obligations. We do not sell your personal data to third parties."],
        ["3. Data Storage", "Your data is securely stored on Supabase infrastructure. We implement industry-standard security measures to protect your information from unauthorized access."],
        ["4. Sharing of Information", "Your information is shared only with the specific merchant whose storefront you used, and with service providers necessary to operate the platform (such as email and messaging providers). We do not share your data with unrelated third parties."],
        ["5. Cookies", "We use minimal cookies necessary for the operation of our storefronts, including session state and user preferences. No tracking or advertising cookies are used without consent."],
        ["6. Your Rights", "You have the right to access, correct, or request deletion of your personal data. Contact the business through their storefront or reach us at info@jsupremetech.online to exercise these rights."],
        ["7. Children's Privacy", "Our services are not directed to children under 13. We do not knowingly collect personal information from children."],
        ["8. Changes to This Policy", "We may update this Privacy Policy periodically. We will notify users of significant changes by updating the date at the top of this page."],
        ["9. Contact", "For privacy-related inquiries, contact J Supreme Tech at info@jsupremetech.online or (658) 218-2282."],
      ].map(([title, content]) => (
        <div key={title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", margin: 0 }}>{content}</p>
        </div>
      ))}
    </div>
  );
}
