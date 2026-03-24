-- Live flight positions (from OpenSky or similar public sources)
CREATE TABLE IF NOT EXISTS public.flight_tracks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  callsign      text NOT NULL,
  icao24        text UNIQUE,
  origin_iata   text,
  dest_iata     text,
  aircraft_type text,
  lat           double precision NOT NULL,
  lng           double precision NOT NULL,
  altitude_ft   integer,
  speed_kts     integer,
  heading       smallint,
  squawk        text,
  on_ground     boolean NOT NULL DEFAULT false,
  track_at      timestamptz NOT NULL DEFAULT now()
);

-- Live vessel positions (from public AIS feeds)
CREATE TABLE IF NOT EXISTS public.vessels (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mmsi         text NOT NULL UNIQUE,
  name         text,
  vessel_type  text,
  flag         text,
  lat          double precision NOT NULL,
  lng          double precision NOT NULL,
  speed_kts    numeric(5,2),
  heading      smallint,
  destination  text,
  cargo_type   text,
  is_tanker    boolean NOT NULL DEFAULT false,
  track_at     timestamptz NOT NULL DEFAULT now()
);

-- Airports reference
CREATE TABLE IF NOT EXISTS public.airports (
  iata         text PRIMARY KEY,
  name         text NOT NULL,
  city         text,
  country_id   text REFERENCES public.countries(id),
  lat          double precision NOT NULL,
  lng          double precision NOT NULL,
  is_major     boolean NOT NULL DEFAULT false
);

-- Major ports reference
CREATE TABLE IF NOT EXISTS public.ports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  country_id   text REFERENCES public.countries(id),
  lat          double precision NOT NULL,
  lng          double precision NOT NULL,
  is_chokepoint boolean NOT NULL DEFAULT false,
  annual_teu   integer  -- twenty-foot equivalent units
);

CREATE INDEX IF NOT EXISTS idx_flights_track_at ON public.flight_tracks(track_at DESC);
CREATE INDEX IF NOT EXISTS idx_vessels_track_at ON public.vessels(track_at DESC);
