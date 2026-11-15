-- House of Isabelle — Initial Schema
-- Project: ibtadbwtrxglujkzqofs
-- Run: supabase db push OR paste into Supabase SQL editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE hi_customer_segment AS ENUM ('retail', 'stylist', 'wholesale');
CREATE TYPE hi_order_status AS ENUM ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE hi_delivery_method AS ENUM ('islandwide', 'knutsford', 'pickup');
CREATE TYPE hi_cart_status AS ENUM ('active', 'abandoned', 'converted');
CREATE TYPE hi_booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE hi_hair_texture AS ENUM ('Straight', 'Body Wave', 'Burmese Curly', 'Coloured Hair', 'Tape-in', 'Crochet', 'Deep Wave', 'Kinky Curly');
CREATE TYPE hi_hair_colour AS ENUM ('Natural Black', '1B Off Black', '#2 Darkest Brown', '#4 Dark Brown', '#27 Honey Blonde', '#30 Medium Auburn', '#613 Platinum Blonde', 'Ombre', 'Custom');

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================
CREATE TABLE hi_product_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,         -- "Body Wave", "Tape-ins", etc.
  slug        TEXT NOT NULL UNIQUE,         -- "body-wave", "tape-ins"
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO hi_product_categories (name, slug, sort_order) VALUES
  ('Straight',       'straight',       1),
  ('Body Wave',      'body-wave',      2),
  ('Burmese Curly',  'burmese-curly',  3),
  ('Coloured Hair',  'coloured-hair',  4),
  ('Tape-ins',       'tape-ins',       5),
  ('Crochet',        'crochet',        6),
  ('Deep Wave',      'deep-wave',      7),
  ('Kinky Curly',    'kinky-curly',    8);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE hi_products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id     UUID REFERENCES hi_product_categories(id),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  base_price_jmd  INTEGER NOT NULL,          -- price in JMD cents
  image_url       TEXT,
  image_urls      TEXT[] DEFAULT '{}',       -- additional product images
  active          BOOLEAN NOT NULL DEFAULT true,
  featured        BOOLEAN NOT NULL DEFAULT false,
  seo_title       TEXT,
  seo_description TEXT,
  google_product_category TEXT DEFAULT 'Apparel & Accessories > Hair Accessories',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCT VARIANTS (texture + length + colour = one SKU)
-- ============================================================
CREATE TABLE hi_product_variants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES hi_products(id) ON DELETE CASCADE,
  texture     hi_hair_texture NOT NULL,
  length_in   INTEGER NOT NULL,              -- length in inches (8, 10, 12 ... 30)
  colour      hi_hair_colour NOT NULL,
  price_jmd   INTEGER NOT NULL,              -- JMD cents (may differ from base_price)
  sku         TEXT UNIQUE,                   -- auto-generated or manually set
  stock       INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, texture, length_in, colour)
);

