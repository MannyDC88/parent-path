# Parent Path — Implementation Plan

> IBM AI for Good Challenge · Nov 6 – Dec 1, 2026
> Stack: React + Vite + Tailwind · watsonx.ai Granite · Supabase · Vercel
> See SPEC.md for full context.

---

## Overview

Build a bilingual, mobile-friendly web tool for Broward County parents navigating early intervention services. The app has five pillars: a curated provider directory with shared parent-reported availability (Supabase), an IBM Granite AI chat navigator, an IEP/evaluation request letter generator, static resource pages, and an EN/ES language toggle. All AI responses are in the user's selected language.

---

## Sub-Task 1 — Project Scaffold, Supabase Setup, and Vercel Deploy

**Status:** `[ ] pending`

**Intent:** Create a working React + Vite + Tailwind app shell, provision the Supabase `availability_updates` table, and confirm a live Vercel deployment. This is the foundation every other sub-task builds on.

**Expected Outcomes:**
- `npm run dev` starts the app without errors
- The app renders a header with "Parent Path", a placeholder main area, and a footer
- The Vercel URL is live and accessible
- Supabase project exists; `availability_updates` table is created with the schema from SPEC.md §4
- Supabase anon key and URL are stored as Vercel environment variables

**Todo List:**
1. Run `npm create vite@latest . -- --template react` in the repo root
2. Run `npm install`
3. Install and configure Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`)
4. Add Tailwind directives to `src/index.css`
5. Replace Vite boilerplate in `src/App.jsx` with a minimal shell layout (header, main, footer)
6. Create a free Supabase project; create the `availability_updates` table (columns: `id` uuid PK, `provider_id` text, `status` text, `updated_at` timestamptz default now(), `browser_key` text)
7. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local` and Vercel environment variables
8. Commit and push to GitHub (`MannyDC88/parent-path`)
9. Connect repo to Vercel; confirm live deploy URL loads

**Relevant Context:**
- Repo: `MannyDC88/parent-path`
- Supabase table schema: see SPEC.md §4
- Hosting: Vercel free tier (static + Edge Functions)

---

## Sub-Task 2 — Provider Seed Data

**Status:** `[ ] pending`

**Intent:** Create the `providers.json` flat file with 15–20 real Broward County therapy providers that the developer has personally curated and verified. Bob must not invent provider names, phone numbers, or websites — all entries are provided by the developer.

**Expected Outcomes:**
- `/public/data/providers.json` exists and is valid JSON
- Contains ≥15 entries with all required fields, all verified by the developer
- Covers all three specialties: speech, OT, behavioral
- All entries have `availability: "unknown"` and `lastVerified: null` as defaults

**Todo List:**
1. Developer gathers real Broward County provider data from:
   - Broward County Public Schools ESE provider lists
   - Florida Medicaid provider directory
   - Direct phone/website verification
2. Create `/public/data/providers.json` with the following schema per entry:
   ```json
   {
     "id": "unique-slug",
     "name": "Exact verified provider name",
     "specialties": ["speech", "OT", "behavioral"],
     "insurances": ["Medicaid", "Florida Blue", "Sunshine Health"],
     "city": "City name",
     "phone": "954-555-0000",
     "website": "https://verified-url.com",
     "availability": "unknown",
     "lastVerified": null,
     "notes": ""
   }
   ```
3. Add only providers whose name, phone, and website have been directly verified
4. Validate JSON is well-formed

**Relevant Context:**
- **Bob must not invent or suggest provider names, phone numbers, or websites** — all data is developer-supplied
- File lives in `/public/` so Vite serves it as a static asset
- See SPEC.md §8 Assumption 3

---

## Sub-Task 3 — Provider Directory UI

**Status:** `[ ] pending`

**Intent:** Build the Home page that fetches `providers.json` and renders provider cards with availability badges and a specialty filter. This is the most-used screen in the app.

**Expected Outcomes:**
- Home page fetches and displays all providers as cards
- Each card shows: name, city, specialties, phone, website link, and availability badge
- Specialty filter (All / Speech / OT / Behavioral) narrows the list
- Layout is responsive (stacks on mobile, grid on desktop)

