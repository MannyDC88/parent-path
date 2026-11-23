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
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      'I wasn\'t able to get a response. Please try again or call Child Find at 754-321-7200.'

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
