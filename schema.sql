-- Users (single user, but schema supports it)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  google_drive_token JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clipboard
CREATE TABLE clipboard_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text','url','code','address')) DEFAULT 'text',
  is_pinned BOOLEAN DEFAULT false,
  is_secret BOOLEAN DEFAULT false,
  device_source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Media Vault (metadata only, file lives in Google Drive)
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  drive_url TEXT,
  thumbnail_url TEXT,
  file_name TEXT,
  file_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- File Transfer Queue
CREATE TABLE file_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  drive_file_id TEXT,
  download_url TEXT,
  qr_code_data TEXT,
  status TEXT CHECK (status IN ('pending','uploaded','downloaded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Download Queue
CREATE TABLE download_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT CHECK (status IN ('queued','downloading','done','failed')) DEFAULT 'queued',
  added_from TEXT DEFAULT 'mobile',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notes (Second Brain)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  linked_note_ids UUID[],
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6b7280',
  UNIQUE(user_id, name)
);

-- Note Tags Junction
CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Saved Links (Resource Library)
CREATE TABLE saved_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  category TEXT,
  thumbnail_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Course Tracker
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT,
  progress_pct INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Focus Sessions
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  session_type TEXT CHECK (session_type IN ('pomodoro','manual')) DEFAULT 'pomodoro',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics Logs
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  focus_score INTEGER CHECK (focus_score BETWEEN 1 AND 10),
  mood TEXT,
  notes TEXT,
  UNIQUE(user_id, date)
);

-- Vault Secrets
CREATE TABLE vault_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Dashboard Widget Config
CREATE TABLE dashboard_config (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  widget_order TEXT[],
  hidden_widgets TEXT[],
  theme TEXT DEFAULT 'light',
  daily_brief TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
