/**
 * ChatAssistant.jsx
 *
 * Floating "Ask Parent Path / Pregunte" button + chat panel.
 * - Messages stored in React state only (no localStorage, no Supabase).
 * - Feedback (👍/👎) logged to Supabase `chat_feedback` table (rating + lang only).
 * - Provider cards shown under each assistant reply when the server returns matches.
 *   Availability badge uses Supabase data via getLatestAvailability — same as the directory.
 * - Keyboard accessible: Escape closes, focus trap inside panel, aria labels throughout.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getLatestAvailability } from '../api/availability'
import AvailabilityBadge from './AvailabilityBadge'
import { SPECIALTY_LABELS, specialtyPillStyle } from '../utils/specialtyPills'

// ---------------------------------------------------------------------------
// Language detection
// ---------------------------------------------------------------------------
const SPANISH_RE = /[áéíóúüñ¿¡]/i
const SPANISH_WORDS = /\b(hola|gracias|cómo|como|qué|que|necesito|tengo|mi|hijo|hija|ayuda|puede|habla|español|necesita|tiene|para|por|favor|con|los|las|una|un|del|también|hay|más|me|le|se|si|no)\b/i

function detectLang(text) {
  if (!text) return 'en'
  if (SPANISH_RE.test(text) || SPANISH_WORDS.test(text)) return 'es'
  return 'en'
}

// ---------------------------------------------------------------------------
// Feedback buttons per assistant message
// ---------------------------------------------------------------------------
function FeedbackButtons({ lang }) {
  const [state, setState] = useState('idle') // 'idle' | 'loading' | 'done'

  async function handleVote(rating) {
    if (state !== 'idle') return
    setState('loading')
    try {
      if (supabase) {
        await supabase.from('chat_feedback').insert({ rating, lang })
      }
      setState('done')
    } catch {
      setState('done') // still show thanks on error — don't surface Supabase errors
    }
  }

  if (state === 'done') {
    return (
      <p className="text-xs text-muted mt-1" aria-live="polite">
        {lang === 'es' ? '¡Gracias!' : 'Thanks!'}
      </p>
    )
  }

  return (
    <div className="flex gap-2 mt-1" role="group" aria-label={lang === 'es' ? 'Califica esta respuesta' : 'Rate this answer'}>
      <button
        onClick={() => handleVote('up')}
        disabled={state !== 'idle'}
        aria-label={lang === 'es' ? 'Respuesta útil' : 'Helpful'}
        className="text-sm px-2 py-0.5 rounded border border-sand hover:border-sage hover:bg-pill-bg disabled:opacity-50 transition-colors"
      >
        👍
      </button>
      <button
        onClick={() => handleVote('down')}
        disabled={state !== 'idle'}
        aria-label={lang === 'es' ? 'Respuesta no útil' : 'Not helpful'}
        className="text-sm px-2 py-0.5 rounded border border-sand hover:border-sage hover:bg-pill-bg disabled:opacity-50 transition-colors"
      >
        👎
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Single provider card
// ---------------------------------------------------------------------------
function ProviderMiniCard({ provider, availability, lang }) {
  const ins =
    provider.insurances && provider.insurances.length > 0
      ? provider.insurances.join(', ')
      : lang === 'es'
        ? 'No listado — pregunte al proveedor'
        : 'Not listed — ask the provider'

  return (
    <div className="rounded-xl border border-sand bg-white px-3 py-2.5 text-xs flex flex-col gap-1">
      {/* Name */}
      <p className="font-semibold text-charcoal text-sm leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 500 }}>
        {provider.name}
      </p>

      {/* City + availability badge */}
      <div className="flex items-start gap-2 flex-wrap">
        <span className="text-muted">{provider.city}</span>
        <AvailabilityBadge
          status={availability?.status ?? 'unknown'}
          lastVerified={availability?.lastVerified ?? null}
        />
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1 mt-0.5">
        {provider.specialties.map((s) => (
          <span
            key={s}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={specialtyPillStyle(s)}
          >
            {SPECIALTY_LABELS[s] ?? s}
          </span>
        ))}
      </div>

      {/* Phone */}
      <a
        href={`tel:${provider.phone.replace(/\D/g, '')}`}
        aria-label={`${lang === 'es' ? 'Llamar a' : 'Call'} ${provider.name}: ${provider.phone}`}
        className="text-sage font-medium hover:underline focus:underline focus:outline-none"
      >
        {provider.phone}
      </a>

      {/* Website (only if present) */}
      {provider.website && (
        <a
          href={provider.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${provider.name} ${lang === 'es' ? 'sitio web (abre en nueva pestaña)' : 'website (opens in new tab)'}`}
          className="text-sage hover:underline focus:underline focus:outline-none break-all"
        >
          {provider.website.replace(/^https?:\/\//, '')}
        </a>
      )}

      {/* Insurance */}
      <p className="text-muted">
        <span className="font-medium text-charcoal">{lang === 'es' ? 'Seguro: ' : 'Insurance: '}</span>
        {ins}
      </p>

      {/* Notes (if any) */}
      {provider.notes && (
        <p className="text-muted italic">{provider.notes}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Provider cards block shown under an assistant reply
// ---------------------------------------------------------------------------
function ProviderCards({ providers, lang }) {
  // Fetch Supabase availability for the matched providers.
  const [availMap, setAvailMap] = useState({}) // { [id]: { status, lastVerified } }

  useEffect(() => {
    if (!providers.length) return
    getLatestAvailability(providers.map((p) => p.id)).then((rows) => {
      const map = {}
      for (const row of rows) {
        const verifiedDate = new Date(row.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
        map[row.provider_id] = { status: row.status, lastVerified: verifiedDate }
      }
      setAvailMap(map)
    })
  }, [providers])

  if (!providers.length) return null

  const footer =
    lang === 'es'
      ? 'Llame antes de ir para confirmar que aceptan nuevos pacientes y su seguro.'
      : 'Call ahead to confirm they\'re taking new patients and accept your insurance.'

  return (
    <div className="mt-3 flex flex-col gap-2">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">
        {lang === 'es' ? 'Proveedores del directorio' : 'From the directory'}
      </p>

      {providers.map((p) => (
        <ProviderMiniCard
          key={p.id}
          provider={p}
          availability={availMap[p.id] ?? null}
          lang={lang}
        />
      ))}

      <p className="text-xs text-muted italic mt-0.5">{footer}</p>

      <a
        href="/"
        className="text-xs text-sage font-medium hover:underline focus:underline focus:outline-none"
        aria-label={lang === 'es' ? 'Ver todos los proveedores en el directorio' : 'See all providers in the directory'}
      >
        {lang === 'es' ? '→ Ver todos los proveedores' : '→ See all providers'}
      </a>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Individual chat message bubble
// ---------------------------------------------------------------------------
function Message({ msg, lang }) {
  const isAssistant = msg.role === 'assistant'
  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isAssistant
            ? 'bg-white border border-sand text-charcoal'
            : 'bg-sage text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>
        {isAssistant && <FeedbackButtons lang={lang} />}
        {isAssistant && msg.providers?.length > 0 && (
          <ProviderCards providers={msg.providers} lang={lang} />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // { role, content, providers? }[]
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const openBtnRef = useRef(null)

  // Detect language from the most recent user message
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
  const lang = detectLang(lastUserMsg?.content)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Escape key to close
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        openBtnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Focus trap inside the panel
  useEffect(() => {
    if (!open || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    function onTab(e) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onTab)
    return () => document.removeEventListener('keydown', onTab)
  }, [open, messages, loading])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, providers: data.providers ?? [] },
      ])
    } catch {
      setError(
        lang === 'es'
          ? 'No se pudo conectar. Por favor intente de nuevo.'
          : 'Could not connect. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [input, messages, loading, lang])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        ref={openBtnRef}
        onClick={() => setOpen(true)}
        aria-label="Ask Parent Path assistant"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 bg-sage text-white rounded-full px-5 py-3 text-sm font-medium shadow-lg hover:bg-[#334d3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 transition-colors"
        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
      >
        Ask Parent Path&nbsp;/&nbsp;Pregunte
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:bg-transparent"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Parent Path Assistant"
          className="fixed z-50 flex flex-col
            inset-x-0 bottom-0 h-[90dvh] rounded-t-2xl
            sm:inset-auto sm:bottom-20 sm:right-5 sm:h-[560px] sm:w-[400px] sm:rounded-2xl
            bg-cream border border-sand shadow-2xl"
          style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
        >
          {/* Header */}
          <div className="bg-sage rounded-t-2xl px-4 py-3 flex items-center justify-between flex-shrink-0">
            <h2
              className="text-[17px] text-header-cream leading-tight"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 500 }}
            >
              Parent Path Assistant
            </h2>
            <button
              onClick={() => {
                setOpen(false)
                openBtnRef.current?.focus()
              }}
              aria-label="Close chat"
              className="text-header-cream hover:text-white p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Privacy note */}
          <div className="px-4 py-2 text-xs text-muted bg-footer-bg border-b border-sand flex-shrink-0">
            Chats aren&apos;t saved. Please don&apos;t type your child&apos;s name or health details. Not medical or legal advice.{' '}
            <span aria-hidden="true">·</span>{' '}
            Los chats no se guardan. No escriba el nombre ni datos de salud de su hijo/a. No es consejo médico ni legal.
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Conversation"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted text-center mt-6">
                Ask a question about Early Steps, Child Find, Medicaid, or finding therapy in Broward County.
                <br />
                <span className="text-xs mt-1 block">
                  Haga una pregunta sobre servicios de intervención temprana, Medicaid o terapias en el condado de Broward.
                </span>
              </p>
            )}

            {messages.map((msg, i) => (
              <Message key={i} msg={msg} lang={lang} />
            ))}

            {loading && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-sand rounded-2xl px-4 py-2.5 text-sm text-muted">
                  <span aria-label="Loading response" role="status">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-700 text-center my-2" role="alert">
                {error}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="px-3 pb-3 pt-2 border-t border-sand flex gap-2 flex-shrink-0">
            <label htmlFor="chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question… / Escriba su pregunta…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-sand bg-white px-3 py-2 text-sm text-charcoal placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              style={{ maxHeight: '100px', overflowY: 'auto' }}
              aria-label="Your message"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="bg-sage text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-[#334d3c] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1 transition-colors flex-shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
