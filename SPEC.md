# Parent Path — MVP Specification

> IBM AI for Good Challenge · Broward County, FL · Deadline Dec 2, 2026

---

## 1. Problem Statement

Parents navigating early intervention services in Broward County face two compounding obstacles:

1. **Fragmented information** — Early Steps, the age-3 transition, school evaluations, and therapy providers each live in separate silos with no single starting point.
2. **Stale provider data** — Insurance directories mark providers as "accepting new patients" long after they stop accepting them, wasting families' time.

Parent Path solves both by providing a guided, bilingual resource hub with **parent-reported availability** so the list stays honest.

---

## 2. MVP Scope

### In

| Feature | Description |
|---|---|
| Provider directory | ~20 seed providers (speech, OT, behavioral) with specialty, insurance accepted, city, phone/website |
| Availability badge | "Accepting" / "Waitlist" / "Unknown" with last-verified date and a one-click "I called — update this" button |
| Shared availability updates | Parent-reported updates stored in Supabase (free tier); only `provider_id`, `status`, and `date` stored; one update per provider per browser per day |
| AI navigator | IBM Granite chat assistant answering questions about Early Steps, the age-3 transition, school evaluations, and IEPs — responds in the user's selected language |
| IEP letter generator | Parent answers a few questions; Granite drafts an evaluation/IEP request letter in English or Spanish; no child name stored |
| Bilingual UI | English / Spanish toggle — all UI strings and AI responses in the selected language |
| Resource pages | 3–4 static pages: Early Steps overview, Age-3 Transition, School Evaluation & IEP, How to Use This Site |
| Safety screening | Safety filter using the Granite Guardian model if available on watsonx.ai Lite; otherwise a clearly labeled prompt-based safety filter — blocks harmful or off-topic AI responses |
| Mobile-friendly | Responsive layout; accessible color contrast and focus states |

### Out (post-MVP)

- User accounts or authentication
- Real-time insurance verification
- Provider self-service portal
- Map/geolocation search
- More Florida counties
- Automated provider scraping

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **React + Vite** | You know React; Vite is fast with zero-config; deploys as static files |
| Styling | **Tailwind CSS** | Utility-first, small bundle, easy responsive design |
| Provider data | **JSON flat file** (`/public/data/providers.json`) | No database needed for ~20 providers; editable in any text editor |
| Availability updates | **Supabase free tier** (Postgres) | Shared across all browsers; free up to 500 MB; simple REST API; no auth required for inserts |
| Abuse limiting | **Supabase + browser fingerprint** (date + `provider_id` + hashed browser key) | One update per provider per browser per day; no account needed |
| AI chat + letter generator | **watsonx.ai Lite via REST API** (IBM Granite 3.x) | Free tier; IBM-native; satisfies challenge requirement |
| AI safety | **Granite Guardian model** (if available on Lite tier); otherwise **prompt-based safety filter** — labeled honestly | Blocks harmful or off-topic responses; never called "Granite Guardian" if using prompt-only |
| i18n | **react-i18next** (static JSON locale files) | Simple, well-documented; no backend needed |
| Hosting | **Vercel** (free tier) | Zero-config for Vite/React; environment variable support for API keys |
| Version control | GitHub (`MannyDC88/parent-path`) | Already set up |

### Why Supabase instead of localStorage?

localStorage availability reports are invisible to all other users — the list only improves for the person who typed the update. Supabase free tier provides shared Postgres with a REST API, requiring no backend server, no user accounts, and no cost. The only data stored per update is `provider_id` (text), `status` (enum), and `updated_at` (timestamp) — no PII.

### Why not Python/FastAPI backend?

A backend would require a free persistent server (Render free tier sleeps after inactivity, hurting demo reliability). Calling watsonx.ai directly through a **Vercel Edge Function** keeps the stack serverless, always-on, and free.

---

## 4. Architecture

```
Browser (React + Vite)
│
├── /src/pages/
│   ├── Home.jsx                ← Search + provider list
│   ├── EarlySteps.jsx          ← Static resource page
│   ├── AgeThreeTransition.jsx
│   ├── SchoolEvalIEP.jsx
│   ├── LetterGenerator.jsx     ← IEP/evaluation request letter generator
│   └── HowToUse.jsx
│
├── /src/components/
│   ├── ProviderCard.jsx        ← Card with availability badge + update button
│   ├── AvailabilityBadge.jsx   ← Accepting / Waitlist / Unknown + last-verified
│   ├── ChatWidget.jsx          ← Floating AI chat (Granite)
│   └── LanguageToggle.jsx      ← EN / ES switcher
│
├── /src/api/
│   ├── granite.js              ← Calls /api/chat Vercel Edge Function
│   └── availability.js         ← Reads/writes to Supabase REST API
│
├── /api/
│   ├── chat.js                 ← Vercel Edge Function (proxies to watsonx.ai)
│   └── letter.js               ← Vercel Edge Function (letter generation via Granite)
│
├── /public/data/
│   └── providers.json          ← Seed provider data (developer-curated, verified)
│
└── /src/locales/
    ├── en.json
    └── es.json
```

