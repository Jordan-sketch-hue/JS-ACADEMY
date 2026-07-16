const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';

const FEED_DIR   = path.join(__dirname, 'feed/output');
const STORY_DIR  = path.join(__dirname, 'stories/output');
const REEL_DIR   = path.join(__dirname, 'reels/output');
const HTML_DIR   = path.join(__dirname, 'html');

[FEED_DIR, STORY_DIR, REEL_DIR, HTML_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

// ─── BRAND TOKENS ────────────────────────────────────────────────────────────
const B = {
  black:      '#0A0A0A',
  gold:       '#C9A84C',
  white:      '#F5F5F0',
  goldDim:    'rgba(201,168,76,0.15)',
  goldBorder: 'rgba(201,168,76,0.35)',
  whiteDim:   'rgba(245,245,240,0.55)',
  whiteFaint: 'rgba(245,245,240,0.3)',
};

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`;

function head(W, H, extra = '') {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
${FONT}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:${B.black};
     font-family:'Space Grotesk',sans-serif;overflow:hidden;position:relative;color:${B.white}}
${extra}
</style></head><body>`;
}

const divider = (top, mx = 60) =>
  `<div style="position:absolute;top:${top}px;left:${mx}px;right:${mx}px;height:1px;
    background:linear-gradient(90deg,transparent,${B.gold} 30%,${B.gold} 70%,transparent)"></div>`;

const chip = (text, top, left) =>
  `<div style="position:absolute;top:${top}px;left:${left}px;
    display:inline-block;border:1px solid ${B.goldBorder};background:${B.goldDim};
    color:${B.gold};font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
    padding:6px 16px;border-radius:4px">${text}</div>`;

const logo = (brand = 'JST', size = 22) =>
  `<span style="font-size:${size}px;font-weight:700;color:${B.gold};letter-spacing:.04em">
    ${brand === 'JST'
      ? `J<span style="color:${B.white}">ST</span>`
      : `J<span style="color:${B.white}">SM</span>`}
  </span>`;

// ─── FEED POSTS ──────────────────────────────────────────────────────────────

function jstFeedPricing() {
  const W = 1080, H = 1080;
  const tiers = [
    { name: 'BASIC',      price: 'US$175', label: 'Landing Page / 5-Page Site', highlight: false },
    { name: 'PRO',        price: 'US$350', label: '10-Page Site + Full SEO',     highlight: true  },
    { name: 'ENTERPRISE', price: 'US$950', label: 'Mobile App — Full Build',     highlight: false },
  ];
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 20%,rgba(201,168,76,.08) 0%,transparent 65%)"></div>
  ${chip('J Supreme Technology', 52, 60)}
  <div style="position:absolute;top:130px;left:60px;right:60px;font-size:62px;font-weight:700;line-height:1.0;letter-spacing:-.025em">
    What does a real<br>website cost?
  </div>
  <div style="position:absolute;top:290px;left:60px;right:60px;font-size:18px;color:${B.whiteDim};line-height:1.4">
    Real prices. No hidden fees. No surprise invoices.
  </div>
  <div style="position:absolute;top:355px;left:60px;right:60px;display:flex;flex-direction:column;gap:16px">
  ${tiers.map(t => `
    <div style="border:1px solid ${t.highlight ? B.gold : 'rgba(245,245,240,0.1)'};
      background:${t.highlight ? 'rgba(201,168,76,.09)' : 'rgba(245,245,240,0.03)'};
      border-radius:10px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;color:${t.highlight ? B.gold : B.whiteDim};margin-bottom:4px">${t.name}</div>
        <div style="font-size:18px;color:${B.white}">${t.label}</div>
      </div>
      <div style="font-size:32px;font-weight:700;color:${t.highlight ? B.gold : B.white};font-variant-numeric:tabular-nums">${t.price}</div>
    </div>`).join('')}
  </div>
  ${divider(750)}
  <div style="position:absolute;top:778px;left:60px;right:60px;display:flex;gap:40px">
    <div>
      <div style="font-size:11px;font-weight:600;color:${B.gold};letter-spacing:.12em;margin-bottom:4px">TIMELINE</div>
      <div style="font-size:18px;color:${B.whiteDim}">Ready in 3–5 days</div>
    </div>
    <div>
      <div style="font-size:11px;font-weight:600;color:${B.gold};letter-spacing:.12em;margin-bottom:4px">COVERAGE</div>
      <div style="font-size:18px;color:${B.whiteDim}">Jamaica · Caribbean</div>
    </div>
    <div>
      <div style="font-size:11px;font-weight:600;color:${B.gold};letter-spacing:.12em;margin-bottom:4px">CLIENTS</div>
      <div style="font-size:18px;color:${B.whiteDim}">100+ served</div>
    </div>
  </div>
  <div style="position:absolute;bottom:52px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center">
    ${logo('JST', 22)}
    <div style="font-size:15px;color:${B.whiteFaint}">jsupremetech.online</div>
  </div>
  </body></html>`;
}

function jstFeedClientResult() {
  const W = 1080, H = 1080;
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 20% 20%,rgba(201,168,76,.07) 0%,transparent 60%)"></div>
  ${chip('Client Result', 60, 60)}
  <div style="position:absolute;top:155px;left:60px;right:60px">
    <div style="font-size:24px;color:${B.whiteDim};margin-bottom:16px">Your Business — Kingston, JA</div>
    <div style="font-size:80px;font-weight:700;line-height:1;letter-spacing:-.02em">
      Your business,<br><span style="color:${B.gold}">ready to sell</span><br>in 3–5 days.
    </div>
  </div>
  ${divider(540)}
  <div style="position:absolute;top:570px;left:60px;right:60px;display:flex;flex-direction:column;gap:18px">
    ${[['Before','No website. Clients called the office or walked in.'],
       ['After', 'Fully booked online. Intake form. Auto-confirmations.'],
       ['Build', 'Pro Website + Booking Automation — US$449 total.']
    ].map(([label, text]) => `
      <div style="display:flex;gap:20px;align-items:flex-start">
        <div style="font-size:13px;font-weight:600;color:${B.gold};letter-spacing:.1em;min-width:70px;padding-top:3px">${label}</div>
        <div style="font-size:20px;color:${B.whiteDim};line-height:1.4">${text}</div>
      </div>`).join('')}
  </div>
  <div style="position:absolute;bottom:60px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center">
    ${logo('JST', 22)}
    <div style="font-size:15px;color:${B.whiteFaint}">jsupremetech.online</div>
  </div>
  </body></html>`;
}

