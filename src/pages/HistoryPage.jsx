import { useTransactions } from '../domain/transactions/useTransactions'
import { formatTry } from '../shared/format'

export default function HistoryPage() {
  const { transactions, totalSpent } = useTransactions()

  return (
    <div>
      <h2>History</h2>

      <div className="card between" style={{ marginTop: '1rem' }}>
        <span className="label">Total Spent</span>
        <span className="big">{formatTry(totalSpent)}</span>
      </div>

      {transactions.length === 0 ? (
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          No transactions yet.
        </p>
      ) : (
        <ul className="list" style={{ marginTop: '1.5rem' }}>
          {transactions.map((t) => (
            <li key={t.id} className="list__item">
              <div className="row between">
                <span className="item__title">{t.title}</span>
                <span className="item__amount">{formatTry(t.amount)}</span>
              </div>
              <div className="row between">
                <span className="small">{t.date}</span>
                <span className="small">{t.tags.join(' ')}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
