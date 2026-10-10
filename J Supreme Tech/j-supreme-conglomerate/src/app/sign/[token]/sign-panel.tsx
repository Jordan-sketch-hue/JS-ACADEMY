"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Printer } from "lucide-react";
import { SignaturePad } from "@/components/contracts/signature-pad";
import type { SignatureValue } from "@/lib/contracts/signature";
import { signByTokenAction } from "./actions";

/** Client-side signing panel embedded in the public contract page. */
export function SignPanel({
  token,
  initialEmail = "",
}: {
  token: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [value, setValue] = useState<SignatureValue | null>(null);
  const [agreed, setAgreed] = useState(false);

  const onSign = () => {
    setError(null);
    if (!name.trim()) return setError("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return setError("Enter a valid email address — your signed copy is sent there.");
    }
    if (!value) return setError("Type or draw your signature.");
    if (!agreed) return setError("Tick the box to confirm you agree to the terms.");
    startTransition(async () => {
      const res = await signByTokenAction(token, value, name.trim(), email.trim());
      if (!res.ok) return setError(res.error);
      router.refresh();
    });
  };

  return (
    <div className="no-print mt-3 space-y-3 rounded-xl border border-neutral-300 bg-neutral-50 p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
        <PenLine className="h-4 w-4" />
        Sign here to accept
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="public-sign-name" className="text-neutral-700">
            Your full name
          </Label>
          <Input
            id="public-sign-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="public-sign-email" className="text-neutral-700">
            Your email
          </Label>
          <Input
            id="public-sign-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="bg-white"
          />
          <p className="text-[11px] text-neutral-500">
            Your signed copy is emailed here.
          </p>
        </div>
      </div>
      <SignaturePad onChange={setValue} initialName={name} />
      <label className="flex cursor-pointer items-start gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-neutral-900"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          I have read this Agreement and agree to be bound by its terms. I adopt
          the signature above as my electronic signature.
        </span>
      </label>
      {error ? (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} onClick={onSign}>
        {pending ? "Signing…" : "Sign agreement"}
      </Button>
    </div>
  );
}

/** Print button for the signed copy (client component for onClick). */
export function PrintButton() {
  return (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
      <Printer className="h-4 w-4" />
      Print / save PDF
    </Button>
  );
}
