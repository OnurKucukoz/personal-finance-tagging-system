import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTransactions } from '../domain/transactions/useTransactions'
import { formatTry } from '../shared/format'
import TransactionForm from '../components/TransactionForm'
import Dialog from '../components/Dialog'

function normalizeTag(raw) {
  const lower = raw.toLowerCase()
  return lower.startsWith('#') ? lower : `#${lower}`
}

export default function HistoryPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()

  const [searchParams, setSearchParams] = useSearchParams()
  const rawTag = searchParams.get('tag')
  const activeTag = rawTag ? normalizeTag(rawTag) : null

  const visibleTransactions = activeTag
    ? transactions.filter((t) => t.tags.includes(activeTag))
    : transactions

  const filteredTotalSpent = visibleTransactions.reduce((sum, t) => sum + t.amount, 0)

  const [editingTx, setEditingTx] = useState(null)

  function handleEdit(tx) {
    setEditingTx(tx)
  }

  function handleEditClose() {
    setEditingTx(null)
  }

  function handleEditSubmit({ title, amount, date, tags }) {
    updateTransaction(editingTx.id, { title, amount, date, tags })
    setEditingTx(null)
  }

  function handleDelete(id) {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  function handleClearFilter() {
    setSearchParams({})
  }

  return (
    <div>
      <h2>History</h2>

      <TransactionForm onSubmit={addTransaction} />

      <div className="card between" style={{ marginTop: '1.5rem' }}>
        <span className="label">Total Spent</span>
        <span className="big">{formatTry(filteredTotalSpent)}</span>
      </div>

      {activeTag && (
        <div className="filter-row" style={{ marginTop: '1rem' }}>
          <span className="label">Filtered by:</span>
          <span className="pill">{activeTag}</span>
          <button
            type="button"
            className="button button--ghost"
            onClick={handleClearFilter}
          >
            Clear
          </button>
        </div>
      )}

      {visibleTransactions.length === 0 ? (
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          {activeTag ? `No transactions tagged ${activeTag}.` : 'No transactions yet.'}
        </p>
      ) : (
        <ul className="list" style={{ marginTop: '1.5rem' }}>
          {visibleTransactions.map((t) => (
            <li key={t.id} className="list__item">
              <div className="row between">
                <span className="item__title">{t.title}</span>
                <span className="item__amount">{formatTry(t.amount)}</span>
              </div>
              <div className="row between">
                <span className="small">{t.date}</span>
                <span className="small">{t.tags.join(' ')}</span>
              </div>
              <div className="actions">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={editingTx !== null}
        title="Edit Transaction"
        onClose={handleEditClose}
      >
        {editingTx && (
          <TransactionForm
            key={editingTx.id}
            onSubmit={handleEditSubmit}
            initialValues={{
              title: editingTx.title,
              amount: editingTx.amount,
              date: editingTx.date,
              tagsInput: editingTx.tags.join(' '),
            }}
            submitLabel="Save Changes"
            resetOnSubmit={false}
          />
        )}
      </Dialog>
    </div>
  )
}
