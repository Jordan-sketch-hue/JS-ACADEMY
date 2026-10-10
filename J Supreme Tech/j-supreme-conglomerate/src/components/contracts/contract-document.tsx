import { Logo } from "@/components/brand/logo";
import { formatCurrencyAmount } from "@/lib/utils";
import {
  cadenceFeePhrase,
  cadencePeriodNoun,
  cadenceSpanPhrase,
  recurrenceLabel,
  type Recurrence,
} from "@/lib/invoices/recurrence";
import type { ContractListItem } from "@/lib/data/contracts";
import { SignatureView } from "@/components/contracts/signature-view";
import { parseSignature } from "@/lib/contracts/signature";

/**
 * One source of truth for the agreement text. The operator editor renders it
 * from live form state; the public /sign page renders it from the saved
 * record — both through this component, so the document a client signs is
 * exactly the document the operator drafted.
 */
export type ContractDocData = {
  provider: string;
  clientName: string;
  title: string;
  isRetainer: boolean;
  cadence: Recurrence;
  services: string[];
  scope: string;
  startDate: string;
  endDate: string;
  feeLabel: string;
  /** Just the formatted amount, no cadence suffix — for schedule sentences. */
  feeAmountOnly: string;
  depositLabel: string | null;
  /** Retainers: deposit >= one period's fee, so it pays for the first period. */
  depositCoversFirstPeriod: boolean;
  paymentTermsDays: number;
  lateFee: string;
  governingLaw: string;
  terminationDays: number;
  liabilityText: string;
  confidentiality: boolean;
  ipAssignment: boolean;
  validUntil: string;
};

export function docDataFromRecord(c: ContractListItem): ContractDocData {
  const isRetainer = c.contract_type === "retainer";
  const feeAmountOnly =
    c.fee_amount > 0 ? formatCurrencyAmount(c.fee_amount, c.currency) : "[fee]";
  const fee =
    c.fee_amount > 0
      ? isRetainer
        ? `${feeAmountOnly} ${cadenceFeePhrase(c.billing_cadence)}`
        : feeAmountOnly
      : "[fee]";
  return {
    provider: c.company_name?.trim() || "J Supreme Conglomerate",
    clientName:
      c.client_business_name ?? c.client_signer_name ?? "[Client]",
    title: c.title,
    isRetainer,
    cadence: c.billing_cadence,
    services: c.services,
    scope: c.scope ?? "",
    startDate: c.start_date?.slice(0, 10) ?? "",
    endDate: c.end_date?.slice(0, 10) ?? "",
    feeLabel: fee,
    feeAmountOnly,
    depositLabel:
      c.deposit_amount != null && c.deposit_amount > 0
        ? formatCurrencyAmount(c.deposit_amount, c.currency)
        : null,
    depositCoversFirstPeriod:
      isRetainer &&
      c.fee_amount > 0 &&
      c.deposit_amount != null &&
      c.deposit_amount >= c.fee_amount,
    paymentTermsDays: c.payment_terms_days,
    lateFee: c.late_fee_percent != null ? String(c.late_fee_percent) : "",
    governingLaw: c.governing_law?.trim() || "Jamaica",
    terminationDays: c.termination_notice_days,
    liabilityText:
      c.liability_cap?.trim() ||
      "the total fees paid by the Client to the Provider in the three (3) months preceding the event giving rise to the claim",
    confidentiality: c.confidentiality,
    ipAssignment: c.ip_assignment,
    validUntil: c.valid_until?.slice(0, 10) ?? "",
  };
}

