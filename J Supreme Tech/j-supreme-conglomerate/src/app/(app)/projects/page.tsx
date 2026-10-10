import { ProjectsClient } from "@/components/projects/projects-client";
import { listProjectWorkflows } from "@/lib/data/project-workflows";
import { requireOwnerClerkId } from "@/lib/session";

export default async function ProjectsPage() {
  const owner = await requireOwnerClerkId();
  const workflows = await listProjectWorkflows(owner);
  return <ProjectsClient initialWorkflows={workflows} />;
}
