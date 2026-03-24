-- Intelligence workspaces (saved map configurations)
CREATE TABLE IF NOT EXISTS public.workspaces (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  map_state     jsonb NOT NULL DEFAULT '{}'::jsonb,   -- viewport, projection
  active_layers jsonb NOT NULL DEFAULT '[]'::jsonb,  -- layer IDs
  filter_state  jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Bookmarks (saved events/items)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_type text NOT NULL,  -- 'event' | 'country' | 'briefing'
  entity_id   text NOT NULL,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_workspaces_user ON public.workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id, entity_type);
