-- Data sources registry
CREATE TABLE IF NOT EXISTS public.data_sources (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    text NOT NULL UNIQUE,
  slug                    text NOT NULL UNIQUE,
  adapter_key             text NOT NULL,
  base_url                text,
  auth_type               text,  -- 'api_key' | 'basic' | 'none'
  is_active               boolean NOT NULL DEFAULT true,
  fetch_interval_seconds  integer NOT NULL DEFAULT 300,
  last_fetched_at         timestamptz,
  metadata                jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Ingestion run log
CREATE TABLE IF NOT EXISTS public.ingestion_runs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id        uuid NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
  status           ingestion_status NOT NULL DEFAULT 'pending',
  records_fetched  integer NOT NULL DEFAULT 0,
  records_inserted integer NOT NULL DEFAULT 0,
  records_skipped  integer NOT NULL DEFAULT 0,
  error_message    text,
  started_at       timestamptz NOT NULL DEFAULT now(),
  completed_at     timestamptz,
  duration_ms      integer
);

-- Global events — polymorphic core table
CREATE TABLE IF NOT EXISTS public.global_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type         event_type NOT NULL,
  title        text NOT NULL,
  summary      text,
  body         text,
  severity     severity_level NOT NULL DEFAULT 'low',
  country_id   text REFERENCES public.countries(id) ON DELETE SET NULL,
  region       text,
  lat          double precision,
  lng          double precision,
  location_point geometry(Point, 4326) GENERATED ALWAYS AS (
    CASE WHEN lat IS NOT NULL AND lng IS NOT NULL
      THEN ST_SetSRID(ST_MakePoint(lng, lat), 4326)
      ELSE NULL
    END
  ) STORED,
  source_id    uuid REFERENCES public.data_sources(id) ON DELETE SET NULL,
  source_url   text,
  external_id  text,
  tags         text[] NOT NULL DEFAULT '{}',
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_summary   text,
  ai_tags      text[] NOT NULL DEFAULT '{}',
  is_active    boolean NOT NULL DEFAULT true,
  occurred_at  timestamptz NOT NULL,
  ingested_at  timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),

  UNIQUE NULLS NOT DISTINCT (source_id, external_id)
);
