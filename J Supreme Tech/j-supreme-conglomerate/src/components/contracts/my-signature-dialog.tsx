"use client";

import { useEffect, useState, useTransition } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine } from "lucide-react";
import { SignaturePad } from "@/components/contracts/signature-pad";
import { SignatureView } from "@/components/contracts/signature-view";
import type { SignatureValue } from "@/lib/contracts/signature";
import {
  getMySignatureAction,
  saveMySignatureAction,
} from "@/app/(app)/contracts/actions";

/**
 * Manage the operator's saved ("set") signature — the one applied with a
 * single click when signing any contract as Provider.
 */
export function MySignatureDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState<{
    signerName: string;
    value: SignatureValue;
  } | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [value, setValue] = useState<SignatureValue | null>(null);

  useEffect(() => {
    if (!open || loaded) return;
    getMySignatureAction().then((res) => {
      setLoaded(true);
      if (res.ok && res.signature?.value) {
        setCurrent({
          signerName: res.signature.signerName,
          value: res.signature.value,
        });
        setSignerName(res.signature.signerName);
        setSignerTitle(res.signature.signerTitle ?? "");
      }
    });
  }, [open, loaded]);

  const onSave = () => {
    setError(null);
    if (!value) {
      setError("Type or draw a signature first.");
      return;
    }
    const name =
      signerName.trim() || (value.kind === "typed" ? value.name : "");
    if (!name) {
      setError("Enter the signer name.");
      return;
    }
    startTransition(async () => {
      const res = await saveMySignatureAction({
        signerName: name,
        signerTitle: signerTitle.trim() || null,
        value,
      });
      if (!res.ok) return setError(res.error);
      // Close-commit before refresh — see contract-sign-section run().
      flushSync(() => {
        setCurrent({ signerName: name, value });
        setOpen(false);
      });
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <PenLine className="h-3.5 w-3.5" />
          My signature
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My signature</DialogTitle>
          <DialogDescription>
            Saved once, used on every contract you sign as Provider.
          </DialogDescription>
        </DialogHeader>

        {current ? (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Current signature
            </p>
            <div className="rounded-lg border border-neutral-300 bg-white px-4 py-2">
              <SignatureView value={current.value} />
              <p className="border-t border-neutral-300 pt-1 text-xs text-neutral-600">
                {current.signerName}
              </p>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sig-name">Signer name</Label>
              <Input
                id="sig-name"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Jordan Morris"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sig-title">Title (optional)</Label>
              <Input
                id="sig-title"
                value={signerTitle}
                onChange={(e) => setSignerTitle(e.target.value)}
                placeholder="Founder & CEO"
              />
            </div>
          </div>
          <SignaturePad onChange={setValue} initialName={signerName} />
        </div>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button onClick={onSave} disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save signature"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
