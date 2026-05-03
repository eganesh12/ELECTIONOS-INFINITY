import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'

const ThrowError = () => { throw new Error('Test error') }

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>All good</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    consoleSpy.mockRestore()
  })

  it('shows reload button in error state', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByText('Reload App')).toBeInTheDocument()
    consoleSpy.mockRestore()
  })
})
