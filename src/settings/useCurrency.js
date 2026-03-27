import { useState, useEffect } from 'react'
import { loadCurrency, saveCurrency } from './currency'

/**
 * React hook that provides the current display currency and a setter.
 *
 * @returns {{ currency: string, setCurrency: (currency: string) => void }}
 */
export function useCurrency() {
  const [currency, setCurrencyState] = useState(() => loadCurrency())

  useEffect(() => {
    saveCurrency(currency)
  }, [currency])

  function setCurrency(newCurrency) {
    setCurrencyState(newCurrency)
  }

  return { currency, setCurrency }
}
