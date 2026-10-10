"use client";

import { useState, useTransition } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Link2, Mail, PenLine, Undo2 } from "lucide-react";
import { SignaturePad } from "@/components/contracts/signature-pad";
import { SignatureView } from "@/components/contracts/signature-view";
import { parseSignature, type SignatureValue } from "@/lib/contracts/signature";
import type { ContractListItem } from "@/lib/data/contracts";
import {
  clearSignatureAction,
  emailSignLinkAction,
  signClientAction,
  signLinkAction,
  signProviderAction,
} from "@/app/(app)/contracts/actions";

function formatSignedDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isFinite(d.getTime())
    ? d.toLocaleDateString("en-JM", { year: "numeric", month: "long", day: "numeric" })
    : "";
}

/**
 * The signature block of the contract document. Signed parties render their
 * actual e-signature (ink-on-paper strip, print-safe); unsigned parties show
 * a classic ruled line in print plus on-screen signing controls.
 */
export function ContractSignSection({
  contract,
  providerLabel,
  clientLabel,
  defaultEmail = "",
}: {
  contract: ContractListItem;
  providerLabel: string;
  clientLabel: string;
  /** Prefill for "Email signing link" — CRM client email or stored signer email. */
  defaultEmail?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const providerSig = parseSignature(contract.provider_signature);
  const clientSig = parseSignature(contract.client_signature);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) {
        setError(res.error ?? "Something went wrong.");
        return;
      }
      // Commit the dialog close on its own BEFORE the server payload swaps —
      // batching them strands the Radix portal and leaves body pointer-events
      // locked (page becomes unclickable after signing).
      flushSync(() => {
        setClientOpen(false);
        setProviderOpen(false);
        setEmailOpen(false);
      });
      router.refresh();
    });
  };

  const sendInvite = (email: string) => {
    setError(null);
    startTransition(async () => {
      const res = await emailSignLinkAction(contract.id, email);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      flushSync(() => setEmailOpen(false));
      setInviteSent(true);
      setTimeout(() => setInviteSent(false), 4000);
      router.refresh();
    });
  };

  const copySignLink = () => {
    setError(null);
    startTransition(async () => {
      const res = await signLinkAction(contract.id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const url = `${window.location.origin}/sign/${res.token}`;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        window.prompt("Copy this signing link:", url);
      }
    });
  };

  return (
    <div className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground print:text-neutral-500">
        Signatures
      </p>
      <p className="mt-1 text-xs text-muted-foreground print:text-neutral-600">
        Signed electronically — each party&rsquo;s e-signature below is adopted
        as its legal signature on this Agreement.
      </p>

      {error ? (
        <p role="alert" className="no-print mt-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Provider */}
        <div>
          {providerSig ? (
            <SignedCard
              value={providerSig}
              name={contract.provider_signer_name}
              date={formatSignedDate(contract.provider_signed_at)}
              label={providerLabel}
              onClear={() => run(() => clearSignatureAction(contract.id, "provider"))}
              pending={pending}
            />
          ) : (
            <>
              <div className="h-10 border-b border-foreground/40 print:border-neutral-500" />
              <p className="mt-1 text-xs text-muted-foreground print:text-neutral-600">
                {providerLabel}
              </p>
              <div className="no-print mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5"
                  disabled={pending}
                  onClick={() => run(() => signProviderAction(contract.id))}
                >
                  <PenLine className="h-3.5 w-3.5" />
                  Sign with my signature
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setProviderOpen(true)}
                >
                  New signature…
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Client */}
        <div>
          {clientSig ? (
            <SignedCard
              value={clientSig}
              name={contract.client_signer_name}
              date={formatSignedDate(contract.client_signed_at)}
              label={clientLabel}
              onClear={() => run(() => clearSignatureAction(contract.id, "client"))}
              pending={pending}
            />
          ) : (
            <>
              <div className="h-10 border-b border-foreground/40 print:border-neutral-500" />
              <p className="mt-1 text-xs text-muted-foreground print:text-neutral-600">
                {clientLabel}
              </p>
              <div className="no-print mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5"
                  disabled={pending}
                  onClick={() => setEmailOpen(true)}
                >
                  {inviteSent ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Invite sent
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      Email signing link
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setClientOpen(true)}
                >
                  <PenLine className="h-3.5 w-3.5" />
                  Client signs now
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  disabled={pending}
                  onClick={copySignLink}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Link copied
                    </>
                  ) : (
                    <>
                      <Link2 className="h-3.5 w-3.5" />
                      Copy signing link
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keyed on open so every open is a fresh pad — no stale signature state. */}
      <ProviderSignDialog
        key={`prov-${providerOpen}`}
        open={providerOpen}
        onOpenChange={setProviderOpen}
        pending={pending}
        onSign={(value, signerName, saveAsDefault) =>
          run(() => signProviderAction(contract.id, value, { signerName, saveAsDefault }))
        }
      />
      <ClientSignDialog
        key={`client-${clientOpen}`}
        open={clientOpen}
        onOpenChange={setClientOpen}
        pending={pending}
        defaultName={contract.client_signer_name ?? ""}
        onSign={(value, signerName) =>
          run(() => signClientAction(contract.id, value, signerName))
        }
      />
      <EmailLinkDialog
        key={`email-${emailOpen}`}
        open={emailOpen}
        onOpenChange={setEmailOpen}
        pending={pending}
        defaultEmail={contract.client_signer_email ?? defaultEmail}
        onSend={sendInvite}
      />
    </div>
  );
}

function SignedCard({
  value,
  name,
  date,
  label,
  onClear,
  pending,
}: {
  value: SignatureValue;
  name: string | null;
  date: string;
  label: string;
  onClear: () => void;
  pending: boolean;
}) {
  return (
    <div>
      <div className="rounded-lg border border-neutral-300 bg-white px-4 pb-2 pt-3 print:rounded-none print:border-0 print:px-0">
        <SignatureView value={value} />
        <div className="mt-1 flex items-baseline justify-between gap-2 border-t border-neutral-400 pt-1.5">
          <span className="text-xs font-medium text-neutral-800">
            {name || "Signed"}
          </span>
          {date ? <span className="text-[11px] text-neutral-500">{date}</span> : null}
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground print:text-neutral-600">{label}</p>
        <button
          type="button"
          className="no-print inline-flex items-center gap-1 text-[11px] text-muted-foreground underline-offset-2 hover:text-destructive hover:underline disabled:opacity-50"
          onClick={() => {
            if (window.confirm("Remove this signature?")) onClear();
          }}
          disabled={pending}
        >
          <Undo2 className="h-3 w-3" />
          Remove
        </button>
      </div>
    </div>
  );
}

function ProviderSignDialog({
  open,
  onOpenChange,
  onSign,
  pending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSign: (value: SignatureValue, signerName: string, saveAsDefault: boolean) => void;
  pending: boolean;
}) {
  const [value, setValue] = useState<SignatureValue | null>(null);
  const [name, setName] = useState("");
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign as Provider</DialogTitle>
          <DialogDescription>
            Type or draw your signature for this agreement.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="prov-sign-name">Signer name</Label>
            <Input
              id="prov-sign-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Morris"
            />
          </div>
          <SignaturePad onChange={setValue} initialName={name} />
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={saveAsDefault}
              onChange={(e) => setSaveAsDefault(e.target.checked)}
            />
            <span>Save as my signature for all contracts</span>
          </label>
        </div>
        <Button
          className="w-full"
          disabled={pending || !value}
          onClick={() => {
            if (!value) return;
            const signer =
              name.trim() || (value.kind === "typed" ? value.name : "");
            onSign(value, signer, saveAsDefault);
          }}
        >
          {pending ? "Signing…" : "Apply signature"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function EmailLinkDialog({
  open,
  onOpenChange,
  onSend,
  pending,
  defaultEmail,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSend: (email: string) => void;
  pending: boolean;
  defaultEmail: string;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const valid = /^\S+@\S+\.\S+$/.test(email.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email signing link</DialogTitle>
          <DialogDescription>
            The client gets a branded email with the agreement summary and a
            &ldquo;Review &amp; sign&rdquo; button. Their signed copy is emailed
            to the same address automatically after they sign.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="invite-email">Client&rsquo;s email</Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@example.com"
            autoComplete="email"
          />
        </div>
        <Button
          className="w-full gap-1.5"
          disabled={pending || !valid}
          onClick={() => onSend(email.trim())}
        >
          <Mail className="h-4 w-4" />
          {pending ? "Sending…" : "Send signing invite"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function ClientSignDialog({
  open,
  onOpenChange,
  onSign,
  pending,
  defaultName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSign: (value: SignatureValue, signerName: string) => void;
  pending: boolean;
  defaultName: string;
}) {
  const [value, setValue] = useState<SignatureValue | null>(null);
  const [name, setName] = useState(defaultName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client signature</DialogTitle>
          <DialogDescription>
            Hand the device to the client to sign, or use &ldquo;Copy signing
            link&rdquo; to let them sign remotely.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="client-sign-name">Client signer&rsquo;s full name</Label>
            <Input
              id="client-sign-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <SignaturePad onChange={setValue} initialName={name} />
        </div>
        <Button
          className="w-full"
          disabled={pending || !value || !name.trim()}
          onClick={() => value && onSign(value, name.trim())}
        >
          {pending ? "Signing…" : "Sign agreement"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
