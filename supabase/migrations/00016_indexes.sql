-- Performance indexes

-- global_events — most queried table
CREATE INDEX IF NOT EXISTS idx_events_type ON public.global_events(type, is_active);
CREATE INDEX IF NOT EXISTS idx_events_severity ON public.global_events(severity, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_country ON public.global_events(country_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_region ON public.global_events(region, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_occurred ON public.global_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_active ON public.global_events(is_active, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_tags ON public.global_events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_events_ai_tags ON public.global_events USING GIN(ai_tags);

-- Spatial index for map queries
CREATE INDEX IF NOT EXISTS idx_events_location ON public.global_events USING GIST(location_point)
  WHERE location_point IS NOT NULL;

-- Full text search on events
CREATE INDEX IF NOT EXISTS idx_events_fts ON public.global_events
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '')));

-- Countries
CREATE INDEX IF NOT EXISTS idx_countries_region ON public.countries(region);
CREATE INDEX IF NOT EXISTS idx_countries_risk ON public.countries(risk_score DESC);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Price ticks (high-volume)
CREATE INDEX IF NOT EXISTS idx_price_latest ON public.price_ticks(asset_id, tick_at DESC);

-- Notifications (frequently polled)
CREATE INDEX IF NOT EXISTS idx_notif_unread ON public.notifications(user_id, created_at DESC)
  WHERE read = false;
