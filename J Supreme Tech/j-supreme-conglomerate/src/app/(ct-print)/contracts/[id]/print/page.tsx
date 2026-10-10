import { notFound } from "next/navigation";
import { requireOwnerClerkId } from "@/lib/session";
import { getContract } from "@/lib/data/contracts";
import { ContractPrintView } from "@/components/contracts/contract-print-view";

export default async function ContractPrintRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const { id } = await params;
  const contract = await getContract(owner, id);
  if (!contract) notFound();
  return <ContractPrintView contract={contract} />;
}
