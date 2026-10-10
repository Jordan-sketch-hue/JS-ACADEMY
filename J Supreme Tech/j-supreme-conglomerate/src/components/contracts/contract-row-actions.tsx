"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { deleteContractAction } from "@/app/(app)/contracts/actions";

export function ContractRowActions({
  contractId,
  title,
}: {
  contractId: string;
  title: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, setError] = useState<string | null>(null);

  const onDelete = () => {
    if (!window.confirm(`Delete contract "${title}"? This cannot be undone.`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await deleteContractAction(contractId);
      if (!res.ok) {
        setError(res.error);
        window.alert(`Could not delete contract: ${res.error}`);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/contracts/${contractId}`}>Open</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="gap-1">
        <Link href={`/contracts/${contractId}/print`} title="Open print view / save as PDF">
          <Download className="h-3.5 w-3.5" />
          PDF
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        aria-label={`Delete contract ${title}`}
        onClick={onDelete}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
