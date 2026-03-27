/**
 * Format a numeric amount using the given currency code.
 * Locale is fixed to "tr-TR" for consistent decimal/grouping separators
 * while the currency symbol varies with the `currency` argument.
 *
 * @param {number} amount
 * @param {string} currency  ISO 4217 currency code, e.g. "USD", "TRY", "EUR"
 * @returns {string}  e.g. "$1.234,56" / "₺1.234,56" / "€1.234,56"
 */
export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}
