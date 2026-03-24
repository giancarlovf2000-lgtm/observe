-- User alert rules
CREATE TABLE IF NOT EXISTS public.alert_rules (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         text NOT NULL,
  condition    alert_condition NOT NULL,
  parameters   jsonb NOT NULL DEFAULT '{}'::jsonb,
  channels     text[] NOT NULL DEFAULT '{in_app}',
  is_active    boolean NOT NULL DEFAULT true,
  last_fired_at timestamptz,
  fire_count   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Alert event log (when a rule fires)
CREATE TABLE IF NOT EXISTS public.alert_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id      uuid NOT NULL REFERENCES public.alert_rules(id) ON DELETE CASCADE,
  event_id     uuid REFERENCES public.global_events(id) ON DELETE SET NULL,
  fired_at     timestamptz NOT NULL DEFAULT now(),
  acknowledged boolean NOT NULL DEFAULT false,
  payload      jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- User notifications (inbox)
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  body        text,
  type        text NOT NULL DEFAULT 'alert',
  read        boolean NOT NULL DEFAULT false,
  action_url  text,
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alert_rules_user ON public.alert_rules(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_alert_events_rule ON public.alert_events(rule_id, fired_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read, created_at DESC);
