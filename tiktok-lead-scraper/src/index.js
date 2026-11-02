require('dotenv').config();
const cron = require('node-cron');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const { HASHTAGS } = require('./hashtags');
const { scrapeHashtags } = require('./scraper');
const { upsertLeads, fetchLeadsForExport } = require('./db');

const MODE = process.argv.find((a) => a.startsWith('--mode='))?.split('=')[1] || 'cron';

async function runScrape() {
  console.log('═══════════════════════════════════════');
  console.log('   TikTok Lead Engine — JST v1.0');
  console.log(`   ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════\n');

  try {
    const leads = await scrapeHashtags(HASHTAGS);

    if (leads.length) {
      const saved = await upsertLeads(leads);
      console.log(`💾 Saved ${saved} new leads to Supabase`);
    } else {
      console.log('⚠ No leads found this run');
    }

    // Auto-export CSV after every scrape
    await exportCSV({ status: 'new' });
  } catch (err) {
    console.error('❌ Scrape failed:', err.message);
    process.exit(1);
  }
}

async function exportCSV(filters = {}) {
  console.log('\n📊 Exporting leads to CSV...');

  const leads = await fetchLeadsForExport(filters);
  if (!leads.length) {
    console.log('No leads match the filter.');
    return;
  }

  const fields = [
    { label: 'Handle', value: 'username' },
    { label: 'Business Name', value: 'display_name' },
    { label: 'Bio', value: 'bio' },
    { label: 'Followers', value: 'followers' },
    { label: 'Category', value: 'category' },
    { label: 'Message to Send', value: 'message' },
    { label: 'Status', value: 'status' },
    { label: 'Profile URL', value: 'profile_url' },
    { label: 'Scraped At', value: 'scraped_at' }
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(leads);

  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  const outPath = path.join(process.cwd(), filename);
  fs.writeFileSync(outPath, csv);

  console.log(`✅ Exported ${leads.length} leads → ${filename}`);
}

// ─── Entry points ──────────────────────────────────────────────────────────

if (MODE === 'scrape') {
  // One-shot run
  runScrape();
} else if (MODE === 'export') {
  // Export only
  exportCSV().catch(console.error);
} else {
  // Cron mode: runs daily at 6AM Jamaica time (UTC-5 = 11AM UTC)
  console.log('🕐 Cron mode active — runs daily at 6AM Jamaica time');
  cron.schedule('0 11 * * *', () => {
    console.log('\n⏰ Cron trigger fired');
    runScrape();
  });

  // Also run immediately on startup
  runScrape();
}
