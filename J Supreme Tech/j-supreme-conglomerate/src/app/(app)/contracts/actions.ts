"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  clearContractSignature,
  createContract,
  deleteContract,
  ensureSignToken,
  getContract,
  setClientSignerEmail,
  signContractAsClient,
  signContractAsProvider,
  updateContract,
  type ContractInput,
} from "@/lib/data/contracts";
import {
  notifyOperatorContractSigned,
  sendSignedCopyEmail,
  sendSignInviteEmail,
} from "@/lib/contracts/contract-emails";
import {
  getSignatureSettings,
  saveSignatureSettings,
} from "@/lib/data/signature-settings";
import {
  parseSignature,
  serializeSignature,
  type SignatureValue,
} from "@/lib/contracts/signature";

export async function createContractAction(input: ContractInput) {
  const owner = await requireOwnerClerkId();
  const result = await createContract(owner, input);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/contracts");
  revalidatePath(`/contracts/${result.id}`);
  return { ok: true as const, id: result.id };
}

export async function updateContractAction(
  contractId: string,
  input: ContractInput,
) {
  const owner = await requireOwnerClerkId();
  const result = await updateContract(owner, contractId, input);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/contracts");
  revalidatePath(`/contracts/${contractId}`);
  return { ok: true as const, id: result.id };
}

export async function deleteContractAction(contractId: string) {
  const owner = await requireOwnerClerkId();
  const result = await deleteContract(owner, contractId);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/contracts");
  return { ok: true as const };
}

/* ------------------------------------------------------------------ */
/* E-signing                                                            */
/* ------------------------------------------------------------------ */

function revalidateContract(contractId: string) {
  revalidatePath("/contracts");
  revalidatePath(`/contracts/${contractId}`);
}

/**
 * Sign as Provider. With no signature argument, applies the operator's saved
 * signature; with one, optionally stores it as the new saved signature so it
 * is reused on every future contract.
 */
export async function signProviderAction(
  contractId: string,
  signature?: SignatureValue,
  options?: { signerName?: string; saveAsDefault?: boolean },
) {
  const owner = await requireOwnerClerkId();
  let value = signature ?? null;
  let signerName = options?.signerName?.trim() ?? "";

  if (!value) {
    const saved = await getSignatureSettings(owner);
    const parsed = saved ? parseSignature(saved.signature_data) : null;
    if (!saved || !parsed) {
      return {
        ok: false as const,
        error: "No saved signature yet — create one first.",
      };
    }
    value = parsed;
    signerName = signerName || saved.signer_name;
  } else if (options?.saveAsDefault) {
    const save = await saveSignatureSettings(owner, {
      signer_name: signerName || (value.kind === "typed" ? value.name : ""),
      signature_data: serializeSignature(value),
    });
    if (!save.ok) return { ok: false as const, error: save.error };
  }

  if (!signerName && value.kind === "typed") signerName = value.name;
  const result = await signContractAsProvider(
    owner,
    contractId,
    serializeSignature(value),
    signerName,
  );
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidateContract(contractId);
  return { ok: true as const };
}

/** Client signs in person on the operator's device. */
export async function signClientAction(
  contractId: string,
  signature: SignatureValue,
  signerName: string,
) {
  const owner = await requireOwnerClerkId();
  if (!signerName.trim()) {
    return { ok: false as const, error: "Enter the client signer's full name." };
  }
  const result = await signContractAsClient(
    owner,
    contractId,
    serializeSignature(signature),
    signerName,
  );
  if (!result.ok) return { ok: false as const, error: result.error };
  // Signed copy to the client's stored email, when we have one. Best-effort —
  // the signature is already saved; email failure must not undo that.
  const signed = await getContract(owner, contractId);
  if (signed?.client_signer_email && signed.sign_token) {
    await sendSignedCopyEmail(signed, signed.client_signer_email);
  }
  revalidateContract(contractId);
  return { ok: true as const };
}

/** Email the signing link to the client (stores the address for the signed copy). */
export async function emailSignLinkAction(contractId: string, email: string) {
  const owner = await requireOwnerClerkId();
  const to = email.trim();
  if (!/^\S+@\S+\.\S+$/.test(to)) {
    return { ok: false as const, error: "Enter a valid email address." };
  }
  const token = await ensureSignToken(owner, contractId);
  if (!token.ok) return { ok: false as const, error: token.error };
  const stored = await setClientSignerEmail(owner, contractId, to);
  if (!stored.ok) return { ok: false as const, error: stored.error };
  const contract = await getContract(owner, contractId);
  if (!contract) return { ok: false as const, error: "Contract not found." };
  const sent = await sendSignInviteEmail(contract, to);
  if (!sent.ok) return { ok: false as const, error: sent.error };
  revalidateContract(contractId);
  return { ok: true as const };
}

export async function clearSignatureAction(
  contractId: string,
  party: "provider" | "client",
) {
  const owner = await requireOwnerClerkId();
  const result = await clearContractSignature(owner, contractId, party);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidateContract(contractId);
  return { ok: true as const };
}

/** Create/fetch the public signing link for a contract. */
export async function signLinkAction(contractId: string) {
  const owner = await requireOwnerClerkId();
  const result = await ensureSignToken(owner, contractId);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidateContract(contractId);
  return { ok: true as const, token: result.token };
}

export async function getMySignatureAction() {
  const owner = await requireOwnerClerkId();
  const saved = await getSignatureSettings(owner);
  if (!saved) return { ok: true as const, signature: null };
  return {
    ok: true as const,
    signature: {
      signerName: saved.signer_name,
      signerTitle: saved.signer_title,
      value: parseSignature(saved.signature_data),
    },
  };
}

export async function saveMySignatureAction(input: {
  signerName: string;
  signerTitle?: string | null;
  value: SignatureValue;
}) {
  const owner = await requireOwnerClerkId();
  const result = await saveSignatureSettings(owner, {
    signer_name: input.signerName,
    signer_title: input.signerTitle ?? null,
    signature_data: serializeSignature(input.value),
  });
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/contracts");
  return { ok: true as const };
}
