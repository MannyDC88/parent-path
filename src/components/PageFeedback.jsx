/**
 * PageFeedback.jsx
 *
 * "Was this page helpful?" form in the page footer.
 * - Yes / No buttons, optional comment (max 300 chars, live counter), Send button.
 * - Privacy note in EN and ES.
 * - On submit, inserts a row into Supabase `page_feedback`.
 * - Shows a thank-you message and hides the form after submission.
 * - Degrades silently when Supabase is not configured.
 */

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const MAX_CHARS = 300

export default function PageFeedback({ lang }) {
  const [step, setStep] = useState('prompt') // 'prompt' | 'comment' | 'done'
  const [helpful, setHelpful] = useState(null) // true | false
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleVote(value) {
    setHelpful(value)
    setStep('comment')
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      if (supabase) {
        const { error: dbError } = await supabase.from('page_feedback').insert({
          helpful,
          comment: comment.trim() || null,
          page: window.location.pathname,
          lang: lang === 'es' ? 'es' : 'en',
        })
        if (dbError) throw dbError
      }
      setStep('done')
    } catch {
      setError(
        lang === 'es'
          ? 'No se pudo enviar. Intente de nuevo.'
          : 'Could not send. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done') {
    return (
      <p className="text-sm text-muted text-center" aria-live="polite">
        {lang === 'es' ? '¡Gracias por sus comentarios!' : 'Thanks for your feedback!'}
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-charcoal">
        {lang === 'es' ? '¿Le fue útil esta página?' : 'Was this page helpful?'}
      </p>

      {step === 'prompt' && (
        <div className="flex gap-3">
          <button
            onClick={() => handleVote(true)}
            className="rounded-full px-5 py-1.5 text-sm font-medium border border-sand bg-white text-charcoal hover:border-sage hover:text-sage transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            {lang === 'es' ? 'Sí' : 'Yes'}
          </button>
          <button
            onClick={() => handleVote(false)}
            className="rounded-full px-5 py-1.5 text-sm font-medium border border-sand bg-white text-charcoal hover:border-sage hover:text-sage transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            No
          </button>
        </div>
      )}

      {step === 'comment' && (
        <div className="w-full max-w-sm flex flex-col gap-2">
          <div className="relative">
            <label htmlFor="page-feedback-comment" className="sr-only">
              {lang === 'es' ? 'Comentario opcional' : 'Optional comment'}
            </label>
            <textarea
              id="page-feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, MAX_CHARS))}
              placeholder={
                lang === 'es'
                  ? 'Comentario opcional…'
                  : 'Optional comment…'
              }
              rows={3}
              maxLength={MAX_CHARS}
              className="w-full resize-none rounded-xl border border-sand bg-white px-3 py-2 text-sm text-charcoal placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              disabled={submitting}
            />
            <span
              className="absolute bottom-2 right-3 text-xs text-muted select-none"
              aria-live="polite"
              aria-label={
                lang === 'es'
                  ? `${MAX_CHARS - comment.length} caracteres restantes`
                  : `${MAX_CHARS - comment.length} characters remaining`
              }
            >
              {MAX_CHARS - comment.length}
            </span>
          </div>

          <p className="text-xs text-muted text-center">
            Please don&apos;t include your child&apos;s name or health details.
            {' · '}
            Por favor no incluya el nombre ni datos de salud de su hijo/a.
          </p>

          {error && (
            <p className="text-xs text-red-700 text-center" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="self-center rounded-full px-6 py-1.5 text-sm font-medium bg-sage text-white hover:bg-[#334d3c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1"
          >
            {lang === 'es' ? 'Enviar' : 'Send'}
          </button>
        </div>
      )}
    </div>
  )
}
