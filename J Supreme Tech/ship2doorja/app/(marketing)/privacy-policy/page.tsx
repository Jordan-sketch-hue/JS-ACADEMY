import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Ship 2 Door JA privacy policy and data protection information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        blurb="How we collect, use, and protect your information."
      />

      <Section>
        <Container className="max-w-3xl">
          <div className="prose prose-slate max-w-none">
            <h2>Privacy Policy</h2>
            <p>Last updated: June 2026</p>

            <h3>1. Information We Collect</h3>
            <p>
              When you use Ship 2 Door JA, we collect information including your name, 
              contact details, shipping address, and payment information to provide our forwarding service.
            </p>

            <h3>2. How We Use Your Information</h3>
            <p>
              Your information is used to process shipments, communicate about your packages, 
              handle customs clearance, and improve our service.
            </p>

            <h3>3. Data Security</h3>
            <p>
              We protect your information using industry-standard security measures and 
              do not share your data with third parties without your consent.
            </p>

            <h3>4. Your Rights</h3>
            <p>
              You have the right to access, update, or delete your personal information 
              at any time. Contact us for requests.
            </p>

            <h3>5. Contact Us</h3>
            <p>
              Questions about this policy? Email us at <strong>ship2door@outlook.com</strong> or 
              message us on WhatsApp at <strong>(876) 360-2586</strong>.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
