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
      setMessage('You already reported this provider today.')
    } else {
      setMessage('Something went wrong. Please try again.')
      setSelectedStatus(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
      {/* Name */}
      <h2 className="text-base font-semibold text-gray-900 leading-snug">{name}</h2>

      {/* Availability badge */}
      <AvailabilityBadge status={currentStatus} lastVerified={currentVerified} />

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

      {/* Report availability — only shown when Supabase is configured */}
      {supabase && (
        <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          {message && (
            <p className="text-xs text-gray-600 italic">{message}</p>
          )}
        </div>
      )}
    </div>
  )
}
