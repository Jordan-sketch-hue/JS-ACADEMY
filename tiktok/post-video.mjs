/**
 * TikTok Content Posting API — Video Publisher
 * J Supreme Marketing (@jsuprememarketing)
 *
 * Usage:
 *   node tiktok/post-video.mjs --file ./reel1.mp4 --title "Your hook here"
 *   node tiktok/post-video.mjs --url https://cdn.example.com/reel.mp4 --title "Your hook here"
 *
 * Options:
 *   --file <path>       Local video file to upload (FILE_UPLOAD mode)
 *   --url <url>         Public video URL to pull from (PULL_FROM_URL mode — simpler)
 *   --title <text>      Video caption/title (required)
 *   --privacy <level>   PUBLIC_TO_EVERYONE | SELF_ONLY | MUTUAL_FOLLOW_FRIENDS (default: PUBLIC_TO_EVERYONE)
 *   --cover-ms <ms>     Timestamp in ms for cover thumbnail (default: 1000)
 *   --draft             Post as draft (SELF_ONLY) regardless of --privacy
 *   --dry-run           Print payload, don't actually post
 */

import { createReadStream, statSync } from 'fs';
import { basename } from 'path';
import { getAccessToken } from './token.mjs';

const API = 'https://open.tiktokapis.com/v2';

// ── CLI parsing ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function arg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}
function flag(f) { return args.includes(f); }

const videoFile    = arg('--file');
const videoUrl     = arg('--url');
const title        = arg('--title');
const privacy      = flag('--draft') ? 'SELF_ONLY' : (arg('--privacy') || 'PUBLIC_TO_EVERYONE');
const coverMs      = Number(arg('--cover-ms') || 1000);
const dryRun       = flag('--dry-run');

if (!title) {
  console.error('--title is required');
  process.exit(1);
}

if (!videoFile && !videoUrl) {
  console.error('Provide --file <path> or --url <url>');
  process.exit(1);
}

// ── Post via PULL_FROM_URL ───────────────────────────────────────────────────

async function postFromUrl(accessToken) {
  const payload = {
    post_info: {
      title,
      privacy_level: privacy,
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      video_cover_timestamp_ms: coverMs,
    },
    source_info: {
      source: 'PULL_FROM_URL',
      video_url: videoUrl,
    },
  };

  if (dryRun) {
    console.log('\n[DRY RUN] Would POST to:', `${API}/post/publish/video/init/`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log('Publishing via URL pull...');
  const res = await fetch(`${API}/post/publish/video/init/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (data.error?.code !== 'ok' && data.error?.code !== undefined) {
    throw new Error(`API error: ${data.error.code} — ${data.error.message}`);
  }

  const publishId = data.data?.publish_id;
  console.log(`\n✓ Video submitted. Publish ID: ${publishId}`);
  console.log('Polling status...\n');
  await pollStatus(accessToken, publishId);
}

// ── Post via FILE_UPLOAD ─────────────────────────────────────────────────────

async function postFromFile(accessToken) {
  const stat = statSync(videoFile);
  const fileSize = stat.size;

  // TikTok max chunk size is 64 MB; keep it simple with one chunk if ≤64 MB
  const MAX_CHUNK = 64 * 1024 * 1024;
  const chunkSize = Math.min(fileSize, MAX_CHUNK);
  const totalChunks = Math.ceil(fileSize / MAX_CHUNK);

  const payload = {
    post_info: {
      title,
      privacy_level: privacy,
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      video_cover_timestamp_ms: coverMs,
    },
    source_info: {
      source: 'FILE_UPLOAD',
      video_size: fileSize,
      chunk_size: chunkSize,
      total_chunk_count: totalChunks,
    },
  };

  if (dryRun) {
    console.log('\n[DRY RUN] Would POST to:', `${API}/post/publish/video/init/`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  // Step 1: init upload
  console.log(`Initializing upload for ${basename(videoFile)} (${(fileSize / 1024 / 1024).toFixed(1)} MB)...`);
  const initRes = await fetch(`${API}/post/publish/video/init/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });

  const initData = await initRes.json();
  if (initData.error?.code !== 'ok' && initData.error?.code !== undefined) {
    throw new Error(`Init error: ${initData.error.code} — ${initData.error.message}`);
  }

  const { publish_id, upload_url } = initData.data;
  console.log(`Publish ID: ${publish_id}`);

  // Step 2: upload chunks
  for (let chunk = 0; chunk < totalChunks; chunk++) {
    const start = chunk * MAX_CHUNK;
    const end   = Math.min(start + chunkSize - 1, fileSize - 1);
    const size  = end - start + 1;

    process.stdout.write(`Uploading chunk ${chunk + 1}/${totalChunks} (bytes ${start}–${end})... `);

    const chunkBuffer = await readChunk(videoFile, start, size);

    const uploadRes = await fetch(upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': String(size),
      },
      body: chunkBuffer,
    });

    if (!uploadRes.ok) {
      throw new Error(`Chunk upload failed: HTTP ${uploadRes.status}`);
    }
    console.log('OK');
  }

  console.log('\nUpload complete. Polling publish status...\n');
  await pollStatus(accessToken, publish_id);
}

// ── Read a chunk from a file ──────────────────────────────────────────────────

async function readChunk(filePath, start, size) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = createReadStream(filePath, { start, end: start + size - 1 });
    stream.on('data', c => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

// ── Poll publish status ───────────────────────────────────────────────────────

async function pollStatus(accessToken, publishId, maxAttempts = 12) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API}/post/publish/status/fetch/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id: publishId }),
    });

    const data = await res.json();
    const status = data.data?.status;
    const failReason = data.data?.fail_reason;

    console.log(`Status: ${status}`);

    if (status === 'PUBLISH_COMPLETE') {
      console.log(`\n✓ Video published successfully!`);
      console.log(`  Publish ID: ${publishId}`);
      console.log(`  Check @jsuprememarketing on TikTok.\n`);
      return;
    }

    if (status === 'FAILED') {
      throw new Error(`Publish failed: ${failReason || 'unknown reason'}`);
    }

    // PROCESSING_UPLOAD, SEND_TO_USER_INBOX, etc. — keep waiting
    if (i < maxAttempts - 1) {
      process.stdout.write('  Waiting 10s...\n');
      await new Promise(r => setTimeout(r, 10_000));
    }
  }

  console.log(`\nPublish still processing. Check TikTok dashboard for publish ID: ${publishId}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  try {
    const accessToken = await getAccessToken();

    if (videoUrl) {
      await postFromUrl(accessToken);
    } else {
      await postFromFile(accessToken);
    }
  } catch (err) {
    console.error('\nError:', err.message);
    process.exit(1);
  }
})();
