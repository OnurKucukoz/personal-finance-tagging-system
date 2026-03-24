/**
 * @typedef {Object} Transaction
 * @property {string}   id        - Unique identifier (UUID)
 * @property {string}   title     - Human-readable description
 * @property {number}   amount    - Monetary amount (positive = expense)
 * @property {string}   date      - ISO date string (YYYY-MM-DD)
 * @property {string[]} tags      - Normalized tag array (e.g. ["#food", "#lunch"])
 * @property {string}   createdAt - ISO timestamp of record creation
 * @property {string}   updatedAt - ISO timestamp of last update
 */

const STORAGE_KEY = 'pfts.transactions.v1'

/**
 * Load transactions from localStorage.
 * Returns an empty array if storage is unavailable or data is malformed.
 *
 * @returns {Transaction[]}
 */
export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Persist transactions to localStorage.
 * Silently ignores write errors (e.g. private browsing quota).
 *
 * @param {Transaction[]} transactions
 */
export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch {
    // storage unavailable – ignore
  }
}
