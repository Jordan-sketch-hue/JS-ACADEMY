"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  computeInvoiceTotals,
  DEFAULT_ISSUING_COMPANY,
  DEFAULT_ISSUING_EMAIL,
  DEFAULT_ISSUING_PHONE,
  SERVICE_OPTIONS,
  type DepositInvoiceRef,
  type InvoiceLineDraft,
  type InvoiceStatus,
  type InvoiceWithLines,
} from "@/lib/data/invoices";
import { RECURRENCE_OPTIONS, type Recurrence } from "@/lib/invoices/recurrence";
import { INCOME_GROUPS } from "@/lib/earnings/income";
import { Logo } from "@/components/brand/logo";
import {
  createInvoiceAction,
  generateFinalInvoiceAction,
  updateInvoiceAction,
} from "@/app/(app)/invoices/actions";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrencyAmount } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  Repeat,
  FileCheck2,
  FileSignature,
  UserPlus,
} from "lucide-react";
import { createCrmDealAction } from "@/app/(app)/crm/actions";
import type { CrmClientRecord } from "@/lib/data/crm-records";

const STATUS_OPTIONS: InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "void",
];

const CURRENCY_OPTIONS: { code: string; label: string }[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "JMD", label: "JMD — Jamaican Dollar" },
];

type Props =
  | {
      mode: "create";
      clients: CrmClientRecord[];
      defaultClientId?: string | null;
    }
  | {
      mode: "edit";
      clients: CrmClientRecord[];
      bundle: InvoiceWithLines;
    };

function emptyLine(): InvoiceLineDraft {
  return { description: "", quantity: 1, unit_rate: 0 };
}

