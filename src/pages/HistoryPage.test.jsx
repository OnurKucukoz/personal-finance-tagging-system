import { beforeEach, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HistoryPage from './HistoryPage'

const STORAGE_KEY = 'pfts.transactions.v1'

const seed = [
  {
    id: 'tx-1',
    title: 'Lunch',
    amount: 120,
    date: '2026-03-01',
    tags: ['#food'],
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'tx-2',
    title: 'Bus',
    amount: 40,
    date: '2026-03-02',
    tags: ['#transport'],
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-02T10:00:00.000Z',
  },
]

beforeEach(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
})

describe('HistoryPage tag filtering', () => {
  it('shows matching transaction and hides non-matching when tag param is set', () => {
    render(
      <MemoryRouter initialEntries={['/history?tag=%23food']}>
        <HistoryPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lunch')).toBeInTheDocument()
    expect(screen.queryByText('Bus')).not.toBeInTheDocument()
  })
})
