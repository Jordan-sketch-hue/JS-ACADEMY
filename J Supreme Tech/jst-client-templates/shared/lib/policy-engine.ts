/**
 * shared/lib/policy-engine.ts — Legal policy template builder.
 *
 * CRITICAL RULES:
 * - NEVER fabricate legal advice, compliance guarantees, or certifications.
 * - Every generated policy is a TEMPLATE requiring human legal review before publish.
 * - Tenant policies are APPEND-ONLY — never update/delete rows in tenant_policies.
 * - Consent events must be recorded in consent_events before surfacing a policy.
 *
 * Policy types (16):
 *   privacy, terms, cookies, refund, shipping, returns, disclaimer,
 *   accessibility, data-retention, aml, gdpr, ccpa, vendor, nda,
 *   service-agreement, photo-release
 */

export type PolicyType =
  | "privacy" | "terms" | "cookies" | "refund" | "shipping" | "returns"
  | "disclaimer" | "accessibility" | "data-retention" | "aml" | "gdpr"
  | "ccpa" | "vendor" | "nda" | "service-agreement" | "photo-release";

export interface PolicyInput {
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  businessAddress?: string;
  jurisdiction?: string;
  effectiveDate: string;
  /** Category-specific clauses from CATEGORY_CONFIG.policyClauses */
  extraClauses?: string[];
}

/** Version record stored in tenant_policies (append-only) */
export interface PolicyVersion {
  policyType: PolicyType;
  version: string;
  content: string;
  status: "draft" | "pending_review" | "approved" | "published" | "archived";
  createdAt: string;
  tenantId: string;
}

/** Consent evidence stored in consent_events */
export interface ConsentEvent {
  userId: string;
  policyType: PolicyType;
  policyVersion: string;
  consentedAt: string;
  ipAddress?: string;
  userAgent?: string;
  method: "checkbox" | "click" | "api";
}

// ─── Policy templates ─────────────────────────────────────────────────────────

function header(type: PolicyType, input: PolicyInput): string {
  return `# ${POLICY_TITLES[type]}

**Business:** ${input.businessName}
**Effective Date:** ${input.effectiveDate}
**Jurisdiction:** ${input.jurisdiction ?? "Jamaica"}
**Contact:** ${input.businessEmail}${input.businessPhone ? ` · ${input.businessPhone}` : ""}

> ⚠️ **DRAFT — Requires legal review before publication.**
> This document was generated from a template and must be reviewed by a qualified attorney
> before being published or presented to users.

---
`;
}

export const POLICY_TITLES: Record<PolicyType, string> = {
  "privacy": "Privacy Policy",
  "terms": "Terms & Conditions",
  "cookies": "Cookie Policy",
  "refund": "Refund Policy",
  "shipping": "Shipping Policy",
  "returns": "Returns & Exchanges Policy",
  "disclaimer": "Disclaimer",
  "accessibility": "Accessibility Statement",
  "data-retention": "Data Retention Policy",
  "aml": "Anti-Money Laundering Policy",
  "gdpr": "GDPR Data Processing Addendum",
  "ccpa": "CCPA Privacy Notice",
  "vendor": "Vendor Agreement",
  "nda": "Non-Disclosure Agreement",
  "service-agreement": "Service Agreement",
  "photo-release": "Photo & Media Release",
};

