import type { Metadata } from "next";
import { getContractBySignToken } from "@/lib/data/contracts";
import {
  ContractDocument,
  docDataFromRecord,
  PartySignatureBlock,
} from "@/components/contracts/contract-document";
import { parseSignature } from "@/lib/contracts/signature";
import { Logo } from "@/components/brand/logo";
import { BadgeCheck, Clock3 } from "lucide-react";
import { PrintButton, SignPanel } from "./sign-panel";

export const metadata: Metadata = {
  title: "Review & sign agreement",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatSignedDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isFinite(d.getTime())
    ? d.toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" })
    : "";
}

export default async function PublicSignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const contract = await getContractBySignToken(token);

  if (!contract) {
    return (
      <Shell>
        <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-neutral-900">
            Signing link not found
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            This link is invalid or has been withdrawn. Please contact the
            provider for a fresh signing link.
          </p>
        </div>
      </Shell>
    );
  }

  const data = docDataFromRecord(contract);
  const clientSig = parseSignature(contract.client_signature);
  const expired =
    !clientSig &&
    !!contract.valid_until &&
    new Date(`${contract.valid_until}T23:59:59`).getTime() < Date.now();

  return (
    <Shell>
      <div className="mx-auto w-full max-w-[860px] space-y-4">
        {/* Status banner */}
        {clientSig ? (
          <div className="no-print flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
              <BadgeCheck className="h-4 w-4" />
              Agreement signed
              {contract.client_signed_at
                ? ` on ${formatSignedDate(contract.client_signed_at)}`
                : ""}
              . Keep a copy for your records.
            </p>
            <PrintButton />
          </div>
        ) : expired ? (
          <div className="no-print flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            <Clock3 className="h-4 w-4" />
            This offer expired on {contract.valid_until}. Contact the provider
            for updated terms.
          </div>
        ) : (
          <div className="no-print rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
            <span className="font-semibold text-neutral-900">
              You&rsquo;ve been invited to review and sign this agreement.
            </span>{" "}
            Read it through, then sign at the bottom.
            {contract.valid_until ? (
              <> Offer valid until <strong>{contract.valid_until}</strong>.</>
            ) : null}
          </div>
        )}

        <ContractDocument
          data={data}
          signatures={
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground print:text-neutral-500">
                Signatures
              </p>
              <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <PartySignatureBlock
                  signature={contract.provider_signature}
                  signerName={contract.provider_signer_name}
                  signedAt={contract.provider_signed_at}
                  label={`${data.provider} (Provider)`}
                />
                <div>
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
                  {!clientSig && !expired ? (
                    <SignPanel
                      token={token}
                      initialEmail={contract.client_signer_email ?? ""}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          }
        />

        <p className="no-print pb-8 text-center text-xs text-neutral-500">
          Secure e-sign · {data.provider}
        </p>
      </div>
    </Shell>
  );
}

/** Always-light "paper" shell so clients see a clean document regardless of theme. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="light"
      className="min-h-svh bg-neutral-100 px-4 py-8 text-neutral-900 print:bg-white print:p-0"
    >
      <div className="no-print mx-auto mb-6 flex w-full max-w-[860px] items-center gap-2.5">
        <Logo className="h-7 w-7 text-neutral-900" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-900">
          J Supreme Conglomerate
        </span>
      </div>
      {children}
    </div>
  );
}
