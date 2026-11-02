require('dotenv').config();
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { classify } = require('./classifier');

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) => err.response?.status === 429 || err.code === 'ECONNRESET'
});

const DELAY_MS = 3000;
const MIN_FOLLOWERS = 100;
const MAX_PROFILES_PER_HASHTAG = 30;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Rotate user agents to reduce fingerprinting
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];
let uaIndex = 0;
const nextUA = () => USER_AGENTS[uaIndex++ % USER_AGENTS.length];

// ─── Parse __NEXT_DATA__ from TikTok hashtag page HTML ─────────────────────
// Hits the public /tag/{hashtag} page and extracts the embedded JSON payload.
// No internal API tokens required — same content a browser gets.

async function fetchProfilesForHashtag(tag, maxProfiles = MAX_PROFILES_PER_HASHTAG) {
  const profiles = [];

  try {
    const url = `https://www.tiktok.com/tag/${encodeURIComponent(tag)}`;
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': nextUA(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.tiktok.com/',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
      },
      timeout: 20000,
    });

    // Extract __NEXT_DATA__ JSON embedded in the page
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!match) {
      // Fallback: try SIGI_STATE
      const sigiMatch = html.match(/window\['SIGI_STATE'\]\s*=\s*(\{[\s\S]*?\});\s*window\[/);
      if (!sigiMatch) {
        console.log(`  ⚠ No data in page for #${tag} (likely geo-blocked or captcha)`);
        return profiles;
      }
    }

    let pageData;
    try {
      pageData = JSON.parse(match[1]);
    } catch {
      console.log(`  ⚠ JSON parse failed for #${tag}`);
      return profiles;
    }

    // Navigate the Next.js page props to find video items
    const itemModule = pageData?.props?.pageProps?.itemList
      || pageData?.props?.pageProps?.items
      || [];

    if (!itemModule.length) {
      console.log(`  ⚠ Empty item list for #${tag}`);
      return profiles;
    }

    let fetched = 0;
    for (const item of itemModule) {
      if (fetched >= maxProfiles) break;
      const author = item.author || item.authorStats;
      if (!author) continue;

      const followerCount = item.authorStats?.followerCount || author.followerCount || 0;
      if (followerCount < MIN_FOLLOWERS) continue;

      profiles.push({
        username: author.uniqueId || author.id,
        display_name: author.nickname || author.uniqueId,
        bio: author.signature || '',
        followers: followerCount,
        video_count: item.authorStats?.videoCount || author.videoCount || 0,
        profile_url: `https://www.tiktok.com/@${author.uniqueId || author.id}`,
        source_hashtag: tag,
      });
      fetched++;
    }
  } catch (err) {
    if (err.response?.status === 403 || err.response?.status === 429) {
      console.log(`  ⚠ Rate limited on #${tag} — backing off 30s`);
      await sleep(30000);
    } else {
      console.log(`  ✗ Error fetching #${tag}: ${err.message}`);
    }
  }

  return profiles;
}

async function scrapeHashtags(hashtagList) {
  const seen = new Set();
  const leads = [];
  let hashtagsDone = 0;

  console.log(`\n🔍 Scraping ${hashtagList.length} hashtags...\n`);

  for (const tag of hashtagList) {
    hashtagsDone++;
    console.log(`[${hashtagsDone}/${hashtagList.length}] #${tag}`);

    const profiles = await fetchProfilesForHashtag(tag);

    let added = 0;
    for (const profile of profiles) {
      if (seen.has(profile.username)) continue;
      seen.add(profile.username);

      const result = classify(profile);
      if (!result) continue;

      leads.push({
        ...profile,
        category: result.category,
        category_confidence: result.score,
        message: result.message,
        status: 'new',
        scraped_at: new Date().toISOString()
      });
      added++;
    }

    console.log(`  → ${profiles.length} profiles, ${added} new leads added`);
    await sleep(1000); // extra pause between hashtags
  }

  console.log(`\n✅ Done. Total unique leads: ${leads.length}\n`);
  return leads;
}

module.exports = { scrapeHashtags };