**Todo List:**
1. Create `src/components/AvailabilityBadge.jsx` — accepts `status` ("accepting"/"waitlist"/"unknown") and `lastVerified` date; renders a colored badge with last-verified text
2. Create `src/components/ProviderCard.jsx` — displays all provider fields and renders `AvailabilityBadge`
3. Create `src/pages/Home.jsx` — fetches `/data/providers.json`, holds filter state, renders card grid
4. Add specialty filter buttons above the grid
5. Wire `<Home />` into `src/App.jsx`
6. Confirm responsive layout on mobile viewport in browser dev tools

**Relevant Context:**
- Provider schema: see Sub-Task 2
- Architecture diagram: see SPEC.md §4
- Tailwind is already configured from Sub-Task 1

---

## Sub-Task 4 — Shared Availability Update Flow (Supabase)

**Status:** `[ ] pending`

**Intent:** Let parents report availability updates that are shared across all browsers via Supabase. Include a one-per-day-per-provider abuse limit using a hashed browser key.

**Expected Outcomes:**
- Each `ProviderCard` has an "Update availability" button
- Clicking opens a small inline form: radio buttons (Accepting / Waitlist / Can't reach them), a "Submit" button
- On submit: the update is written to Supabase `availability_updates`; badge updates immediately; "Thank you for updating!" confirmation shown
- On Home page load: the most recent Supabase update per `provider_id` overrides the JSON default availability
- If the same browser has already submitted an update for this provider today, the form shows "You've already updated this today" instead of submitting again

**Todo List:**
1. Install `@supabase/supabase-js`; create `src/api/availability.js` with two functions:
   - `getLatestAvailability(providerIds)` — fetches most recent update per provider from Supabase
   - `submitAvailabilityUpdate(providerId, status, browserKey)` — inserts a row; checks for duplicate today+provider+browserKey before inserting
2. Create a `browserKey` utility in `src/utils/browserKey.js` — generates a stable hashed key from browser fingerprint fields (user-agent + screen dimensions) stored in sessionStorage; no PII
3. Add `AvailabilityUpdateForm` inline to `ProviderCard` (hidden by default, shown on button click)
4. On Home page load: call `getLatestAvailability` and merge results over JSON defaults
5. Manually test end-to-end: submit an update from one browser, open a different browser, confirm the badge shows the shared update
6. Test rate limiting: submit twice in one day for the same provider, confirm the second attempt is blocked

**Relevant Context:**
- Supabase anon key is safe to use in the browser for inserts (Row Level Security: allow insert anon, restrict delete/update to service role)
- See SPEC.md §4 (table schema) and §3 (abuse limiting row)
- No personal data is stored — see SPEC.md §5 Responsible AI

---

## Sub-Task 5 — Vercel Edge Function + Granite AI Chat

**Status:** `[ ] pending`

**Intent:** Add the IBM Granite AI chat widget powered by a Vercel Edge Function that proxies requests to watsonx.ai Lite. A safety filter (Granite Guardian model if available, otherwise an honestly labeled prompt-based filter) screens harmful or off-topic responses. The AI responds in the user's currently selected language.

**Expected Outcomes:**
- A floating chat button appears on all pages
- Clicking opens a chat panel; user can type a question in English or Spanish and receive a Granite response in the same language
- The watsonx.ai API key is stored as a Vercel environment variable and never exposed to the browser
- Responses include: "AI answers may not be complete — always verify with your service coordinator"
- A notice above the input reads: "Please don't enter your child's name or diagnosis"
- Off-topic or harmful queries return a safe refusal message
- The safety mechanism is labeled accurately in the UI (Guardian model or prompt filter)

**Todo List:**
1. At setup, check the watsonx.ai Lite model catalog to confirm the exact model ID for Granite 3.x (see SPEC.md §8 Assumption 8) and whether Granite Guardian is available as a separate endpoint
2. Create `/api/chat.js` — Vercel Edge Function that:
   - Accepts `{ message, lang }` (lang = "en" or "es")
   - If Granite Guardian endpoint is available: calls it first; blocks if flagged; labels filter as "Granite Guardian"
   - Otherwise: includes refusal instructions in the system prompt; labels filter as "prompt-based safety filter"
   - Calls watsonx.ai Granite with a system prompt instructing it to answer only Early Steps / IEP topics and to respond in `lang`
   - Returns the response
3. Add `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, and `WATSONX_MODEL_ID` to Vercel environment variables
4. Create `src/api/granite.js` — thin client that POSTs `{ message, lang }` to `/api/chat`
5. Create `src/components/ChatWidget.jsx` — floating button, slide-up panel, message thread, input box, disclaimer text, "no names/diagnoses" notice
6. Add `<ChatWidget />` to `src/App.jsx`; pass current language from i18n context
7. Test locally with `vercel dev`; test on deployed Vercel URL

**Relevant Context:**
- watsonx.ai Lite base URL: `https://us-south.ml.cloud.ibm.com`
- Placeholder model ID: `ibm/granite-3-8b-instruct` — **must be verified at setup**
- See SPEC.md §3 (AI safety row), §5 Responsible AI, §8 Assumptions 5, 7, 8

---

## Sub-Task 6 — Bilingual Support (EN / ES)

**Status:** `[ ] pending`

**Intent:** Add an English/Spanish toggle using react-i18next with static locale JSON files. All UI strings and all AI responses use the selected language.

**Expected Outcomes:**
- A language toggle button (EN / ES) appears in the header
- All visible UI text switches language when toggled
- Language preference persists across page reloads (stored in localStorage)
- No UI text is hardcoded in JSX; all strings come from locale files
- The selected language is passed to `/api/chat` and `/api/letter` so AI responses match

**Todo List:**
1. Install `react-i18next` and `i18next`
2. Create `src/locales/en.json` with all UI strings
3. Create `src/locales/es.json` with Spanish translations for all strings
4. Configure i18next in `src/i18n.js`; import in `src/main.jsx`
5. Replace all hardcoded strings in existing components with `t('key')` calls
6. Create `src/components/LanguageToggle.jsx`; add to header
7. Update `ChatWidget.jsx` to read current language from i18n and pass `lang` to `src/api/granite.js`
8. Confirm toggle works on Home page, provider cards, chat widget disclaimer

**Relevant Context:**
- AI responses follow the `lang` parameter — see Sub-Task 5 and SPEC.md §8 Assumption 7
- See SPEC.md §2 (Bilingual UI row)

---

## Sub-Task 7 — IEP / Evaluation Request Letter Generator

**Status:** `[ ] pending`

**Intent:** Build a form where a parent answers a few questions (school name, child's age, concerns — no child name stored) and Granite drafts a formal evaluation or IEP request letter in the selected language. This is a second distinct AI feature beyond the chat navigator.

**Expected Outcomes:**
- A "Letter Generator" page is accessible from the main nav
- The form collects: school/district name, child's current age in years/months, primary concern (speech, OT, behavioral, general), and desired language (EN/ES)
- No child name is collected or sent to the AI
- Granite returns a complete, formatted letter the parent can copy or download as a `.txt` file
- The letter includes required IDEA language (written request, 60-day evaluation timeline, parent rights)
- The same safety filter as Sub-Task 5 is applied

**Todo List:**
1. Create `/api/letter.js` — Vercel Edge Function that accepts `{ schoolName, childAgeMonths, concern, lang }`, applies the same safety filter as `/api/chat`, calls Granite with a letter-drafting system prompt, returns the drafted letter text
2. Write the letter system prompt: instructs Granite to produce a formal written request under IDEA, include the 60-day evaluation timeline, mention parent rights, address it to the school district's ESE department, and respond in `lang`
3. Create `src/pages/LetterGenerator.jsx` — form with the four fields above, a "Generate Letter" button, and a result panel showing the drafted letter with a "Copy" button and a "Download .txt" button
4. Add a route `/letter` in `App.jsx` and a nav link
5. Add i18n keys for all form labels and button text to `en.json` and `es.json`
6. Test: generate a letter in English and in Spanish; verify IDEA language is present; verify no child name appears anywhere in the output

**Relevant Context:**
- Reuses the same Edge Function pattern as Sub-Task 5
- No child name is ever in the prompt — system prompt explicitly instructs Granite to draft "Dear ESE Department" style (no child identifier)
- See SPEC.md §2 (IEP letter generator row), §5 Responsible AI (privacy row)

---

## Sub-Task 8 — Static Resource Pages

**Status:** `[ ] pending`

**Intent:** Create the three informational pages that explain Early Steps, the age-3 transition, and school evaluations/IEPs. These are the content backbone of the site.

**Expected Outcomes:**
- Three navigable pages: `/early-steps`, `/age-3-transition`, `/school-eval-iep`
- Each page has clear headings, bullet-point steps, and links to official resources (Florida Early Steps, Broward County Public Schools)
- Content is bilingual (uses i18n keys from Sub-Task 6)
- Pages are reachable from the main navigation

**Todo List:**
1. Install `react-router-dom`; set up routes in `App.jsx` for `/`, `/early-steps`, `/age-3-transition`, `/school-eval-iep`, `/letter`
2. Create `src/pages/EarlySteps.jsx` with content on the Florida Early Steps program (eligibility, referral, IFSP)
3. Create `src/pages/AgeThreeTransition.jsx` with content on the transition process (evaluation, IEP vs IFSP, timelines)
4. Create `src/pages/SchoolEvalIEP.jsx` with content on requesting an evaluation, the 60-day timeline, and IEP rights
5. Create `src/components/NavBar.jsx` with links to all pages and the language toggle
6. Add i18n keys for all page content to `en.json` and `es.json`

**Relevant Context:**
- Official sources: floridahealth.gov/EarlySteps, Broward County Public Schools ESE department
- See SPEC.md §2 (Resource pages row)

---

## Sub-Task 9 — Accessibility Pass and Demo Polish

**Status:** `[ ] pending`

**Intent:** Ensure the app meets WCAG 2.1 AA, looks polished on mobile, and is ready for the 3-minute recorded demo.

**Expected Outcomes:**
- No critical accessibility violations (run axe DevTools or Lighthouse)
- All interactive elements have visible focus styles
- Color contrast passes AA on all badges and buttons
- The demo flow in SPEC.md §7 works end-to-end on a mobile viewport
- README.md updated with project description, live URL, and screenshot

**Todo List:**
1. Run Lighthouse accessibility audit; fix any critical issues
2. Add `aria-label` to icon buttons (chat open/close, language toggle)
3. Confirm keyboard navigation: Tab through provider cards, open chat, submit update form, use letter generator
4. Check color contrast on availability badges (Accepting = green, Waitlist = yellow, Unknown = gray)
5. Add a skip-to-main-content link in the layout
6. Update `README.md`: project description, Vercel live URL, how to run locally, tech stack
7. Do a full run-through of the SPEC.md §7 demo script and fix anything that breaks

**Relevant Context:**
- Demo script: SPEC.md §7
- Challenge deadline: Dec 2, 2026

---

## Sub-Task 10 — Challenge Submission Materials

**Status:** `[ ] pending`

**Intent:** Prepare all required IBM AI for Good Challenge submission artifacts before the Dec 2, 2026 deadline.

**Expected Outcomes:**
- 3-minute spoken video recorded and ready to upload (follows demo script in SPEC.md §7)
- Presentation slides created (problem, solution, AI approach, IBM Granite + Bob usage, impact)
- Project page written covering: problem statement, AI and technical approach, how IBM Bob was used, team info
- IBM SkillsBuild certificate obtained (complete the required SkillsBuild course if not already done)
- GitHub repo is public, has a clean README, and the Vercel demo URL is confirmed working

**Todo List:**
1. Verify the SkillsBuild course requirement and complete it if not done; download the certificate
2. Draft the project page content: problem statement, AI/technical approach (Granite for chat and letters, safety filter, Supabase for shared availability), how IBM Bob was used (planning, code generation, plan file tracking), team info (solo developer)
3. Create presentation slides (5–7 slides): problem, solution demo screenshots, architecture, responsible AI, IBM tools used, impact/next steps
4. Record the 3-minute spoken video following SPEC.md §7 demo script; use the live Vercel URL on a mobile viewport
5. Confirm GitHub repo is public; README has the live URL, description, and stack
6. Submit all materials before Dec 2, 2026

**Relevant Context:**
- Submission requirements: SPEC.md §8 Assumption 9
- Demo script: SPEC.md §7
- IBM Bob usage: planning sessions documented in `devlog.md`
