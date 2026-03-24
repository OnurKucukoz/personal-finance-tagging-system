import { useState, useEffect, useCallback } from 'react'
import { loadTransactions, saveTransactions } from './storage'

/**
 * Generate a unique ID.
 * Uses crypto.randomUUID() when available, else falls back to a timestamp+random string.
 *
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Sort comparator: date desc, then createdAt desc as tie-breaker.
 *
 * @param {import('./storage').Transaction} a
 * @param {import('./storage').Transaction} b
 * @returns {number}
 */
function compareTransactions(a, b) {
  const dateDiff = b.date.localeCompare(a.date)
  if (dateDiff !== 0) return dateDiff
  return b.createdAt.localeCompare(a.createdAt)
}

/**
 * React hook for managing transactions with localStorage persistence.
 *
 * @returns {{
 *   transactions: import('./storage').Transaction[],
 *   totalSpent: number,
 *   addTransaction: (data: Omit<import('./storage').Transaction, 'id'|'createdAt'|'updatedAt'>) => void,
 *   updateTransaction: (id: string, patch: Partial<import('./storage').Transaction>) => void,
 *   deleteTransaction: (id: string) => void,
 * }}
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const loaded = loadTransactions()
    return [...loaded].sort(compareTransactions)
  })

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const addTransaction = useCallback((data) => {
    const now = new Date().toISOString()
    const record = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setTransactions((prev) => [...prev, record].sort(compareTransactions))
  }, [])

  const updateTransaction = useCallback((id, patch) => {
    setTransactions((prev) =>
      [...prev.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
      )].sort(compareTransactions)
    )
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const totalSpent = transactions.reduce((sum, t) => sum + (t.amount ?? 0), 0)

  return {
    transactions,
    totalSpent,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
