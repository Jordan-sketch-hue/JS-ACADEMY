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
