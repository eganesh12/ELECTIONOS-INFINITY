import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'

// Mock child that throws
const Bomb = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error('Boom!')
  return <div>Safe content</div>
}

describe('ErrorBoundary comprehensive', () => {
  it('renders children normally', () => {
    render(<ErrorBoundary><div>Hello</div></ErrorBoundary>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('catches render errors and shows fallback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ErrorBoundary><Bomb shouldThrow={true} /></ErrorBoundary>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    spy.mockRestore()
  })

  it('shows the error message in fallback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ErrorBoundary><Bomb shouldThrow={true} /></ErrorBoundary>)
    expect(screen.getByText('Boom!')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('has a reload button', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ErrorBoundary><Bomb shouldThrow={true} /></ErrorBoundary>)
    const btn = screen.getByRole('button', { name: /reload app/i })
    expect(btn).toBeInTheDocument()
    spy.mockRestore()
  })
})
