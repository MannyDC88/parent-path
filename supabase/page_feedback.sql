-- supabase/page_feedback.sql
--
-- Creates the page_feedback table for the "Was this page helpful?" footer form.
-- Stores helpful (boolean), optional comment (≤300 chars), page path (≤100 chars),
-- and language ('en' or 'es'). No PII — form instructs users not to include names.
--
-- RLS: anon may INSERT only (column-level grant). No SELECT, UPDATE, or DELETE.
-- Review this file before running. Do NOT run automatically.

CREATE TABLE public.page_feedback (
  id         bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  helpful    boolean     NOT NULL,
  comment    text        NULL        CHECK (char_length(comment) <= 300),
  page       text        NOT NULL    CHECK (char_length(page) <= 100),
  lang       text        NOT NULL    CHECK (lang IN ('en', 'es')),
  created_at timestamptz NOT NULL    DEFAULT now()
);

-- Enable Row Level Security.
ALTER TABLE public.page_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: anon may INSERT. No SELECT, UPDATE, or DELETE granted.
CREATE POLICY "anon_insert_page_feedback"
  ON public.page_feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Column-level grants: anon may only supply the four payload columns.
-- id and created_at are set by the database and cannot be supplied by the client.
REVOKE ALL ON public.page_feedback FROM anon, authenticated;
GRANT INSERT (helpful, comment, page, lang) ON public.page_feedback TO anon;
