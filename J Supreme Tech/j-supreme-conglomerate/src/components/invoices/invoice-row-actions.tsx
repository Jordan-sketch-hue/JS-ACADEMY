"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FileCheck2, Repeat, Trash2 } from "lucide-react";
import {
  deleteInvoiceAction,
  generateFinalInvoiceAction,
  generateNextRecurringInvoiceAction,
} from "@/app/(app)/invoices/actions";
import { isRecurring, type Recurrence } from "@/lib/invoices/recurrence";

type Props = {
  invoiceId: string;
  invoiceNumber: string;
  recurrence?: Recurrence;
  isDeposit?: boolean;
};

export function InvoiceRowActions({
  invoiceId,
  invoiceNumber,
  recurrence = "none",
  isDeposit = false,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [isGeneratingFinal, startGeneratingFinal] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    if (
      !window.confirm(
        `Delete invoice ${invoiceNumber}? This permanently removes the invoice and its line items.`,
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await deleteInvoiceAction(invoiceId);
      if (!res.ok) {
        setError(res.error);
        window.alert(`Could not delete invoice: ${res.error}`);
        return;
      }
      router.refresh();
    });
  };

  const onGenerateNext = () => {
    if (
      !window.confirm(
        `Generate the next invoice in this recurring series from ${invoiceNumber}? A new draft with a fresh number and advanced dates will be created.`,
      )
    ) {
      return;
    }
    setError(null);
    startGenerating(async () => {
      const res = await generateNextRecurringInvoiceAction(invoiceId);
      if (!res.ok) {
        setError(res.error);
        window.alert(`Could not generate next invoice: ${res.error}`);
        return;
      }
      router.push(`/invoices/${res.id}`);
      router.refresh();
    });
  };

  const onGenerateFinal = () => {
    if (
      !window.confirm(
        `Generate a final balance invoice from deposit ${invoiceNumber}? A new draft will be created for the remaining balance.`,
      )
    ) {
      return;
    }
    setError(null);
    startGeneratingFinal(async () => {
      const res = await generateFinalInvoiceAction(invoiceId);
      if (!res.ok) {
        setError(res.error);
        window.alert(`Could not generate final invoice: ${res.error}`);
        return;
      }
      router.push(`/invoices/${res.id}`);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {isDeposit ? (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-emerald-400 hover:text-emerald-400"
          onClick={onGenerateFinal}
          disabled={isGeneratingFinal}
          title="Generate a final invoice for the remaining balance"
        >
          <FileCheck2 className="h-3.5 w-3.5" />
          {isGeneratingFinal ? "Generating…" : "Final invoice"}
        </Button>
      ) : null}
      {isRecurring(recurrence) ? (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-accent hover:text-accent"
          onClick={onGenerateNext}
          disabled={isGenerating}
          title="Create the next invoice in this recurring series"
        >
          <Repeat className="h-3.5 w-3.5" />
          {isGenerating ? "Generating…" : "Generate next"}
        </Button>
      ) : null}
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/invoices/${invoiceId}`}>Edit</Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        aria-label={`Delete invoice ${invoiceNumber}`}
        onClick={onDelete}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && (
        <span className="sr-only" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
