/**
 * JSM Reel Scheduler — batch post or queue reels for @jsuprememarketing
 *
 * Usage:
 *   node tiktok/schedule-reels.mjs
 *
 * Define your reel queue below. Run with --dry-run to preview without posting.
 * Posts sequentially with a 60-second gap between each to avoid rate limits.
 */

import { getAccessToken } from './token.mjs';

const DRY_RUN = process.argv.includes('--dry-run');

// ── Reel queue — edit this ───────────────────────────────────────────────────
// source: 'url' → video hosted publicly (CDN, Dropbox direct link, etc.)
// source: 'file' → local file path (relative to repo root)

const REELS = [
  {
    name: 'Reel 1 — The Invisible Business (JST)',
    source: 'file',
    path: './videos/reel1-invisible-business.mp4',
    title: `If your business isn't online, your customers are finding someone who is. 🇯🇲

We build real digital presence for Jamaican businesses — no templates, no shortcuts.

Ferguson Law went from zero to fully booked online in 4 weeks.

🔗 Free scope call in bio — no jargon, no pressure.

#JSupremeTech #DigitalJamaica #WebDesignJamaica #JamaicanBusiness #SmallBusinessJamaica #JST`,
    privacy: 'PUBLIC_TO_EVERYONE',
    coverMs: 1000,
  },
  {
    name: 'Reel 2 — The Posting Trap (JSM)',
    source: 'file',
    path: './videos/reel2-posting-trap.mp4',
    title: `Posting every day with nothing to show for it isn't a content problem. It's a strategy problem.

No content calendar. No offer ladder. No follow-up. Just noise.

Our clients average 5× their retainer in 90 days. One generates J$300K+/mo from content we manage for J$55K.

Q3 retainer spots: 2 left. Closes July 31.

🔗 Apply in bio.

#JSupremeMarketing #MarketingJamaica #ContentStrategy #JamaicanBusiness #BrandGrowth #JSM`,
    privacy: 'PUBLIC_TO_EVERYONE',
    coverMs: 2000,
  },
  {
    name: 'Reel 3 — Build It. Grow It. (JST+JSM)',
    source: 'file',
    path: './videos/reel3-build-grow.mp4',
    title: `Two problems. One team.

No digital presence? → J Supreme Tech builds it. Custom sites, apps, booking systems. From J$25K.

Has presence but no conversions? → J Supreme Marketing grows it. Strategy + retainer management. 5× average ROI.

Built for Jamaica. Running the full system.

🔗 Start wherever you are — link in bio.

#JSupreme #JSupremeTech #JSupremeMarketing #DigitalJamaica #JamaicanBusiness #Caribbean #BuildAndGrow`,
    privacy: 'PUBLIC_TO_EVERYONE',
    coverMs: 1500,
  },
];

// ── Posting logic ─────────────────────────────────────────────────────────────

async function postReel(accessToken, reel) {
  const { statSync, createReadStream } = await import('fs');

  const stat = statSync(reel.path);
  const fileSize = stat.size;
  const MAX_CHUNK = 64 * 1024 * 1024;
  const chunkSize = Math.min(fileSize, MAX_CHUNK);
  const totalChunks = Math.ceil(fileSize / MAX_CHUNK);

  const payload = {
    post_info: {
      title: reel.title,
      privacy_level: reel.privacy,
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      video_cover_timestamp_ms: reel.coverMs,
    },
    source_info: {
      source: 'FILE_UPLOAD',
      video_size: fileSize,
      chunk_size: chunkSize,
      total_chunk_count: totalChunks,
    },
  };

  if (DRY_RUN) {
    console.log(`[DRY RUN] ${reel.name}`);
    console.log(`  File: ${reel.path} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);
    console.log(`  Privacy: ${reel.privacy}`);
    console.log(`  Title preview: ${reel.title.slice(0, 80)}...\n`);
    return;
  }

  // Init
  const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });

  const initData = await initRes.json();
  if (initData.error?.code && initData.error.code !== 'ok') {
    throw new Error(`Init failed: ${initData.error.code} — ${initData.error.message}`);
  }

  const { publish_id, upload_url } = initData.data;

  // Upload chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * MAX_CHUNK;
    const end   = Math.min(start + chunkSize - 1, fileSize - 1);
    const size  = end - start + 1;

    const chunks = [];
    await new Promise((res, rej) => {
      const s = createReadStream(reel.path, { start, end: start + size - 1 });
      s.on('data', c => chunks.push(c));
      s.on('end', res);
      s.on('error', rej);
    });

    const buf = Buffer.concat(chunks);
    const putRes = await fetch(upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': String(size),
      },
      body: buf,
    });

    if (!putRes.ok) throw new Error(`Chunk upload HTTP ${putRes.status}`);
  }

  // Poll
  for (let attempt = 0; attempt < 12; attempt++) {
    const statusRes = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id }),
    });

    const statusData = await statusRes.json();
    const status = statusData.data?.status;

    if (status === 'PUBLISH_COMPLETE') {
      console.log(`  ✓ Published (ID: ${publish_id})`);
      return;
    }
    if (status === 'FAILED') {
      throw new Error(`Publish failed: ${statusData.data?.fail_reason}`);
    }

    await new Promise(r => setTimeout(r, 10_000));
  }

  console.log(`  Still processing — ID: ${publish_id}`);
}

(async () => {
  console.log('\n── J Supreme · TikTok Reel Scheduler ──────────────────────');
  if (DRY_RUN) console.log('DRY RUN — no posts will be made\n');

  const accessToken = await getAccessToken();

  for (const reel of REELS) {
    console.log(`\nPosting: ${reel.name}`);
    try {
      await postReel(accessToken, reel);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }

    if (!DRY_RUN && REELS.indexOf(reel) < REELS.length - 1) {
      console.log('  Waiting 60s before next post...');
      await new Promise(r => setTimeout(r, 60_000));
    }
  }

  console.log('\nDone.\n');
})();