function jsmFeedServices() {
  const W = 1080, H = 1080;
  const services = [
    { name: 'Brand Identity Build',        price: 'US$325', freq: 'once', highlight: false },
    { name: 'Social Media Management',     price: 'US$175', freq: '/mo',  highlight: false },
    { name: 'Content Retainer (16 posts)', price: 'US$175', freq: '/mo',  highlight: false },
    { name: 'Reels Package (4/mo)',         price: 'US$210', freq: '/mo',  highlight: false },
    { name: 'Full Marketing Retainer',      price: 'US$450', freq: '/mo',  highlight: true  },
  ];
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 65% 20%,rgba(201,168,76,.08) 0%,transparent 65%)"></div>
  ${chip('J Supreme Marketing', 52, 60)}
  <div style="position:absolute;top:130px;left:60px;right:60px">
    <div style="font-size:46px;font-weight:700;line-height:1.05;letter-spacing:-.02em">
      You're posting every day.<br><span style="color:${B.gold}">Getting nothing back.</span>
    </div>
    <div style="font-size:17px;color:${B.whiteDim};margin-top:10px">That's a strategy problem. Here's what changes it:</div>
  </div>
  <div style="position:absolute;top:300px;left:60px;right:60px;display:flex;flex-direction:column;gap:10px">
  ${services.map(s => `
    <div style="border:1px solid ${s.highlight ? B.gold : 'rgba(245,245,240,0.1)'};
      background:${s.highlight ? 'rgba(201,168,76,.09)' : 'rgba(245,245,240,0.03)'};
      border-radius:9px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:16px;font-weight:${s.highlight?'600':'400'};color:${s.highlight?B.white:B.whiteDim}">${s.name}</div>
      <div style="font-size:20px;font-weight:700;color:${s.highlight?B.gold:B.white};font-variant-numeric:tabular-nums">
        ${s.price}<span style="font-size:13px;font-weight:400;color:${B.whiteFaint}">${s.freq}</span>
      </div>
    </div>`).join('')}
  </div>
  ${divider(770)}
  <div style="position:absolute;top:796px;left:60px;right:60px">
    <div style="font-size:20px;font-weight:700;color:${B.white}">Our clients generate <span style="color:${B.gold}">J$300K+/mo</span> from content we manage for J$55K.</div>
    <div style="font-size:14px;color:${B.whiteDim};margin-top:6px">Full Marketing Retainer pays for itself in week one.</div>
  </div>
  <div style="position:absolute;bottom:52px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center">
    ${logo('JSM', 22)}
    <div style="font-size:15px;color:${B.whiteFaint}">DM to start</div>
  </div>
  </body></html>`;
}

function jsmFeedRevenueReframe() {
  const W = 1080, H = 1080;
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 90%,rgba(201,168,76,.1) 0%,transparent 60%)"></div>
  ${chip('Value Reframe', 52, 60)}
  <div style="position:absolute;top:130px;left:60px;right:60px;font-size:72px;font-weight:700;line-height:1;letter-spacing:-.02em">
    Our clients generate<br><span style="color:${B.gold}">J$300K+/mo</span><br>from content we<br>manage for J$55K.
  </div>
  ${divider(610)}
  <div style="position:absolute;top:636px;left:60px;right:60px;font-size:22px;color:${B.whiteDim};line-height:1.5">
    The Full Marketing Retainer pays for itself in week one.
  </div>
  <div style="position:absolute;bottom:52px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center">
    ${logo('JSM', 22)}
    <div style="font-size:15px;color:${B.whiteFaint}">DM to start</div>
  </div>
  </body></html>`;
}

