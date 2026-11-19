import { useState } from 'react'
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