-- ============================================================
-- SERVICES (salon bookings)
-- ============================================================
CREATE TABLE hi_services (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,             -- "Full Install", "Treatment", "Cut & Style"
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  duration_min    INTEGER NOT NULL DEFAULT 60,
  price_jmd       INTEGER NOT NULL,
  image_url       TEXT,
  active          BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CUSTOMERS (CRM)
-- ============================================================
CREATE TABLE hi_customers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name        TEXT NOT NULL,
  last_name         TEXT,
  email             TEXT UNIQUE,
  phone             TEXT,
  whatsapp_phone    TEXT,
  segment           hi_customer_segment NOT NULL DEFAULT 'retail',
  verified_stylist  BOOLEAN NOT NULL DEFAULT false,
  referral_source   TEXT,                    -- "Instagram", "Google", "Walk-in", etc.
  notes             TEXT,
  tags              TEXT[] DEFAULT '{}',
  total_spent_jmd   INTEGER NOT NULL DEFAULT 0,
  order_count       INTEGER NOT NULL DEFAULT 0,
  last_order_at     TIMESTAMPTZ,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  consent_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- WHOLESALE / STYLIST TIERS
-- ============================================================
CREATE TABLE hi_wholesale_tiers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  segment         hi_customer_segment NOT NULL UNIQUE,
  discount_pct    NUMERIC(5,2) NOT NULL,     -- e.g. 15.00 = 15%
  min_order_jmd   INTEGER NOT NULL DEFAULT 0,
  description     TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO hi_wholesale_tiers (segment, discount_pct, min_order_jmd, description) VALUES
  ('stylist',   15.00, 0,       'Licensed stylist — 15% off all orders'),
  ('wholesale', 25.00, 500000,  'Wholesale buyer — 25% off, min order J$5,000');

-- ============================================================
-- CARTS (abandoned cart tracking)
-- ============================================================
CREATE TABLE hi_carts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      TEXT NOT NULL UNIQUE,      -- browser session ID (cookie)
  customer_id     UUID REFERENCES hi_customers(id),
  email           TEXT,                      -- captured before checkout
  phone           TEXT,
  status          hi_cart_status NOT NULL DEFAULT 'active',
  total_jmd       INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hi_cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id     UUID NOT NULL REFERENCES hi_carts(id) ON DELETE CASCADE,
  variant_id  UUID NOT NULL REFERENCES hi_product_variants(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  price_jmd   INTEGER NOT NULL,              -- price at time of add (snapshot)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cart_id, variant_id)
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE hi_orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number        TEXT NOT NULL UNIQUE,  -- HI-YYYYMMDD-XXXX
  customer_id         UUID REFERENCES hi_customers(id),
  customer_name       TEXT NOT NULL,
  customer_email      TEXT,
  customer_phone      TEXT NOT NULL,
  status              hi_order_status NOT NULL DEFAULT 'pending_payment',
  delivery_method     hi_delivery_method NOT NULL,
  delivery_address    TEXT,
  delivery_branch     TEXT,                  -- for Knutsford Express branch name
  subtotal_jmd        INTEGER NOT NULL,
  discount_jmd        INTEGER NOT NULL DEFAULT 0,
  delivery_fee_jmd    INTEGER NOT NULL DEFAULT 0,
  total_jmd           INTEGER NOT NULL,
  fygaro_payment_id   TEXT,
  fygaro_payment_link TEXT,
  paid_at             TIMESTAMPTZ,
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hi_order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES hi_orders(id) ON DELETE CASCADE,
  variant_id  UUID NOT NULL REFERENCES hi_product_variants(id),
  product_name TEXT NOT NULL,               -- snapshot
  variant_desc TEXT NOT NULL,               -- "Straight · 16" · Natural Black" snapshot
  quantity    INTEGER NOT NULL DEFAULT 1,
  unit_price_jmd INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- APPOINTMENTS (salon services)
-- ============================================================
CREATE TABLE hi_appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id      UUID NOT NULL REFERENCES hi_services(id),
  customer_id     UUID REFERENCES hi_customers(id),
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_min    INTEGER NOT NULL DEFAULT 60,
  status          hi_booking_status NOT NULL DEFAULT 'pending',
  notes           TEXT,
  deposit_paid    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- MARKETING CONSENTS
-- ============================================================
CREATE TABLE hi_marketing_consents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL,
  phone       TEXT,
  source      TEXT,                          -- "checkout", "popup", "booking", "account"
  customer_id UUID REFERENCES hi_customers(id),
  opted_in    BOOLEAN NOT NULL DEFAULT true,
  opted_out_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- EMAIL LOG (Resend deduplication)
-- ============================================================
CREATE TABLE hi_email_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resend_message_id TEXT,
  recipient_email TEXT NOT NULL,
  template        TEXT NOT NULL,             -- "order_confirm", "abandoned_cart", "promo"
  order_id        UUID REFERENCES hi_orders(id),
  cart_id         UUID REFERENCES hi_carts(id),
  status          TEXT NOT NULL DEFAULT 'sent',
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ABANDONED CART LOG
-- ============================================================
CREATE TABLE hi_abandoned_cart_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id     UUID NOT NULL REFERENCES hi_carts(id),
  email_sent  BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  reminder_count INTEGER NOT NULL DEFAULT 0,
  converted   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ANALYTICS EVENTS (server-side)
-- ============================================================
CREATE TABLE hi_analytics_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name  TEXT NOT NULL,                 -- "Purchase", "AddToCart", "ViewContent"
  event_id    TEXT NOT NULL UNIQUE,          -- dedup ID sent to Meta + GA4
  platform    TEXT NOT NULL,                 -- "meta", "ga4", "both"
  order_id    UUID REFERENCES hi_orders(id),
  customer_id UUID REFERENCES hi_customers(id),
  value_jmd   INTEGER,
  payload     JSONB,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ADMIN NOTES (CRM)
-- ============================================================
CREATE TABLE hi_admin_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES hi_customers(id),
  order_id    UUID REFERENCES hi_orders(id),
  content     TEXT NOT NULL,
  created_by  TEXT NOT NULL DEFAULT 'admin',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_hi_products_category ON hi_products(category_id);
CREATE INDEX idx_hi_products_slug ON hi_products(slug);
CREATE INDEX idx_hi_variants_product ON hi_product_variants(product_id);
CREATE INDEX idx_hi_carts_session ON hi_carts(session_id);
CREATE INDEX idx_hi_carts_status ON hi_carts(status);
CREATE INDEX idx_hi_carts_updated ON hi_carts(updated_at);
CREATE INDEX idx_hi_orders_customer ON hi_orders(customer_id);
CREATE INDEX idx_hi_orders_status ON hi_orders(status);
CREATE INDEX idx_hi_orders_created ON hi_orders(created_at DESC);
CREATE INDEX idx_hi_customers_email ON hi_customers(email);
CREATE INDEX idx_hi_customers_phone ON hi_customers(phone);
CREATE INDEX idx_hi_customers_segment ON hi_customers(segment);
CREATE INDEX idx_hi_appointments_scheduled ON hi_appointments(scheduled_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Enable RLS on all tables (admin reads via service role key only)
ALTER TABLE hi_products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_product_variants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_wholesale_tiers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_carts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_cart_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_marketing_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_email_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_abandoned_cart_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_analytics_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hi_admin_notes        ENABLE ROW LEVEL SECURITY;

-- Public read policies (storefront)
CREATE POLICY "public read products"      ON hi_products            FOR SELECT USING (active = true);
CREATE POLICY "public read variants"      ON hi_product_variants    FOR SELECT USING (active = true);
CREATE POLICY "public read categories"    ON hi_product_categories  FOR SELECT USING (active = true);
CREATE POLICY "public read services"      ON hi_services            FOR SELECT USING (active = true);
CREATE POLICY "public read wholesale"     ON hi_wholesale_tiers     FOR SELECT USING (true);

-- Cart: session-owner can read/write their own cart
CREATE POLICY "cart owner read"  ON hi_carts FOR SELECT USING (true); -- filtered in app by session_id
CREATE POLICY "cart owner write" ON hi_carts FOR INSERT WITH CHECK (true);
CREATE POLICY "cart owner update" ON hi_carts FOR UPDATE USING (true);
CREATE POLICY "cart items read"  ON hi_cart_items FOR SELECT USING (true);
CREATE POLICY "cart items write" ON hi_cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "cart items update" ON hi_cart_items FOR UPDATE USING (true);
CREATE POLICY "cart items delete" ON hi_cart_items FOR DELETE USING (true);

-- Orders: insert allowed (checkout), read requires service role
CREATE POLICY "orders insert" ON hi_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "order items insert" ON hi_order_items FOR INSERT WITH CHECK (true);

-- Appointments: public insert (booking form)
CREATE POLICY "appointments insert" ON hi_appointments FOR INSERT WITH CHECK (true);

-- Marketing consent: public insert
CREATE POLICY "consent insert" ON hi_marketing_consents FOR INSERT WITH CHECK (true);

-- Functions: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hi_products_updated    BEFORE UPDATE ON hi_products    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_hi_customers_updated   BEFORE UPDATE ON hi_customers   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_hi_orders_updated      BEFORE UPDATE ON hi_orders      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_hi_carts_updated       BEFORE UPDATE ON hi_carts       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_hi_appointments_updated BEFORE UPDATE ON hi_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
