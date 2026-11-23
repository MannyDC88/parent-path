import { useEffect, useState } from 'react'
import ProviderCard from '../components/ProviderCard'
import { getLatestAvailability } from '../api/availability'
import { SPECIALTY_COLORS, SPECIALTY_ORDER, SPECIALTY_LABELS } from '../utils/specialtyPills'

export default function Home() {
  const [providers, setProviders] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Specialties present in the loaded data, ordered by SPECIALTY_ORDER
  const [availableFilters, setAvailableFilters] = useState([])

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

        // Derive filter list from actual data, respecting SPECIALTY_ORDER
        const presentSet = new Set(merged.flatMap((p) => p.specialties ?? []))
        const filters = SPECIALTY_ORDER.filter((s) => presentSet.has(s))

        setProviders(merged)
        setAvailableFilters(filters)
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
    // pb-24 (96px) gives clearance above the fixed floating chat button (≈44px tall + 20px bottom offset)
    <main className="flex-1 px-4 py-8 pb-24 max-w-5xl mx-auto w-full">
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
        {/* "All" button — keeps existing sage style */}
        <button
          onClick={() => setActiveFilter('all')}
          aria-pressed={activeFilter === 'all'}
          className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1 ${
            activeFilter === 'all'
              ? 'bg-sage text-white border-sage'
              : 'bg-white text-charcoal border-sand hover:border-sage hover:text-sage'
          }`}
        >
          All
        </button>

        {/* Specialty buttons — derived from data, colored from shared util */}
        {availableFilters.map((key) => {
          const isActive = activeFilter === key
          const colors = SPECIALTY_COLORS[key]
          const label = SPECIALTY_LABELS[key] ?? key

          const style = isActive
            ? // Selected: specialty text-color as bg, white text
              { backgroundColor: colors?.color ?? '#6B5A3E', color: '#FFFFFF', borderColor: colors?.color ?? '#6B5A3E' }
            : // Unselected: specialty bg + text, same as pills
              { backgroundColor: colors?.bg ?? '#F3EBDD', color: colors?.color ?? '#6B5A3E', borderColor: colors?.bg ?? '#F3EBDD' }

          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              aria-pressed={isActive}
              style={style}
              className="rounded-full px-4 py-1.5 text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            >
              {label}
            </button>
          )
        })}
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
