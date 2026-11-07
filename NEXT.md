# NEXT — Immediate Next 3 Tasks

> Updated: 2026-11-07 (Sub-Task 1 complete)
> Status: Week 1 — moving to provider seed data

---

## Task 1 · Curate and create `providers.json` seed data  ← **do this next**

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

## Task 2 · Build the `ProviderCard` component + Home page list

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

## Task 3 · Shared Availability Update Flow (Supabase)

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
