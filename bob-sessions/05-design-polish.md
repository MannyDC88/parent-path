# Restyle the app to match this approved design, then fix two small bugs. Do not change data, Supabase queries, or schema, and do not edit providers.json.

DESIGN (styling only)
- Fonts: load Fraunces (weight 500, for headings) and Inter (400 and 500, for body) from Google Fonts via <link> in index.html. No npm packages.
- Colors (add to the Tailwind theme):
  - page background cream #FAF7F2, text warm charcoal #2B2A27, muted text #6B655C
  - primary deep sage #3F5E4A (header background, active filter button, phone links)
  - borders sand #E7DFD3; specialty pills bg #F3EBDD text #6B5A3E; footer bg #F1EADF
- Header: deep sage background, "Parent Path" in Fraunces ~30px, cream text #F6F3EC; subtitle in #D9E4DB: "Find therapy for your child in Broward — and see who's really accepting new patients."
- Section heading "Provider directory" in Fraunces, short muted description under it.
- Filter buttons: rounded pills; active = sage fill with white text; inactive = white with sand border.
- Cards: white, 14px rounded corners, thin sand border, roomy padding; provider name in Fraunces.
- Badges: accepting bg #E2EDDF text #2F5A35; waitlist ochre (bg #F6EBD3 text #7A5A1E); not_accepting muted clay (bg #F5E1DA text #8A3B26); no_answer and unknown bg #EFEBE4 text #5F5A52. Keep WCAG AA contrast.
- Report buttons: small white pills with sand border; selected = sage.
- Footer: #F1EADF background, centered small muted text; keep the disclaimer wording.
- Keep it mobile-friendly. BUG FIXES
1. In Home.jsx, pass an onAvailabilityUpdate callback to ProviderCard that updates that provider's availability and lastVerified in the providers state, so the badge stays correct after switching filters.
2. In ProviderCard, after a duplicate (23505) error, reset selectedStatus so no button looks selected.

Run npm run build to confirm no errors, then add a dated devlog.md entry. Keep it concise.

---

**Status:** active  **Date:** 2026-11-19

---

### 👤 User

Restyle the app to match this approved design, then fix two small bugs. Do not change data, Supabase queries, or schema, and do not edit providers.json.

DESIGN (styling only)
- Fonts: load Fraunces (weight 500, for headings) and Inter (400 and 500, for body) from Google Fonts via <link> in index.html. No npm packages.
- Colors (add to the Tailwind theme):
  - page background cream #FAF7F2, text warm charcoal #2B2A27, muted text #6B655C
  - primary deep sage #3F5E4A (header background, active filter button, phone links)
  - borders sand #E7DFD3; specialty pills bg #F3EBDD text #6B5A3E; footer bg #F1EADF
- Header: deep sage background, "Parent Path" in Fraunces ~30px, cream text #F6F3EC; subtitle in #D9E4DB: "Find therapy for your child in Broward — and see who's really accepting new patients."
- Section heading "Provider directory" in Fraunces, short muted description under it.
- Filter buttons: rounded pills; active = sage fill with white text; inactive = white with sand border.
- Cards: white, 14px rounded corners, thin sand border, roomy padding; provider name in Fraunces.
- Badges: accepting bg #E2EDDF text #2F5A35; waitlist ochre (bg #F6EBD3 text #7A5A1E); not_accepting muted clay (bg #F5E1DA text #8A3B26); no_answer and unknown bg #EFEBE4 text #5F5A52. Keep WCAG AA contrast.
- Report buttons: small white pills with sand border; selected = sage.
- Footer: #F1EADF background, centered small muted text; keep the disclaimer wording.
- Keep it mobile-friendly. BUG FIXES
1. In Home.jsx, pass an onAvailabilityUpdate callback to ProviderCard that updates that provider's availability and lastVerified in the providers state, so the badge stays correct after switching filters.
2. In ProviderCard, after a duplicate (23505) error, reset selectedStatus so no button looks selected.

Run npm run build to confirm no errors, then add a dated devlog.md entry. Keep it concise.

---

### 🤖 Assistant

> 🔧 called: update_todo_list



> 🔧 **update_todo_list** — 
[-] Explore project structure and read existing files
[ ] Update index.html with Google Fonts link
[ ] Update tailwind.config with new colors and fonts
[ ] Restyle App/layout (header, footer, page background)
[ ] Restyle Home.jsx (section heading, filter buttons)
[ ] Restyle ProviderCard.jsx (card, badges, report buttons)
[ ] Bug fix 1: onAvailabilityUpdate callback in Home.jsx → ProviderCard
[ ] Bug fix 2: Reset selectedStatus after 23505 duplicate error in ProviderCard
[ ] Run npm run build to confirm no errors
[ ] Add dated devlog.md entry


