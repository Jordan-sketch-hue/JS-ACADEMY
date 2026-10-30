export default function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>JST Client Templates</p>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: "#6b7280", marginBottom: 40 }}>Last updated: {new Date().toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" })}</p>

      {[
        ["1. Acceptance of Terms", "By accessing or using any storefront powered by JST Client Templates, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service."],
        ["2. Use of Service", "Our platform provides online storefronts, booking systems, and quote request forms for local businesses. You agree to use these services only for lawful purposes and in accordance with these Terms."],
        ["3. Orders and Payments", "All orders placed through our storefronts are subject to confirmation by the individual business. Prices are displayed in Jamaican Dollars (JMD) unless stated otherwise. Payment methods vary by merchant and are processed securely."],
        ["4. Bookings and Appointments", "Booking requests submitted through our platform are not confirmed until you receive explicit confirmation from the business. We reserve the right to cancel or reschedule appointments with reasonable notice."],
        ["5. Returns and Refunds", "Return and refund policies are determined by each individual merchant. Please contact the specific business for their policy before placing an order."],
        ["6. Privacy", "Your use of our services is also governed by our Privacy Policy. By using our services, you consent to the collection and use of information as described therein."],
        ["7. Intellectual Property", "All content, branding, and materials on individual storefronts belong to their respective business owners. Unauthorized use, reproduction, or distribution is prohibited."],
        ["8. Limitation of Liability", "To the maximum extent permitted by law, JST Client Templates and the individual merchants shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services."],
        ["9. Changes to Terms", "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the revised terms."],
        ["10. Contact", "For questions about these Terms, contact the individual business through their storefront, or reach out to J Supreme Tech at info@jsupremetech.online."],
      ].map(([title, content]) => (
        <div key={title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", margin: 0 }}>{content}</p>
        </div>
      ))}
    </div>
  );
}
