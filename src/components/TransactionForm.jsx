import { useState, useCallback } from 'react'
import { parseTags } from '../domain/transactions/tags'
import { todayIsoDate } from '../shared/date'

const EMPTY_STATE = {
  title: '',
  amount: '',
  date: todayIsoDate(),
  tags: '',
}

function buildInitialState(initialValues) {
  if (!initialValues) return { ...EMPTY_STATE, date: todayIsoDate() }
  return {
    title: initialValues.title ?? '',
    amount: initialValues.amount !== undefined ? String(initialValues.amount) : '',
    date: initialValues.date ?? todayIsoDate(),
    tags: initialValues.tagsInput ?? '',
  }
}

function validate(fields) {
  const next = {}

  if (!fields.title.trim()) {
    next.title = 'Title is required.'
  }

  const amt = Number(fields.amount)
  if (fields.amount === '' || Number.isNaN(amt) || amt <= 0) {
    next.amount = 'Amount must be a number greater than 0.'
  }

  if (!fields.date) {
    next.date = 'Date is required.'
  }

  const tagsResult = parseTags(fields.tags)
  if (!tagsResult.ok) {
    next.tags = tagsResult.error
  }

  return next
}

/**
 * @param {{
 *   onSubmit: (data: { title: string, amount: number, date: string, tags: string[] }) => void,
 *   initialValues?: { title?: string, amount?: number, date?: string, tagsInput?: string },
 *   submitLabel?: string,
 *   resetOnSubmit?: boolean
 * }} props
 */
export default function TransactionForm({
  onSubmit,
  initialValues,
  submitLabel = 'Add Transaction',
  resetOnSubmit = true,
}) {
  const [fields, setFields] = useState(() => buildInitialState(initialValues))
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [suggestMessage, setSuggestMessage] = useState(null) // { type: 'error'|'info', text: string }

  const canSuggest = fields.title.trim().length >= 2

  const handleSuggestTags = useCallback(async () => {
    setSuggestLoading(true)
    setSuggestMessage(null)
    try {
      const res = await fetch('/api/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: fields.title }),
      })
      if (!res.ok) {
        let msg = `Server error (${res.status}).`
        try {
          const body = await res.json()
          if (body?.error) msg = body.error
        } catch { /* ignore */ }
        setSuggestMessage({ type: 'error', text: msg })
        return
      }
      const data = await res.json()
      if (Array.isArray(data.tags) && data.tags.length > 0) {
        setFields((prev) => ({ ...prev, tags: data.tags.join(' ') }))
        setSuggestMessage(null)
      } else {
        setSuggestMessage({ type: 'info', text: 'No suggestions returned.' })
      }
    } catch {
      setSuggestMessage({ type: 'error', text: 'Could not reach the suggestion service.' })
    } finally {
      setSuggestLoading(false)
    }
  }, [fields.title])

  const allErrors = validate(fields)
  const isInvalid = Object.keys(allErrors).length > 0

  function getFieldError(name) {
    // Show error only if field has been touched OR form was submitted (errors state set)
    if (touched[name] || errors[name]) {
      return allErrors[name]
    }
    return undefined
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (isInvalid) {
      // Mark all fields as touched so all errors become visible
      setTouched({ title: true, amount: true, date: true, tags: true })
      setErrors(allErrors)
      return
    }

    const tagsResult = parseTags(fields.tags)
    onSubmit({
      title: fields.title.trim(),
      amount: Number(fields.amount),
      date: fields.date,
      tags: tagsResult.tags,
    })

    if (resetOnSubmit) {
      setFields({ ...EMPTY_STATE, date: todayIsoDate() })
      setErrors({})
      setTouched({})
    }
  }

  const titleError = getFieldError('title')
  const amountError = getFieldError('amount')
  const dateError = getFieldError('date')
  const tagsError = getFieldError('tags')

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h3>{submitLabel}</h3>

      <div className="field">
        <label htmlFor="tf-title">Title</label>
        <input
          id="tf-title"
          className="input"
          type="text"
          name="title"
          value={fields.title}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={titleError ? 'true' : undefined}
          aria-describedby={titleError ? 'tf-title-error' : undefined}
          autoComplete="off"
        />
        {titleError && (
          <span id="tf-title-error" className="error" role="alert">
            {titleError}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="tf-amount">Amount</label>
        <input
          id="tf-amount"
          className="input"
          type="number"
          name="amount"
          value={fields.amount}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0.01"
          step="0.01"
          aria-invalid={amountError ? 'true' : undefined}
          aria-describedby={amountError ? 'tf-amount-error' : undefined}
        />
        {amountError && (
          <span id="tf-amount-error" className="error" role="alert">
            {amountError}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="tf-date">Date</label>
        <input
          id="tf-date"
          className="input"
          type="date"
          name="date"
          value={fields.date}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={dateError ? 'true' : undefined}
          aria-describedby={dateError ? 'tf-date-error' : undefined}
        />
        {dateError && (
          <span id="tf-date-error" className="error" role="alert">
            {dateError}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="tf-tags">Tags</label>
        <input
          id="tf-tags"
          className="input"
          type="text"
          name="tags"
          value={fields.tags}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. food lunch"
          aria-invalid={tagsError ? 'true' : undefined}
          aria-describedby={
            tagsError ? 'tf-tags-error' : suggestMessage ? 'tf-tags-suggest-msg' : undefined
          }
          autoComplete="off"
        />
        <button
          type="button"
          className="button"
          style={{ marginTop: '8px' }}
          onClick={handleSuggestTags}
          disabled={!canSuggest || suggestLoading}
          aria-label="Get AI suggestions"
        >
          {suggestLoading ? 'Suggesting…' : 'Suggest tags'}
        </button>
        {tagsError && (
          <span id="tf-tags-error" className="error" role="alert">
            {tagsError}
          </span>
        )}
        {!tagsError && suggestMessage && (
          <span
            id="tf-tags-suggest-msg"
            className={suggestMessage.type === 'error' ? 'error' : 'info'}
            role={suggestMessage.type === 'error' ? 'alert' : 'status'}
          >
            {suggestMessage.text}
          </span>
        )}
      </div>

      <button type="submit" className="button" disabled={isInvalid}>
        {submitLabel}
      </button>
    </form>
  )
}