### 🤖 Assistant

> 🔧 called: list_files



> 🔧 **list_files** — c:\Users\ManuelCastillo\Projects\parent-path

### 🤖 Assistant

> 🔧 called: list_files, read_file



> 🔧 **read_file** — c:\Users\ManuelCastillo\Projects\parent-path\index.html

> 🔧 **list_files** — c:\Users\ManuelCastillo\Projects\parent-path\src

### 🤖 Assistant

> 🔧 called: read_file, read_file, read_file



> 🔧 **read_file** — c:\Users\ManuelCastillo\Projects\parent-path\src\App.jsx

> 🔧 **read_file** — c:\Users\ManuelCastillo\Projects\parent-path\src\pages\Home.jsx

> 🔧 **read_file** — c:\Users\ManuelCastillo\Projects\parent-path\src\components\ProviderCard.jsx

### 🤖 Assistant

> 🔧 called: read_file, read_file



> 🔧 **read_file** — tailwind config colors fonts content paths

> 🔧 **read_file** — full content of AvailabilityBadge.jsx including all status styles

### 🤖 Assistant

> 🔧 called: read_file, read_file



> 🔧 **read_file** — tailwind config theme extend colors fonts

> 🔧 **read_file** — full content of index.css including tailwind config

### 🤖 Assistant

> 🔧 called: update_todo_list

This is Tailwind CSS v4, which uses CSS-based configuration (no `tailwind.config.js`). I need to add theme variables directly in `index.css` using `@theme`. Now I have everything I need to proceed with all changes.

> 🔧 **update_todo_list** — 
[x] Explore project structure and read existing files
[-] Update index.html with Google Fonts link
[ ] Update index.css with Tailwind v4 @theme variables (colors + fonts)
[ ] Restyle App.jsx (header, footer, page background)
[ ] Restyle Home.jsx (section heading, filter buttons)
[ ] Restyle ProviderCard.jsx (card, badges, report buttons)
[ ] Restyle AvailabilityBadge.jsx (new badge colors)
[ ] Bug fix 1: onAvailabilityUpdate callback in Home.jsx → ProviderCard
[ ] Bug fix 2: Reset selectedStatus after 23505 duplicate error in ProviderCard
[ ] Run npm run build to confirm no errors
[ ] Add dated devlog.md entry


### 🤖 Assistant

> 🔧 called: apply_diff



> 🔧 **apply_diff** — c:\Users\ManuelCastillo\Projects\parent-path\index.html

### 🤖 Assistant

> 🔧 called: write_file

Now update `index.css` with Tailwind v4 `@theme` block:

> 🔧 **write_file** — c:\Users\ManuelCastillo\Projects\parent-path\src\index.css

### 🤖 Assistant

> 🔧 called: update_todo_list

Now restyle [`App.jsx`](src/App.jsx):

> 🔧 **update_todo_list** — 
[x] Explore project structure and read existing files
[x] Update index.html with Google Fonts link
[x] Update index.css with Tailwind v4 @theme variables (colors + fonts)
[-] Restyle App.jsx (header, footer, page background)
[ ] Restyle Home.jsx (section heading, filter buttons)
[ ] Restyle ProviderCard.jsx (card, badges, report buttons)
[ ] Restyle AvailabilityBadge.jsx (new badge colors)
[ ] Bug fix 1: onAvailabilityUpdate callback in Home.jsx → ProviderCard
[ ] Bug fix 2: Reset selectedStatus after 23505 duplicate error in ProviderCard
[ ] Run npm run build to confirm no errors
[ ] Add dated devlog.md entry


### 🤖 Assistant

> 🔧 called: apply_diff



> 🔧 **apply_diff** — c:\Users\ManuelCastillo\Projects\parent-path\src\App.jsx

### 🤖 Assistant

> 🔧 called: update_todo_list

Now restyle [`Home.jsx`](src/pages/Home.jsx) and apply bug fix 1 simultaneously:

> 🔧 **update_todo_list** — 
[x] Explore project structure and read existing files
[x] Update index.html with Google Fonts link
[x] Update index.css with Tailwind v4 @theme variables (colors + fonts)
[x] Restyle App.jsx (header, footer, page background)
[-] Restyle Home.jsx (section heading, filter buttons) + Bug fix 1: onAvailabilityUpdate callback
[ ] Restyle ProviderCard.jsx (card, badges, report buttons)
[ ] Restyle AvailabilityBadge.jsx (new badge colors)
[ ] Bug fix 2: Reset selectedStatus after 23505 duplicate error in ProviderCard
[ ] Run npm run build to confirm no errors
[ ] Add dated devlog.md entry


