ALTER TABLE public.profile_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
