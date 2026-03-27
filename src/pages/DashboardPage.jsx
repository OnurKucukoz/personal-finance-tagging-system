import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactions } from '../domain/transactions/useTransactions'
import { computeTagAnalytics } from '../domain/transactions/analytics'
import { formatMoney } from '../shared/format'
import { useCurrency } from '../settings/useCurrency'
import Dialog from '../components/Dialog'
import TransactionForm from '../components/TransactionForm'

export default function DashboardPage() {
  const { transactions, addTransaction } = useTransactions()
  const { totalSpent, rows } = computeTagAnalytics(transactions)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { currency } = useCurrency()

  function handleAddTransaction(data) {
    addTransaction(data)
    setDialogOpen(false)
  }

  return (
    <div>
      <div className="between" style={{ alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <button
          type="button"
          className="button"
          style={{ width: 'auto' }}
          onClick={() => setDialogOpen(true)}
        >
          Add Transaction
        </button>
      </div>

      <Dialog
        open={dialogOpen}
        title="Add Transaction"
        onClose={() => setDialogOpen(false)}
      >
        <TransactionForm
          submitLabel="Add"
          resetOnSubmit={true}
          onSubmit={handleAddTransaction}
        />
      </Dialog>

      <div className="card between" style={{ marginTop: '1.5rem' }}>
        <span className="label">Total Spent</span>
        <span className="big">{formatMoney(totalSpent, currency)}</span>
      </div>

      {rows.length === 0 ? (
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          No transactions yet. Add one from History.
        </p>
      ) : (
        <ul className="list analytics-list" style={{ marginTop: '1.5rem' }}>
          {rows.map(({ tag, total, percent }) => (
            <li key={tag} className="list__item list__item--link">
              <Link
                to={`/history?tag=${encodeURIComponent(tag)}`}
                className="link-row"
              >
                <div className="tag-row">
                  <span className="tag">{tag}</span>
                  <span className="item__amount">{formatMoney(total, currency)}</span>
                  <span className="percent">{Math.round(percent)}%</span>
                </div>
                <div className="bar">
                  <div
                    className="bar__fill"
                    style={{ width: `${percent}%` }}
                    role="presentation"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
