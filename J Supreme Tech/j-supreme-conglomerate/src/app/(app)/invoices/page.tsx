import Link from "next/link";
import { requireOwnerClerkId } from "@/lib/session";
import { listInvoices } from "@/lib/data/invoices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyAmount } from "@/lib/utils";
import { InvoiceRowActions } from "@/components/invoices/invoice-row-actions";
import { isRecurring, recurrenceLabel } from "@/lib/invoices/recurrence";
import { resolveIncomeGroup } from "@/lib/earnings/income";
import { Repeat } from "lucide-react";

export default async function InvoicesPage() {
  const owner = await requireOwnerClerkId();
  const rows = await listInvoices(owner);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Create billing documents from your CRM clients. Totals include line items, optional discount, and tax.
          </p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">New invoice</Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
          No invoices yet — start from{" "}
          <Link href="/invoices/new" className="text-primary underline underline-offset-2">
            New invoice
          </Link>{" "}
          or the CRM roster.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border/60 lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Open</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      <Link href={`/invoices/${r.id}`} className="text-primary hover:underline">
                        {r.number}
                      </Link>
                      {isRecurring(r.recurrence) ? (
                        <span className="mt-1 flex w-fit items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                          <Repeat className="h-3 w-3" />
                          {recurrenceLabel(r.recurrence)}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.client_business_name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant="outline" className="capitalize">
                          {r.status}
                        </Badge>
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {resolveIncomeGroup(r)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrencyAmount(r.amount, r.currency)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.issued_at ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.due_date ?? "—"}
                      {isRecurring(r.recurrence) && r.next_issue_date ? (
                        <span className="mt-0.5 block text-[10px] text-accent/80">
                          next ≈ {r.next_issue_date}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <InvoiceRowActions
                        invoiceId={r.id}
                        invoiceNumber={r.number}
                        recurrence={r.recurrence}
                        isDeposit={r.is_deposit}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards — tap to open */}
          <div className="space-y-2 lg:hidden">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 bg-card/40 p-3">
                <Link href={`/invoices/${r.id}`} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-primary">{r.number}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.client_business_name ?? "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant="outline" className="capitalize">
                        {r.status}
                      </Badge>
                      {isRecurring(r.recurrence) ? (
                        <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                          <Repeat className="h-3 w-3" />
                          {recurrenceLabel(r.recurrence)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
                      <p className="font-semibold tabular-nums">
                        {formatCurrencyAmount(r.amount, r.currency)}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{resolveIncomeGroup(r)}</p>
                      {r.due_date ? <p>Due {r.due_date}</p> : null}
                      {isRecurring(r.recurrence) && r.next_issue_date ? (
                        <p className="text-accent/80">next ≈ {r.next_issue_date}</p>
                      ) : null}
                    </div>
                  </div>
                </Link>
                <div className="mt-2 flex justify-end border-t border-border/50 pt-2">
                  <InvoiceRowActions
                    invoiceId={r.id}
                    invoiceNumber={r.number}
                    recurrence={r.recurrence}
                    isDeposit={r.is_deposit}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
