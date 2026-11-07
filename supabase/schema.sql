-- ============================================================
-- Parent Path · Supabase Schema (reviewed Nov 6, 2026)
-- Run this yourself in the Supabase SQL Editor. Run it once.
-- ============================================================

-- Table: one row per parent availability report.
-- Stores only the provider slug, the status, dates, and a
-- random browser key for rate-limiting. No personal data.
CREATE TABLE IF NOT EXISTS public.availability_updates (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Matches "id" in /public/data/providers.json. Length-capped.
    provider_id  text        NOT NULL
                 CHECK (char_length(provider_id) BETWEEN 1 AND 100),

    -- The four statuses the UI offers.
    status       text        NOT NULL
                 CHECK (status IN ('accepting', 'not_accepting', 'waitlist', 'no_answer')),

    -- Set by the database (Florida time), never by the browser.
    report_date  date        NOT NULL
                 DEFAULT ((now() AT TIME ZONE 'America/New_York')::date),

    -- Set by the database, never by the browser.
    created_at   timestamptz NOT NULL DEFAULT now(),

    -- Random key stored in the browser's localStorage. Length-capped.
    browser_key  text        NOT NULL
                 CHECK (char_length(browser_key) BETWEEN 8 AND 128),

    -- The database enforces: one report per provider, per browser, per day.
    CONSTRAINT uq_provider_browser_date UNIQUE (provider_id, browser_key, report_date)
);

-- Turn on Row Level Security.
ALTER TABLE public.availability_updates ENABLE ROW LEVEL SECURITY;

-- Remove Supabase's broad default permissions for public roles...
REVOKE ALL ON TABLE public.availability_updates FROM anon, authenticated;

-- ...then grant back only what the app needs:
-- the public may INSERT only these three columns (the database fills the dates),
GRANT INSERT (provider_id, status, browser_key)
    ON TABLE public.availability_updates TO anon;

-- and may READ only these three columns (browser_key stays hidden).
GRANT SELECT (provider_id, status, created_at)
    ON TABLE public.availability_updates TO anon;

-- Row Level Security policies matching those grants.
CREATE POLICY "anon can submit reports"
    ON public.availability_updates
    FOR INSERT TO anon
    WITH CHECK (status IN ('accepting', 'not_accepting', 'waitlist', 'no_answer'));

CREATE POLICY "anon can read reports"
    ON public.availability_updates
    FOR SELECT TO anon
    USING (true);

-- View: the latest status per provider.
-- security_invoker = true means the view follows the rules above
-- instead of running with admin rights.
CREATE OR REPLACE VIEW public.latest_availability
    WITH (security_invoker = true) AS
    SELECT DISTINCT ON (provider_id)
        provider_id,
        status,
        created_at
    FROM public.availability_updates
    ORDER BY provider_id, created_at DESC;

GRANT SELECT ON public.latest_availability TO anon;