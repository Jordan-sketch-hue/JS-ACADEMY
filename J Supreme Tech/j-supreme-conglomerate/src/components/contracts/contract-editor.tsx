"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, ShieldCheck, Info } from "lucide-react";
import { DEFAULT_ISSUING_COMPANY, SERVICE_OPTIONS } from "@/lib/data/invoices";
import {
  cadenceFeePhrase,
  RECURRENCE_OPTIONS,
  type Recurrence,
} from "@/lib/invoices/recurrence";
import { formatCurrencyAmount } from "@/lib/utils";
import {
  createContractAction,
  updateContractAction,
} from "@/app/(app)/contracts/actions";
import type {
  ContractListItem,
  ContractStatus,
  ContractType,
} from "@/lib/data/contracts";
import type { CrmClientRecord } from "@/lib/data/crm-records";
import { ContractDocument } from "@/components/contracts/contract-document";
import { ContractSignSection } from "@/components/contracts/contract-sign-section";

const NO_CLIENT = "__none__";

const TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: "service", label: "Service agreement (project)" },
  { value: "retainer", label: "Retainer (recurring)" },
];

const STATUS_OPTIONS: ContractStatus[] = [
  "draft",
  "sent",
  "signed",
  "active",
  "terminated",
  "expired",
];

const CURRENCY_OPTIONS = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "JMD", label: "JMD — Jamaican Dollar" },
];

type Props =
  | {
      mode: "create";
      clients: CrmClientRecord[];
      defaultClientId?: string | null;
      /** Seed values pulled from an invoice ("draft contract from invoice"). */
      prefill?: Partial<ContractListItem>;
    }
  | {
      mode: "edit";
      clients: CrmClientRecord[];
      contract: ContractListItem;
    };

