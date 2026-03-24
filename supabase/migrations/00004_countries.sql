-- Countries table with PostGIS geometry support
CREATE TABLE IF NOT EXISTS public.countries (
  id          text PRIMARY KEY,  -- ISO 3166-1 alpha-2: 'US', 'UA', 'CN'
  name        text NOT NULL,
  region      text NOT NULL,     -- 'Europe', 'Middle East', 'Asia', etc.
  subregion   text,
  capital     text,
  lat         double precision,
  lng         double precision,
  population  bigint,
  risk_score  smallint NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  flag_url    text,
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Regions lookup (aggregated from countries)
CREATE TABLE IF NOT EXISTS public.regions (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  lat         double precision,
  lng         double precision,
  country_ids text[] DEFAULT '{}'
);

CREATE TRIGGER countries_updated_at
  BEFORE UPDATE ON public.countries
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
