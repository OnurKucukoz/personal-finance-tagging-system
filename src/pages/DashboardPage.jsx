import { Link } from 'react-router-dom'
import { useTransactions } from '../domain/transactions/useTransactions'
import { computeTagAnalytics } from '../domain/transactions/analytics'
import { formatTry } from '../shared/format'

export default function DashboardPage() {
  const { transactions } = useTransactions()
  const { totalSpent, rows } = computeTagAnalytics(transactions)

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="card between" style={{ marginTop: '1.5rem' }}>
        <span className="label">Total Spent</span>
        <span className="big">{formatTry(totalSpent)}</span>
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
                  <span className="item__amount">{formatTry(total)}</span>
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