**Supabase table: `availability_updates`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | auto-generated |
| `provider_id` | text | matches slug in providers.json |
| `status` | text | "accepting" / "waitlist" / "unknown" |
| `updated_at` | timestamptz | server default now() |
| `browser_key` | text | hashed; used for one-per-day rate limiting only; not linked to any identity |

The app reads the most recent update per `provider_id` to show the shared badge.

---

## 5. Responsible AI Approach

| Concern | Mitigation |
|---|---|
| Harmful or off-topic responses | Safety filter using Granite Guardian model if available on Lite tier; otherwise a clearly labeled prompt-based safety filter — response blocked if flagged |
| Privacy | Users are told not to enter names or diagnoses; chats are never stored (session-only); letter generator does not store the child's name |
| Accuracy / hallucination | AI answers only from a grounded system prompt with factual Early Steps / IDEA content; disclaimer shown on every AI response |
| Accessibility | WCAG 2.1 AA color contrast; keyboard navigable chat; `aria-label` on interactive elements |
| Transparency | "Powered by IBM Granite" label in chat widget; "AI answers may not be complete — always verify with your service coordinator" disclaimer; safety mechanism labeled accurately (Guardian model or prompt filter) |
| Data minimalism | Availability updates store only `provider_id`, `status`, and `updated_at` — no names, no location, no device ID beyond a daily rate-limit hash |
| Bilingual AI | Granite is instructed to respond in the user's currently selected language (EN or ES) |

---

## 6. 4-Week Build Plan (Nov 6 – Dec 1)

| Week | Focus | Deliverables |
|---|---|---|
| **Week 1** Nov 6–9 | Project scaffold + data | Vite/React/Tailwind setup, providers.json seed data, Vercel deploy, Supabase table |
| **Week 2** Nov 10–16 | Core UI + AI chat | Home page, ProviderCard, AvailabilityBadge, Supabase update flow, Granite chat widget |
| **Week 3** Nov 17–23 | Letter generator + i18n | IEP letter generator page, EN/ES toggle wired to all AI calls |
| **Week 4** Nov 24–Dec 1 | Resource pages + polish + submission | 3 static pages, accessibility pass, demo recording, submission materials |

**Session cadence:** 3–4 sessions/week × 30–60 min each. Each session = one Bob-assisted subtask.

---

## 7. Demo Plan (3-minute video)

1. Open site on mobile (Vercel URL) — switch to Spanish; confirm all UI text changes
2. Search/filter providers → find a speech therapist → see "Last verified" badge (shared, from Supabase)
3. Click "Update availability" → badge changes → "Thank you" message; note that all users see this update
4. Open AI chat → ask in Spanish "Mi hijo cumple 3 años el próximo mes, ¿qué pasa con sus servicios de Early Steps?" → get a Spanish Granite response with safety filter applied
5. Navigate to Letter Generator → fill in a few fields (no child name) → Granite drafts an IEP request letter in Spanish → show copy/download
6. Navigate to Early Steps page → show bilingual resource content

---

## 8. Assumptions

1. **watsonx.ai Lite** free tier (currently 20 RPS, 50K tokens/month) is sufficient for a 3-minute demo with low concurrent usage.
2. **Supabase free tier** (500 MB Postgres, 2 GB bandwidth/month) is sufficient for MVP availability updates.
3. The seed provider list (~20 providers) will be manually curated and verified by the developer. Bob must not invent provider names, phone numbers, or websites.
4. **No user accounts** means abuse limits rely on a hashed browser key + date; determined spammers could work around this. Accepted risk for a demo tool.
5. The Granite Guardian model endpoint availability on watsonx.ai Lite will be verified at setup. If it is not available, a prompt-based safety filter will be used and labeled clearly as such — it will not be called "Granite Guardian."
6. **Vercel Edge Functions** are used to proxy the watsonx.ai API key — the key is never exposed to the browser.
7. AI responses (chat and letter generator) will be in the user's currently selected language (EN or ES). The `lang` value is passed to the Edge Function and included in the system prompt instruction.
8. The Granite model ID (e.g., `ibm/granite-3-8b-instruct`) must be verified against the actual Lite-tier model catalog at setup time, since model names and availability change. The plan uses `ibm/granite-3-8b-instruct` as a placeholder.
9. The IBM AI for Good Challenge submission requires: a 3-minute spoken video, presentation slides, a project page (problem statement, AI and technical approach, how IBM Bob was used), team info, and the IBM SkillsBuild certificate. A final sub-task covers all submission materials.
