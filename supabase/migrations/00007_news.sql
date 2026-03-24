-- News articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid NOT NULL REFERENCES public.global_events(id) ON DELETE CASCADE,
  headline     text NOT NULL,
  body         text,
  source_name  text NOT NULL,
  source_url   text NOT NULL UNIQUE,
  author       text,
  image_url    text,
  language     text NOT NULL DEFAULT 'en',
  sentiment    numeric(4,3) CHECK (sentiment BETWEEN -1 AND 1),
  topics       text[] NOT NULL DEFAULT '{}',
  published_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_event_id ON public.news_articles(event_id);
CREATE INDEX IF NOT EXISTS idx_news_topics ON public.news_articles USING GIN(topics);
