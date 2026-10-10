"use server";

import { revalidatePath } from "next/cache";
import {
  getContractBySignToken,
  signContractByToken,
} from "@/lib/data/contracts";
import { serializeSignature, type SignatureValue } from "@/lib/contracts/signature";
import {
  notifyOperatorContractSigned,
  sendSignedCopyEmail,
} from "@/lib/contracts/contract-emails";

/** Public client signing — the unguessable token is the only credential. */
export async function signByTokenAction(
  token: string,
  signature: SignatureValue,
  signerName: string,
  signerEmail: string,
) {
  const result = await signContractByToken(
    token,
    serializeSignature(signature),
    signerName,
    signerEmail,
  );
  if (!result.ok) return { ok: false as const, error: result.error };
  // Best-effort delivery — the signature is already saved; a failed email
  // must never surface as a failed signing.
  const signed = await getContractBySignToken(token);
  if (signed) {
    await Promise.allSettled([
      sendSignedCopyEmail(signed, signerEmail.trim()),
      notifyOperatorContractSigned(signed),
    ]);
  }
  revalidatePath(`/sign/${token}`);
  return { ok: true as const };
}
