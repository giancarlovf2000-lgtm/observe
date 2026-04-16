-- =============================================
-- BYOK (Bring Your Own Key) + Stripe billing
-- =============================================

-- Stripe billing fields on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id       text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id   text,
  ADD COLUMN IF NOT EXISTS subscription_status      text NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS subscription_period_end  timestamptz;

-- Per-user API credentials store
CREATE TABLE IF NOT EXISTS public.api_credentials (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service         text        NOT NULL,
  -- AES-256-GCM encrypted JSON: { iv, tag, data } all base64-encoded
  encrypted_data  text        NOT NULL,
  is_active       boolean     NOT NULL DEFAULT true,
  last_tested_at  timestamptz,
  test_status     text        CHECK (test_status IN ('ok', 'failed')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, service)
);

ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own credentials"
  ON public.api_credentials FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add user_id to global_events so BYOK-fetched events are scoped to the user
ALTER TABLE public.global_events
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Replace the fully-public read policy with one that respects user ownership
DROP POLICY IF EXISTS "Public read: global_events" ON public.global_events;

CREATE POLICY "Read global events"
  ON public.global_events FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Users can insert and delete their own events
DROP POLICY IF EXISTS "Users insert own events" ON public.global_events;
CREATE POLICY "Users insert own events"
  ON public.global_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users delete own events" ON public.global_events;
CREATE POLICY "Users delete own events"
  ON public.global_events FOR DELETE
  USING (user_id = auth.uid());

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_global_events_user_id
  ON public.global_events (user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_api_credentials_user_service
  ON public.api_credentials (user_id, service);