export function ContractEditor(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const seed: Partial<ContractListItem> | null =
    props.mode === "edit" ? props.contract : props.prefill ?? null;
  const contractId = props.mode === "edit" ? props.contract.id : null;

  const [clientId, setClientId] = useState(
    seed?.client_id ??
      (props.mode === "create" ? props.defaultClientId?.trim() || "" : ""),
  );
  const [title, setTitle] = useState(seed?.title ?? "");
  const [contractType, setContractType] = useState<ContractType>(
    seed?.contract_type ?? "service",
  );
  const [status, setStatus] = useState<ContractStatus>(seed?.status ?? "draft");
  const [companyName, setCompanyName] = useState(
    seed?.company_name ?? DEFAULT_ISSUING_COMPANY,
  );
  const [services, setServices] = useState<string[]>(seed?.services ?? []);
  const [scope, setScope] = useState(seed?.scope ?? "");
  // Default to today only on NEW contracts — an existing contract with no
  // start date means "commences on deposit receipt" and must stay unset.
  const [startDate, setStartDate] = useState(
    seed?.start_date?.slice(0, 10) ??
      (props.mode === "create" ? new Date().toISOString().slice(0, 10) : ""),
  );
  const [endDate, setEndDate] = useState(seed?.end_date?.slice(0, 10) ?? "");
  const [cadence, setCadence] = useState<Recurrence>(
    seed?.billing_cadence ?? "monthly",
  );
  const [fee, setFee] = useState(
    seed?.fee_amount != null && seed.fee_amount > 0 ? String(seed.fee_amount) : "",
  );
  const [currency, setCurrency] = useState(() => {
    const c = (seed?.currency ?? "USD").toUpperCase();
    return CURRENCY_OPTIONS.some((o) => o.code === c) ? c : "USD";
  });
  const [paymentTerms, setPaymentTerms] = useState(
    String(seed?.payment_terms_days ?? 14),
  );
  const [lateFee, setLateFee] = useState(
    seed?.late_fee_percent != null ? String(seed.late_fee_percent) : "1.5",
  );
  const [governingLaw, setGoverningLaw] = useState(seed?.governing_law ?? "Jamaica");
  const [terminationDays, setTerminationDays] = useState(
    String(seed?.termination_notice_days ?? 30),
  );
  const [liabilityCap, setLiabilityCap] = useState(seed?.liability_cap ?? "");
  const [confidentiality, setConfidentiality] = useState(
    seed?.confidentiality !== false,
  );
  const [ipAssignment, setIpAssignment] = useState(seed?.ip_assignment !== false);
  const [notes, setNotes] = useState(seed?.notes ?? "");
  const [deposit, setDeposit] = useState(
    seed?.deposit_amount != null && seed.deposit_amount > 0
      ? String(seed.deposit_amount)
      : "",
  );
  const [validUntil, setValidUntil] = useState(
    seed?.valid_until?.slice(0, 10) ?? "",
  );

  const clientName =
    props.clients.find((c) => c.id === clientId)?.business_name ??
    (props.mode === "edit" && props.contract.client_signer_name
      ? props.contract.client_signer_name
      : "[Client]");
  const provider = companyName.trim() || DEFAULT_ISSUING_COMPANY;
  const feeNumber = Number.parseFloat(fee.replace(",", ".")) || 0;
  const depositNumber = Number.parseFloat(deposit.replace(",", ".")) || 0;
  const isRetainer = contractType === "retainer";

  const feeAmountOnly =
    feeNumber > 0 ? formatCurrencyAmount(feeNumber, currency) : "[fee]";

  const feeLabel = useMemo(() => {
    if (feeNumber <= 0) return "[fee]";
    const amount = formatCurrencyAmount(feeNumber, currency);
    return isRetainer ? `${amount} ${cadenceFeePhrase(cadence)}` : amount;
  }, [feeNumber, currency, isRetainer, cadence]);

  const depositLabel = useMemo(
    () => (depositNumber > 0 ? formatCurrencyAmount(depositNumber, currency) : null),
    [depositNumber, currency],
  );

  const liabilityText =
    liabilityCap.trim() ||
    "the total fees paid by the Client to the Provider in the three (3) months preceding the event giving rise to the claim";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Give the agreement a title.");
      return;
    }
    const payload = {
      client_id: clientId.trim() || null,
      title: title.trim(),
      contract_type: contractType,
      status,
      company_name: companyName.trim() || null,
      services,
      scope: scope.trim() || null,
      start_date: startDate.trim() || null,
      end_date: endDate.trim() || null,
      billing_cadence: isRetainer ? cadence : ("none" as Recurrence),
      fee_amount: feeNumber,
      currency,
      payment_terms_days: Number.parseInt(paymentTerms, 10) || 14,
      late_fee_percent: lateFee.trim() ? Number.parseFloat(lateFee) : null,
      governing_law: governingLaw.trim() || null,
      termination_notice_days: Number.parseInt(terminationDays, 10) || 30,
      liability_cap: liabilityCap.trim() || null,
      confidentiality,
      ip_assignment: ipAssignment,
      notes: notes.trim() || null,
      deposit_amount: depositNumber > 0 ? depositNumber : null,
      valid_until: validUntil.trim() || null,
    };
    startTransition(async () => {
      if (props.mode === "create") {
        const res = await createContractAction(payload);
        if (!res.ok) return setError(res.error);
        router.push(`/contracts/${res.id}`);
        router.refresh();
        return;
      }
      const res = await updateContractAction(contractId!, payload);
      if (!res.ok) return setError(res.error);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-[1100px] space-y-6">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {props.mode === "create" ? "New contract" : title || "Edit contract"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill the terms — the agreement preview below updates live and prints clean.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/contracts">All contracts</Link>
          </Button>
          {props.mode === "edit" ? (
            <Button type="button" variant="outline" size="sm" className="gap-1" asChild>
              <Link href={`/contracts/${props.contract.id}/print`}>
                <Printer className="h-4 w-4" />
                Print
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="no-print flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Template, not legal advice.</strong> These clauses are a
          protective starting point. Have a qualified attorney review any
          agreement before you or a client signs it.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="no-print rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <div className="no-print space-y-5 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ct-title">Agreement title</Label>
              <Input
                id="ct-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Social media management — retainer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-client">Client</Label>
              <Select
                value={clientId || NO_CLIENT}
                onValueChange={(v) => setClientId(v === NO_CLIENT ? "" : v)}
              >
                <SelectTrigger id="ct-client">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CLIENT}>— Unassigned (attach later) —</SelectItem>
                  {props.clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-type">Type</Label>
              <Select value={contractType} onValueChange={(v) => setContractType(v as ContractType)}>
                <SelectTrigger id="ct-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ContractStatus)}>
                <SelectTrigger id="ct-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-company">Provider (your company)</Label>
              <Input
                id="ct-company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={DEFAULT_ISSUING_COMPANY}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-start">Start date</Label>
              <Input id="ct-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-end">End date {isRetainer ? "(optional)" : ""}</Label>
              <Input id="ct-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Services covered</Label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_OPTIONS.map((service) => {
                const checked = services.includes(service);
                return (
                  <label
                    key={service}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                      checked
                        ? "border-primary/60 bg-primary/10"
                        : "border-border/60 bg-card/30 hover:bg-card/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                      checked={checked}
                      onChange={(e) =>
                        setServices((prev) =>
                          e.target.checked
                            ? [...prev, service]
                            : prev.filter((s) => s !== service),
                        )
                      }
                    />
                    <span>{service}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ct-scope">Scope of work</Label>
            <Textarea
              id="ct-scope"
              rows={3}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Describe deliverables, cadence, and what's explicitly out of scope…"
            />
          </div>

          {/* Fees */}
          <div className="grid gap-4 rounded-lg border border-border/60 bg-card/30 p-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ct-fee">Fee ({currency})</Label>
              <Input
                id="ct-fee"
                inputMode="decimal"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="30000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="ct-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((o) => (
                    <SelectItem key={o.code} value={o.code}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isRetainer ? (
              <div className="space-y-2">
                <Label htmlFor="ct-cadence">Billing cadence</Label>
                <Select value={cadence} onValueChange={(v) => setCadence(v as Recurrence)}>
                  <SelectTrigger id="ct-cadence">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCE_OPTIONS.filter((o) => o.value !== "none").map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="ct-terms">Payment due (days)</Label>
              <Input id="ct-terms" type="number" min={0} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-late">Late fee (% / month)</Label>
              <Input id="ct-late" inputMode="decimal" value={lateFee} onChange={(e) => setLateFee(e.target.value)} placeholder="1.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-deposit">Initial deposit ({currency}, optional)</Label>
              <Input
                id="ct-deposit"
                inputMode="decimal"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="15000"
              />
              <p className="text-xs text-muted-foreground">
                Due before service commences.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-valid">Offer valid until (optional)</Label>
              <Input
                id="ct-valid"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Pricing expires if unsigned by this date.
              </p>
            </div>
          </div>

          {/* Protective terms */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ct-law">Governing law</Label>
              <Input id="ct-law" value={governingLaw} onChange={(e) => setGoverningLaw(e.target.value)} placeholder="Jamaica" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-termination">Termination notice (days)</Label>
              <Input id="ct-termination" type="number" min={0} value={terminationDays} onChange={(e) => setTerminationDays(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ct-liability">Liability cap (optional)</Label>
              <Input
                id="ct-liability"
                value={liabilityCap}
                onChange={(e) => setLiabilityCap(e.target.value)}
                placeholder="Defaults to fees paid in the prior 3 months"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-card/30 px-3 py-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={ipAssignment} onChange={(e) => setIpAssignment(e.target.checked)} />
              <span>Assign IP of final deliverables to client on full payment</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-card/30 px-3 py-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={confidentiality} onChange={(e) => setConfidentiality(e.target.checked)} />
              <span>Include mutual confidentiality clause</span>
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ct-notes">Internal notes (not printed)</Label>
            <Textarea id="ct-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="no-print space-y-4 rounded-xl border border-border/60 bg-card/30 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Agreement summary
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Type" value={isRetainer ? "Retainer" : "Service"} />
            <Row label="Client" value={clientName} />
            <Row label="Fee" value={feeLabel} />
            {depositLabel ? <Row label="Deposit" value={`${depositLabel} to start`} /> : null}
            {validUntil ? <Row label="Offer valid" value={`until ${validUntil}`} /> : null}
            <Row label="Payment" value={`Net ${paymentTerms || 0} days`} />
            <Row label="Termination" value={`${terminationDays || 0} days' notice`} />
            <Row label="Status" value={status} capitalize />
          </dl>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : props.mode === "create" ? "Create contract" : "Save changes"}
          </Button>
          {props.mode === "edit" ? (
            <Button type="button" variant="outline" className="w-full gap-1" asChild>
              <Link href={`/contracts/${props.contract.id}/print`}>
                <Printer className="h-4 w-4" />
                Print / export PDF
              </Link>
            </Button>
          ) : null}
        </aside>
      </div>

      {/* Live + printable agreement (same component as the public signing page) */}
      <ContractDocument
        data={{
          provider,
          clientName,
          title,
          isRetainer,
          cadence,
          services,
          scope,
          startDate,
          endDate,
          feeLabel,
          feeAmountOnly,
          depositLabel,
          depositCoversFirstPeriod:
            isRetainer && feeNumber > 0 && depositNumber >= feeNumber,
          paymentTermsDays: Number.parseInt(paymentTerms, 10) || 0,
          lateFee,
          governingLaw: governingLaw.trim() || "Jamaica",
          terminationDays: Number.parseInt(terminationDays, 10) || 0,
          liabilityText,
          confidentiality,
          ipAssignment,
          validUntil,
        }}
        signatures={
          props.mode === "edit" ? (
            <ContractSignSection
              contract={props.contract}
              providerLabel={`${provider} (Provider)`}
              clientLabel={`${clientName} (Client)`}
              defaultEmail={
                props.clients.find((c) => c.id === clientId)?.email ?? ""
              }
            />
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {[`${provider} (Provider)`, `${clientName} (Client)`].map((party) => (
                <div key={party}>
                  <div className="h-10 border-b border-foreground/40 print:border-neutral-500" />
                  <p className="mt-1 text-xs text-muted-foreground print:text-neutral-600">
                    {party}
                  </p>
                  <div className="mt-6 h-8 border-b border-foreground/40 print:border-neutral-500" />
                  <p className="mt-1 text-xs text-muted-foreground print:text-neutral-600">
                    Date
                  </p>
                </div>
              ))}
            </div>
          )
        }
      />
    </form>
  );
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right font-medium ${capitalize ? "capitalize" : ""}`}>{value}</dd>
    </div>
  );
}
