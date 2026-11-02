require('dotenv').config();
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { classify } = require('./classifier');

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) => err.response?.status === 429 || err.code === 'ECONNRESET'
});

const DELAY_MS = 2500; // ~24 req/min — stay under TikTok's soft limit
const MIN_FOLLOWERS = 100;
const MAX_PROFILES_PER_HASHTAG = 30;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── TikTok public search endpoints ────────────────────────────────────────
// Uses TikTok's public web API (no auth required, same as browser requests)
// Falls back to alternative endpoint if primary 403s

async function fetchHashtagId(tag) {
  try {
    const url = `https://www.tiktok.com/api/challenge/detail/?challengeName=${encodeURIComponent(tag)}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000
    });
    return data?.challengeInfo?.challenge?.id || null;
  } catch {
    return null;
  }
}

async function fetchProfilesForHashtag(tag, maxProfiles = MAX_PROFILES_PER_HASHTAG) {
  const profiles = [];

  try {
    // TikTok public hashtag feed endpoint
    const challengeId = await fetchHashtagId(tag);
    if (!challengeId) {
      console.log(`  ⚠ Could not resolve hashtag ID for #${tag}`);
      return profiles;
    }

    let cursor = 0;
    let fetched = 0;

    while (fetched < maxProfiles) {
      await sleep(DELAY_MS);

      const url = `https://www.tiktok.com/api/challenge/item_list/?challengeID=${challengeId}&count=20&cursor=${cursor}&type=5`;
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': `https://www.tiktok.com/tag/${tag}`
        },
        timeout: 15000
      });

      const items = data?.itemList || [];
      if (!items.length) break;

      for (const item of items) {
        const author = item.author;
        if (!author) continue;

        const followerCount = author.stats?.followerCount || 0;
        if (followerCount < MIN_FOLLOWERS) continue;

        profiles.push({
          username: author.uniqueId,
          display_name: author.nickname,
          bio: author.signature || '',
          followers: followerCount,
          video_count: author.stats?.videoCount || 0,
          profile_url: `https://www.tiktok.com/@${author.uniqueId}`,
          source_hashtag: tag,
        });
        fetched++;
        if (fetched >= maxProfiles) break;
      }

      if (!data.hasMore) break;
      cursor = data.cursor || cursor + 20;
    }
  } catch (err) {
    console.log(`  ✗ Error fetching #${tag}: ${err.message}`);
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
