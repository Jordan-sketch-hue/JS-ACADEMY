import Link from "next/link";
import { requireOwnerClerkId } from "@/lib/session";
import { listContracts } from "@/lib/data/contracts";
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
import { recurrenceLabel, isRecurring } from "@/lib/invoices/recurrence";
import { ContractRowActions } from "@/components/contracts/contract-row-actions";
import { MySignatureDialog } from "@/components/contracts/my-signature-dialog";
import { Repeat } from "lucide-react";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "success" | "warning"
> = {
  draft: "outline",
  sent: "secondary",
  signed: "success",
  active: "success",
  terminated: "warning",
  expired: "outline",
};

export default async function ContractsPage() {
  const owner = await requireOwnerClerkId();
  const rows = await listContracts(owner);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contracts</h1>
          <p className="text-sm text-muted-foreground">
            Draft protective service &amp; retainer agreements, e-sign them in
            the app, or send a signing link. Print/PDF stays one click away.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MySignatureDialog />
          <Button asChild>
            <Link href="/contracts/new">New contract</Link>
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
          No contracts yet — draft one from{" "}
          <Link href="/contracts/new" className="text-primary underline underline-offset-2">
            New contract
          </Link>
          .
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border/60 lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      <Link href={`/contracts/${r.id}`} className="text-primary hover:underline">
                        {r.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.client_business_name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm capitalize">
                        {r.contract_type === "retainer" ? (
                          <Repeat className="h-3.5 w-3.5 text-accent" />
                        ) : null}
                        {r.contract_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[r.status] ?? "outline"} className="capitalize">
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.fee_amount > 0 ? formatCurrencyAmount(r.fee_amount, r.currency) : "—"}
                      {isRecurring(r.billing_cadence) ? (
                        <span className="block text-[10px] text-accent/80">
                          / {recurrenceLabel(r.billing_cadence).toLowerCase()}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <ContractRowActions contractId={r.id} title={r.title} />
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
                <Link href={`/contracts/${r.id}`} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-primary">{r.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.client_business_name ?? "—"}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[r.status] ?? "outline"} className="shrink-0 capitalize">
                      {r.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs capitalize text-muted-foreground">
                      {r.contract_type === "retainer" ? (
                        <Repeat className="h-3.5 w-3.5 text-accent" />
                      ) : null}
                      {r.contract_type}
                    </span>
                    <div className="text-right tabular-nums">
                      <p className="font-semibold">
                        {r.fee_amount > 0 ? formatCurrencyAmount(r.fee_amount, r.currency) : "—"}
                      </p>
                      {isRecurring(r.billing_cadence) ? (
                        <p className="text-[10px] text-accent/80">
                          / {recurrenceLabel(r.billing_cadence).toLowerCase()}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
                <div className="mt-2 flex justify-end border-t border-border/50 pt-2">
                  <ContractRowActions contractId={r.id} title={r.title} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
