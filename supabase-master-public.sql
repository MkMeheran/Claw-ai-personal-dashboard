-- ============================================================
-- NEXUS AI DASHBOARD — Master Supabase Setup Script (Public Version)
-- Run this entire script in your Supabase SQL Editor.
-- It is safe to run multiple times (uses IF NOT EXISTS).
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE & AUTH TRIGGER
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  google_drive_token JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. CORE FEATURE TABLES
-- ============================================================

-- Clipboard
CREATE TABLE IF NOT EXISTS clipboard_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text','url','code','address','image')) DEFAULT 'text',
  is_pinned BOOLEAN DEFAULT false,
  is_secret BOOLEAN DEFAULT false,
  device_source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Media Vault
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  drive_url TEXT,
  thumbnail_url TEXT,
  file_name TEXT,
  file_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- File Queue
CREATE TABLE IF NOT EXISTS file_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  drive_file_id TEXT,
  download_url TEXT,
  qr_code_data TEXT,
  status TEXT CHECK (status IN ('pending','uploaded','downloaded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Download Queue
CREATE TABLE IF NOT EXISTS download_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT CHECK (status IN ('queued','downloading','done','failed')) DEFAULT 'queued',
  added_from TEXT DEFAULT 'mobile',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Second Brain (Notes)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  linked_note_ids UUID[],
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6b7280',
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Resources
CREATE TABLE IF NOT EXISTS saved_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  category TEXT,
  thumbnail_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT,
  progress_pct INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Tracker
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  session_type TEXT CHECK (session_type IN ('pomodoro','manual')) DEFAULT 'pomodoro',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics (Daily Logs)
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  focus_score INTEGER CHECK (focus_score BETWEEN 1 AND 10),
  mood TEXT,
  notes TEXT,
  UNIQUE(user_id, date)
);

-- Config
CREATE TABLE IF NOT EXISTS dashboard_config (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_order TEXT[],
  hidden_widgets TEXT[],
  theme TEXT DEFAULT 'dark',
  daily_brief TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Secret Vault
CREATE TABLE IF NOT EXISTS vault_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recycle Bin
CREATE TABLE IF NOT EXISTS recycle_bin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_table TEXT NOT NULL,
  original_id UUID NOT NULL,
  payload JSONB NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
-- ============================================================
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name != 'users' LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage own %I" ON %I;', t, t);
    
    -- Special rule for note_tags junction
    IF t = 'note_tags' THEN
      EXECUTE 'CREATE POLICY "Users can manage own note tags" ON note_tags FOR ALL USING (EXISTS (SELECT 1 FROM notes WHERE notes.id = note_id AND notes.user_id = auth.uid()));';
    ELSE
      EXECUTE format('CREATE POLICY "Users can manage own %I" ON %I FOR ALL USING (auth.uid() = user_id);', t, t);
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- 4. DUPLICATE PREVENTION LOGIC (CLIPBOARD)
-- ============================================================
CREATE OR REPLACE FUNCTION handle_clipboard_duplicates()
RETURNS TRIGGER AS $$
DECLARE
    existing_id UUID;
    recent_image_id UUID;
BEGIN
    SELECT id INTO existing_id FROM clipboard_items WHERE user_id = NEW.user_id AND md5(content) = md5(NEW.content) LIMIT 1;
    IF existing_id IS NOT NULL THEN
        UPDATE clipboard_items SET created_at = NOW() WHERE id = existing_id;
        RETURN NULL;
    END IF;

    IF NEW.type = 'image' THEN
        SELECT id INTO recent_image_id FROM clipboard_items WHERE user_id = NEW.user_id AND type = 'image' AND created_at > NOW() - INTERVAL '5 seconds' LIMIT 1;
        IF recent_image_id IS NOT NULL THEN
            RETURN NULL;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_clipboard_duplicates ON clipboard_items;
CREATE TRIGGER trg_prevent_clipboard_duplicates BEFORE INSERT ON clipboard_items FOR EACH ROW EXECUTE FUNCTION handle_clipboard_duplicates();

-- ============================================================
-- 5. RECYCLE BIN LOGIC (SOFT DELETES)
-- ============================================================
CREATE OR REPLACE FUNCTION trg_move_to_recycle_bin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO recycle_bin (user_id, original_table, original_id, payload)
  VALUES (OLD.user_id, TG_TABLE_NAME, OLD.id, row_to_json(OLD)::jsonb);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to major tables
DO $$ 
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['clipboard_items', 'media_items', 'notes', 'vault_secrets', 'saved_links', 'focus_sessions']) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_recycle ON %I;', t, t);
    EXECUTE format('CREATE TRIGGER trg_%I_recycle BEFORE DELETE ON %I FOR EACH ROW EXECUTE FUNCTION trg_move_to_recycle_bin();', t, t);
  END LOOP;
END $$;

-- Restore RPC Function
CREATE OR REPLACE FUNCTION restore_from_recycle_bin(bin_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  bin_record RECORD;
BEGIN
  SELECT * INTO bin_record FROM recycle_bin WHERE id = bin_id;
  IF NOT FOUND THEN RETURN FALSE; END IF;
  EXECUTE format('INSERT INTO %I SELECT * FROM jsonb_populate_record(NULL::%I, $1)', bin_record.original_table, bin_record.original_table) USING bin_record.payload;
  DELETE FROM recycle_bin WHERE id = bin_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 6. BACKGROUND CRON JOBS (Optional - Requires pg_cron)
-- ============================================================
DO $do$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Cleanup unpinned clipboard older than 3 hours
    BEGIN PERFORM cron.unschedule('cleanup-old-clipboard'); EXCEPTION WHEN OTHERS THEN END;
    PERFORM cron.schedule('cleanup-old-clipboard', '0 * * * *', $$ delete from public.clipboard_items where is_pinned = false and created_at < now() - interval '3 hours'; $$);
    
    -- Cleanup recycle bin older than 20 days
    BEGIN PERFORM cron.unschedule('cleanup_recycle_bin'); EXCEPTION WHEN OTHERS THEN END;
    PERFORM cron.schedule('cleanup_recycle_bin', '0 3 * * *', $$ DELETE FROM recycle_bin WHERE deleted_at < NOW() - INTERVAL '20 days'; $$);
  END IF;
END $do$;

-- ============================================================
-- 7. ENABLE REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE clipboard_items;
ALTER PUBLICATION supabase_realtime ADD TABLE focus_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
ALTER PUBLICATION supabase_realtime ADD TABLE vault_secrets;

-- Reload cache
NOTIFY pgrst, 'reload schema';
