/** Tokens that are silently dropped before tag normalization (case-insensitive). */
const STOP_WORDS = new Set(['and', 've', 'ile'])

/**
 * Parse a free-text tag string into a normalized, deduped array of tags.
 * Stop words ("and", "ve", "ile") are ignored case-insensitively.
 *
 * @param {string} input - Whitespace-separated tag tokens
 * @returns {{ ok: true, tags: string[] } | { ok: false, error: string }}
 */
export function parseTags(input) {
  const tokens = String(input ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token.toLowerCase()))

  if (tokens.length === 0) {
    return { ok: false, error: 'At least one tag is required.' }
  }

  const seen = new Set()
  const tags = []

  for (const token of tokens) {
    const normalized = (token.startsWith('#') ? token : `#${token}`).toLowerCase()
    if (!seen.has(normalized)) {
      seen.add(normalized)
      tags.push(normalized)
    }
  }

  return { ok: true, tags }
}