### 🤖 Assistant

> 🔧 called: write_file



> 🔧 **write_file** — import { useEffect, useState } from 'react'
import ProviderCard from '../components/ProviderCard'
import { getLatestAvailability } from '../api/availability'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Speech', value: 'speech' },
  { label: 'OT', value: 'OT' },
  { label: 'Behavioral', value: 'behavioral' },
]

export default function Home() {
  const [providers, setProviders] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/providers.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load provider data.')
        return res.json()
      })
      .then(async (data) => {
        const ids = data.map((p) => p.id)
        const supabaseRows = await getLatestAvailability(ids)

        // Build a lookup map keyed by provider_id
        const lookup = {}
        for (const row of supabaseRows) {
          lookup[row.provider_id] = row
        }

        // Merge: Supabase data takes precedence over JSON defaults
        const merged = data.map((p) => {
          const row = lookup[p.id]
          if (!row) return p
          const verifiedDate = new Date(row.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          return { ...p, availability: row.status, lastVerified: verifiedDate }
        })

        setProviders(merged)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  function handleAvailabilityUpdate(id, status, verifiedDate) {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, availability: status, lastVerified: verifiedDate } : p
      )
    )
  }

  const filtered =
    activeFilter === 'all'
      ? providers
      : providers.filter((p) => p.specialties?.includes(activeFilter))

  return (
    <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
      <h2
        className="text-2xl text-charcoal mb-1"
        style={{ fontFamily: 'Fraunces, serif', fontWeight: 500 }}
      >
        Provider directory
      </h2>
      <p className="text-sm text-muted mb-6">
        Broward County pediatric therapy providers. Call ahead to verify availability.
      </p>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            aria-pressed={activeFilter === f.value}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
              activeFilter === f.value
                ? 'bg-sage text-white border-sage'
                : 'bg-white text-charcoal border-sand hover:border-sage hover:text-sage'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <p className="text-muted text-sm">Loading providers…</p>
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-muted text-sm">No providers match this filter.</p>
      )}

      {/* Responsive grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onAvailabilityUpdate={handleAvailabilityUpdate}
            />
          ))}
        </div>
      )}
    </main>
  )
}


### 🤖 Assistant

> 🔧 called: update_todo_list

Now restyle [`ProviderCard.jsx`](src/components/ProviderCard.jsx) and apply bug fix 2:

> 🔧 **update_todo_list** — 
[x] Explore project structure and read existing files
[x] Update index.html with Google Fonts link
[x] Update index.css with Tailwind v4 @theme variables (colors + fonts)
[x] Restyle App.jsx (header, footer, page background)
[x] Restyle Home.jsx (section heading, filter buttons) + Bug fix 1: onAvailabilityUpdate callback
[-] Restyle ProviderCard.jsx (card, badges, report buttons) + Bug fix 2: reset selectedStatus on 23505
[ ] Restyle AvailabilityBadge.jsx (new badge colors)
[ ] Run npm run build to confirm no errors
[ ] Add dated devlog.md entry


### 🤖 Assistant

> 🔧 called: write_file



> 🔧 **write_file** — import { useState } from 'react'
import AvailabilityBadge from './AvailabilityBadge'
import { submitAvailabilityUpdate } from '../api/availability'
import { supabase } from '../lib/supabase'

const SPECIALTY_LABELS = {
  speech: 'Speech',
  OT: 'OT',
  PT: 'PT',
  behavioral: 'Behavioral',
  feeding: 'Feeding',
}

const REPORT_STATUSES = [
  { value: 'accepting', label: 'Accepting' },
  { value: 'not_accepting', label: 'Not accepting' },
  { value: 'waitlist', label: 'Waitlist' },
  { value: 'no_answer', label: 'No answer' },
]

export default function ProviderCard({ provider, onAvailabilityUpdate }) {
  const {
    id,
    name,
    specialties,
    city,
    phone,
    website,
    insurances,
    availability,
    lastVerified,
    notes,
  } = provider

  const [currentStatus, setCurrentStatus] = useState(availability)
  const [currentVerified, setCurrentVerified] = useState(lastVerified)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)

  async function handleReport(status) {
    setSubmitting(true)
    setMessage(null)
    setSelectedStatus(status)
    const { error } = await submitAvailabilityUpdate(id, status)
    setSubmitting(false)
    if (!error) {
      const verifiedDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      setCurrentStatus(status)
      setCurrentVerified(verifiedDate)
      setMessage('Thanks, your report helps other parents.')
      if (onAvailabilityUpdate) onAvailabilityUpdate(id, status, verifiedDate)
    } else if (error.code === '23505') {
      setSelectedStatus(null)
      setMessage('You already reported this provider today.')
    } else {
      setMessage('Something went wrong. Please try again.')
      setSelectedStatus(null)
    }
  }

  return (
    <div className="bg-white rounded-[14px] border border-sand p-5 flex flex-col gap-3">
      {/* Name */}
      <h2
        className="text-base leading-snug text-charcoal"
        style={{ fontFamily: 'Fraunces, serif', fontWeight: 500 }}
      >
        {name}
      </h2>

      {/* Availability badge */}
      <AvailabilityBadge status={currentStatus} lastVerified={currentVerified} />

      {/* Specialties */}
      {specialties && specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-pill-bg text-pill-text text-xs px-2.5 py-0.5 font-medium"
            >
              {SPECIALTY_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      )}

      {/* City + phone */}
      <div className="text-sm text-charcoal flex flex-col gap-0.5">
        <span className="text-muted">{city}</span>
        <a
          href={`tel:${phone.replace(/\D/g, '')}`}
          className="text-sage hover:underline font-medium"
        >
          {phone}
        </a>
      </div>

      {/* Website — only if not null */}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-sage hover:underline break-all"
        >
          {website.replace(/^https?:\/\//, '')}
        </a>
      )}

      {/* Insurances — only if list is non-empty */}
      {insurances && insurances.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
            Insurance
          </p>
          <p className="text-sm text-charcoal">{insurances.join(', ')}</p>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <p className="text-xs text-muted border-t border-sand pt-2">{notes}</p>
      )}

      {/* Report availability — only shown when Supabase is configured */}
      {supabase && (
        <div className="border-t border-sand pt-3 flex flex-col gap-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Report availability
          </p>
          <div className="flex flex-wrap gap-1.5">
            {REPORT_STATUSES.map(({ value, label }) => {
              const isPressed = selectedStatus === value
              return (
                <button
                  key={value}
                  onClick={() => !submitting && handleReport(value)}
                  disabled={submitting}
                  aria-pressed={isPressed}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors disabled:opacity-50 ${
                    isPressed
                      ? 'bg-sage text-white border-sage'
                      : 'bg-white text-charcoal border-sand hover:border-sage hover:text-sage'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          {message && (
            <p className="text-xs text-muted italic">{message}</p>
          )}
        </div>
      )}
    </div>
  )
}


### 🤖 Assistant

> 🔧 called: update_todo_list

Now restyle [`AvailabilityBadge.jsx`](src/components/AvailabilityBadge.jsx):

> 🔧 **update_todo_list** — 
[x] Explore project structure and read existing files
[x] Update index.html with Google Fonts link
[x] Update index.css with Tailwind v4 @theme variables (colors + fonts)
[x] Restyle App.jsx (header, footer, page background)
[x] Restyle Home.jsx (section heading, filter buttons) + Bug fix 1: onAvailabilityUpdate callback
[x] Restyle ProviderCard.jsx (card, badges, report buttons) + Bug fix 2: reset selectedStatus on 23505
[-] Restyle AvailabilityBadge.jsx (new badge colors)
[ ] Run npm run build to confirm no errors
[ ] Add dated devlog.md entry


### 🤖 Assistant

> 🔧 called: write_file



> 🔧 **write_file** — const STATUS_CONFIG = {
  accepting: {
    label: 'Accepting',
    classes: 'bg-badge-accepting-bg text-badge-accepting-text',
  },
  not_accepting: {
    label: 'Not accepting',
    classes: 'bg-badge-not-accepting-bg text-badge-not-accepting-text',
  },
  waitlist: {
    label: 'Waitlist',
    classes: 'bg-badge-waitlist-bg text-badge-waitlist-text',
  },
  no_answer: {
    label: 'No answer',
    classes: 'bg-badge-neutral-bg text-badge-neutral-text',
  },
  unknown: {
    label: 'Unknown',
    classes: 'bg-badge-neutral-bg text-badge-neutral-text',
  },
}

export default function AvailabilityBadge({ status, lastVerified }) {
  const key = status ?? 'unknown'
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.unknown
  const isUnknown = key === 'unknown'

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit ${config.classes}`}
      >
        {config.label}
      </span>
      {isUnknown && (
        <p className="text-xs text-muted italic">
          Availability not yet verified — call to confirm.
        </p>
      )}
      {!isUnknown && lastVerified && (
        <p className="text-xs text-muted">Verified {lastVerified}</p>
      )}
    </div>
  )
}


### 🤖 Assistant

> 🔧 called: update_todo_list

Now run the build:

> 🔧 **update_todo_list** — 
[x] Explore project structure and read existing files
[x] Update index.html with Google Fonts link
[x] Update index.css with Tailwind v4 @theme variables (colors + fonts)
[x] Restyle App.jsx (header, footer, page background)
[x] Restyle Home.jsx (section heading, filter buttons) + Bug fix 1: onAvailabilityUpdate callback
[x] Restyle ProviderCard.jsx (card, badges, report buttons) + Bug fix 2: reset selectedStatus on 23505
[x] Restyle AvailabilityBadge.jsx (new badge colors)
[-] Run npm run build to confirm no errors
[ ] Add dated devlog.md entry


### 🤖 Assistant

> 🔧 called: execute_command



> 🔧 **execute_command** — npm run build 2>&1

### 🤖 Assistant

> 🔧 called: execute_command



> 🔧 **execute_command** — & "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build 2>&1

### 🤖 Assistant

> 🔧 called: read_file

Build is clean. Now add the devlog entry:

> 🔧 **read_file** — most recent devlog entry and format

### 🤖 Assistant

> 🔧 called: read_file



> 🔧 **read_file** — line numbers at end of file

### 🤖 Assistant

> 🔧 called: insert_content



> 🔧 **insert_content** — c:\Users\ManuelCastillo\Projects\parent-path\devlog.md

### 🤖 Assistant

> 🔧 called: update_todo_list



> 🔧 **update_todo_list** — 
[x] Explore project structure and read existing files
[x] Update index.html with Google Fonts link
[x] Update index.css with Tailwind v4 @theme variables (colors + fonts)
[x] Restyle App.jsx (header, footer, page background)
[x] Restyle Home.jsx (section heading, filter buttons) + Bug fix 1: onAvailabilityUpdate callback
[x] Restyle ProviderCard.jsx (card, badges, report buttons) + Bug fix 2: reset selectedStatus on 23505
[x] Restyle AvailabilityBadge.jsx (new badge colors)
[x] Run npm run build to confirm no errors
[x] Add dated devlog.md entry


### 🤖 Assistant

Everything done. Here's a summary of every change made:

---

### Files changed

**[`index.html`](index.html)** — Added `<link rel="preconnect">` and the Google Fonts stylesheet for Fraunces 500 and Inter 400/500. No npm packages.

**[`src/index.css`](src/index.css)** — Added a Tailwind v4 `@theme` block defining all design tokens as CSS custom properties: `--font-sans` (Inter), `--font-heading` (Fraunces), and all color tokens for the page, header, footer, badges, specialty pills, and borders.

**[`src/App.jsx`](src/App.jsx)** — Header: deep sage background, Fraunces 30px cream title, updated subtitle copy in `#D9E4DB`. Body: cream background. Footer: `#F1EADF` bg with sand border.

**[`src/pages/Home.jsx`](src/pages/Home.jsx)** — Section heading "Provider directory" in Fraunces. Filter pills: active = sage fill/white text, inactive = white/sand border. All gray utility classes replaced with design tokens.
- **Bug fix 1:** Added `handleAvailabilityUpdate(id, status, verifiedDate)` that updates the matching provider in state via `setProviders`. Passed as `onAvailabilityUpdate` prop to every `<ProviderCard>` — the badge now reflects the reported status even after switching filters.

**[`src/components/ProviderCard.jsx`](src/components/ProviderCard.jsx)** — Card: 14px radius, sand border, roomy padding. Provider name in Fraunces. Specialty pills: warm sand tones. Phone/website links: sage. Report buttons: sage active state, white/sand inactive. All gray references replaced with tokens.
- **Bug fix 2:** In the `23505` duplicate-error branch, `setSelectedStatus(null)` is now called so no report button stays pressed after a duplicate-submission error.

**[`src/components/AvailabilityBadge.jsx`](src/components/AvailabilityBadge.jsx)** — All five badge statuses updated: accepting → green `#E2EDDF/#2F5A35`, waitlist → ochre `#F6EBD3/#7A5A1E`, not_accepting → clay `#F5E1DA/#8A3B26`, no_answer/unknown → neutral `#EFEBE4/#5F5A52`.

**[`devlog.md`](devlog.md)** — Dated Session 6 entry added.

Build: ✓ 72 modules, 0 errors, 0 warnings.