export function buildPolicy(type: PolicyType, input: PolicyInput): string {
  const h = header(type, input);
  const extra = input.extraClauses?.length
    ? "\n## Additional Terms\n\n" + input.extraClauses.map(c => `- ${c}`).join("\n")
    : "";

  const bodies: Record<PolicyType, string> = {
    "privacy": `## 1. Information We Collect\n\nWe collect information you provide directly to us, including name, email address, phone number, and any other information you choose to provide.\n\n## 2. How We Use Your Information\n\nWe use the information we collect to provide, maintain, and improve our services, process transactions, send you related information, and comply with legal obligations.\n\n## 3. Information Sharing\n\nWe do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this policy.\n\n## 4. Data Security\n\nWe implement appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.\n\n## 5. Your Rights\n\nYou have the right to access, correct, or delete your personal data. Contact us at ${input.businessEmail} to exercise these rights.\n\n## 6. Contact\n\n${input.businessName} · ${input.businessEmail}${input.businessPhone ? ` · ${input.businessPhone}` : ""}`,

    "terms": `## 1. Acceptance\n\nBy accessing or using our services, you agree to be bound by these Terms & Conditions.\n\n## 2. Use of Services\n\nYou agree to use our services only for lawful purposes and in accordance with these Terms.\n\n## 3. Intellectual Property\n\nAll content on this site is owned by or licensed to ${input.businessName} and is protected by applicable intellectual property laws.\n\n## 4. Limitation of Liability\n\nTo the maximum extent permitted by law, ${input.businessName} shall not be liable for any indirect, incidental, or consequential damages.\n\n## 5. Governing Law\n\nThese Terms shall be governed by the laws of ${input.jurisdiction ?? "Jamaica"}.\n\n## 6. Contact\n\n${input.businessName} · ${input.businessEmail}`,

    "cookies": `## Cookie Policy\n\nWe use cookies to enhance your experience. By continuing to use our site, you consent to our use of cookies.\n\n### Types of Cookies\n- **Essential:** Required for the site to function.\n- **Analytics:** Help us understand how visitors use the site.\n- **Marketing:** Used to deliver relevant advertisements.\n\n### Managing Cookies\n\nYou can control cookies through your browser settings. Disabling certain cookies may affect site functionality.`,

    "refund": `## Refund Policy\n\nWe want you to be satisfied with your purchase. If you are not completely satisfied, please contact us within 14 days of purchase.\n\n### Eligibility\n\nRefunds are considered on a case-by-case basis. Items must be unused and in original condition.\n\n### Process\n\nTo request a refund, contact ${input.businessEmail} with your order details and reason for the request.`,

    "shipping": `## Shipping Policy\n\nOrders are processed within 2–3 business days. Delivery times vary by location.\n\n### Rates\n\nShipping rates are calculated at checkout based on weight and destination.\n\n### Tracking\n\nYou will receive a tracking number once your order has shipped.`,

    "returns": `## Returns & Exchanges\n\nWe accept returns within 14 days of delivery for unused items in original packaging.\n\n### Process\n\nContact us at ${input.businessEmail} to initiate a return. Include your order number and reason for return.`,

    "disclaimer": `## Disclaimer\n\nThe information provided by ${input.businessName} is for general informational purposes only. It does not constitute professional advice. Always seek the advice of a qualified professional.`,

    "accessibility": `## Accessibility Statement\n\n${input.businessName} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.\n\n### Conformance Status\n\nWe aim to conform to WCAG 2.1 Level AA.\n\n### Feedback\n\nContact ${input.businessEmail} to report accessibility barriers.`,

    "data-retention": `## Data Retention Policy\n\nWe retain personal data only as long as necessary for the purposes for which it was collected, or as required by law.\n\n### Retention Periods\n\n- Customer records: 7 years\n- Marketing data: 2 years or until consent withdrawn\n- Transaction data: 7 years (legal requirement)`,

    "aml": `## Anti-Money Laundering Policy\n\n${input.businessName} is committed to preventing money laundering and terrorist financing. We comply with all applicable AML regulations in ${input.jurisdiction ?? "Jamaica"}.\n\n### Customer Due Diligence\n\nWe verify the identity of customers before providing services where required by law.`,

    "gdpr": `## GDPR Data Processing Addendum\n\nThis Addendum supplements any agreement between ${input.businessName} and its EU-based customers regarding the processing of personal data under GDPR.\n\n### Lawful Basis\n\nData processing is conducted on the basis of contract performance, legitimate interests, or consent as applicable.`,

    "ccpa": `## CCPA Privacy Notice\n\nThis notice is for California residents. You have the right to know what personal information we collect, the right to delete, and the right to opt-out of sale of personal information.\n\n### Contact\n\n${input.businessEmail}`,

    "vendor": `## Vendor Agreement\n\nThis agreement governs the relationship between ${input.businessName} and its vendors. By supplying goods or services, vendors agree to these terms.`,

    "nda": `## Non-Disclosure Agreement\n\nThis NDA governs the disclosure of confidential information between ${input.businessName} and the receiving party. Confidential information shall not be disclosed to third parties without prior written consent.`,

    "service-agreement": `## Service Agreement\n\nThis Service Agreement outlines the terms under which ${input.businessName} provides services to its clients. Services are provided as described in the applicable Statement of Work.`,

    "photo-release": `## Photo & Media Release\n\nBy participating in a session or event organized by ${input.businessName}, you grant us permission to photograph, film, and use your likeness for promotional purposes unless you explicitly opt out in writing.`,
  };

  return h + bodies[type] + extra;
}

/** Version string in semver format: 1.0.0, 1.0.1 … */
export function nextVersion(current?: string): string {
  if (!current) return "1.0.0";
  const parts = current.split(".").map(Number);
  parts[2] = (parts[2] ?? 0) + 1;
  return parts.join(".");
}
