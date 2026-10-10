"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import {
  ContractDocument,
  docDataFromRecord,
  PartySignatureBlock,
} from "@/components/contracts/contract-document";
import type { ContractListItem } from "@/lib/data/contracts";

/**
 * Shell-free, print-first contract view (mirror of InvoicePrintView).
 * Lives outside the app shell so the browser paginates the full document —
 * printing from inside the dashboard's fixed-height scroll container clips
 * everything past the first viewport.
 */
export function ContractPrintView({ contract }: { contract: ContractListItem }) {
  const data = docDataFromRecord(contract);

  // Auto-trigger the browser print dialog after a short delay
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      data-theme="light"
      className="min-h-svh bg-neutral-100 text-neutral-900 print:bg-white"
    >
      {/* Screen-only toolbar — hidden when printing */}
      <div className="no-print sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-2.5">
        <Link
          href={`/contracts/${contract.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to contract
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-neutral-500 sm:block">
            Tip: untick &ldquo;Headers and footers&rdquo; in the print dialog
            for a clean PDF.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
          >
            <Printer className="h-4 w-4" />
            Print / save PDF
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[860px] px-4 py-8 print:max-w-none print:p-0">
        <ContractDocument
          data={data}
          signatures={
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground print:text-neutral-500">
                Signatures
              </p>
              <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 print:grid-cols-2">
                <PartySignatureBlock
                  signature={contract.provider_signature}
                  signerName={contract.provider_signer_name}
                  signedAt={contract.provider_signed_at}
                  label={`${data.provider} (Provider)`}
                />
                <PartySignatureBlock
                  signature={contract.client_signature}
                  signerName={contract.client_signer_name}
                  signedAt={contract.client_signed_at}
                  label={
                    data.clientName === "[Client]"
                      ? "Client"
                      : `${data.clientName} (Client)`
                  }
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
