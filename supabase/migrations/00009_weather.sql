-- Weather and natural disaster events
CREATE TABLE IF NOT EXISTS public.weather_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid NOT NULL REFERENCES public.global_events(id) ON DELETE CASCADE,
  weather_type text NOT NULL,   -- 'hurricane', 'earthquake', 'wildfire', 'flood', 'storm', 'heat'
  magnitude    numeric(6,2),    -- wind speed km/h, Richter scale, etc.
  forecast_json jsonb,
  valid_from   timestamptz NOT NULL,
  valid_until  timestamptz
);

CREATE INDEX IF NOT EXISTS idx_weather_events_valid ON public.weather_events(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_weather_events_type ON public.weather_events(weather_type);
