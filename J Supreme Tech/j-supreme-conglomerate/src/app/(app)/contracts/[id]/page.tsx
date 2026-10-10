import { notFound } from "next/navigation";
import { requireOwnerClerkId } from "@/lib/session";
import { getContract } from "@/lib/data/contracts";
import { listCrmClients } from "@/lib/data/crm";
import { ContractEditor } from "@/components/contracts/contract-editor";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const { id } = await params;
  const contract = await getContract(owner, id);
  if (!contract) {
    notFound();
  }
  const clients = await listCrmClients(owner);

  return <ContractEditor mode="edit" clients={clients} contract={contract} />;
}
