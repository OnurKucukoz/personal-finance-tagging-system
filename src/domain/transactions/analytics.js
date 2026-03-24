/**
 * @typedef {{ tag: string, total: number, percent: number }} TagRow
 */

/**
 * Compute per-tag spend totals and percentages from a list of transactions.
 *
 * @param {import('./storage').Transaction[]} transactions
 * @returns {{ totalSpent: number, rows: TagRow[] }}
 */
export function computeTagAnalytics(transactions) {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

  /** @type {Map<string, number>} */
  const tagTotals = new Map()

  for (const t of transactions) {
    for (const tag of t.tags) {
      tagTotals.set(tag, (tagTotals.get(tag) ?? 0) + t.amount)
    }
  }

  const rows = Array.from(tagTotals.entries())
    .map(([tag, total]) => ({
      tag,
      total,
      percent: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total
      return a.tag.localeCompare(b.tag)
    })

  return { totalSpent, rows }
}
