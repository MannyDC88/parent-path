# Dev Log — Parent Path

> A running record of build sessions and how Bob helped.

---

## 2026-11-06 · Session 1 — Project Planning

**What we did:**
- Defined the MVP scope for the IBM AI for Good Challenge (deadline Dec 2, 2026)
- Chose tech stack: React + Vite + Tailwind CSS, Vercel hosting, IBM Granite via watsonx.ai Lite, Vercel Edge Function as API proxy
- Decided on localStorage for availability updates (serverless, privacy-preserving)
- Selected react-i18next for EN/ES bilingual support
- Decided against a Python backend to ensure reliable free hosting (no Render cold-start during demo)
- Created SPEC.md, NEXT.md, and this devlog
- Created parent-path-plan.md with a 4-week subtask breakdown

**How Bob helped:**
- Explored the repo (clean slate — just README + LICENSE)
- Drafted the full SPEC.md including architecture diagram, responsible AI table, 4-week schedule, and assumptions
- Drafted NEXT.md with the first 3 actionable tasks
- Created the implementation plan file

**Decisions made:**
- Granite Guardian implemented as a system prompt instruction (not a separate endpoint) — assumption documented in SPEC.md
- AI responses English-only for MVP; UI strings bilingual
- Availability updates are localStorage-only (no sync across devices) — known limitation

**Next session:** Scaffold the Vite/React project and deploy to Vercel (NEXT.md Task 1)

---

## 2026-11-06 · Session 2 — Spec Revision

**What we did:**
- Revised SPEC.md, NEXT.md, parent-path-plan.md across 9 changes based on developer review
- Replaced localStorage availability with Supabase free tier (shared updates across all browsers)
- Corrected the challenge submission requirements: 3-minute spoken video, presentation slides, project page, team info, IBM SkillsBuild certificate
- Clarified provider data rule: Bob must not invent provider names, phones, or websites — all data is developer-verified
- Removed English-only AI assumption; Granite now responds in the user's selected language (EN/ES) for both chat and letter generator
- Clarified safety filter: use Granite Guardian model if available on Lite tier; otherwise use a prompt-based safety filter, labeled honestly — never call a system prompt "Granite Guardian"
- Added IEP/evaluation request letter generator as a new MVP feature and its own sub-task (Sub-Task 7)
- Moved Granite chat sub-task to Week 2 (right after provider directory); resource pages and polish moved to Week 3–4
- Updated privacy wording: "users are told not to enter names or diagnoses; chats are never stored"
- Added Assumption 8: Granite model ID must be verified at setup; using `ibm/granite-3-8b-instruct` as placeholder only
- Added Sub-Task 10 for all challenge submission materials
- Plan now has 10 sub-tasks across 4 weeks

**How Bob helped:**
- Read both SPEC.md and parent-path-plan.md in full before making changes
- Rewrote SPEC.md in place (all 9 changes applied in a single pass)
- Rewrote parent-path-plan.md with reordered sub-tasks, updated Sub-Tasks 1, 2, 4, 5, 6, and new Sub-Tasks 7 and 10
- Updated NEXT.md to reflect Supabase setup in Task 1 and the provider data verification rule in Task 2

**Decisions changed from Session 1:**
- localStorage → Supabase (shared availability updates)
- English-only AI → bilingual AI responses
- "Granite Guardian system prompt" → honest labeling (Guardian model if available, otherwise prompt filter)
- Letter generator added as a new core AI feature
- Sub-task order revised: AI chat moves earlier (Week 2)

**Next session:** Scaffold the Vite/React project, create Supabase table, deploy to Vercel (NEXT.md Task 1)

---

## 2026-11-06 · Session 3 — Sub-Task 1: Project Scaffold

**What we did:**
- Scaffolded React + Vite (v8.3.6) into a temp `_scaffold` subfolder, moved files to the repo root without overwriting existing files (README.md, LICENSE, SPEC.md, etc.), then deleted the temp folder
- Installed all npm dependencies: React 19, react-router-dom 7, Tailwind CSS v4, @tailwindcss/vite plugin
- Configured Tailwind v4 correctly for Vite: added `@tailwindcss/vite` to `vite.config.js` as a plugin; replaced all boilerplate CSS with a single `@import "tailwindcss"` directive
- Built minimal app shell in `src/App.jsx`: header "Parent Path", placeholder main area, footer "Not affiliated with any agency. Listings are not endorsements."
- Set up React Router with `BrowserRouter` and a placeholder Home route
- Added `.gitignore` covering `node_modules`, `dist`, `.env`, `.env.local`, `.env.*.local`
- Created `.env.example` with placeholder names only — no real keys anywhere
- Created `supabase/schema.sql` with plain-English comments throughout
- Updated `SPEC.md`, `parent-path-plan.md`, and `NEXT.md` to reflect all corrections
- Developer confirmed `npm run dev` runs; app shell renders at localhost:5173
- Schema reviewed before running (with Claude): fixed a spoofable timestamp, locked down column permissions, made the view respect RLS, and set the daily limit to Eastern time. Ran it in the Supabase SQL Editor: success.

**How Bob helped:**
- Scaffolded via temp subfolder strategy to avoid clobbering existing project files (after the developer rejected a risky `--yes` scaffold in the non-empty folder)
- Identified that Tailwind v4 uses `@tailwindcss/vite` instead of the v3 PostCSS approach — used the correct current setup
- Wrote the first draft of `supabase/schema.sql` with detailed comments, RLS policy, unique constraint, and `latest_availability` view
- Applied all spec corrections in a single pass across SPEC.md, parent-path-plan.md, and NEXT.md

**Decisions made / corrections applied:**
- Availability statuses: `accepting` / `not_accepting` / `waitlist` / `no_answer`
- Schema uses `report_date` (date, set by the database in Eastern time) + `created_at` (timestamptz, set by the database); the browser can only send `provider_id`, `status`, and `browser_key`
- Unique constraint `(provider_id, browser_key, report_date)` enforced at the DB level
- RLS + column-level grants: anon may insert three columns and read `provider_id`, `status`, `created_at` only (`browser_key` never exposed); `latest_availability` view uses `security_invoker` so it follows those rules
- Browser key stored in **localStorage** (not sessionStorage) for persistence across browser sessions
- `react-router-dom` installed in Sub-Task 1 (not Sub-Task 8 as originally planned)
- Tailwind CSS v4 — no `tailwind.config.js`, no PostCSS config, no `autoprefixer` needed

**Environment notes:**
- Windows, PowerShell scripts blocked — all npm/node commands run via `cmd /c`; default terminal set to Command Prompt
- Node v26.13.0, npm 11.20.0, Vite 8.3.6, React 19.3.1, Tailwind 4.3.5
- Supabase project "parent-path" (East US): `availability_updates` table and `latest_availability` view created
- Vercel account exists; not yet connected (developer will do via dashboard)

**Next session:** Build the provider list into `/public/data/providers.json` from verified entries in `research/provider-candidates.xlsx` (Sub-Task 2), build the directory page (Sub-Task 3), and connect Vercel for a live URL