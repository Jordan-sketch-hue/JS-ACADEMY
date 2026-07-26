-- The Cleanser JA — admin product RPC functions
-- Run this in the Supabase SQL editor after supabase-schema.sql
--
-- SETUP: Set the admin secret in your Supabase project once:
--   ALTER DATABASE postgres SET "app.admin_rpc_secret" = '<your-ADMIN_RPC_SECRET>';
-- Then reload the config:
--   SELECT pg_reload_conf();
-- The value must match ADMIN_RPC_SECRET in your Vercel / .env.local.

-- Add missing columns to products table (safe to re-run)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS slug         text,
  ADD COLUMN IF NOT EXISTS image_url    text,
  ADD COLUMN IF NOT EXISTS category     text,
  ADD COLUMN IF NOT EXISTS updated_at   timestamptz NOT NULL DEFAULT now();

-- Unique constraint on slug (only non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products (slug) WHERE slug IS NOT NULL;

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Helper to verify the admin RPC secret
CREATE OR REPLACE FUNCTION _tcj_assert_admin(p_secret text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  stored text;
BEGIN
  stored := current_setting('app.admin_rpc_secret', true);
  IF stored IS NULL OR stored = '' OR p_secret IS DISTINCT FROM stored THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;
END;
$$;

-- LIST all products (newest first)
CREATE OR REPLACE FUNCTION tcj_admin_list_products(p_secret text)
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM _tcj_assert_admin(p_secret);
  RETURN QUERY
    SELECT row_to_json(r)
    FROM (
      SELECT
        p.id,
        COALESCE(p.sku, 'SKU-' || SUBSTRING(p.id::text, 1, 8))  AS sku,
        COALESCE(p.slug, LOWER(REPLACE(p.name, ' ', '-')))        AS slug,
        p.name,
        COALESCE(p.description, '')                                AS description,
        p.category,
        p.price,
        p.sale_price,
        p.stock_quantity                                            AS stock,
        p.low_stock_threshold,
        p.ingredients,
        p.benefits,
        p.usage_instructions,
        p.warnings,
        p.shipping_eligibility,
        p.image_url,
        p.featured,
        p.active,
        p.created_at,
        COALESCE(p.updated_at, p.created_at)                       AS updated_at
      FROM products p
      WHERE p.archived_at IS NULL
      ORDER BY p.created_at DESC
    ) r;
END;
$$;

-- UPSERT a product (create when p_id IS NULL, update otherwise)
CREATE OR REPLACE FUNCTION tcj_admin_upsert_product(
  p_secret text,
  p_id     uuid,
  p_data   jsonb
)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_id uuid;
  v_slug text;
BEGIN
  PERFORM _tcj_assert_admin(p_secret);

  -- Derive slug from name if not supplied
  v_slug := NULLIF(TRIM(p_data->>'slug'), '');
  IF v_slug IS NULL AND p_data->>'name' IS NOT NULL THEN
    v_slug := LOWER(REGEXP_REPLACE(TRIM(p_data->>'name'), '[^a-z0-9]+', '-', 'g'));
    v_slug := REGEXP_REPLACE(v_slug, '^-+|-+$', '', 'g');
  END IF;

  IF p_id IS NULL THEN
    -- INSERT
    INSERT INTO products (
      name, sku, slug, description, category,
      price, sale_price, stock_quantity, low_stock_threshold,
      ingredients, benefits, usage_instructions, warnings,
      shipping_eligibility, image_url, featured, active
    ) VALUES (
      p_data->>'name',
      NULLIF(TRIM(p_data->>'sku'), ''),
      v_slug,
      COALESCE(p_data->>'description', ''),
      NULLIF(TRIM(p_data->>'category'), ''),
      (p_data->>'price')::numeric,
      NULLIF(p_data->>'sale_price', '')::numeric,
      COALESCE((p_data->>'stock')::integer, 0),
      COALESCE((p_data->>'low_stock_threshold')::integer, 10),
      NULLIF(TRIM(p_data->>'ingredients'), ''),
      NULLIF(TRIM(p_data->>'benefits'), ''),
      NULLIF(TRIM(p_data->>'usage_instructions'), ''),
      NULLIF(TRIM(p_data->>'warnings'), ''),
      NULLIF(TRIM(p_data->>'shipping_eligibility'), ''),
      NULLIF(TRIM(p_data->>'image_url'), ''),
      COALESCE((p_data->>'featured')::boolean, false),
      COALESCE((p_data->>'active')::boolean, true)
    )
    RETURNING id INTO v_id;
  ELSE
    -- UPDATE
    UPDATE products SET
      name                = COALESCE(p_data->>'name',               name),
      sku                 = COALESCE(NULLIF(TRIM(p_data->>'sku'),''), sku),
      slug                = COALESCE(v_slug,                         slug),
      description         = COALESCE(p_data->>'description',         description),
      category            = COALESCE(NULLIF(TRIM(p_data->>'category'),''), category),
      price               = COALESCE((p_data->>'price')::numeric,    price),
      sale_price          = CASE WHEN p_data ? 'sale_price'
                                 THEN NULLIF(p_data->>'sale_price', 'null')::numeric
                                 ELSE sale_price END,
      stock_quantity      = COALESCE((p_data->>'stock')::integer,    stock_quantity),
      low_stock_threshold = COALESCE((p_data->>'low_stock_threshold')::integer, low_stock_threshold),
      ingredients         = COALESCE(NULLIF(TRIM(p_data->>'ingredients'),''),   ingredients),
      benefits            = COALESCE(NULLIF(TRIM(p_data->>'benefits'),''),      benefits),
      usage_instructions  = COALESCE(NULLIF(TRIM(p_data->>'usage_instructions'),''), usage_instructions),
      warnings            = COALESCE(NULLIF(TRIM(p_data->>'warnings'),''),      warnings),
      shipping_eligibility= COALESCE(NULLIF(TRIM(p_data->>'shipping_eligibility'),''), shipping_eligibility),
      image_url           = CASE WHEN p_data ? 'image_url'
                                 THEN NULLIF(TRIM(p_data->>'image_url'),'')
                                 ELSE image_url END,
      featured            = COALESCE((p_data->>'featured')::boolean,  featured),
      active              = COALESCE((p_data->>'active')::boolean,    active)
    WHERE id = p_id
    RETURNING id INTO v_id;

    IF v_id IS NULL THEN
      RAISE EXCEPTION 'Product not found: %', p_id;
    END IF;
  END IF;

  RETURN (
    SELECT row_to_json(r)
    FROM (
      SELECT
        p.id,
        COALESCE(p.sku, 'SKU-' || SUBSTRING(p.id::text, 1, 8))  AS sku,
        COALESCE(p.slug, LOWER(REPLACE(p.name, ' ', '-')))        AS slug,
        p.name,
        COALESCE(p.description, '')                                AS description,
        p.category,
        p.price,
        p.sale_price,
        p.stock_quantity                                            AS stock,
        p.low_stock_threshold,
        p.ingredients,
        p.benefits,
        p.usage_instructions,
        p.warnings,
        p.shipping_eligibility,
        p.image_url,
        p.featured,
        p.active,
        p.created_at,
        COALESCE(p.updated_at, p.created_at)                       AS updated_at
      FROM products p WHERE p.id = v_id
    ) r
  );
END;
$$;

-- DELETE a product (soft-delete via archived_at)
CREATE OR REPLACE FUNCTION tcj_admin_delete_product(p_secret text, p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM _tcj_assert_admin(p_secret);
  UPDATE products SET archived_at = now() WHERE id = p_id;
END;
$$;

-- Grant anon execute so the app can call via anon key (secret is verified inside)
GRANT EXECUTE ON FUNCTION _tcj_assert_admin(text)             TO anon;
GRANT EXECUTE ON FUNCTION tcj_admin_list_products(text)       TO anon;
GRANT EXECUTE ON FUNCTION tcj_admin_upsert_product(text,uuid,jsonb) TO anon;
GRANT EXECUTE ON FUNCTION tcj_admin_delete_product(text,uuid) TO anon;
