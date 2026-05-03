import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh', background: '#020408', display: 'flex',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24
          }}
        >
          <div style={{ maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 28px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
                color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
