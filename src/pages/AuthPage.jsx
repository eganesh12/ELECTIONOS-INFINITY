import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// ── Animated particle canvas (Subtle overlay) ─────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext('2d')
    let W = (c.width = window.innerWidth); let H = (c.height = window.innerHeight)
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, a: Math.random(),
    }))
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,212,255,${p.a * 0.3})`; ctx.fill()
      })
      requestAnimationFrame(draw)
    }
    draw()
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
}

function Field({ type = 'text', placeholder, value, onChange, icon, required, id, label }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', marginBottom: 12 }}>
      {label && <label htmlFor={id} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>{label}</label>}
      <span aria-hidden="true" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.5, zIndex: 1 }}>{icon}</span>
      <input
        id={id}
        type={type} placeholder={placeholder} value={value}
        onChange={onChange} required={required}
        aria-label={label || placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '13px 14px 13px 40px', borderRadius: 12,
          border: `1px solid ${focused ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
          background: 'rgba(255,255,255,0.03)', color: '#f0f4ff', fontSize: 14, outline: 'none', transition: 'all 0.2s',
        }}
      />
    </div>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [timeLeft, setTimeLeft] = useState(300)
  const [timedOut, setTimedOut] = useState(false)
  const { signIn, signUp, signInWithGoogle, enterDemo, isAuthenticated, loading, error, clearError } = useAuthStore()
  const nav = useNavigate()

  useEffect(() => { if (isAuthenticated) nav('/') }, [isAuthenticated])
  useEffect(() => { if (error) { toast.error(error); clearError() } }, [error])
  useEffect(() => {
    if (timeLeft <= 0) { setTimedOut(true); return }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (mode === 'signup') {
      if (form.password !== form.confirm) return toast.error('Passwords do not match')
      const r = await signUp(form.email, form.password, form.name)
      if (r.success) toast.success(r.message)
    } else { await signIn(form.email, form.password) }
  }

  if (timedOut) {
    return (
      <div style={{ minHeight: '100vh', background: '#020408', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="glass" style={{ padding: 40, borderRadius: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 20 }}>Session Expired</h2>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 30px', borderRadius: 12, border: 'none', background: '#00d4ff', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Retry Login</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      <style>{`
        @keyframes borderColorCycle {
          0% { border-color: rgba(0, 212, 255, 0.4); box-shadow: 0 0 30px rgba(0, 212, 255, 0.1); }
          33% { border-color: rgba(124, 58, 237, 0.4); box-shadow: 0 0 30px rgba(124, 58, 237, 0.1); }
          66% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 30px rgba(16, 185, 129, 0.1); }
          100% { border-color: rgba(0, 212, 255, 0.4); box-shadow: 0 0 30px rgba(0, 212, 255, 0.1); }
        }
        .auth-card {
          animation: borderColorCycle 6s infinite linear;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-width: 3px !important;
        }
        .auth-card:hover { transform: translateY(-5px); box-shadow: 0 50px 120px rgba(0,0,0,0.9); }
      `}</style>
      <ParticleCanvas />
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at 60% 30%, rgba(0,80,160,0.5) 0%, rgba(2,4,8,1) 70%)' }} />

      {/* ── Centered Auth Card ── */}
      <div className="auth-card fade-up" style={{
        width: '100%', maxWidth: 440, padding: '48px 40px', borderRadius: 28, 
        background: 'rgba(4,10,24,0.97)', backdropFilter: 'blur(50px)',
        border: '3px solid rgba(0,212,255,0.2)', boxShadow: '0 50px 120px rgba(0,0,0,0.9)',
        position: 'relative', zIndex: 10, textAlign: 'center'
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 80, filter: 'drop-shadow(0 0 25px rgba(0,212,255,0.5))' }}>🌐</div>
        </div>
        
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 2, letterSpacing: -0.5 }}>ELECTIONOS <span className="grad-text">INFINITY</span></h1>
        <p style={{ fontSize: 9, color: '#475569', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 800 }}>Autonomous Swarm Intelligence Core</p>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 4, marginBottom: 30, border: '1px solid rgba(255,255,255,0.06)' }}>
          {['signin', 'signup'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === m ? 'rgba(0,212,255,0.15)' : 'transparent', color: mode === m ? '#00d4ff' : '#64748b', fontSize: 13, fontWeight: 800 }}>
              {m === 'signin' ? 'AUTHORIZE' : 'RECRUIT'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} aria-label={mode === 'signin' ? 'Sign in form' : 'Sign up form'}>
          {mode === 'signup' && <Field id="name" label="Full Name" icon="◈" placeholder="Full Name" value={form.name} onChange={set('name')} required />}
          <Field id="email" label="Email address" icon="◇" type="email" placeholder="System ID / Email" value={form.email} onChange={set('email')} required />
          <Field id="password" label="Password" icon="⌬" type="password" placeholder="Access Key" value={form.password} onChange={set('password')} required />
          {mode === 'signup' && <Field id="confirm" label="Confirm password" icon="⌬" type="password" placeholder="Confirm Access Key" value={form.confirm} onChange={set('confirm')} required />}
          <button type="submit" disabled={loading} aria-busy={loading} style={{ width: '100%', padding: '15px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#fff', fontSize: 13, fontWeight: 800, marginTop: 8, cursor: 'pointer', letterSpacing: 1 }}>
            {loading ? 'INITIALIZING...' : mode === 'signin' ? 'AUTHORIZE SESSION' : 'CREATE PROFILE'}
          </button>
        </form>

        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
           <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
           <span style={{ color: '#334155', fontSize: 11, fontWeight: 800 }}>SECURE ACCESS</span>
           <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12, marginBottom: 20 }}>
           <button onClick={signInWithGoogle} style={{ 
             padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', 
             background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13, fontWeight: 700, 
             cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
             transition: 'all 0.2s'
           }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
           </button>
           <button onClick={() => { enterDemo(); nav('/') }} style={{ padding: '12px', borderRadius: 12, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.08)', color: '#00d4ff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Demo Access</button>
        </div>

        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1 }}>SYSTEM TIMEOUT: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>
      </div>

      {/* ── Subtitle Overlay (Bottom Center) ── */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 1, width: '100%', padding: '0 20px' }}>
         <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, textShadow: '0 2px 10px #000' }}>
            ElectionOS Infinity Systems: Securing global democratic integrity through high-speed autonomous agent swarms.
         </p>
      </div>
    </div>
  )
}
