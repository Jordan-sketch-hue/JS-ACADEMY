-- Run this once in Supabase dashboard → SQL Editor
-- Project: ibtadbwtrxglujkzqofs

CREATE TABLE IF NOT EXISTS tiktok_leads (
  id                    BIGSERIAL PRIMARY KEY,
  username              TEXT NOT NULL UNIQUE,
  display_name          TEXT,
  bio                   TEXT,
  followers             INTEGER DEFAULT 0,
  video_count           INTEGER DEFAULT 0,
  profile_url           TEXT,
  category              TEXT,
  category_confidence   INTEGER DEFAULT 0,
  message               TEXT,
  source_hashtag        TEXT,
  status                TEXT DEFAULT 'new',
  notes                 TEXT,
  scraped_at            TIMESTAMPTZ DEFAULT NOW(),
  contacted_at          TIMESTAMPTZ,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tiktok_leads_category  ON tiktok_leads(category);
CREATE INDEX IF NOT EXISTS idx_tiktok_leads_status    ON tiktok_leads(status);
CREATE INDEX IF NOT EXISTS idx_tiktok_leads_followers ON tiktok_leads(followers DESC);

-- status enum values: new | sent | replied | converted | skip

-- RLS: deny all anon access; only service_role (Railway scraper) can read/write
ALTER TABLE tiktok_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON tiktok_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
