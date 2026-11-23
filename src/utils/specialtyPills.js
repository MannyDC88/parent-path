/**
 * Shared specialty pill color mapping and label lookup.
 * Used by ProviderCard and ChatAssistant's ProviderMiniCard.
 *
 * behavioral uses teal (not green) because the green is visually similar to
 * the "Accepting" availability badge (#E2EDDF / #2F5A35).
 */

export const SPECIALTY_COLORS = {
  speech:     { bg: '#DCE7F5', color: '#28487A' },
  OT:         { bg: '#F7EDC8', color: '#6B5310' },
  behavioral: { bg: '#DDEFEC', color: '#1F5C55' },
  ABA:        { bg: '#DDEFEC', color: '#1F5C55' },
  PT:         { bg: '#E9E4F5', color: '#4A3B7A' },
  feeding:    { bg: '#FBE5D6', color: '#7A3E1C' },
}

/**
 * Canonical display order for specialty filter buttons.
 * Excludes ABA (alias of behavioral, not used as a standalone filter key).
 */
export const SPECIALTY_ORDER = ['speech', 'OT', 'PT', 'behavioral', 'feeding']

const FALLBACK_STYLE = { backgroundColor: '#F3EBDD', color: '#6B5A3E' }

/** Returns an inline style object for the given specialty key. */
export function specialtyPillStyle(specialty) {
  const entry = SPECIALTY_COLORS[specialty]
  if (!entry) return FALLBACK_STYLE
  return { backgroundColor: entry.bg, color: entry.color }
}

export const SPECIALTY_LABELS = {
  speech: 'Speech',
  OT: 'OT',
  PT: 'PT',
  behavioral: 'Behavioral',
  ABA: 'ABA',
  feeding: 'Feeding',
}
