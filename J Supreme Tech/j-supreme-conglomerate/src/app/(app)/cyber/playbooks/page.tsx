import { Playbooks } from "@/components/cyber/playbooks";

export const metadata = { title: "IR Playbooks · J Supreme" };
export const dynamic = "force-dynamic";

export default function CyberPlaybooksPage() {
  return <Playbooks />;
}
