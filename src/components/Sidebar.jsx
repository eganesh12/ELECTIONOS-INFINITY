import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { 
  LayoutDashboard, 
  Brain, 
  Trophy, 
  Zap, 
  Globe, 
  User, 
  LogOut,
  ShieldCheck
} from 'lucide-react'

const LINKS = [
  { path: '/',          icon: LayoutDashboard, label: 'Dashboard',  accent: '#00d4ff' },
  { path: '/tutor',     icon: Brain,           label: 'AI Tutor',   accent: '#7c3aed' },
  { path: '/quiz',      icon: Trophy,          label: 'Quiz Arena',  accent: '#10b981' },
  { path: '/simulator', icon: Zap,             label: 'Simulator',   accent: '#f59e0b' },
  { path: '/globe',     icon: Globe,           label: '3D Globe',    accent: '#06b6d4' },
  { path: '/profile',   icon: User,            label: 'Profile',     accent: '#ec4899' },
]

export default function Sidebar() {
  const navigate   = useNavigate()
  const loc        = useLocation()
  const { user, userProfile, signOut } = useAuthStore()
  const [hovered, setHovered] = useState(null)
  const [signing, setSigning] = useState(false)

  const handleSignOut = async () => {
    setSigning(true)
    await signOut()
    setSigning(false)
  }

  const initials = (userProfile?.displayName || user?.displayName || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <style>{`
        .nav-btn { transition: all 0.18s ease; }
        .nav-btn:hover { background: rgba(255,255,255,0.05) !important; }
        .signout-btn:hover { background: rgba(239,68,68,0.1) !important; color: #ef4444 !important; }
      `}</style>

      <aside
        aria-label="Main navigation"
        style={{
        width: 230, minHeight: '100vh',
        background: 'rgba(4,10,22,0.98)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(0,212,255,0.08)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, zIndex: 100,
        boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
      }}>

        {/* ── Logo ── */}
        <div style={{ padding: '24px 18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28, filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.6))' }}>🌐</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#f0f4ff', letterSpacing: -0.2 }}>ElectionOS</div>
              <div style={{ fontSize: 9, color: '#00d4ff', letterSpacing: 2, fontWeight: 800 }}>INFINITY</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
            <ShieldCheck size={10} color="#10b981" />
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, letterSpacing: 0.5 }}>CORE ACTIVE</span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav aria-label="Site navigation" style={{ flex: 1, padding: '16px 10px' }}>
          {LINKS.map(({ path, icon: Icon, label, accent }) => {
            const active = loc.pathname === path
            return (
              <button
                key={path}
                className="nav-btn"
                onClick={() => navigate(path)}
                onMouseEnter={() => setHovered(path)}
                onMouseLeave={() => setHovered(null)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '11px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: active ? `${accent}12` : 'transparent',
                  color: active ? accent : hovered === path ? '#f0f4ff' : '#64748b',
                  fontSize: 13, fontWeight: active ? 800 : 500,
                  marginBottom: 4, textAlign: 'left',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                <span style={{ flex: 1 }}>{label}</span>
                {active && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} aria-hidden="true" />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── User ── */}
        <div style={{ padding: '10px 10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            marginBottom: 8,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#7c3aed,#00d4ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 900, color: '#fff', cursor: 'pointer'
            }} onClick={() => navigate('/profile')}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#f0f4ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userProfile?.displayName || user?.displayName || 'Citizen'}
              </div>
              <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', fontWeight: 800 }}>
                Level {Math.floor((userProfile?.stats?.xp || 0) / 1000) + 1}
              </div>
            </div>
          </div>

          <button className="signout-btn" onClick={handleSignOut} disabled={signing} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#475569', fontSize: 12, fontWeight: 700,
            transition: 'all 0.2s',
          }}>
            <LogOut size={16} />
            <span>{signing ? 'SECURE LOGOUT...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