export function InvoiceEditor(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [finalPending, startFinalTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const invoiceId = props.mode === "edit" ? props.bundle.invoice.id : null;
  const inv = props.mode === "edit" ? props.bundle.invoice : null;
  const depositInvoice: DepositInvoiceRef | null =
    props.mode === "edit" ? (props.bundle.deposit_invoice ?? null) : null;

  const [clientId, setClientId] = useState(
    props.mode === "create"
      ? props.defaultClientId?.trim() || ""
      : inv?.client_id ?? "",
  );
  const [currency, setCurrency] = useState(() => {
    const existing = (inv?.currency ?? "USD").toUpperCase();
    return CURRENCY_OPTIONS.some((o) => o.code === existing) ? existing : "USD";
  });
  const [status, setStatus] = useState<InvoiceStatus>(inv?.status ?? "draft");
  const [issuedAt, setIssuedAt] = useState(
    inv?.issued_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState(inv?.due_date?.slice(0, 10) ?? "");
  const [paidAt, setPaidAt] = useState(() => {
    if (!inv?.paid_at) return "";
    try {
      const d = new Date(inv.paid_at);
      if (Number.isNaN(d.getTime())) return "";
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  });
  const [notes, setNotes] = useState(inv?.notes ?? "");
  const [taxRatePercent, setTaxRatePercent] = useState(
    inv?.tax_rate_percent != null ? String(inv.tax_rate_percent) : "",
  );
  const [discountAmount, setDiscountAmount] = useState(
    inv != null && inv.discount_amount > 0 ? String(inv.discount_amount) : "",
  );
  const [companyName, setCompanyName] = useState(
    inv?.company_name ?? DEFAULT_ISSUING_COMPANY,
  );
  const [servicesRendered, setServicesRendered] = useState<string[]>(
    inv?.services_rendered ?? [],
  );
  const [isDeposit, setIsDeposit] = useState(inv?.is_deposit === true);
  const [totalProjectAmount, setTotalProjectAmount] = useState(
    inv?.total_project_amount != null && inv.total_project_amount > 0
      ? String(inv.total_project_amount)
      : "",
  );
  const [recurrence, setRecurrence] = useState<Recurrence>(
    inv?.recurrence ?? "none",
  );
  const [nextIssueDate, setNextIssueDate] = useState(
    inv?.next_issue_date?.slice(0, 10) ?? "",
  );
  const [incomeCategory, setIncomeCategory] = useState<string>(
    inv?.income_category ?? "",
  );
  const [lines, setLines] = useState<InvoiceLineDraft[]>(() => {
    if (props.mode === "edit" && props.bundle.lines.length) {
      return props.bundle.lines.map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unit_rate: l.unit_rate,
      }));
    }
    return [emptyLine()];
  });

  const [clients, setClients] = useState<CrmClientRecord[]>(props.clients);

  const handleClientCreated = (client: CrmClientRecord) => {
    setClients((prev) =>
      prev.some((c) => c.id === client.id) ? prev : [...prev, client],
    );
    setClientId(client.id);
  };

  const totals = useMemo(() => {
    const tax =
      taxRatePercent.trim() === ""
        ? null
        : Number.parseFloat(taxRatePercent.replace(",", "."));
    const discount =
      discountAmount.trim() === ""
        ? null
        : Number.parseFloat(discountAmount.replace(",", "."));
    return computeInvoiceTotals(
      lines,
      tax != null && !Number.isNaN(tax) ? tax : null,
      discount != null && !Number.isNaN(discount) ? discount : null,
    );
  }, [lines, taxRatePercent, discountAmount]);

  const totalProjectNumber = useMemo(() => {
    if (!isDeposit) return null;
    const parsed = Number.parseFloat(totalProjectAmount.replace(",", "."));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [isDeposit, totalProjectAmount]);

  const remainingBalance =
    isDeposit && totalProjectNumber != null
      ? Math.max(0, Math.round((totalProjectNumber - totals.amount) * 100) / 100)
      : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!clientId.trim()) {
      setError("Select a client.");
      return;
    }
    if (isDeposit && totalProjectNumber == null) {
      setError("Enter the full project amount when this invoice is a deposit.");
      return;
    }
    if (isDeposit && totalProjectNumber != null && totalProjectNumber < totals.amount) {
      setError("Total project amount must be at least the deposit being requested.");
      return;
    }
    const tax =
      taxRatePercent.trim() === ""
        ? null
        : Number.parseFloat(taxRatePercent.replace(",", "."));
    const discount =
      discountAmount.trim() === ""
        ? null
        : Number.parseFloat(discountAmount.replace(",", "."));
    let paidIso: string | null = null;
    if (paidAt.trim()) {
      paidIso = new Date(paidAt).toISOString();
    } else if (status === "paid") {
      paidIso = new Date().toISOString();
    }
    const sharedPayload = {
      client_id: clientId,
      currency,
      status,
      issued_at: issuedAt.trim() || null,
      due_date: dueDate.trim() || null,
      paid_at: paidIso,
      notes: notes.trim() || null,
      tax_rate_percent:
        tax != null && !Number.isNaN(tax) && tax > 0 ? tax : null,
      discount_amount:
        discount != null && !Number.isNaN(discount) ? discount : null,
      company_name: companyName.trim() || null,
      services_rendered: servicesRendered,
      is_deposit: isDeposit,
      total_project_amount: isDeposit ? totalProjectNumber : null,
      recurrence,
      next_issue_date:
        recurrence !== "none" ? nextIssueDate.trim() || null : null,
      income_category: incomeCategory || null,
      lines,
    };

    startTransition(async () => {
      if (props.mode === "create") {
        const res = await createInvoiceAction(sharedPayload);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        router.push(`/invoices/${res.id}`);
        router.refresh();
        return;
      }
      const res = await updateInvoiceAction(invoiceId!, sharedPayload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  };

  const numberLabel = props.mode === "edit" ? inv?.number : "New";
  const clientLabel =
    clients.find((c) => c.id === clientId)?.business_name ?? "—";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-[1100px] space-y-6">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {props.mode === "create" ? "New invoice" : `Invoice ${numberLabel}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            Line totals, optional tax and discount, then save. Use Print for a clean hard copy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="no-print" asChild>
            <Link href="/invoices">All invoices</Link>
          </Button>
          {props.mode === "edit" ? (
            <Button type="button" variant="outline" size="sm" className="no-print gap-1" asChild>
              <Link href={`/contracts/new?fromInvoice=${invoiceId}`}>
                <FileSignature className="h-4 w-4" />
                Draft contract
              </Link>
            </Button>
          ) : null}
          {props.mode === "edit" && isDeposit ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="no-print gap-1 border-emerald-500/40 text-emerald-400 hover:text-emerald-400"
              disabled={finalPending}
              onClick={() => {
                if (!window.confirm(`Generate a final balance invoice from ${numberLabel}?`)) return;
                startFinalTransition(async () => {
                  const res = await generateFinalInvoiceAction(invoiceId!);
                  if (!res.ok) {
                    setError(res.error);
                    return;
                  }
                  router.push(`/invoices/${res.id}`);
                  router.refresh();
                });
              }}
            >
              <FileCheck2 className="h-4 w-4" />
              {finalPending ? "Generating…" : "Final invoice"}
            </Button>
          ) : null}
          {props.mode === "edit" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="no-print gap-1"
              onClick={() =>
                window.open(
                  `/invoices/${invoiceId}/print`,
                  "_blank",
                  "width=780,height=960,scrollbars=yes",
                )
              }
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="invoice-document space-y-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 print:border-0 print:bg-white print:text-black">
          <div className="hidden print:block">
            <div className="flex items-start justify-between gap-6 border-b-2 border-neutral-900 pb-5">
              <div className="flex items-center gap-4">
                <Logo className="h-14 w-14 text-neutral-900" />
                <div>
                  <p className="text-base font-bold uppercase tracking-[0.22em] text-neutral-900">
                    {companyName.trim() || DEFAULT_ISSUING_COMPANY}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Digital infrastructure studio
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  {isDeposit ? "Deposit Invoice" : depositInvoice ? "Final Invoice" : "Invoice"}
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
                  {numberLabel}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Bill to
                </p>
                <p className="mt-2 text-base font-semibold text-neutral-900">
                  {clientLabel}
                </p>
              </div>
              <div className="justify-self-end">
                <dl className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-sm">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Issued
                  </dt>
                  <dd className="text-right tabular-nums text-neutral-900">
                    {issuedAt || "—"}
                  </dd>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Due
                  </dt>
                  <dd className="text-right tabular-nums text-neutral-900">
                    {dueDate || "—"}
                  </dd>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Status
                  </dt>
                  <dd className="text-right capitalize text-neutral-900">
                    {status}
                  </dd>
                </dl>
              </div>
            </div>

            {servicesRendered.length > 0 ? (
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Services rendered
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {servicesRendered.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium text-neutral-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="no-print grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="inv-client">Client</Label>
                <NewClientDialog onCreated={handleClientCreated} />
              </div>
              <Select
                value={clientId.length ? clientId : undefined}
                onValueChange={setClientId}
              >
                <SelectTrigger id="inv-client">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clients.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No clients yet — use <strong>New client</strong> to add one.
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as InvoiceStatus)}
              >
                <SelectTrigger id="inv-status">
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
              <Label htmlFor="inv-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="inv-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.code} value={opt.code}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-issued">Issued</Label>
              <Input
                id="inv-issued"
                type="date"
                value={issuedAt}
                onChange={(e) => setIssuedAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-due">Due</Label>
              <Input
                id="inv-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-paid">Paid at (optional)</Label>
              <Input
                id="inv-paid"
                type="datetime-local"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="inv-company">Issuing company</Label>
              <Input
                id="inv-company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={DEFAULT_ISSUING_COMPANY}
                maxLength={120}
              />
              <p className="text-xs text-muted-foreground">
                Shown at the top of the printed invoice. Defaults to {DEFAULT_ISSUING_COMPANY}.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-income">Income type</Label>
              <Select
                value={incomeCategory || "auto"}
                onValueChange={(v) => setIncomeCategory(v === "auto" ? "" : v)}
              >
                <SelectTrigger id="inv-income">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (from services)</SelectItem>
                  {INCOME_GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Sets the bucket on the dashboard &amp; earnings. Pick{" "}
                <strong>Fixed income</strong> for retainers/recurring revenue;
                Auto derives it from the services.
              </p>
            </div>
          </div>

          <div className="no-print space-y-2">
            <Label>Services rendered</Label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_OPTIONS.map((service) => {
                const checked = servicesRendered.includes(service);
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
                        setServicesRendered((prev) =>
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
            {servicesRendered.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {servicesRendered.length} selected · {servicesRendered.join(", ")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Tick every service this invoice covers — these print on the hard copy.
              </p>
            )}
          </div>

          <div className="no-print space-y-3 rounded-lg border border-border/60 bg-card/30 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={isDeposit}
                onChange={(e) => setIsDeposit(e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium">
                  This invoice is a deposit toward a larger project
                </p>
                <p className="text-xs text-muted-foreground">
                  When ticked, enter the full project price so the remaining balance can be shown.
                </p>
              </div>
            </label>
            {isDeposit ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inv-total-project">
                    Total project amount ({currency})
                  </Label>
                  <Input
                    id="inv-total-project"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={totalProjectAmount}
                    onChange={(e) => setTotalProjectAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Balance remaining after this deposit</Label>
                  <div className="flex h-9 items-center rounded-md border border-border/60 bg-background/60 px-3 text-sm tabular-nums">
                    {remainingBalance != null
                      ? formatCurrencyAmount(remainingBalance, currency)
                      : "—"}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="no-print space-y-3 rounded-lg border border-border/60 bg-card/30 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-md border border-accent/30 bg-accent/10 p-2 text-accent">
                <Repeat className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Billing cadence</p>
                <p className="text-xs text-muted-foreground">
                  Mark retainers or subscriptions as recurring. Recurring invoices
                  get a badge and a one-click <strong>Generate next</strong> on the
                  list — counted as Fixed income in earnings.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inv-recurrence">Repeat</Label>
                <Select
                  value={recurrence}
                  onValueChange={(v) => setRecurrence(v as Recurrence)}
                >
                  <SelectTrigger id="inv-recurrence">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {recurrence !== "none" ? (
                <div className="space-y-2">
                  <Label htmlFor="inv-next-issue">Next issue date</Label>
                  <Input
                    id="inv-next-issue"
                    type="date"
                    value={nextIssueDate}
                    onChange={(e) => setNextIssueDate(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Optional — leave blank to auto-advance from the issued date.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <div className="no-print flex items-center justify-between gap-2">
              <Label>Line items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setLines((prev) => [...prev, emptyLine()])}
              >
                <Plus className="h-4 w-4" />
                Add line
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead className="w-24 text-right">Qty</TableHead>
                    <TableHead className="w-32 text-right">Rate</TableHead>
                    <TableHead className="w-32 text-right">Line</TableHead>
                    <TableHead className="no-print w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((row, idx) => {
                    const lineQty = Number.isFinite(row.quantity) ? row.quantity : 0;
                    const lineRate = Number.isFinite(row.unit_rate) ? row.unit_rate : 0;
                    const lineTotal = lineQty * lineRate;
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          {/* Screen: editable textarea supporting line breaks */}
                          <Textarea
                            className="no-print min-h-[60px] resize-y"
                            value={row.description}
                            placeholder="Description"
                            onChange={(e) =>
                              setLines((prev) =>
                                prev.map((p, i) =>
                                  i === idx ? { ...p, description: e.target.value } : p,
                                )
                              )
                            }
                          />
                          {/* Print: preserve line breaks */}
                          <span className="hidden print:block text-sm leading-snug text-neutral-900 whitespace-pre-wrap">
                            {row.description || "Line item"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Input
                            className="no-print text-right tabular-nums"
                            type="number"
                            min={0}
                            step="any"
                            value={row.quantity}
                            onChange={(e) =>
                              setLines((prev) =>
                                prev.map((p, i) =>
                                  i === idx
                                    ? { ...p, quantity: Number.parseFloat(e.target.value || "0") }
                                    : p,
                                )
                              )
                            }
                          />
                          <span className="hidden print:block text-right tabular-nums text-sm text-neutral-900">
                            {row.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Input
                            className="no-print text-right tabular-nums"
                            type="number"
                            step="any"
                            value={row.unit_rate}
                            onChange={(e) =>
                              setLines((prev) =>
                                prev.map((p, i) =>
                                  i === idx
                                    ? { ...p, unit_rate: Number.parseFloat(e.target.value || "0") }
                                    : p,
                                )
                              )
                            }
                          />
                          {/* Print: formatted currency — handles negative (deposit credit) cleanly */}
                          <span className="hidden print:block text-right tabular-nums text-sm text-neutral-900">
                            {formatCurrencyAmount(lineRate, currency)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground print:text-neutral-900">
                          {formatCurrencyAmount(lineTotal, currency)}
                        </TableCell>
                        <TableCell className="no-print">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            disabled={lines.length <= 1}
                            aria-label="Remove line"
                            onClick={() =>
                              setLines((prev) => prev.filter((_, i) => i !== idx))
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="no-print grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-tax">Tax rate (%)</Label>
              <Input
                id="inv-tax"
                placeholder="e.g. 8.25"
                inputMode="decimal"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-discount">Discount ({currency})</Label>
              <Input
                id="inv-discount"
                placeholder="0"
                inputMode="decimal"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="no-print space-y-2">
            <Label htmlFor="inv-notes">Notes</Label>
            <Textarea
              id="inv-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Terms, remittance, or internal notes…"
            />
          </div>
        </div>

        <aside className="no-print space-y-4 rounded-xl border border-border/60 bg-card/30 p-4 backdrop-blur">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Totals</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums font-medium">
                  {formatCurrencyAmount(totals.subtotal, currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="tabular-nums">
                  –
                  {formatCurrencyAmount(totals.discount_amount, currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="tabular-nums">
                  {formatCurrencyAmount(totals.tax_amount, currency)}
                </dd>
              </div>
              {status === "paid" ? (
                <div className="mt-2 flex items-center justify-between gap-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                      Bill cleared
                    </span>
                  </div>
                  <span className="tabular-nums text-sm font-bold">
                    {formatCurrencyAmount(totals.amount, currency)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between gap-4 border-t border-border/60 pt-2 text-base font-semibold">
                  <dt>{isDeposit ? "Deposit due" : "Total due"}</dt>
                  <dd className="tabular-nums">
                    {formatCurrencyAmount(totals.amount, currency)}
                  </dd>
                </div>
              )}
              {isDeposit ? (
                <>
                  <div className="flex justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground">Full project price</dt>
                    <dd className="tabular-nums">
                      {totalProjectNumber != null
                        ? formatCurrencyAmount(totalProjectNumber, currency)
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 text-sm font-medium">
                    <dt>
                      {status === "paid" && remainingBalance === 0
                        ? "Balance after this deposit"
                        : "Balance remaining"}
                    </dt>
                    <dd className="tabular-nums">
                      {remainingBalance != null
                        ? formatCurrencyAmount(remainingBalance, currency)
                        : "—"}
                    </dd>
                  </div>
                </>
              ) : null}
            </dl>
          </div>
          {/* ── Transaction history ─────────────────────────────── */}
          {depositInvoice ? (
            <div className="rounded-lg border border-border/60 bg-card/30 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Payment history
              </p>
              <div className="mt-3 space-y-2.5 text-sm">
                {/* Row 1 — original deposit */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      ① Deposit received
                    </p>
                    <p className="mt-0.5 truncate font-medium text-primary">
                      {depositInvoice.number}
                    </p>
                    {depositInvoice.issued_at ? (
                      <p className="text-xs text-muted-foreground">
                        {depositInvoice.issued_at.slice(0, 10)}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular-nums font-medium">
                      {formatCurrencyAmount(depositInvoice.amount, depositInvoice.currency)}
                    </p>
                    <span className="mt-0.5 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                      {depositInvoice.status}
                    </span>
                  </div>
                </div>

                {/* Row 2 — this final invoice */}
                <div className="flex items-start justify-between gap-2 border-t border-border/50 pt-2.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      ② Balance due
                    </p>
                    <p className="mt-0.5 truncate font-medium text-primary">
                      {numberLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">this invoice</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular-nums font-semibold">
                      {formatCurrencyAmount(totals.amount, currency)}
                    </p>
                  </div>
                </div>

                {/* Total project value */}
                <div className="flex justify-between border-t border-border/50 pt-2 text-xs">
                  <span className="text-muted-foreground">Total project value</span>
                  <span className="tabular-nums font-semibold">
                    {formatCurrencyAmount(
                      depositInvoice.total_project_amount ??
                        depositInvoice.amount + totals.amount,
                      currency,
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : props.mode === "create" ? "Create invoice" : "Save changes"}
          </Button>
        </aside>
      </div>

      {/* Print-friendly summary block */}
      <div className="invoice-print-summary hidden print:block">
        <div className="mt-8 grid grid-cols-[1fr_320px] gap-8">
          <div className="space-y-4 text-sm text-neutral-800">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Thank you
              </p>
              <p className="mt-2 leading-relaxed">
                We appreciate your partnership with {companyName.trim() || DEFAULT_ISSUING_COMPANY}.
                {" "}
                {isDeposit
                  ? "Settling this deposit secures your slot and starts production."
                  : depositInvoice
                    ? `This is the final balance for your project. Your deposit (${depositInvoice.number}) has already been received and applied above.`
                    : "Settling this invoice keeps your delivery on schedule."}
              </p>
            </div>
            {/* Hide the Notes block in print when the Payment History table is
                present — it's the definitive record and avoids redundancy. */}
            {notes.trim() && !depositInvoice ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap leading-relaxed">{notes}</p>
              </div>
            ) : null}
          </div>

          <div>
            <dl className="space-y-1.5 text-sm text-neutral-800">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Subtotal</dt>
                <dd className="tabular-nums">
                  {formatCurrencyAmount(totals.subtotal, currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Discount</dt>
                <dd className="tabular-nums">
                  −{formatCurrencyAmount(totals.discount_amount, currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Tax</dt>
                <dd className="tabular-nums">
                  {formatCurrencyAmount(totals.tax_amount, currency)}
                </dd>
              </div>
            </dl>

            {status === "paid" ? (
              <div className="invoice-total-bar invoice-total-bar--paid mt-3 flex items-center justify-between rounded-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em]">
                    {isDeposit ? "Deposit paid · Bill cleared" : "Paid in full · Bill cleared"}
                  </dt>
                </div>
                <dd className="text-lg font-bold tabular-nums">
                  {formatCurrencyAmount(totals.amount, currency)}
                </dd>
              </div>
            ) : (
              <div className="invoice-total-bar mt-3 flex items-baseline justify-between rounded-md px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {isDeposit ? "Deposit due now" : "Total due"}
                </dt>
                <dd className="text-lg font-bold tabular-nums">
                  {formatCurrencyAmount(totals.amount, currency)}
                </dd>
              </div>
            )}

            {isDeposit ? (
              <div className="mt-3 rounded-md border border-neutral-300 bg-neutral-50 p-3">
                <div className="flex justify-between text-xs text-neutral-600">
                  <dt>Full project price</dt>
                  <dd className="tabular-nums">
                    {totalProjectNumber != null
                      ? formatCurrencyAmount(totalProjectNumber, currency)
                      : "—"}
                  </dd>
                </div>
                <div className="mt-1.5 flex justify-between text-sm font-semibold text-neutral-900">
                  <dt>Balance remaining</dt>
                  <dd className="tabular-nums">
                    {remainingBalance != null
                      ? formatCurrencyAmount(remainingBalance, currency)
                      : "—"}
                  </dd>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ── Transaction history (print) — shown when this is a final balance invoice ── */}
        {depositInvoice ? (
          <div className="mt-8 overflow-hidden rounded-lg border border-neutral-300">
            <div className="border-b border-neutral-300 bg-neutral-100 px-4 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-600">
                Payment history — full transaction record
              </p>
            </div>
            <div className="divide-y divide-neutral-200 text-sm text-neutral-800">
              {/* Original deposit row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                    ① Deposit
                  </span>
                  <span className="font-medium">{depositInvoice.number}</span>
                  {depositInvoice.issued_at ? (
                    <span className="text-neutral-500">
                      received {depositInvoice.issued_at.slice(0, 10)}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums font-semibold">
                    {formatCurrencyAmount(depositInvoice.amount, depositInvoice.currency)}
                  </span>
                  <span className="rounded-full border border-emerald-400 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                    {depositInvoice.status}
                  </span>
                </div>
              </div>

              {/* Final balance row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                    ② Balance
                  </span>
                  <span className="font-medium">{numberLabel}</span>
                  <span className="text-neutral-500">this invoice · due now</span>
                </div>
                <span className="tabular-nums font-semibold">
                  {formatCurrencyAmount(totals.amount, currency)}
                </span>
              </div>
            </div>

            {/* Total project value footer row */}
            <div className="flex items-center justify-between border-t border-neutral-300 bg-neutral-50 px-4 py-3 text-sm">
              <span className="font-medium text-neutral-700">Total project value</span>
              <span className="tabular-nums font-bold text-neutral-900">
                {formatCurrencyAmount(
                  depositInvoice.total_project_amount ??
                    depositInvoice.amount + totals.amount,
                  currency,
                )}
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-10 border-t border-neutral-200 pt-3 text-center text-[10px] text-neutral-500">
          <p className="uppercase tracking-[0.25em]">
            {companyName.trim() || DEFAULT_ISSUING_COMPANY} · {numberLabel}
          </p>
          <p className="mt-1 tracking-normal text-neutral-600">
            {DEFAULT_ISSUING_PHONE} · {DEFAULT_ISSUING_EMAIL}
          </p>
        </div>
      </div>
    </form>
  );
}

function NewClientDialog({
  onCreated,
}: {
  onCreated: (client: CrmClientRecord) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const reset = () => {
    setBusinessName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!businessName.trim()) {
      setError("Business / client name is required.");
      return;
    }
    setSaving(true);
    try {
      const res = await createCrmDealAction({
        business_name: businessName.trim(),
        contact_name: contactName.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onCreated(res.client);
      setOpen(false);
      reset();
    } catch {
      setError("Could not add the client. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1">
          <UserPlus className="h-4 w-4" />
          New client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a client</DialogTitle>
          <DialogDescription>
            Saves a new client to your CRM roster and selects it for this
            invoice.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-client-business">Business / client name</Label>
            <Input
              id="new-client-business"
              autoFocus
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Acme Holdings Ltd."
              maxLength={160}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-client-contact">Contact name</Label>
              <Input
                id="new-client-contact"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-client-phone">Phone</Label>
              <Input
                id="new-client-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-client-email">Email</Label>
            <Input
              id="new-client-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Optional"
            />
          </div>
          {error ? (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Adding…" : "Add client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
