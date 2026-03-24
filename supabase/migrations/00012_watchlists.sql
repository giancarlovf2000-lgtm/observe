-- User watchlists
CREATE TABLE IF NOT EXISTS public.watchlists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  is_default  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Watchlist items (can be countries, assets, conflicts, regions, or topics)
CREATE TABLE IF NOT EXISTS public.watchlist_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id uuid NOT NULL REFERENCES public.watchlists(id) ON DELETE CASCADE,
  entity_type  text NOT NULL,  -- 'country' | 'asset' | 'conflict' | 'region' | 'topic'
  entity_id    text NOT NULL,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  added_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(watchlist_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user ON public.watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_wl ON public.watchlist_items(watchlist_id);
