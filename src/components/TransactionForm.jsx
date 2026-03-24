import { useState } from 'react'
import { parseTags } from '../domain/transactions/tags'
import { todayIsoDate } from '../shared/date'

const INITIAL_STATE = {
  title: '',
  amount: '',
  date: todayIsoDate(),
  tags: '',
}

/**
 * @param {{ onSubmit: (data: { title: string, amount: number, date: string, tags: string[] }) => void }} props
 */
export default function TransactionForm({ onSubmit }) {
  const [fields, setFields] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    // Clear the error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function validate() {
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

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const tagsResult = parseTags(fields.tags)
    onSubmit({
      title: fields.title.trim(),
      amount: Number(fields.amount),
      date: fields.date,
      tags: tagsResult.tags,
    })

    // Reset form — keep date fresh
    setFields({ ...INITIAL_STATE, date: todayIsoDate() })
    setErrors({})
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h3>Add Transaction</h3>

      <div className="field">
        <label htmlFor="tf-title">Title</label>
        <input
          id="tf-title"
          className="input"
          type="text"
          name="title"
          value={fields.title}
          onChange={handleChange}
          aria-invalid={errors.title ? 'true' : undefined}
          aria-describedby={errors.title ? 'tf-title-error' : undefined}
          autoComplete="off"
        />
        {errors.title && (
          <span id="tf-title-error" className="error" role="alert">
            {errors.title}
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
          min="0.01"
          step="0.01"
          aria-invalid={errors.amount ? 'true' : undefined}
          aria-describedby={errors.amount ? 'tf-amount-error' : undefined}
        />
        {errors.amount && (
          <span id="tf-amount-error" className="error" role="alert">
            {errors.amount}
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
          aria-invalid={errors.date ? 'true' : undefined}
          aria-describedby={errors.date ? 'tf-date-error' : undefined}
        />
        {errors.date && (
          <span id="tf-date-error" className="error" role="alert">
            {errors.date}
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
          placeholder="e.g. food lunch"
          aria-invalid={errors.tags ? 'true' : undefined}
          aria-describedby={errors.tags ? 'tf-tags-error' : undefined}
          autoComplete="off"
        />
        {errors.tags && (
          <span id="tf-tags-error" className="error" role="alert">
            {errors.tags}
          </span>
        )}
      </div>

      <button type="submit" className="button">
        Add Transaction
      </button>
    </form>
  )
}
