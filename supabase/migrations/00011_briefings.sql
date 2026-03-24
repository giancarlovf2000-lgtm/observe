-- AI-generated briefings
CREATE TABLE IF NOT EXISTS public.ai_briefings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type              briefing_type NOT NULL,
  title             text NOT NULL,
  executive_summary text,
  full_content      text,
  model_used        text NOT NULL DEFAULT 'gpt-4o',
  prompt_tokens     integer,
  completion_tokens integer,
  country_id        text REFERENCES public.countries(id) ON DELETE SET NULL,
  region            text,
  tags              text[] NOT NULL DEFAULT '{}',
  source_event_ids  uuid[] NOT NULL DEFAULT '{}',
  generated_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published      boolean NOT NULL DEFAULT false,
  briefing_date     date NOT NULL DEFAULT CURRENT_DATE,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_briefings_date ON public.ai_briefings(briefing_date DESC, type);
CREATE INDEX IF NOT EXISTS idx_briefings_published ON public.ai_briefings(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefings_country ON public.ai_briefings(country_id) WHERE country_id IS NOT NULL;
