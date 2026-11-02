require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// SQL migration — run once via Supabase dashboard or MCP
const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS tiktok_leads (
  id              BIGSERIAL PRIMARY KEY,
  username        TEXT NOT NULL UNIQUE,
  display_name    TEXT,
  bio             TEXT,
  followers       INTEGER DEFAULT 0,
  video_count     INTEGER DEFAULT 0,
  profile_url     TEXT,
  category        TEXT,
  category_confidence INTEGER DEFAULT 0,
  message         TEXT,
  source_hashtag  TEXT,
  status          TEXT DEFAULT 'new',  -- new | sent | replied | converted | skip
  notes           TEXT,
  scraped_at      TIMESTAMPTZ DEFAULT NOW(),
  contacted_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tiktok_leads_category ON tiktok_leads(category);
CREATE INDEX IF NOT EXISTS idx_tiktok_leads_status   ON tiktok_leads(status);
CREATE INDEX IF NOT EXISTS idx_tiktok_leads_followers ON tiktok_leads(followers DESC);
`;

async function upsertLeads(leads) {
  if (!leads.length) return 0;

  const rows = leads.map((l) => ({
    username:             l.username,
    display_name:         l.display_name,
    bio:                  l.bio,
    followers:            l.followers,
    video_count:          l.video_count,
    profile_url:          l.profile_url,
    category:             l.category,
    category_confidence:  l.category_confidence,
    message:              l.message,
    source_hashtag:       l.source_hashtag,
    status:               l.status || 'new',
    scraped_at:           l.scraped_at
  }));

  // upsert — skip if username already exists (don't overwrite contacted leads)
  const { data, error } = await supabase
    .from('tiktok_leads')
    .upsert(rows, { onConflict: 'username', ignoreDuplicates: true });

  if (error) throw error;
  return rows.length;
}

async function fetchLeadsForExport(filters = {}) {
  const PAGE_SIZE = 1000;
  const allRows = [];
  let offset = 0;

  while (true) {
    let query = supabase
      .from('tiktok_leads')
      .select('username, display_name, bio, followers, category, message, status, profile_url, scraped_at')
      .order('followers', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.status)   query = query.eq('status', filters.status);
    if (filters.minFollowers) query = query.gte('followers', filters.minFollowers);

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return allRows;
}

module.exports = { upsertLeads, fetchLeadsForExport, MIGRATION_SQL };
