const STATUS_CONFIG = {
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