// ─── STORY POSTS ──────────────────────────────────────────────────────────────

function jstStoryScarcity() {
  const W = 1080, H = 1920;
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(201,168,76,.11) 0%,transparent 65%)"></div>
  <div style="position:absolute;top:120px;left:60px">${logo('JST', 28)}</div>
  ${chip('J Supreme Technology', 220, 60)}
  <div style="position:absolute;top:320px;left:60px;right:60px;font-size:100px;font-weight:700;line-height:.93;letter-spacing:-.03em">
    Every week<br>you're offline,<br>someone gets<br><span style="color:${B.gold}">your client.</span>
  </div>
  ${divider(820)}
  <div style="position:absolute;top:860px;left:60px;right:60px;font-size:28px;color:${B.whiteDim};line-height:1.5">
    Your competitor is already online. Taking bookings. Ranking on Google. Getting the DMs you should be getting.
  </div>
  <div style="position:absolute;top:1120px;left:60px;right:60px;display:flex;flex-direction:column;gap:16px">
    ${[['Website','From US$175'],['Mobile App','From US$950'],['Automation','From US$99/mo']].map(([s,p]) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid rgba(245,245,240,0.08)">
      <div style="font-size:24px;color:${B.whiteDim}">${s}</div>
      <div style="font-size:26px;font-weight:600;color:${B.white}">${p}</div>
    </div>`).join('')}
  </div>
  <div style="position:absolute;top:1470px;left:60px;right:60px;background:${B.gold};border-radius:12px;padding:32px;text-align:center">
    <div style="font-size:26px;font-weight:700;color:${B.black}">Start today</div>
    <div style="font-size:17px;color:rgba(10,10,10,.7);margin-top:8px">jsupremetech.online · DM us</div>
  </div>
  <div style="position:absolute;bottom:80px;left:0;right:0;text-align:center;font-size:17px;color:${B.whiteFaint}">
    J Supreme Technology · Jamaica · Caribbean
  </div>
  </body></html>`;
}

function jstStoryCTA() {
  const W = 1080, H = 1920;
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(201,168,76,.07) 0%,transparent 50%)"></div>
  <div style="position:absolute;top:120px;left:60px">${logo('JST', 28)}</div>
  <div style="position:absolute;top:260px;left:60px;right:60px">
    <div style="font-size:38px;color:${B.whiteDim};margin-bottom:24px">Every week without a website —</div>
    <div style="font-size:100px;font-weight:700;line-height:.95;letter-spacing:-.03em">
      someone else gets<br><span style="color:${B.gold}">your customer.</span>
    </div>
  </div>
  ${divider(780)}
  <div style="position:absolute;top:820px;left:60px;right:60px">
    ${[['Website','From US$175'],['Mobile App','From US$950'],['Automation','From US$99/mo']].map(([s,p]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:1px solid rgba(245,245,240,0.08)">
        <div style="font-size:24px;color:${B.whiteDim}">${s}</div>
        <div style="font-size:26px;font-weight:600;color:${B.white}">${p}</div>
      </div>`).join('')}
  </div>
  <div style="position:absolute;top:1200px;left:60px;right:60px;border:1px solid ${B.gold};border-radius:12px;padding:32px;text-align:center">
    <div style="font-size:26px;font-weight:600;color:${B.gold}">jsupremetech.online</div>
    <div style="font-size:18px;color:${B.whiteDim};margin-top:10px">Build · Launch · Grow</div>
  </div>
  <div style="position:absolute;bottom:80px;left:0;right:0;text-align:center;font-size:18px;color:${B.whiteFaint}">
    J Supreme Technology · Jamaica
  </div>
  </body></html>`;
}

function jsmStoryRetainer() {
  const W = 1080, H = 1920;
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(201,168,76,.1) 0%,transparent 65%)"></div>
  <div style="position:absolute;top:120px;left:60px">${logo('JSM', 28)}</div>
  ${chip('Q3 Retainer Offer', 240, 60)}
  <div style="position:absolute;top:340px;left:60px;right:60px;font-size:96px;font-weight:700;line-height:.95;letter-spacing:-.03em">
    Full stack<br>marketing<br>for <span style="color:${B.gold}">US$450/mo.</span>
  </div>
  ${divider(820)}
  <div style="position:absolute;top:860px;left:60px;right:60px;font-size:28px;color:${B.whiteDim}">What's included:</div>
  <div style="position:absolute;top:920px;left:60px;right:60px;display:flex;flex-direction:column;gap:16px">
    ${['16 feed posts / month','4 reels / month','Story content + engagement','Campaign strategy + planning','Monthly performance report'].map(item => `
      <div style="display:flex;align-items:center;gap:20px">
        <div style="width:8px;height:8px;background:${B.gold};border-radius:50%;flex-shrink:0"></div>
        <div style="font-size:26px;color:${B.white}">${item}</div>
      </div>`).join('')}
  </div>
  <div style="position:absolute;top:1380px;left:60px;right:60px;background:${B.gold};border-radius:12px;padding:32px;text-align:center">
    <div style="font-size:22px;font-weight:700;color:${B.black}">Spots close July 31</div>
    <div style="font-size:18px;color:rgba(10,10,10,.7);margin-top:8px">DM to lock in your rate</div>
  </div>
  <div style="position:absolute;bottom:80px;left:0;right:0;text-align:center;font-size:18px;color:${B.whiteFaint}">
    J Supreme Marketing · Jamaica · Caribbean
  </div>
  </body></html>`;
}

function jsmStoryPoll() {
  const W = 1080, H = 1920;
  return head(W, H) + `
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(201,168,76,.06) 0%,transparent 40%)"></div>
  <div style="position:absolute;top:120px;left:60px">${logo('JSM', 28)}</div>
  <div style="position:absolute;top:260px;left:60px;right:60px;font-size:80px;font-weight:700;line-height:1;letter-spacing:-.02em">
    Biggest content struggle?
  </div>
  ${divider(550)}
  <div style="position:absolute;top:590px;left:60px;right:60px;display:flex;flex-direction:column;gap:28px">
    ${[['A',"No time to create"],['B',"Don't know what to post"],['C',"Posting but no engagement"],['D',"Followers but no sales"]].map(([letter,label]) => `
      <div style="border:1px solid rgba(245,245,240,0.12);border-radius:12px;padding:28px 32px;display:flex;align-items:center;gap:24px">
        <div style="width:52px;height:52px;border-radius:50%;border:1px solid ${B.goldBorder};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:${B.gold};flex-shrink:0">${letter}</div>
        <div style="font-size:26px;color:${B.white}">${label}</div>
      </div>`).join('')}
  </div>
  <div style="position:absolute;top:1450px;left:60px;right:60px;font-size:26px;color:${B.whiteDim};text-align:center;line-height:1.5">
    Comment your answer below.<br>We'll DM you a free fix for it.
  </div>
  <div style="position:absolute;bottom:80px;left:0;right:0;text-align:center;font-size:18px;color:${B.whiteFaint}">
    J Supreme Marketing
  </div>
  </body></html>`;
}

// ─── REELS ────────────────────────────────────────────────────────────────────

function jstReelLossAversion(frame, totalFrames) {
  const W = 1080, H = 1920;
  const p = frame / totalFrames;
  const fade = (s, e) => Math.min(1, Math.max(0, (p - s) / (e - s)));
  const slideUp = (f) => `opacity:${f};transform:translateY(${(1-f)*40}px)`;

  const s0  = fade(0,    0.12);
  const s1a = fade(0.18, 0.27);
  const s1b = fade(0.30, 0.39);
  const s1c = fade(0.42, 0.51);
  const s2  = fade(0.55, 0.68);
  const s3  = fade(0.82, 0.92);

  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(201,168,76,.1) 0%,transparent 60%)"></div>
  <div style="position:absolute;top:120px;left:60px;${slideUp(s0)}">${logo('JST', 26)}</div>
  <div style="position:absolute;top:260px;left:60px;right:60px;${slideUp(s0)}">
    <div style="font-size:34px;color:${B.whiteDim};margin-bottom:20px">Every week without a website —</div>
    <div style="font-size:108px;font-weight:700;line-height:.92;letter-spacing:-.03em">
      someone else gets<br><span style="color:${B.gold}">your customer.</span>
    </div>
  </div>
  <div style="position:absolute;top:760px;left:60px;right:60px;height:1px;
    background:linear-gradient(90deg,transparent,${B.gold} 30%,${B.gold} 70%,transparent);
    opacity:${fade(0.13,0.18)}"></div>
  <div style="position:absolute;top:800px;left:60px;right:60px;display:flex;flex-direction:column;gap:28px">
    ${[[s1a,"Your competitor is online. You're not."],[s1b,"Every search, every click — they're getting it."],[s1c,"Your product is real. Your digital presence isn't."]].map(([f,text]) => `
      <div style="${slideUp(f)};display:flex;gap:20px;align-items:flex-start">
        <div style="width:8px;height:8px;background:${B.gold};border-radius:50%;margin-top:16px;flex-shrink:0"></div>
        <div style="font-size:30px;color:${B.whiteDim};line-height:1.4">${text}</div>
      </div>`).join('')}
  </div>
  <div style="position:absolute;top:1220px;left:60px;right:60px;${slideUp(s2)}">
    <div style="font-size:72px;font-weight:700;line-height:1;letter-spacing:-.02em">
      We fix that.<br><span style="color:${B.gold}">From US$175.</span>
    </div>
  </div>
  <div style="position:absolute;top:1500px;left:60px;right:60px;${slideUp(s3)}">
    <div style="background:${B.gold};border-radius:14px;padding:34px;text-align:center">
      <div style="font-size:28px;font-weight:700;color:${B.black}">jsupremetech.online</div>
      <div style="font-size:18px;color:rgba(10,10,10,.65);margin-top:8px">J Supreme Technology · Jamaica</div>
    </div>
  </div>
  <div style="position:absolute;bottom:70px;left:0;right:0;text-align:center;font-size:16px;color:${B.whiteFaint};opacity:${fade(0.88,0.95)}">
    @jsupremetek · @jsuprememarketingja
  </div>
  </body></html>`;
}

function jsmReelContentHook(frame, totalFrames) {
  const W = 1080, H = 1920;
  const p = frame / totalFrames;
  const fade = (s, e) => Math.min(1, Math.max(0, (p - s) / (e - s)));
  const slideUp = (f) => `opacity:${f};transform:translateY(${(1-f)*40}px)`;

  const s0  = fade(0,    0.12);
  const s1a = fade(0.18, 0.27);
  const s1b = fade(0.30, 0.39);
  const s1c = fade(0.42, 0.51);
  const s2  = fade(0.58, 0.70);
  const s3  = fade(0.82, 0.92);

  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(201,168,76,.09) 0%,transparent 65%)"></div>
  <div style="position:absolute;top:120px;left:60px;${slideUp(s0)}">${logo('JSM', 26)}</div>
  <div style="position:absolute;top:260px;left:60px;right:60px;${slideUp(s0)}">
    <div style="font-size:36px;color:${B.whiteDim};margin-bottom:16px">You're posting every day.</div>
    <div style="font-size:108px;font-weight:700;line-height:.92;letter-spacing:-.03em">
      Getting<br><span style="color:${B.gold}">nothing</span><br>back.
    </div>
  </div>
  <div style="position:absolute;top:740px;left:60px;right:60px;height:1px;
    background:linear-gradient(90deg,transparent,${B.gold} 30%,${B.gold} 70%,transparent);
    opacity:${fade(0.13,0.18)}"></div>
  <div style="position:absolute;top:780px;left:60px;right:60px;display:flex;flex-direction:column;gap:28px">
    ${[[s1a,"No strategy behind the post."],[s1b,"No hook. No CTA. No system."],[s1c,"Content without conversion is just noise."]].map(([f,text]) => `
      <div style="${slideUp(f)};display:flex;gap:20px;align-items:flex-start">
        <div style="width:8px;height:8px;background:${B.gold};border-radius:50%;margin-top:14px;flex-shrink:0"></div>
        <div style="font-size:30px;color:${B.whiteDim};line-height:1.4">${text}</div>
      </div>`).join('')}
  </div>
  <div style="position:absolute;top:1180px;left:60px;right:60px;${slideUp(s2)}">
    <div style="font-size:60px;font-weight:700;line-height:1.05;letter-spacing:-.02em">
      That's what<br><span style="color:${B.gold}">J Supreme Marketing</span><br>is built to fix.
    </div>
  </div>
  <div style="position:absolute;top:1520px;left:60px;right:60px;${slideUp(s3)}">
    <div style="background:${B.gold};border-radius:14px;padding:34px;text-align:center">
      <div style="font-size:26px;font-weight:700;color:${B.black}">Full retainer from US$175/mo</div>
      <div style="font-size:18px;color:rgba(10,10,10,.65);margin-top:8px">DM to start · Q3 spots limited</div>
    </div>
  </div>
  <div style="position:absolute;bottom:70px;left:0;right:0;text-align:center;font-size:16px;color:${B.whiteFaint};opacity:${fade(0.88,0.95)}">
    @jsupremetek · @jsuprememarketingja
  </div>
  </body></html>`;
}

// ─── REEL: JST SOCIAL PROOF ─────────────────────────────────────────

function jstReelSocialProof(frame, totalFrames) {
  const W = 1080, H = 1920;
  const p = frame / totalFrames;
  const fade = (s, e) => Math.min(1, Math.max(0, (p - s) / (e - s)));
  const slideUp = (f) => `opacity:${f};transform:translateY(${(1-f)*40}px)`;

  const s0  = fade(0,    0.12);
  const s1  = fade(0.16, 0.26);
  const s2a = fade(0.30, 0.40);
  const s2b = fade(0.42, 0.52);
  const s2c = fade(0.54, 0.63);
  const s3  = fade(0.68, 0.80);
  const s4  = fade(0.84, 0.94);

  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(201,168,76,.1) 0%,transparent 65%)"></div>
  <div style="position:absolute;top:120px;left:60px;${slideUp(s0)}">${logo('JST', 26)}</div>

  <div style="position:absolute;top:240px;left:60px;right:60px;${slideUp(s0)}">
    <div style="font-size:24px;color:${B.gold};letter-spacing:.12em;font-weight:600;text-transform:uppercase;margin-bottom:16px">Client Result</div>
    <div style="font-size:96px;font-weight:700;line-height:.92;letter-spacing:-.03em">
      Your Business<br><span style="color:${B.gold}">went live.</span><br>In 3–5 days.
    </div>
  </div>

  <div style="position:absolute;top:700px;left:60px;right:60px;height:1px;
    background:linear-gradient(90deg,transparent,${B.gold} 30%,${B.gold} 70%,transparent);
    opacity:${fade(0.13,0.18)}"></div>

  <div style="position:absolute;top:730px;left:60px;right:60px;${slideUp(s1)}">
    <div style="font-size:26px;color:${B.whiteDim};line-height:1.5">
      No website. No online presence. No leads.<br>We had them live and taking bookings in 3–5 days.
    </div>
  </div>

  <div style="position:absolute;top:930px;left:60px;right:60px;display:flex;flex-direction:column;gap:22px">
    ${[[s2a,'#','Pro Website — 10 pages + SEO'],[s2b,'#','Online intake form + auto-confirmations'],[s2c,'#','Booking automation — zero manual follow-up']].map(([f,,text]) => `
      <div style="${slideUp(f)};display:flex;gap:20px;align-items:flex-start">
        <div style="width:8px;height:8px;background:${B.gold};border-radius:50%;margin-top:16px;flex-shrink:0"></div>
        <div style="font-size:28px;color:${B.whiteDim};line-height:1.4">${text}</div>
      </div>`).join('')}
  </div>

  <div style="position:absolute;top:1280px;left:60px;right:60px;${slideUp(s3)}">
    <div style="border:1px solid ${B.goldBorder};background:${B.goldDim};border-radius:14px;padding:36px">
      <div style="font-size:22px;color:${B.gold};letter-spacing:.1em;font-weight:600;margin-bottom:10px">TOTAL INVESTMENT</div>
      <div style="font-size:64px;font-weight:700;color:${B.white}">US$449</div>
      <div style="font-size:22px;color:${B.whiteDim};margin-top:8px">Website + Booking Automation</div>
    </div>
  </div>

  <div style="position:absolute;top:1580px;left:60px;right:60px;${slideUp(s4)}">
    <div style="background:${B.gold};border-radius:14px;padding:34px;text-align:center">
      <div style="font-size:26px;font-weight:700;color:${B.black}">Your business is next.</div>
      <div style="font-size:20px;color:rgba(10,10,10,.7);margin-top:10px">jsupremetech.online</div>
    </div>
  </div>
  <div style="position:absolute;bottom:70px;left:0;right:0;text-align:center;font-size:16px;color:${B.whiteFaint};opacity:${fade(0.90,0.96)}">
    J Supreme Technology · Jamaica · Caribbean
  </div>
  </body></html>`;
}

