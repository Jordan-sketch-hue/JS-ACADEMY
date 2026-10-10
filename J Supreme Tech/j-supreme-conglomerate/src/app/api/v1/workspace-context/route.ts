import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { buildWorkspaceContextMarkdown } from "@/lib/workspace/build-context-pack";

function unauthorized(reason: string) {
  return NextResponse.json({ error: reason }, { status: 401 });
}

/**
 * GET /api/v1/workspace-context
 * Exports a Markdown snapshot (CRM, leads, tasks) for use in Cursor, ChatGPT, etc.
 *
 * Optional hardening: set WORKSPACE_CONTEXT_SECRET in the server env, then call with
 *   Authorization: Bearer <WORKSPACE_CONTEXT_SECRET>
 * so anonymous callers cannot scrape your deploy.
 */
export async function GET(req: Request) {
  const secret = process.env.WORKSPACE_CONTEXT_SECRET?.trim();
  let tokenAuthed = false;
  if (secret) {
    const auth = req.headers.get("authorization")?.trim() ?? "";
    if (auth !== `Bearer ${secret}`) {
      return unauthorized(
        "Missing or invalid bearer token. Set Authorization: Bearer to WORKSPACE_CONTEXT_SECRET.",
      );
    }
    tokenAuthed = true;
  }

  // A valid bearer token is itself authorization (external AI, no Clerk session) —
  // pin to the configured workspace owner. Otherwise resolve from the Clerk session.
  let owner = await getOwnerClerkId();
  if (!owner && tokenAuthed) {
    owner = process.env.OS_OWNER_ID?.trim() || process.env.NO_CLERK_OWNER_ID?.trim() || null;
  }
  if (!owner) {
    return unauthorized("No workspace owner resolved. Set OS_OWNER_ID / NO_CLERK_OWNER_ID or sign in.");
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format");

  try {
    const markdown = await buildWorkspaceContextMarkdown(owner);

    if (format === "json") {
      return NextResponse.json({
        owner_clerk_id: owner,
        generated_at: new Date().toISOString(),
        markdown,
      });
    }

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Export failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
