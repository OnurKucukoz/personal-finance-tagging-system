/**
 * Parse a free-text tag string into a normalized, deduped array of tags.
 *
 * @param {string} input - Whitespace-separated tag tokens
 * @returns {{ ok: true, tags: string[] } | { ok: false, error: string }}
 */
export function parseTags(input) {
  const tokens = String(input ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

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
