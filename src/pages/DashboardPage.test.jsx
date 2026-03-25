import { beforeEach, describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from './DashboardPage'

const STORAGE_KEY = 'pfts.transactions.v1'

// jsdom does not implement showModal / close on <dialog>, so we polyfill them.
beforeEach(() => {
  localStorage.clear()

  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  )
}

/** Helper — gets the underlying <dialog> element regardless of open state. */
function getDialog() {
  return document.querySelector('dialog')
}

describe('DashboardPage – Add Transaction button', () => {
  it('renders an "Add Transaction" button', () => {
    renderDashboard()
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument()
  })

  it('opens the dialog when the button is clicked', () => {
    renderDashboard()

    // Dialog should not be open initially
    expect(getDialog()).not.toHaveAttribute('open')

    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }))

    // After click, showModal() sets the open attribute
    expect(getDialog()).toHaveAttribute('open')
    // The dialog title heading should be visible
    expect(screen.getByRole('heading', { name: 'Add Transaction' })).toBeInTheDocument()
  })

  it('closes the dialog when the close button is clicked', () => {
    renderDashboard()

    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }))
    expect(getDialog()).toHaveAttribute('open')

    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }))

    expect(getDialog()).not.toHaveAttribute('open')
  })

  it('adds a transaction and closes the dialog on valid submit', async () => {
    renderDashboard()

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }))
    expect(getDialog()).toHaveAttribute('open')

    // Fill in the form — use getByLabelText which works even inside closed dialogs
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Coffee' } })
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-03-25' } })
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'food' } })

    // Submit the form directly (the submit button may still be shown as disabled
    // until React re-renders; submitting the form element bypasses that)
    fireEvent.submit(document.querySelector('.form'))

    // Dialog should close after successful submit
    await waitFor(() => {
      expect(getDialog()).not.toHaveAttribute('open')
    })

    // Transaction should be persisted to localStorage
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('Coffee')
    expect(stored[0].amount).toBe(25)
  })

  it('keeps the dialog open and shows errors on invalid submit', () => {
    renderDashboard()

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }))
    expect(getDialog()).toHaveAttribute('open')

    // Submit the form without filling in anything
    fireEvent.submit(document.querySelector('.form'))

    // Dialog should remain open
    expect(getDialog()).toHaveAttribute('open')

    // Validation error for the title field should be visible
    expect(screen.getByText('Title is required.')).toBeInTheDocument()
  })
})
