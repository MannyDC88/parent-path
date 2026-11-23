# Dev Log — Parent Path

> A running record of build sessions and how Bob helped.

---



## 2026-11-23 · Session 7 — Parent Path AI Chat Assistant (IBM Granite)

**What we built:**
- `api/_knowledge.js` — module-scoped knowledge file (not a Vercel endpoint). Builds the system prompt containing the full behavior rules, all verified facts from `research/content-notes.md` (Early Steps, Child Find, CMS Plan, EPSDT, UM-NSU CARD, other Broward agencies), and a providers section loaded from `public/data/providers.json` via `createRequire`. Strips availability status; exposes only name, specialties, city, phone, and website.
- `api/chat.js` — Vercel Node serverless function (ESM). POST-only (405 otherwise). Validates messages: last 8, roles user/assistant only, content max 1 000 chars, rejects empty. Fetches an IBM IAM token with form-encoded apikey grant; caches the token in module scope and refreshes 60 s before expiry. Calls `${WATSONX_URL}/ml/v1/text/chat?version=2025-10-25` with model `ibm/granite-4-h-small`, `max_tokens: 400`, `temperature: 0`. On any error returns a friendly generic message; never logs message content, never exposes keys or raw IBM errors.
- `src/components/ChatAssistant.jsx` — floating "Ask Parent Path / Pregunte" button (bottom-right). Opens a chat panel (full-screen sheet on mobile, 380×520 px panel on sm+). Privacy note in EN/ES under the header. Messages in React state only — no localStorage, no Supabase. Loading indicator (animated dots). Friendly error on fetch failure. Escape key closes panel; focus returns to trigger button; Tab focus trap inside panel; aria labels, role="dialog", aria-modal, aria-live on message area.
- `FeedbackButtons` sub-component — 👍/👎 under each assistant reply. On click, inserts `{ rating, lang }` into Supabase `chat_feedback`; buttons disabled after one click; shows "Thanks!/¡Gracias!". Language detected from last user message (Spanish accent/keyword heuristic). Never sends question or answer text.
- `supabase/chat_feedback.sql` — table with id, rating (check in/up/down), lang (check in/en/es), created_at (db-set, client cannot supply). RLS enabled; anon INSERT-only policy. File left unrun for developer review.
- `src/App.jsx` — added `import ChatAssistant` and `<ChatAssistant />` inside the layout (after footer, still inside the outer div).

**How Bob helped:**
- Read all 9 relevant files before writing a single line (content-notes.md, providers.json, App.jsx, index.css, Home.jsx, supabase.js, package.json, devlog.md, NEXT.md).
- Identified only the verified facts in content-notes.md (skipped everything marked "to verify," "not covered," or uncertain) and copied them verbatim — no paraphrasing or gap-filling.
- Chose `createRequire` for JSON loading inside a Vercel ESM serverless function (no new npm packages).
- Matched the existing palette and typography exactly (sage, cream, charcoal, Fraunces headings, Inter body, sand borders) without touching any unrelated component.

**Security decisions:**
- `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL` read from `process.env` server-side only — no `VITE_` prefix, never sent to the browser.
- IAM token cached in module scope; never returned to the client.
- Error responses are generic friendly messages; raw IBM error bodies and HTTP statuses are never forwarded.
- `chat_feedback` stores rating + lang only — no message text, no child data.

---

## 2026-11-19 · Session 6 — Design restyle + two bug fixes