// ─── REEL: JST SERVICES OVERVIEW ─────────────────────────────────────────────────

function jstReelServicesOverview(frame, totalFrames) {
  const W = 1080, H = 1920;
  const p = frame / totalFrames;
  const fade = (s, e) => Math.min(1, Math.max(0, (p - s) / (e - s)));
  const slideUp = (f) => `opacity:${f};transform:translateY(${(1-f)*36}px)`;

  const s0  = fade(0,    0.10);
  const s1  = fade(0.14, 0.22);
  const r1  = fade(0.24, 0.32);
  const r2  = fade(0.34, 0.42);
  const r3  = fade(0.44, 0.52);
  const r4  = fade(0.54, 0.62);
  const r5  = fade(0.64, 0.72);
  const s3  = fade(0.76, 0.86);
  const s4  = fade(0.88, 0.96);

  const rows = [
    [r1, 'Landing Page',          'US$175'],
    [r2, 'Pro Website (10 pages)', 'US$350'],
    [r3, 'Mobile App',             'US$950'],
    [r4, 'Automation — Starter',   'US$99/mo'],
    [r5, 'Automation — Growth',    'US$224/mo'],
  ];

  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 20%,rgba(201,168,76,.08) 0%,transparent 60%)"></div>
  <div style="position:absolute;top:120px;left:60px;${slideUp(s0)}">${logo('JST', 26)}</div>

  <div style="position:absolute;top:230px;left:60px;right:60px;${slideUp(s0)}">
    <div style="font-size:28px;color:${B.whiteDim};margin-bottom:18px">One studio.</div>
    <div style="font-size:96px;font-weight:700;line-height:.92;letter-spacing:-.03em">
      Everything<br>your business<br>needs <span style="color:${B.gold}">online.</span>
    </div>
  </div>

  <div style="position:absolute;top:680px;left:60px;right:60px;height:1px;
    background:linear-gradient(90deg,transparent,${B.gold} 30%,${B.gold} 70%,transparent);
    opacity:${fade(0.13,0.18)}"></div>

  <div style="position:absolute;top:700px;left:60px;right:60px;${slideUp(s1)}">
    <div style="font-size:20px;color:${B.gold};font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:18px">What we build</div>
  </div>

  <div style="position:absolute;top:760px;left:60px;right:60px;display:flex;flex-direction:column;gap:20px">
    ${rows.map(([f, name, price]) => `
      <div style="${slideUp(f)};display:flex;justify-content:space-between;align-items:center;
        border-bottom:1px solid rgba(245,245,240,0.08);padding-bottom:20px">
        <div style="font-size:26px;color:${B.whiteDim}">${name}</div>
        <div style="font-size:28px;font-weight:700;color:${B.white}">${price}</div>
      </div>`).join('')}
  </div>

  <div style="position:absolute;top:1390px;left:60px;right:60px;${slideUp(s3)}">
    <div style="font-size:48px;font-weight:700;line-height:1.05;letter-spacing:-.02em">
      <span style='color:${B.gold}'>100+ clients</span><br>served across<br>Jamaica & the Caribbean.
    </div>
  </div>

  <div style="position:absolute;top:1630px;left:60px;right:60px;${slideUp(s4)}">
    <div style="background:${B.gold};border-radius:14px;padding:34px;text-align:center">
      <div style="font-size:26px;font-weight:700;color:${B.black}">jsupremetech.online</div>
      <div style="font-size:18px;color:rgba(10,10,10,.65);margin-top:8px">Build · Launch · Automate</div>
    </div>
  </div>
  <div style="position:absolute;bottom:70px;left:0;right:0;text-align:center;font-size:16px;color:${B.whiteFaint};opacity:${fade(0.90,0.96)}">
    @jsupremetek · Jamaica · Caribbean
  </div>
  </body></html>`;
}

// ─── REEL: JSM AUTOMATION PITCH ──────────────────────────────────────────────────

function jsmReelAutomation(frame, totalFrames) {
  const W = 1080, H = 1920;
  const p = frame / totalFrames;
  const fade = (s, e) => Math.min(1, Math.max(0, (p - s) / (e - s)));
  const slideUp = (f) => `opacity:${f};transform:translateY(${(1-f)*40}px)`;

  const s0  = fade(0,    0.12);
  const s1a = fade(0.16, 0.26);
  const s1b = fade(0.28, 0.38);
  const s1c = fade(0.40, 0.50);
  const s2  = fade(0.54, 0.66);
  const s3a = fade(0.68, 0.76);
  const s3b = fade(0.76, 0.84);
  const s4  = fade(0.86, 0.95);

  return head(W, H) + `
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(201,168,76,.09) 0%,transparent 65%)"></div>
  <div style="position:absolute;top:120px;left:60px;${slideUp(s0)}">${logo('JST', 26)}</div>

  <div style="position:absolute;top:240px;left:60px;right:60px;${slideUp(s0)}">
    <div style="font-size:28px;color:${B.whiteDim};margin-bottom:16px">You're still doing this manually?</div>
    <div style="font-size:96px;font-weight:700;line-height:.92;letter-spacing:-.03em">
      Automate it.<br><span style="color:${B.gold}">From US$99/mo.</span>
    </div>
  </div>

  <div style="position:absolute;top:710px;left:60px;right:60px;height:1px;
    background:linear-gradient(90deg,transparent,${B.gold} 30%,${B.gold} 70%,transparent);
    opacity:${fade(0.13,0.18)}"></div>

  <div style="position:absolute;top:750px;left:60px;right:60px;display:flex;flex-direction:column;gap:24px">
    ${[[s1a,'WhatsApp auto-responder + lead capture'],[s1b,'Booking & appointment automation'],[s1c,'CRM pipeline + follow-up sequences']].map(([f,text]) => `
      <div style="${slideUp(f)};display:flex;gap:20px;align-items:flex-start">
        <div style="width:8px;height:8px;background:${B.gold};border-radius:50%;margin-top:16px;flex-shrink:0"></div>
        <div style="font-size:28px;color:${B.whiteDim};line-height:1.4">${text}</div>
      </div>`).join('')}
  </div>

  <div style="position:absolute;top:1130px;left:60px;right:60px;${slideUp(s2)}">
    <div style="font-size:56px;font-weight:700;line-height:1.05;letter-spacing:-.02em">
      Stop chasing leads.<br><span style="color:${B.gold}">Let the system do it.</span>
    </div>
  </div>

  <div style="position:absolute;top:1400px;left:60px;right:60px;display:flex;flex-direction:column;gap:20px">
    <div style="${slideUp(s3a)};border:1px solid rgba(245,245,240,0.1);border-radius:12px;padding:28px 32px;display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:22px;color:${B.whiteDim}">Starter</div>
      <div style="font-size:32px;font-weight:700;color:${B.white}">US$99<span style="font-size:18px;color:${B.whiteFaint}">/mo</span></div>
    </div>
    <div style="${slideUp(s3b)};border:1px solid ${B.gold};background:${B.goldDim};border-radius:12px;padding:28px 32px;display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:22px;color:${B.white};font-weight:600">Growth</div>
      <div style="font-size:32px;font-weight:700;color:${B.gold}">US$224<span style="font-size:18px;color:${B.whiteFaint}">/mo</span></div>
    </div>
  </div>

  <div style="position:absolute;top:1670px;left:60px;right:60px;${slideUp(s4)}">
    <div style="background:${B.gold};border-radius:14px;padding:30px;text-align:center">
      <div style="font-size:24px;font-weight:700;color:${B.black}">DM us to automate your business</div>
      <div style="font-size:18px;color:rgba(10,10,10,.65);margin-top:8px">jsupremetech.online</div>
    </div>
  </div>
  <div style="position:absolute;bottom:70px;left:0;right:0;text-align:center;font-size:16px;color:${B.whiteFaint};opacity:${fade(0.90,0.96)}">
    J Supreme Technology · Jamaica · Caribbean
  </div>
  </body></html>`;
}

// ─── RENDERER ────────────────────────────────────────────────────────────────

async function renderStill(html, outPath) {
  const isPortrait = outPath.includes('story') || outPath.includes('9x16');
  const W = 1080, H = isPortrait ? 1920 : 1080;
  const b = await puppeteer.launch({
    executablePath: CHROMIUM, headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox',`--window-size=${W},${H}`],
  });
  const page = await b.newPage();
  await page.setViewport({ width: W, height: H });
  await page.setContent(html, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 95 });
  await b.close();
  console.log(`  ✓ ${path.basename(outPath)} (${Math.round(fs.statSync(outPath).size/1024)}KB)`);
}

async function renderReel(htmlFn, outPath, durationSec = 9) {
  const fps = 30, totalFrames = durationSec * fps;
  const W = 1080, H = 1920;
  console.log(`  Rendering ${totalFrames} frames for ${path.basename(outPath)}...`);
  const b = await puppeteer.launch({
    executablePath: CHROMIUM, headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox',`--window-size=${W},${H}`],
  });
  const page = await b.newPage();
  await page.setViewport({ width: W, height: H });
  const frames = [];
  for (let f = 0; f < totalFrames; f++) {
    await page.setContent(htmlFn(f, totalFrames), { waitUntil: 'domcontentloaded' });
    if (f === 0) await new Promise(r => setTimeout(r, 400));
    frames.push(await page.screenshot({ type: 'jpeg', quality: 82 }));
    if (f % 30 === 0) process.stdout.write(`  frame ${f}/${totalFrames}\r`);
  }
  await b.close();
  const res = spawnSync(FFMPEG, [
    '-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),
    '-i','pipe:0','-vf',`scale=${W}:${H}`,'-t',String(durationSec),
    '-c:v','libvpx','-b:v','5M', outPath,
  ], { input: Buffer.concat(frames), stdio:['pipe','pipe','pipe'], timeout:300000, maxBuffer:2*1024*1024*1024 });
  if (res.status !== 0) throw new Error(`ffmpeg: ${res.stderr?.toString().slice(-200)}`);
  console.log(`  ✓ ${path.basename(outPath)} (${(fs.statSync(outPath).size/1e6).toFixed(1)}MB)`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

(async () => {
  console.log('\n=== JST + JSM Creative Builder ===\n');

  console.log('── Feed Posts (1080×1080) ──');
  await renderStill(jstFeedPricing(),        path.join(FEED_DIR, 'jst-feed-pricing.jpg'));
  await renderStill(jstFeedClientResult(),   path.join(FEED_DIR, 'jst-feed-client-result.jpg'));
  await renderStill(jsmFeedServices(),       path.join(FEED_DIR, 'jsm-feed-services.jpg'));
  await renderStill(jsmFeedRevenueReframe(), path.join(FEED_DIR, 'jsm-feed-revenue-reframe.jpg'));

  console.log('\n── Story Posts (1080×1920) ──');
  await renderStill(jstStoryScarcity(),  path.join(STORY_DIR, 'jst-story-scarcity.jpg'));
  await renderStill(jstStoryCTA(),       path.join(STORY_DIR, 'jst-story-cta.jpg'));
  await renderStill(jsmStoryRetainer(),  path.join(STORY_DIR, 'jsm-story-retainer.jpg'));
  await renderStill(jsmStoryPoll(),      path.join(STORY_DIR, 'jsm-story-poll.jpg'));

  console.log('\n── Reels (1080×1920, 9s) ──');
  await renderReel(jstReelLossAversion,    path.join(REEL_DIR, 'jst-reel-loss-aversion.webm'),    9);
  await renderReel(jsmReelContentHook,     path.join(REEL_DIR, 'jsm-reel-content-hook.webm'),     9);
  await renderReel(jstReelSocialProof,     path.join(REEL_DIR, 'jst-reel-social-proof.webm'),     9);
  await renderReel(jstReelServicesOverview,path.join(REEL_DIR, 'jst-reel-services-overview.webm'),9);
  await renderReel(jsmReelAutomation,      path.join(REEL_DIR, 'jsm-reel-automation.webm'),       9);

  console.log('\n=== ALL DONE ===');
  console.log('Feed    → creatives/feed/output/');
  console.log('Stories → creatives/stories/output/');
  console.log('Reels   → creatives/reels/output/');
})();