import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuthStore } from '../store/authStore'
import { useAgentStore } from '../store/agentStore'
import { 
  Brain, 
  Trophy, 
  Zap, 
  Globe, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  Activity,
  Star,
  Cpu,
  BarChart3,
  Clock
} from 'lucide-react'

const CARDS = [
  { path: '/tutor',     icon: Brain,    label: 'AI Tutor',    desc: 'Ask anything about elections & civic issues', color: '#7c3aed', glow: 'rgba(124,58,237,0.2)' },
  { path: '/quiz',      icon: Trophy,   label: 'Quiz Arena',   desc: 'Test your civic knowledge & earn XP',          color: '#10b981', glow: 'rgba(16,185,129,0.2)' },
  { path: '/simulator', icon: Zap,      label: 'Simulator',    desc: 'Run realistic election scenarios',              color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
  { path: '/globe',     icon: Globe,    label: '3D Globe',     desc: 'Explore global elections visually',             color: '#06b6d4', glow: 'rgba(6,182,212,0.2)' },
]

const AGENTS = [
  { name: 'Master Orchestrator', icon: Target, color: '#00d4ff' },
  { name: 'Teacher Agent',       icon: Brain, color: '#7c3aed' },
  { name: 'Quiz Agent',          icon: Trophy, color: '#10b981' },
  { name: 'Fact-Checker',        icon: CheckCircle2, color: '#06b6d4' },
  { name: 'Simulator',           icon: Zap, color: '#f59e0b' },
  { name: 'Safety Guardian',     icon: ShieldCheck, color: '#ec4899' },
]

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <div className="fade-up glass" style={{
      padding: '24px', borderRadius: 20,
      border: `1px solid ${color}20`,
      background: `linear-gradient(135deg, ${color}08 0%, rgba(6,14,30,0.9) 100%)`,
      animationDelay: `${delay}ms`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${color}15` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ 
        width: 44, height: 44, borderRadius: 12, background: `${color}15`, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        border: `1px solid ${color}30`
      }}>
        <Icon size={24} color={color} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const nav = useNavigate()
  const { user, userProfile } = useAuthStore()
  const { metrics } = useAgentStore()
  const [hoveredCard, setHoveredCard] = useState(null)

  const hour = new Date().getHours()
  const greet = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name = userProfile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Citizen'

  const stats = [
    { icon: Star,      label: 'XP Earned',     value: (userProfile?.stats?.xp || 0).toLocaleString(),  color: '#f59e0b' },
    { icon: Trophy,    label: 'Quizzes Taken', value: userProfile?.stats?.quizzesTaken || 0,              color: '#10b981' },
    { icon: Cpu,       label: 'AI Queries',    value: metrics?.total || 0,                                color: '#7c3aed' },
    { icon: Clock,     label: 'Avg Latency',   value: `${metrics?.avgMs || 0}ms`,                         color: '#00d4ff' },
  ]

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: -1.5, lineHeight: 1 }}>
                {greet}, <span className="grad-text">{name}</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 8, fontWeight: 500 }}>
                Autonomous systems engaged. Monitoring democratic signals...
              </p>
            </div>
            <div style={{
              padding: '10px 20px', borderRadius: 14, fontSize: 12, fontWeight: 800,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Activity size={14} className="pulse" />
              SYSTEMS ONLINE
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 40 }}>
          {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 60} />)}
        </div>

        {/* ── Quick Launch ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <BarChart3 size={16} color="#475569" />
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#475569', letterSpacing: 2, textTransform: 'uppercase' }}>
            Mission Control
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginBottom: 40 }}>
          {CARDS.map(({ path, icon: Icon, label, desc, color, glow }) => (
            <button
              key={path}
              onClick={() => nav(path)}
              onMouseEnter={() => setHoveredCard(path)}
              onMouseLeave={() => setHoveredCard(null)}
              className="fade-up"
              style={{
                padding: '30px', borderRadius: 24, border: `1px solid ${color}${hoveredCard === path ? '40' : '15'}`,
                background: hoveredCard === path ? `${color}10` : `${color}06`,
                cursor: 'pointer', textAlign: 'left',
                transform: hoveredCard === path ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hoveredCard === path ? `0 24px 60px ${glow}` : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: 16, background: `${color}15`,
                border: `1px solid ${color}30`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 20,
              }}>
                <Icon size={26} color={color} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
            </button>
          ))}
        </div>

        {/* ── Agent Swarm ── */}
        <div className="fade-up glass" style={{ padding: '28px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Cpu size={18} color="#00d4ff" />
              Intelligence Swarm Status
            </h3>
            <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '6px 14px', borderRadius: 30, border: '1px solid rgba(16,185,129,0.2)', fontWeight: 800 }}>
              NEUTRALITY VERIFIED
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {AGENTS.map(({ name, icon: Icon, color }) => (
              <div key={name} style={{
                padding: '14px 18px', borderRadius: 16,
                background: `${color}08`, border: `1px solid ${color}15`,
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s',
              }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}
