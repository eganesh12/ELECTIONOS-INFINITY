import React from 'react'

export default function Logo({ size = 40, animated = false }) {
  return (
    <div style={{
      width: size,
      height: size,
      position: 'relative',
      perspective: '1000px',
      transformStyle: 'preserve-3d',
    }}>
      <style>{`
        @keyframes orbit-cube {
          0% { transform: rotateX(0) rotateY(0); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        .cube-wrapper {
          width: 100%; height: 100%;
          position: absolute;
          animation: ${animated ? 'orbit-cube 12s linear infinite' : 'none'};
          transform-style: preserve-3d;
        }
        .cube-face {
          position: absolute; width: 100%; height: 100%;
          background: rgba(0, 212, 255, 0.15);
          border: 1.5px solid rgba(0, 212, 255, 0.6);
          box-shadow: inset 0 0 15px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.2);
          display: flex; alignItems: center; justifyContent: center;
          color: #fff; font-size: ${size/3}px; font-weight: 900;
          backface-visibility: hidden;
        }
      `}</style>
      
      <div className="cube-wrapper">
        <div className="cube-face" style={{ transform: 'rotateY(0deg) translateZ(' + size/2 + 'px)' }}>E</div>
        <div className="cube-face" style={{ transform: 'rotateY(90deg) translateZ(' + size/2 + 'px)' }}>O</div>
        <div className="cube-face" style={{ transform: 'rotateY(180deg) translateZ(' + size/2 + 'px)' }}>S</div>
        <div className="cube-face" style={{ transform: 'rotateY(-90deg) translateZ(' + size/2 + 'px)' }}>∞</div>
        <div className="cube-face" style={{ transform: 'rotateX(90deg) translateZ(' + size/2 + 'px)' }}>💎</div>
        <div className="cube-face" style={{ transform: 'rotateX(-90deg) translateZ(' + size/2 + 'px)' }}>🛰️</div>
      </div>

      {/* Orbiting Ring */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: size * 1.8, height: size * 1.8,
        border: '1px solid rgba(167, 139, 250, 0.4)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%) rotateX(75deg)',
        boxShadow: '0 0 15px rgba(167, 139, 250, 0.2)',
        animation: animated ? 'spin 4s linear infinite' : 'none'
      }} />
    </div>
  )
}
