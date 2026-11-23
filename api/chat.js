/**
 * api/chat.js — Vercel Node serverless function (ESM)
 *
 * POST /api/chat
 * Body: { messages: [{ role: "user"|"assistant", content: string }] }
 * Returns: { reply: string }
 *
 * Uses IBM watsonx.ai (Granite) via a server-side IAM token.
 * Secrets (WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL) are read from
 * Vercel server-side env vars — never sent to the browser.
 */

import { SYSTEM_PROMPT } from './_knowledge.js'

// ---------------------------------------------------------------------------
// Safety net: allowlists derived from SYSTEM_PROMPT
//
// SYSTEM_PROMPT already contains every verified URL and phone number (from
// both the VERIFIED FACTS section and the PROVIDERS list). Deriving the
// allowlists from it means they always stay in sync with _knowledge.js — no
// separate providers.json load needed here.
// ---------------------------------------------------------------------------

// --- Allowed domains ---
// Extract every http(s) URL and every bare domain from the prompt, normalise
// to lowercase with no leading "www.", collect into a Set.
function _extractDomains(text) {
  const domains = new Set()
  // Full URLs: https://example.com/path
  const urlRe = /https?:\/\/(?:www\.)?([a-z0-9-]+(?:\.[a-z]{2,})+)/gi
  for (const [, host] of text.matchAll(urlRe)) {
    domains.add(host.toLowerCase())
  }
  // Bare domains already in the prompt (e.g., "floridahealthjustice.org", "card@nova.edu" excluded below)
  // Pattern: word.tld or word.word.tld — must NOT be preceded by "@" (email guard)
  const bareRe = /(?<![/@\w])(?:www\.)?([a-z0-9-]+\.(?:org|com|gov|edu|net)(?:\/[^\s)>\]"']*)?)/gi
  for (const [, host] of text.matchAll(bareRe)) {
    // Keep only the hostname part (drop any path)
    const hostname = host.split('/')[0].toLowerCase()
    domains.add(hostname)
  }
  return domains
}

const ALLOWED_DOMAINS = _extractDomains(SYSTEM_PROMPT)

// --- Allowed phone numbers ---
// Extract every phone in the prompt, normalise to digits only, collect into a
// Set. 911 and 211 are excluded from scrubbing later (they're always safe).
function _normalizePhone(digits) {
  // Drop a leading country-code 1 so "18559015390" and "8559015390" match the same entry.
  return digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits
}

function _extractPhones(text) {
  const phones = new Set()
  const phoneRe = /(?<!\d)(?:1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}(?!\d)/g
  for (const [match] of text.matchAll(phoneRe)) {
    phones.add(_normalizePhone(match.replace(/\D/g, '')))
  }
  return phones
}

const ALLOWED_PHONES = _extractPhones(SYSTEM_PROMPT)

// Short numbers that are always allowed regardless (emergency / directory).
const ALWAYS_ALLOW_PHONES = new Set(['911', '211'])

// ---------------------------------------------------------------------------
// scrubUrls
//
// Removes URLs and bare domains the model invented that weren't in the
// grounding prompt, so parents are never sent to a hallucinated address.
// Handles:
//   - markdown links: [text](url) — keep whole link or replace whole link
//   - https?:// URLs
//   - bare domains like "example.com" or "www.example.org/path"
//   - emails (card@nova.edu) are left untouched
// ---------------------------------------------------------------------------
function _domainAllowed(raw) {
  // Strip protocol and www, take only the hostname portion
  const noProto = raw.replace(/^https?:\/\//i, '').replace(/^www\./i, '')
  const hostname = noProto.split(/[/?#]/)[0].toLowerCase()
  return ALLOWED_DOMAINS.has(hostname)
}

// Matches markdown links: [label](url)
const MD_LINK_RE = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g
// Matches absolute https?:// URLs (no lookahead — markdown links are protected via placeholder swap).
const ABS_URL_RE = /https?:\/\/[^\s"')>\]]+/gi
// Matches bare domains (not preceded by @ or / to avoid emails and URL paths).
// Requires a known TLD so plain words like "e.g." don't match.
const BARE_DOMAIN_RE = /(?<![/@\w])(?:www\.)?[a-z0-9-]+\.(?:org|com|gov|edu|net)(?:\/[^\s)>\]"']*)*/gi

function scrubUrls(text) {
  // 1. Replace each markdown link with an opaque placeholder so the URLs
  //    inside them are invisible to steps 2 and 3. Allowed links are stored
  //    for restoration; disallowed links are immediately replaced.
  const kept = []
  let out = text.replace(MD_LINK_RE, (full, label, url) => {
    if (_domainAllowed(url)) {
      const token = `__MDLINK${kept.length}__`
      kept.push(full)
      return token
    }
    return '(no website listed)'
  })

  // 2. Scrub remaining absolute URLs (fake ones before a real markdown link
  //    are now visible because the real link has been tokenised away).
  out = out.replace(ABS_URL_RE, (url) =>
    _domainAllowed(url) ? url : '(no website listed)'
  )

  // 3. Scrub bare domains (email guard: BARE_DOMAIN_RE uses a negative lookbehind for @).
  out = out.replace(BARE_DOMAIN_RE, (domain) =>
    _domainAllowed(domain) ? domain : '(no website listed)'
  )

  // 4. Restore kept markdown links.
  kept.forEach((original, i) => {
    out = out.replace(`__MDLINK${i}__`, original)
  })

  return out
}

// ---------------------------------------------------------------------------
// scrubPhones
//
// Replaces any US phone number not in the grounding prompt with a safe
// fallback. Protects parents from being given a hallucinated number.
// 911 and 211 are always left intact.
// ---------------------------------------------------------------------------
// Matches common US phone formats: 954-728-1083 (954) 728-1083 1-855-901-5390
const PHONE_RE = /(?<!\d)(?:1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}(?!\d)/g

function scrubPhones(text) {
  return text.replace(PHONE_RE, (match) => {
    const digits = _normalizePhone(match.replace(/\D/g, ''))
    if (ALWAYS_ALLOW_PHONES.has(digits)) return match
    return ALLOWED_PHONES.has(digits) ? match : '(call Child Find at 754-321-7200 for help)'
  })
}

// ---------------------------------------------------------------------------
// normalizeText
//
// Granite sometimes uses Unicode "fancy" punctuation (non-breaking hyphens,
// en-dashes, non-breaking spaces) which makes phone numbers un-tappable on
// mobile and breaks PHONE_RE. Replace them with plain ASCII equivalents before
// any other processing.
// ---------------------------------------------------------------------------
function normalizeText(text) {
  return text
    // Various dash / minus-like code points → ASCII hyphen-minus
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-')
    // Non-breaking and narrow non-breaking space → regular space
    .replace(/[\u00A0\u202F]/g, ' ')
}

// ---------------------------------------------------------------------------
// IAM token cache (module scope — reused across warm invocations)
// ---------------------------------------------------------------------------
let _iamToken = null
let _iamExpiresAt = 0 // epoch ms

async function getIamToken() {
  const now = Date.now()
  // Refresh if no token or within 60 seconds of expiry
  if (_iamToken && now < _iamExpiresAt - 60_000) {
    return _iamToken
  }

  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aibm%3Aparams%3Aoauth%3Agrant-type%3Aapikey&apikey=${encodeURIComponent(process.env.WATSONX_API_KEY)}`,
  })

  if (!res.ok) {
    throw new Error(`IAM token request failed: ${res.status}`)
  }

  const data = await res.json()
  _iamToken = data.access_token
  // expires_in is in seconds
  _iamExpiresAt = now + data.expires_in * 1000
  return _iamToken
}

// ---------------------------------------------------------------------------
// Message validation helpers
// ---------------------------------------------------------------------------
const ALLOWED_ROLES = new Set(['user', 'assistant'])

function validateMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return null

  const filtered = raw
    .filter(
      (m) =>
        m &&
        typeof m === 'object' &&
        ALLOWED_ROLES.has(m.role) &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, 1000),
    }))
    .slice(-8) // keep last 8 messages

  return filtered.length > 0 ? filtered : null
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const messages = validateMessages(body?.messages)
  if (!messages) {
    return res.status(400).json({ error: 'No valid messages provided' })
  }

  try {
    const token = await getIamToken()

    const watsonxUrl = process.env.WATSONX_URL
    const projectId = process.env.WATSONX_PROJECT_ID

    const watsonxRes = await fetch(
      `${watsonxUrl}/ml/v1/text/chat?version=2025-10-25`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model_id: 'ibm/granite-4-h-small',
          project_id: projectId,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
          max_tokens: 400,
          temperature: 0,
        }),
      }
    )

    // Log only the status code — never log message content
    console.log(`watsonx status: ${watsonxRes.status}`)

    if (!watsonxRes.ok) {
      return res.status(500).json({
        reply:
          'Something went wrong. Please try again or call Child Find at 754-321-7200.',
      })
    }

    const data = await watsonxRes.json()
    const raw =
      data?.choices?.[0]?.message?.content?.trim() ||
      'I wasn\'t able to get a response. Please try again or call Child Find at 754-321-7200.'

    // Normalize fancy Unicode punctuation Granite sometimes uses so phone
    // numbers are tappable on mobile and PHONE_RE can match them reliably.
    // Scrub hallucinated URLs and phone numbers before the reply reaches the
    // client. Both allowlists are derived from SYSTEM_PROMPT at module load.
    const reply = scrubPhones(scrubUrls(normalizeText(raw)))

    return res.status(200).json({ reply })
  } catch (err) {
    // Log error type/status only — never log keys, tokens, or message content
    console.error(`chat handler error: ${err.message}`)
    return res.status(500).json({
      reply:
        'Something went wrong. Please try again or call Child Find at 754-321-7200.',
    })
  }
}
