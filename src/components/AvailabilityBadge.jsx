const STATUS_CONFIG = {
  accepting: {
    label: 'Accepting',
    classes: 'bg-green-100 text-green-800',
  },
  'not accepting': {
    label: 'Not accepting',
    classes: 'bg-red-100 text-red-800',
  },
  waitlist: {
    label: 'Waitlist',
    classes: 'bg-yellow-100 text-yellow-800',
  },
  'no answer': {
    label: 'No answer',
    classes: 'bg-gray-100 text-gray-700',
  },
  unknown: {
    label: 'Unknown',
    classes: 'bg-gray-100 text-gray-500',
  },
}

export default function AvailabilityBadge({ status, lastVerified }) {
  const key = (status ?? 'unknown').toLowerCase()
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
        <p className="text-xs text-gray-500 italic">
          Availability not yet verified — call to confirm.
        </p>
      )}
      {!isUnknown && lastVerified && (
        <p className="text-xs text-gray-400">Verified {lastVerified}</p>
      )}
    </div>
  )
}
