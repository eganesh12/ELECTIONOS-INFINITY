import { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import Sidebar from './Sidebar'

const CosmicBackground = memo(function CosmicBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`
    })), [])

  return (
    <div className="cosmic-bg" aria-hidden="true">
      <div className="nebula-glow"></div>
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            '--duration': star.duration,
            animationDelay: star.delay,
            boxShadow: `0 0 10px rgba(255,255,255,0.4)`
          }}
        />
      ))}
    </div>
  )
})

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent', position: 'relative' }}>
      <CosmicBackground />
      <Sidebar />
      <main
        id="main-content"
        tabIndex={-1}
        style={{
          flex: 1, marginLeft: 230,
          padding: '32px 36px',
          overflowY: 'auto',
          minHeight: '100vh',
          background: 'transparent',
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </main>
    </div>
  )
}

Layout.propTypes = { children: PropTypes.node.isRequired }
