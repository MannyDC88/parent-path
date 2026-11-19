import { supabase } from '../lib/supabase'
import { getBrowserKey } from '../utils/browserKey'

/**
 * Returns the latest availability for every provider in providerIds.
 * Returns an empty array if Supabase is unavailable.
 * @param {string[]} providerIds
 * @returns {Promise<Array<{provider_id: string, status: string, created_at: string}>>}
 */
export async function getLatestAvailability(providerIds) {
  if (!supabase || !providerIds.length) return []
  const { data, error } = await supabase
    .from('latest_availability')
    .select('provider_id, status, created_at')
    .in('provider_id', providerIds)
  if (error) {
    console.warn('getLatestAvailability error:', error.message)
    return []
  }
  return data ?? []
}

/**
 * Submits a parent availability report.
 * Returns { error } where error is null on success.
 * @param {string} providerId
 * @param {string} status  one of: accepting | not_accepting | waitlist | no_answer
 */
export async function submitAvailabilityUpdate(providerId, status) {
  if (!supabase) return { error: { message: 'Supabase not configured.' } }
  const browser_key = getBrowserKey()
  const { error } = await supabase
    .from('availability_updates')
    .insert({ provider_id: providerId, status, browser_key })
  return { error }
}
