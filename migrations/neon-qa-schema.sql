-- Neon DB: QA monitoring schema
-- Run once against your NEON_QA_DATABASE_URL

CREATE TABLE IF NOT EXISTS qa_runs (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  run_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  status      TEXT NOT NULL DEFAULT 'running', -- running | done | failed
  total       INT NOT NULL DEFAULT 0,
  passed      INT NOT NULL DEFAULT 0,
  failed      INT NOT NULL DEFAULT 0,
  duration_ms INT,
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS qa_results (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  run_id       TEXT NOT NULL REFERENCES qa_runs(id) ON DELETE CASCADE,
  project_id   TEXT NOT NULL,
  project_name TEXT NOT NULL,
  url          TEXT NOT NULL,
  http_status  INT,
  response_ms  INT,
  passed       BOOLEAN NOT NULL DEFAULT false,
  checks       JSONB,
  error        TEXT,
  checked_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_alerts (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  run_id       TEXT REFERENCES qa_runs(id) ON DELETE SET NULL,
  project_id   TEXT NOT NULL,
  project_name TEXT NOT NULL,
  alert_type   TEXT NOT NULL, -- http_error | timeout | ssl | redirect
  severity     TEXT NOT NULL DEFAULT 'critical', -- critical | warning
  message      TEXT NOT NULL,
  fired_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_qa_results_run_id ON qa_results(run_id);
CREATE INDEX IF NOT EXISTS idx_qa_alerts_run_id  ON qa_alerts(run_id);
CREATE INDEX IF NOT EXISTS idx_qa_alerts_open    ON qa_alerts(resolved_at) WHERE resolved_at IS NULL;
