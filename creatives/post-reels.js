#!/usr/bin/env node
// Post reels + stories to JST and JSM Instagram via Meta Graph API
// Requires: MP4 files in creatives/reels/output/

const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TOKEN = process.env.META_ACCESS_TOKEN;
const JST_IG = process.env.JST_INSTAGRAM_ID;
const JSM_IG = process.env.JSM_INSTAGRAM_ID;
const REEL_DIR = path.join(__dirname, 'reels/output');

const REELS = [
  {
    file: 'jst-reel-loss-aversion.mp4',
    ig_id: JST_IG,
    account: 'JST',
    caption: `Every week you don't have a website, someone else gets your customer. 🔴

Your competitor is already online. Taking bookings. Ranking on Google. Getting the DMs you should be getting.

We build real websites and mobile apps for Jamaican businesses.

✅ Websites from US$175
✅ Mobile Apps from US$950
✅ Automation from US$99/mo
✅ Live in 3–5 days
✅ 100+ clients served across Jamaica & the Caribbean

Stop losing. Start closing.

📲 DM us or visit jsupremetech.online

#JST #JSupremeTech #JamaicanBusiness #WebDesignJamaica #DigitalJamaica #TechJamaica #SmallBusinessJamaica #WebsiteJamaica #MobileAppJamaica`,
  },
  {
    file: 'jst-reel-social-proof.mp4',
    ig_id: JST_IG,
    account: 'JST',
    caption: `Your business. Live. Taking bookings. In 3–5 days. 🚀

That's what we do at J Supreme Tech.

No drawn-out process. No surprise invoices. No "we'll get to it next month."

Real builds. Real timelines. Real results.

✅ 100+ clients served
✅ Websites · Apps · Automation
✅ Jamaica & the Caribbean

Ready to go live?

📲 DM us or visit jsupremetech.online

#JST #JSupremeTech #WebDesignJamaica #DigitalTransformation #JamaicanBusiness #TechJamaica #StartupJamaica`,
  },
  {
    file: 'jst-reel-services-overview.mp4',
    ig_id: JST_IG,
    account: 'JST',
    caption: `We build the digital infrastructure that runs your business. ⚙️

Landing Pages · Full Websites · Mobile Apps · Automations · CRMs · Booking Systems

100+ clients across Jamaica & the Caribbean trust J Supreme Tech to build and run their digital operations.

We're not a template shop. We build real systems.

💻 Websites from US$175
📱 Mobile Apps from US$950
🤖 Automation from US$99/mo

Live in 3–5 days.

📲 DM us or visit jsupremetech.online

#JST #JSupremeTech #WebDesign #AppDevelopment #JamaicanBusiness #DigitalJamaica #Automation #TechJamaica`,
  },
  {
    file: 'jsm-reel-content-hook.mp4',
    ig_id: JSM_IG,
    account: 'JSM',
    caption: `You're posting every day. Getting nothing back.

That's not a content problem. That's a strategy problem. 📊

At J Supreme Marketing we build content systems that actually convert — not just fill your feed.

✅ Content Retainer — 16 posts/mo from US$175/mo
✅ Reels Package — 4 reels/mo from US$210/mo
✅ Full Marketing Retainer — content + reels + campaigns from US$450/mo

Our clients generate J$300K+/mo from content we manage for them.

The Full Marketing Retainer pays for itself in week one.

📲 DM us to start

#JSM #JSupremeMarketing #ContentStrategy #SocialMediaJamaica #MarketingJamaica #InstagramMarketing #JamaicanBusiness #ContentCreator #DigitalMarketing`,
  },
  {
    file: 'jsm-reel-automation.mp4',
    ig_id: JSM_IG,
    account: 'JSM',
    caption: `What if your business ran while you slept? 🤖

WhatsApp auto-responders. Booking automation. CRM pipelines. Invoice systems. Social auto-posting. Email sequences. Client onboarding. Reporting dashboards.

8 automation systems. One team. J Supreme Tech.

Starter: US$99/mo
Growth: US$224/mo
Full-Stack: US$399/mo

100+ Jamaican businesses already running on autopilot.

📲 DM us or visit jsupremetech.online

#JST #JSupremeTech #Automation #BusinessAutomation #JamaicanBusiness #WorkSmarter #TechJamaica #WhatsAppAutomation #CRM`,
  },
];

function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', reject);
  });
}

async function postJSON(endpoint, params) {
  const qs = new URLSearchParams({ ...params, access_token: TOKEN }).toString();
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v19.0${endpoint}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(qs);
    req.end();
  });
}

