-- =============================================
-- Row Level Security Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conflict_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conflict_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_ticks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_runs ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES ----
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ---- PUBLIC READ: intelligence data ----
CREATE POLICY "Public read: countries"
  ON public.countries FOR SELECT USING (true);

CREATE POLICY "Public read: regions"
  ON public.regions FOR SELECT USING (true);

CREATE POLICY "Public read: global_events"
  ON public.global_events FOR SELECT USING (true);

CREATE POLICY "Public read: conflict_zones"
  ON public.conflict_zones FOR SELECT USING (true);

CREATE POLICY "Public read: conflict_updates"
  ON public.conflict_updates FOR SELECT USING (true);

CREATE POLICY "Public read: news_articles"
  ON public.news_articles FOR SELECT USING (true);

CREATE POLICY "Public read: market_assets"
  ON public.market_assets FOR SELECT USING (true);

CREATE POLICY "Public read: price_ticks"
  ON public.price_ticks FOR SELECT USING (true);

CREATE POLICY "Public read: market_signals"
  ON public.market_signals FOR SELECT USING (true);

CREATE POLICY "Public read: weather_events"
  ON public.weather_events FOR SELECT USING (true);

CREATE POLICY "Public read: flight_tracks"
  ON public.flight_tracks FOR SELECT USING (true);

CREATE POLICY "Public read: vessels"
  ON public.vessels FOR SELECT USING (true);

CREATE POLICY "Public read: airports"
  ON public.airports FOR SELECT USING (true);

CREATE POLICY "Public read: ports"
  ON public.ports FOR SELECT USING (true);

CREATE POLICY "Published briefings are public"
  ON public.ai_briefings FOR SELECT
  USING (is_published = true OR auth.uid() = generated_by);

-- ---- PRIVATE: user-owned data ----
CREATE POLICY "Users manage own watchlists"
  ON public.watchlists FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own watchlist items"
  ON public.watchlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.watchlists w
      WHERE w.id = watchlist_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users manage own alerts"
  ON public.alert_rules FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users view own alert events"
  ON public.alert_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alert_rules r
      WHERE r.id = rule_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users view own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own workspaces"
  ON public.workspaces FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- ---- ADMIN ONLY ----
CREATE POLICY "Admin read: data_sources"
  ON public.data_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admin read: ingestion_runs"
  ON public.ingestion_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
