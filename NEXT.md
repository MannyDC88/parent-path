# NEXT — Immediate Next 3 Tasks

> Updated: 2026-11-06 (Revision 2)
> Status: Week 1 — Project Scaffold

---

## Task 1 · Scaffold the React + Vite project, provision Supabase, deploy to Vercel

**Goal:** Get a working app shell running locally, the Supabase `availability_updates` table created, and everything deployed to Vercel.

Steps:
1. Run `npm create vite@latest . -- --template react` in the repo root
2. Run `npm install`
3. Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer` → `npx tailwindcss init -p`
4. Configure `tailwind.config.js` to scan `./src/**/*.{js,jsx}`
5. Add Tailwind directives to `src/index.css`
6. Replace the Vite boilerplate in `src/App.jsx` with a minimal shell (header, main, footer)
7. Create a free Supabase project at supabase.com; create the `availability_updates` table:
   - `id` uuid PK (auto)
   - `provider_id` text
   - `status` text
   - `updated_at` timestamptz default `now()`
   - `browser_key` text
8. Copy Supabase URL and anon key into `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
9. Push to GitHub → connect repo to Vercel → add the two env vars in Vercel dashboard → confirm live URL

**Done when:** The live Vercel URL loads "Parent Path", and the Supabase table exists with the correct columns.

---

## Task 2 · Curate and create `providers.json` seed data

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

## Task 3 · Build the `ProviderCard` component + Home page list

**Goal:** Render the provider list on the Home page with availability badges and a specialty filter.

Steps:
1. Create `src/components/AvailabilityBadge.jsx` — colored badge: Accepting (green) / Waitlist (yellow) / Unknown (gray) + last-verified date
2. Create `src/components/ProviderCard.jsx` — displays name, specialties, city, phone, website link, and `AvailabilityBadge`
3. Create `src/pages/Home.jsx` — fetches `providers.json`, holds filter state, renders a responsive card grid
4. Add specialty filter buttons (All / Speech / OT / Behavioral) above the grid
5. Wire `<Home />` into `App.jsx`

**Done when:** The home page shows all provider cards with badges, and filter buttons correctly narrow the list on both desktop and mobile viewports.