export function ContractDocument({
  data,
  signatures,
}: {
  data: ContractDocData;
  signatures: React.ReactNode;
}) {
  const d = data;
  // With a deposit, an unset start date reads as "starts when the deposit lands".
  const commencementText = d.startDate
    ? d.startDate
    : d.depositLabel
      ? "the date the initial deposit is received"
      : "[start date]";

  // Sequential clause numbering that stays correct as optional clauses toggle.
  let n = 0;
  const num = () => ++n;

  return (
    <div className="invoice-document rounded-xl border border-border/60 bg-card/40 p-6 leading-relaxed md:p-10 print:border-0 print:bg-white print:text-black">
      <div className="border-b-2 border-foreground/80 pb-4 print:border-neutral-900">
        <div className="mb-3 flex items-center gap-2.5">
          <Logo className="h-8 w-8 text-foreground print:text-neutral-900" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">
            {d.provider}
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground print:text-neutral-500">
          {d.isRetainer ? "Retainer Agreement" : "Service Agreement"}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          {d.title || "Service Agreement"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground print:text-neutral-600">
          Effective {commencementText} · {d.provider} &amp; {d.clientName}
        </p>
        {d.validUntil ? (
          <p className="mt-2 inline-flex rounded-md border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 print:border-amber-600 dark:text-amber-300">
            Offer valid for signature until {d.validUntil}
          </p>
        ) : null}
      </div>

      <div className="mt-6 space-y-5 text-sm">
        <p>
          This {d.isRetainer ? "Retainer" : "Service"} Agreement (the
          &ldquo;Agreement&rdquo;) is entered into as of{" "}
          <strong>{commencementText}</strong> between{" "}
          <strong>{d.provider}</strong> (the &ldquo;Provider&rdquo;) and{" "}
          <strong>{d.clientName}</strong> (the &ldquo;Client&rdquo;).
        </p>

        <Clause n={num()} title="Engagement & Scope">
          The Client engages the Provider to provide the following services:{" "}
          <strong>{d.services.length ? d.services.join(", ") : "[services]"}</strong>.
          {d.scope.trim() ? ` ${d.scope.trim()}` : ""} Work outside this scope is
          quoted and billed separately, and begins only after the Client approves
          the quote in writing.
        </Clause>

        <Clause n={num()} title="Term & Commencement">
          {d.isRetainer
            ? `This Agreement begins on ${commencementText} and continues on a ${recurrenceLabel(d.cadence).toLowerCase()} basis, renewing automatically each period until terminated under the Termination clause below. ${d.endDate ? `Unless renewed, it ends on ${d.endDate}.` : ""}`
            : `This Agreement begins on ${commencementText} and continues until the Services are completed${d.endDate ? ` or until ${d.endDate}` : ""}, unless terminated earlier under the Termination clause below.`}
          {d.depositLabel
            ? " The Provider is not obligated to commence or schedule any work before the initial deposit described below has been received in full."
            : ""}
        </Clause>

        <Clause n={num()} title="Fees & Payment">
          The Client shall pay <strong>{d.feeLabel}</strong>.
          {d.depositLabel ? (
            d.isRetainer && d.depositCoversFirstPeriod ? (
              <>
                {" "}An initial deposit of <strong>{d.depositLabel}</strong> is
                due upon signing and <strong>must be received before the
                Provider commences services</strong>; the deposit is applied as
                payment for the first {cadencePeriodNoun(d.cadence)} of service.
                The next payment of <strong>{d.feeAmountOnly}</strong> falls due{" "}
                <strong>{cadenceSpanPhrase(d.cadence)}</strong> after the
                deposit is received, and payments continue every{" "}
                {cadencePeriodNoun(d.cadence)} thereafter for as long as this
                Agreement runs.
              </>
            ) : d.isRetainer ? (
              <>
                {" "}An initial deposit of <strong>{d.depositLabel}</strong> is
                due upon signing and <strong>must be received before the
                Provider commences services</strong>; it is credited against the
                first {cadencePeriodNoun(d.cadence)}&rsquo;s fee, with the
                remaining balance due within{" "}
                <strong>{d.paymentTermsDays} days</strong> of commencement.
                Subsequent payments of <strong>{d.feeAmountOnly}</strong> fall
                due every {cadencePeriodNoun(d.cadence)} thereafter.
              </>
            ) : (
              <>
                {" "}An initial deposit of <strong>{d.depositLabel}</strong> is
                due upon signing and <strong>must be received before the
                Provider commences services</strong>; the remaining balance of
                the project fee is due within{" "}
                <strong>{d.paymentTermsDays} days</strong> of commencement.
              </>
            )
          ) : null}{" "}
          Invoices are due within <strong>{d.paymentTermsDays} days</strong> of issue.
          {Number.parseFloat(d.lateFee) > 0
            ? ` Overdue amounts accrue a late charge of ${d.lateFee}% per month.`
            : ""}{" "}
          The Provider may suspend work on any account that is past due until the
          balance is paid.
        </Clause>

        <Clause n={num()} title="Expenses">
          The fee stated above is all-inclusive: it covers all of the
          Provider&rsquo;s own costs of performing the Services. The Provider
          will not charge the Client any amount beyond the stated fee unless the
          Client has approved that exact additional amount in writing before the
          cost is incurred.
          {d.services.some((s) => /marketing|social/i.test(s))
            ? " Paid advertising budgets (ad spend) are the one exception and are never part of the Provider's fee: the Client sets the advertising budget, approves it in writing, and pays the advertising platform directly. The Provider does not handle the Client's ad money and adds no mark-up to ad spend."
            : ""}
        </Clause>

        <Clause n={num()} title="Intellectual Property">
          {d.ipAssignment
            ? "Once a deliverable has been paid for in full, the Provider assigns to the Client all right, title, and interest in that final deliverable. The Provider keeps ownership only of its pre-existing materials, tools, methods, and know-how, and may show the finished work in its portfolio."
            : "The Provider retains all ownership of work product. The Client receives a non-exclusive license to use the deliverables upon full payment."}
        </Clause>

        {d.confidentiality ? (
          <Clause n={num()} title="Confidentiality">
            Each party will keep the other&rsquo;s non-public information
            confidential and use it only to perform this Agreement, for a period
            of three (3) years after disclosure.
          </Clause>
        ) : null}

        <Clause n={num()} title="Data Protection &amp; Security">
          Where the Provider processes personal data on the Client&rsquo;s
          behalf — for example, data collected through a website or application
          the Provider builds or hosts — the Client is the data controller and
          the Provider acts as a data processor, processing that data only to
          perform this Agreement and on the Client&rsquo;s reasonable
          instructions. The Provider will maintain commercially reasonable
          technical and organisational safeguards appropriate to the data, may
          engage reputable sub-processors (such as hosting, database, email and
          authentication providers) to deliver the Services, and will notify the
          Client without undue delay after becoming aware of a personal-data
          breach affecting the Client&rsquo;s data. On termination, the Provider
          will return or delete the Client&rsquo;s personal data on request,
          except where retention is required by law. The Client remains
          responsible for the lawfulness of the data it collects and for
          providing its own privacy notice to end users.
        </Clause>

        <Clause n={num()} title="Warranties & Disclaimer">
          The Provider will perform the Services in a professional and
          workmanlike manner. EXCEPT AS EXPRESSLY STATED, THE SERVICES AND
          DELIVERABLES ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY
          KIND, EXPRESS OR IMPLIED.
        </Clause>

        <Clause n={num()} title="Limitation of Liability">
          To the maximum extent permitted by law, the Provider&rsquo;s total
          aggregate liability under this Agreement will not exceed {d.liabilityText}.
          Neither party is liable for indirect, incidental, or consequential
          damages.
        </Clause>

        <Clause n={num()} title="Independent Contractor">
          The Provider is an independent contractor. Nothing in this Agreement
          creates an employment, partnership, or joint-venture relationship.
        </Clause>

        <Clause n={num()} title="Termination">
          Either party may terminate for material breach that remains uncured ten
          (10) days after written notice, or for convenience on{" "}
          <strong>{d.terminationDays} days&rsquo;</strong> written notice. On
          termination, the Client pays for all Services performed and expenses
          incurred through the termination date.
          {d.depositLabel
            ? " The initial deposit compensates onboarding, strategy, and reserved capacity and is non-refundable once work has commenced."
            : ""}
        </Clause>

        <Clause n={num()} title="Governing Law & Disputes">
          This Agreement is governed by the laws of{" "}
          <strong>{d.governingLaw}</strong>. Before pursuing any other remedy,
          the parties will spend up to thirty (30) days attempting to resolve
          any dispute by direct good-faith negotiation.
        </Clause>

        {d.validUntil ? (
          <Clause n={num()} title="Acceptance & Offer Validity">
            This Agreement, including its pricing, is open for acceptance until{" "}
            <strong>{d.validUntil}</strong>. If not signed by the Client on or
            before that date, the pricing and availability described here lapse
            and may be re-quoted by the Provider. Electronic signatures are valid
            and binding for all purposes.
          </Clause>
        ) : (
          <Clause n={num()} title="Acceptance & Electronic Signatures">
            Electronic signatures applied to this Agreement are valid and binding
            for all purposes.
          </Clause>
        )}

        <Clause n={num()} title="Entire Agreement">
          This Agreement is the entire understanding between the parties and
          supersedes prior discussions. Any amendment must be in writing and
          signed by both parties.
        </Clause>
      </div>

      {signatures}
    </div>
  );
}

/**
 * Read-only signature slot for one party: the signed ink-on-paper card, or a
 * classic ruled line when unsigned. Shared by the public signing page and the
 * print view (the operator editor renders its interactive variant instead).
 */
export function PartySignatureBlock({
  signature,
  signerName,
  signedAt,
  label,
}: {
  signature: string | null;
  signerName: string | null;
  signedAt: string | null;
  label: string;
}) {
  const value = parseSignature(signature);
  const date = (() => {
    if (!signedAt) return "";
    const d = new Date(signedAt);
    return Number.isFinite(d.getTime())
      ? d.toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" })
      : "";
  })();
  return (
    <div>
      {value ? (
        <div className="rounded-lg border border-neutral-300 bg-white px-4 pb-2 pt-3 print:rounded-none print:border-0 print:px-0">
          <SignatureView value={value} />
          <div className="mt-1 flex items-baseline justify-between gap-2 border-t border-neutral-400 pt-1.5">
            <span className="text-xs font-medium text-neutral-800">
              {signerName || "Signed"}
            </span>
            {date ? (
              <span className="text-[11px] text-neutral-500">{date}</span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="h-10 border-b border-foreground/40 print:border-neutral-500" />
      )}
      <p className="mt-1 text-xs text-muted-foreground print:text-neutral-600">
        {label}
      </p>
    </div>
  );
}

function Clause({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-semibold">
        {n}. {title}
      </p>
      <p className="mt-1 text-muted-foreground print:text-neutral-700">{children}</p>
    </div>
  );
}