async function createReelContainer(igId, videoPath, caption) {
  const fileSize = fs.statSync(videoPath).size;

  const sessionRes = await postJSON(`/${igId}/media`, {
    media_type: 'REELS',
    upload_type: 'resumable',
    file_size: fileSize,
    caption: caption,
    share_to_feed: 'true',
  });

  console.log('  Session response:', JSON.stringify(sessionRes.body));
  if (sessionRes.body.error) throw new Error(`Session error: ${JSON.stringify(sessionRes.body.error)}`);

  const uploadId = sessionRes.body.video_upload_id;
  const containerId = sessionRes.body.id;

  if (uploadId) {
    const videoData = fs.readFileSync(videoPath);
    await new Promise((resolve, reject) => {
      const options = {
        hostname: 'rupload.facebook.com',
        path: `/video-upload/v19.0/${uploadId}`,
        method: 'POST',
        headers: {
          'Authorization': `OAuth ${TOKEN}`,
          'Content-Type': 'video/mp4',
          'Content-Length': fileSize,
          'file_size': fileSize,
          'file_offset': 0,
        },
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => { console.log(`  Upload (${res.statusCode}):`, data.substring(0, 200)); resolve(); });
      });
      req.on('error', reject);
      req.write(videoData);
      req.end();
    });
  }

  return containerId;
}

async function publishContainer(igId, containerId) {
  let attempts = 0;
  while (attempts < 20) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await apiGet(
      `https://graph.facebook.com/v19.0/${containerId}?fields=status_code,status&access_token=${TOKEN}`
    );
    console.log(`  Status: ${statusRes.body.status_code} — ${statusRes.body.status}`);
    if (statusRes.body.status_code === 'FINISHED' || statusRes.body.status_code === 'READY') break;
    if (statusRes.body.status_code === 'ERROR') throw new Error(`Container error: ${statusRes.body.status}`);
    attempts++;
  }
  return postJSON(`/${igId}/media_publish`, { creation_id: containerId });
}

async function postReel(reel) {
  console.log(`\n📹 Posting reel: ${reel.account} — ${reel.file}`);
  try {
    const containerId = await createReelContainer(reel.ig_id, path.join(REEL_DIR, reel.file), reel.caption);
    if (!containerId) throw new Error('No container ID');
    console.log(`  Container: ${containerId}`);
    const pubRes = await publishContainer(reel.ig_id, containerId);
    console.log(`  Published:`, JSON.stringify(pubRes.body));
    return pubRes.body;
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    return null;
  }
}

async function postStory(reel) {
  console.log(`\n📸 Posting story: ${reel.account} — ${reel.file}`);
  try {
    const videoPath = path.join(REEL_DIR, reel.file);
    const fileSize = fs.statSync(videoPath).size;

    const sessionRes = await postJSON(`/${reel.ig_id}/media`, {
      media_type: 'STORIES',
      upload_type: 'resumable',
      file_size: fileSize,
    });

    console.log('  Story session:', JSON.stringify(sessionRes.body));
    if (sessionRes.body.error) throw new Error(JSON.stringify(sessionRes.body.error));

    const uploadId = sessionRes.body.video_upload_id;
    const containerId = sessionRes.body.id;

    if (uploadId) {
      const videoData = fs.readFileSync(videoPath);
      await new Promise((resolve, reject) => {
        const options = {
          hostname: 'rupload.facebook.com',
          path: `/video-upload/v19.0/${uploadId}`,
          method: 'POST',
          headers: {
            'Authorization': `OAuth ${TOKEN}`,
            'Content-Type': 'video/mp4',
            'Content-Length': fileSize,
            'file_size': fileSize,
            'file_offset': 0,
          },
        };
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => { console.log(`  Story upload (${res.statusCode})`); resolve(); });
        });
        req.on('error', reject);
        req.write(videoData);
        req.end();
      });
    }

    const pubRes = await publishContainer(reel.ig_id, containerId);
    console.log(`  Story published:`, JSON.stringify(pubRes.body));
    return pubRes.body;
  } catch (err) {
    console.error(`  Story ERROR: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 J Supreme — Reel + Story Posting');
  console.log(`Token: ${TOKEN ? TOKEN.substring(0, 20) + '...' : 'MISSING'}`);
  console.log(`JST IG: ${JST_IG} | JSM IG: ${JSM_IG}\n`);

  const results = [];
  for (const reel of REELS) {
    const reelResult = await postReel(reel);
    results.push({ type: 'reel', account: reel.account, file: reel.file, result: reelResult });

    const storyResult = await postStory(reel);
    results.push({ type: 'story', account: reel.account, file: reel.file, result: storyResult });

    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log('\n✅ Done. Summary:');
  results.forEach((r) => {
    const status = r.result?.id ? `✅ ID: ${r.result.id}` : '❌ Failed';
    console.log(`  [${r.type.toUpperCase()}] ${r.account} — ${r.file}: ${status}`);
  });
}

main().catch(console.error);
