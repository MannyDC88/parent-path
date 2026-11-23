-- supabase/chat_feedback.sql
--
-- Creates the chat_feedback table for the Parent Path AI assistant.
-- Stores only rating ('up'/'down') and language ('en'/'es') — no message content.
--
-- RLS: anon may INSERT only. No SELECT, UPDATE, or DELETE for anon.
-- Review this file before running. Do NOT run automatically.

CREATE TABLE public.chat_feedback (
  id         bigint  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating     text    NOT NULL CHECK (rating IN ('up', 'down')),
  lang       text    NOT NULL CHECK (lang IN ('en', 'es')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security.
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: anon may INSERT, but only the two allowed columns.
-- No SELECT, UPDATE, or DELETE is granted to anon.
CREATE POLICY "anon_insert_chat_feedback"
  ON public.chat_feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Column-level grant: anon may only supply rating and lang.
-- id and created_at are set by the database and cannot be supplied by the client.
REVOKE ALL ON public.chat_feedback FROM anon, authenticated;
GRANT INSERT (rating, lang) ON public.chat_feedback TO anon;
