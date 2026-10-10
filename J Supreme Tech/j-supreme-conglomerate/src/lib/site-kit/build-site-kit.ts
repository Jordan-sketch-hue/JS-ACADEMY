import JSZip from "jszip";
import type { SiteKitInput } from "./types";
import { slugProjectName } from "./types";
import { buildRubricDocument } from "./rubric";
import { appendStaticMultipageSite, buildStaticMultipageFiles } from "./static-multipage";
import { appendReactViteApp } from "./react-vite-app";

/** Static multipage file map including rubric (for ZIP parity when deploying). */
export function buildStaticSiteKitFileMap(input: SiteKitInput): Record<string, string> {
  const slug = slugProjectName(input.projectName);
  return {
    ...buildStaticMultipageFiles(input, slug),
    "BUILD-RUBRIC.txt": buildRubricDocument("website"),
  };
}

export async function buildSiteKitArchive(
  input: SiteKitInput,
): Promise<{ buffer: Buffer; filename: string }> {
  const zip = new JSZip();
  const slug = slugProjectName(input.projectName);

  if (input.kitKind === "react-app") {
    appendReactViteApp(zip, input, slug);
  } else {
    appendStaticMultipageSite(zip, input, slug);
  }

  zip.file("BUILD-RUBRIC.txt", buildRubricDocument(input.kitKind));

  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return { buffer, filename: `${slug}-site-kit.zip` };
}
