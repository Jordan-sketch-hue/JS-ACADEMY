import { NextRequest, NextResponse } from "next/server";
import { generateNewsletterContent } from "@/lib/newsletter/content";
import { put, head } from "@vercel/blob";

const CRON_SECRET = process.env.CRON_SECRET!;

// Weekday dates since launch that should have issues
function pastIssueDates(): Date[] {
  const launch = new Date("2026-08-18T00:00:00Z");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const dates: Date[] = [];
  const cursor = new Date(launch);
  while (cursor < today) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      dates.push(new Date(cursor));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // Accept either CRON_SECRET or BLOB_READ_WRITE_TOKEN as auth
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  if (body.secret !== CRON_SECRET && body.secret !== blobToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN not set" }, { status: 500 });
  }

  const batchLimit: number = typeof body.limit === "number" ? body.limit : 5;
  const dates = pastIssueDates();
  const results: { date: string; issue: number; status: string }[] = [];
  let generated = 0;

  for (const date of dates) {
    if (generated >= batchLimit) {
      results.push({ date: "...", issue: -1, status: `stopped — batch limit ${batchLimit} reached` });
      break;
    }
    const launch = new Date("2026-08-18T00:00:00Z");
    const daysSinceLaunch = Math.floor((date.getTime() - launch.getTime()) / 86400000);
    const issueNumber = Math.max(1, daysSinceLaunch + 1);
    const blobKey = `newsletter/issue-${String(issueNumber).padStart(4, "0")}.json`;
    const dateStr = date.toISOString().split("T")[0];

    // Skip if already saved
    try {
      await head(blobKey);
      results.push({ date: dateStr, issue: issueNumber, status: "exists" });
      continue;
    } catch {
      // doesn't exist, generate it
    }

    try {
      const data = await generateNewsletterContent(date);
      await put(
        blobKey,
        JSON.stringify({ ...data, sentAt: new Date(date.getTime() + 11 * 3600000).toISOString(), recipients: null, backfilled: true }),
        { access: "public", contentType: "application/json" }
      );
      results.push({ date: dateStr, issue: issueNumber, status: "saved" });
      generated++;
      // Avoid hammering Anthropic API
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      results.push({ date: dateStr, issue: issueNumber, status: `error: ${err}` });
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
