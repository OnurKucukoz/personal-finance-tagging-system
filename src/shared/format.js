const tryFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

/**
 * Format a numeric amount as Turkish Lira.
 *
 * @param {number} amount
 * @returns {string}  e.g. "₺1.234,56"
 */
export function formatTry(amount) {
  return tryFormatter.format(amount)
}
