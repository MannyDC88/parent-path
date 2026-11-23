# NEXT — Immediate Next 3 Tasks

> Updated: 2026-11-23 (Session 9 complete — UI polish: color accents, header alignment, page feedback)
> Status: Week 2 — provider directory + AI chat + polish live

---

## Task 1 · Curate and create `providers.json` seed data  ✅ done

**Goal:** Hand-curate ~20 real, verified Broward County therapy providers and write the JSON file.

**Important:** Bob must not invent provider names, phone numbers, or websites. All data must come from your own research and direct verification.

Sources to use:
- Broward County Public Schools ESE provider directory
- Florida Medicaid provider search
- Direct phone/website verification

Schema per provider:
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

Create `/public/data/providers.json` with only providers you have personally verified.

**Done when:** `/public/data/providers.json` contains ≥15 verified entries and passes `JSON.parse` without errors.

---

## Task 2 · Build the `ProviderCard` component + Home page list  ✅ done

**Goal:** Render the provider list on the Home page with availability badges and a specialty filter.

Availability badge statuses (updated): **Accepting** / **Not accepting** / **Waitlist** / **No answer** / **Unknown**

Steps:
1. Create `src/components/AvailabilityBadge.jsx` — colored badge for each status + last-verified date
2. Create `src/components/ProviderCard.jsx` — displays name, specialties, city, phone, website link, and `AvailabilityBadge`
3. Create `src/pages/Home.jsx` — fetches `providers.json`, holds filter state, renders a responsive card grid
4. Add specialty filter buttons (All / Speech / OT / Behavioral) above the grid
5. Replace the placeholder `<Home />` in `App.jsx` with the real page

**Done when:** The home page shows all provider cards with badges, and filter buttons correctly narrow the list on both desktop and mobile viewports.

---

## Task 4 · Parent Path AI Chat Assistant  ✅ done

**Goal:** Integrate IBM Granite chatbot into the existing app.

**What was done:**
- `api/_knowledge.js` — system prompt, verified facts, providers (server-side only)
- `api/chat.js` — Vercel serverless function: IAM token caching, message validation, watsonx.ai Granite call, privacy-safe error handling
- `src/components/ChatAssistant.jsx` — floating button, responsive chat panel, 👍/👎 feedback (logs rating + lang to Supabase, no message text)
- `supabase/chat_feedback.sql` — schema to review and run manually
- `src/App.jsx` — `<ChatAssistant />` wired into layout

**Pre-requisite before testing:** Add `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL` to Vercel server-side env vars (no VITE_ prefix). Run `supabase/chat_feedback.sql` in Supabase SQL editor.

---

## Task 5 · Provider cards in chat (AI guidance + data-driven cards)  ✅ done

**Goal:** Separate AI guidance from provider data to prevent hallucinated insurance/availability.

**What was done:**
- `api/_knowledge.js` — removed PROVIDERS from system prompt; exported `PROVIDERS` for server use
- `api/chat.js` — deterministic keyword matching returns `{ reply, providers: [...] }`
- `src/components/ChatAssistant.jsx` — `ProviderMiniCard` + `ProviderCards` with live Supabase availability badges, tap-to-call phone, insurance fallback, "See all providers" link

---

## Task 3 · Shared Availability Update Flow (Supabase)  ✅ done

**Goal:** Wire up the Supabase `availability_updates` table so parent-reported status changes are shared across all browsers.

Pre-requisite: Run `supabase/schema.sql` in the Supabase SQL editor and add your `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to `.env.local`.

Steps:
1. Install `@supabase/supabase-js`
2. Create `src/api/availability.js` — `getLatestAvailability(providerIds)` reads from the `latest_availability` view; `submitAvailabilityUpdate(providerId, status, browserKey)` inserts a row
3. Create `src/utils/browserKey.js` — stable hashed key from fingerprint fields, stored in **localStorage**
4. Add `AvailabilityUpdateForm` inline to `ProviderCard`
5. Merge Supabase results over JSON defaults on Home page load
6. Test end-to-end: submit from one browser, confirm another browser sees the update; submit twice in one day, confirm the second is blocked

**Done when:** Badge reflects Supabase data across browsers; duplicate submissions are rejected.

---

## Task 6 · Deploy `page_feedback` table to Supabase

**Pre-requisite:** Session 9 is merged and deployed.

Steps:
1. Open the Supabase SQL editor for the `parent-path` project.
2. Paste and run `supabase/page_feedback.sql`.
3. Test: submit "Yes" with a comment and confirm a row appears in the `page_feedback` table.
4. Test: submit "No" with no comment; confirm `comment` is `null`.
5. Test: attempt to SELECT from `page_feedback` as anon — should return "permission denied".

**Done when:** Rows insert successfully; anon cannot SELECT; RLS is confirmed enabled.
