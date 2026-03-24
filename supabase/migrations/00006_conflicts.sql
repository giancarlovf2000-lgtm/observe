-- Conflict zones
CREATE TABLE IF NOT EXISTS public.conflict_zones (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id              uuid NOT NULL REFERENCES public.global_events(id) ON DELETE CASCADE,
  name                  text NOT NULL,
  conflict_type         conflict_type NOT NULL,
  parties               text[] NOT NULL DEFAULT '{}',
  active                boolean NOT NULL DEFAULT true,
  intensity             smallint NOT NULL DEFAULT 0 CHECK (intensity BETWEEN 0 AND 10),
  casualties_estimate   bigint,
  displacement_estimate bigint,
  start_date            date NOT NULL,
  end_date              date,
  last_update           timestamptz NOT NULL DEFAULT now()
);

-- Conflict timeline updates
CREATE TABLE IF NOT EXISTS public.conflict_updates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_id uuid NOT NULL REFERENCES public.conflict_zones(id) ON DELETE CASCADE,
  title       text NOT NULL,
  body        text,
  severity    severity_level,
  source_url  text,
  occurred_at timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conflict_zones_active ON public.conflict_zones(active);
CREATE INDEX IF NOT EXISTS idx_conflict_zones_event_id ON public.conflict_zones(event_id);
CREATE INDEX IF NOT EXISTS idx_conflict_updates_conflict_id ON public.conflict_updates(conflict_id, occurred_at DESC);
