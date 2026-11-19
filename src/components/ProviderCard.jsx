import AvailabilityBadge from './AvailabilityBadge'

const SPECIALTY_LABELS = {
  speech: 'Speech',
  OT: 'OT',
  PT: 'PT',
  behavioral: 'Behavioral',
  feeding: 'Feeding',
}

export default function ProviderCard({ provider }) {
  const {
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
      {/* Name */}
      <h2 className="text-base font-semibold text-gray-900 leading-snug">{name}</h2>

      {/* Availability badge */}
      <AvailabilityBadge status={availability} lastVerified={lastVerified} />

      {/* Specialties */}
      {specialties && specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-blue-50 text-blue-700 text-xs px-2 py-0.5 font-medium"
            >
              {SPECIALTY_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      )}

      {/* City + phone */}
      <div className="text-sm text-gray-700 flex flex-col gap-0.5">
        <span>{city}</span>
        <a
          href={`tel:${phone.replace(/\D/g, '')}`}
          className="text-blue-700 hover:underline font-medium"
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
          className="text-sm text-blue-700 hover:underline break-all"
        >
          {website.replace(/^https?:\/\//, '')}
        </a>
      )}

      {/* Insurances — only if list is non-empty */}
      {insurances && insurances.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Insurance
          </p>
          <p className="text-sm text-gray-700">{insurances.join(', ')}</p>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <p className="text-xs text-gray-500 border-t border-gray-100 pt-2">{notes}</p>
      )}
    </div>
  )
}
