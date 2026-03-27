export const CURRENCIES = ['USD', 'TRY', 'EUR']

export const DEFAULT_CURRENCY = 'USD'

const STORAGE_KEY = 'pfts.currency.v1'

/**
 * Load the persisted currency from localStorage.
 * Returns the saved value if it is a valid currency, otherwise DEFAULT_CURRENCY.
 *
 * @returns {string}
 */
export function loadCurrency() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && CURRENCIES.includes(saved)) {
      return saved
    }
  } catch {
    // localStorage unavailable (e.g. SSR or private browsing restrictions)
  }
  return DEFAULT_CURRENCY
}

/**
 * Persist the given currency to localStorage.
 *
 * @param {string} currency
 */
export function saveCurrency(currency) {
  try {
    localStorage.setItem(STORAGE_KEY, currency)
  } catch {
    // localStorage unavailable — silently ignore
  }
}