**What we did:**
- Added Google Fonts (`Fraunces` 500, `Inter` 400/500) via `<link>` in `index.html` — no new npm packages
- Extended Tailwind v4 `@theme` in `index.css` with the full approved palette: cream page bg, warm charcoal text, muted, deep sage, sand borders, specialty pill colors, footer tint, header cream/subtitle, and all five badge color pairs
- Restyled `App.jsx`: header now deep sage (#3F5E4A) with Fraunces 30px cream title and sage-tinted subtitle; footer uses `#F1EADF` bg with sand border; body gets cream background
- Restyled `Home.jsx`: "Provider directory" heading in Fraunces; filter pills switch to sage fill (active) / white+sand border (inactive)
- Restyled `ProviderCard.jsx`: 14px border-radius, sand border, roomy padding; provider name in Fraunces; specialty pills in warm sand tones; phone/website links in sage; all gray references replaced with design tokens
- Restyled `AvailabilityBadge.jsx`: all five statuses now use the approved badge palette (accepting green, waitlist ochre, not_accepting clay, no_answer/unknown neutral)
- **Bug fix 1 (`Home.jsx`):** added `handleAvailabilityUpdate` and passes it as `onAvailabilityUpdate` to every `ProviderCard`; badge and `lastVerified` stay correct after switching filters
- **Bug fix 2 (`ProviderCard.jsx`):** on duplicate (23505) error, `setSelectedStatus(null)` is now called so no report button remains visually selected
- Build confirmed clean: 72 modules, no warnings or errors (`vite build` ✓)

**How Bob helped:**
- Read all five affected files before writing any code
- Identified Tailwind v4's CSS-first `@theme` approach (no `tailwind.config.js`) from the existing `vite.config.js` and `index.css`
- Batched the restyle and bug fixes across files in one pass with no unrelated changes

---


## 2026-11-19 · Session 5 — Task 3: Shared Availability via Supabase

**What we did:**
- Installed `@supabase/supabase-js` (only new dependency)
- Created `src/lib/supabase.js` — builds the client from `import.meta.env`; exports `null` and silently degrades if either env var is absent (providers still load from JSON, reporting section hidden)
- Created `src/utils/browserKey.js` — generates a `crypto.randomUUID()` once and persists it in `localStorage`; no fingerprinting or device data
- Created `src/api/availability.js` — `getLatestAvailability(ids)` queries the `latest_availability` view; `submitAvailabilityUpdate(id, status)` inserts `{provider_id, status, browser_key}` with no `.select()` chain (anon cannot read back the row)
- Updated `src/components/AvailabilityBadge.jsx` — switched keys to exact DB values (`not_accepting`, `no_answer`); removed `.toLowerCase()` normalisation
- Updated `src/components/ProviderCard.jsx` — added inline "Report availability" section with four status buttons; on success updates the badge and shows "Thanks, your report helps other parents."; on duplicate (code 23505) shows "You already reported this provider today."; `aria-pressed` on each status button; section hidden when `supabase` is null
- Updated `src/pages/Home.jsx` — after fetching JSON, calls `getLatestAvailability`, merges Supabase rows over defaults (status + `created_at` → formatted `lastVerified`); added `aria-pressed` to filter buttons
- Build confirmed clean: 72 modules, no warnings or errors (`vite build` ✓)

**How Bob helped:**
- Read schema.sql, all existing components, and Home.jsx before writing any code
- Applied the minimum change to each existing file; created four new files
- Kept Supabase credentials safe: read only from `import.meta.env`, never printed or hardcoded

**Decisions made:**
- Browser key: `crypto.randomUUID()` stored in `localStorage` — simple, no PII, satisfies the DB `CHECK (char_length(browser_key) BETWEEN 8 AND 128)` constraint (UUID is 36 chars)
- No `.select()` after insert — anon role lacks column grants to read back the row; avoids a Supabase "permission denied" error
- Report section hidden entirely when `supabase` is null (env vars missing) so the UI stays clean in local dev without keys

**Next session:** TBD (Tasks 1–3 complete)

---


## 2026-11-19 · Session 4 — Task 2: ProviderCard + Home page list

**What we did:**
- Created `src/components/AvailabilityBadge.jsx` — colored badge for Accepting / Not accepting / Waitlist / No answer / Unknown; shows "Availability not yet verified — call to confirm." for unknown status
- Created `src/components/ProviderCard.jsx` — displays name, availability badge, specialties (pill tags), city, tap-to-call phone link, website (only if non-null), insurances (only if non-empty), and notes
- Created `src/pages/Home.jsx` — fetches `/data/providers.json` via `fetch`, holds filter state, renders All / Speech / OT / Behavioral filter buttons above a responsive 1→2→3 column grid
- Updated `src/App.jsx` to import and use the real `Home` page, removing the placeholder
- Build confirmed clean: 26 modules, no warnings or errors (`vite build` ✓)

**How Bob helped:**
- Read `providers.json`, `App.jsx`, `devlog.md`, and `NEXT.md` before writing any code
- Wrote all three new files from scratch following Tailwind-only constraint (no new dependencies)
- Applied minimal diff to `App.jsx` (swap placeholder inline component for real import)
- Marked Tasks 1 & 2 done in `NEXT.md`, flagged Task 3 as next

**Next session:** Task 3 — Supabase availability sync (install `@supabase/supabase-js`, wire up `availability_updates` table, add `AvailabilityUpdateForm` to `ProviderCard`)

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