-- Market assets
CREATE TABLE IF NOT EXISTS public.market_assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol      text NOT NULL UNIQUE,
  name        text NOT NULL,
  asset_class asset_class NOT NULL,
  country_id  text REFERENCES public.countries(id) ON DELETE SET NULL,
  is_active   boolean NOT NULL DEFAULT true,
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Price ticks — time series
CREATE TABLE IF NOT EXISTS public.price_ticks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id    uuid NOT NULL REFERENCES public.market_assets(id) ON DELETE CASCADE,
  price       numeric(20,8) NOT NULL,
  change_24h  numeric(16,8),
  change_pct  numeric(8,4),
  volume_24h  numeric(24,2),
  market_cap  numeric(24,2),
  tick_at     timestamptz NOT NULL DEFAULT now()
);

-- Market signal events (linked to global_events)
CREATE TABLE IF NOT EXISTS public.market_signals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES public.global_events(id) ON DELETE CASCADE,
  asset_id    uuid REFERENCES public.market_assets(id) ON DELETE SET NULL,
  signal_type text NOT NULL,   -- 'regulatory', 'macro', 'geopolitical', 'sentiment'
  impact      text,             -- 'bullish' | 'bearish' | 'neutral' | 'volatile'
  magnitude   smallint CHECK (magnitude BETWEEN -10 AND 10),
  rationale   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_ticks_asset_time ON public.price_ticks(asset_id, tick_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_assets_class ON public.market_assets(asset_class, is_active);
