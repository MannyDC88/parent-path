import { useEffect, useState } from 'react'
import ProviderCard from '../components/ProviderCard'

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
      .then((data) => {
        setProviders(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filtered =
    activeFilter === 'all'
      ? providers
      : providers.filter((p) => p.specialties?.includes(activeFilter))

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Provider Directory</h2>
      <p className="text-sm text-gray-500 mb-5">
        Broward County pediatric therapy providers. Call ahead to verify availability.
      </p>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
              activeFilter === f.value
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <p className="text-gray-400 text-sm">Loading providers…</p>
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No providers match this filter.</p>
      )}

      {/* Responsive grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </main>
  )
}
