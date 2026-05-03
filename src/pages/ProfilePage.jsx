import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const BADGES = [
  { icon:'🏆', label:'Civic Master', desc:'Complete 50 quizzes', earned:false },
  { icon:'🧠', label:'Deep Thinker', desc:'Ask 25 AI questions', earned:true },
  { icon:'⚡', label:'Speed Learner', desc:'Answer in under 10s', earned:true },
  { icon:'🌍', label:'Global Citizen', desc:'Explore 3D Globe', earned:false },
  { icon:'🎯', label:'Perfect Score', desc:'100% quiz accuracy', earned:false },
  { icon:'🔥', label:'On Fire', desc:'5 question streak', earned:false },
]

export default function ProfilePage() {
  const { user, userProfile, signOut } = useAuthStore()
  const nav = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const xp = userProfile?.stats?.xp || 0
  const level = Math.floor(xp / 200) + 1
  const xpInLevel = xp % 200
  const xpToNext = 200

  const initials = (userProfile?.displayName || user?.displayName || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    nav('/auth')
  }

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        .badge-card { transition:all 0.2s; }
        .badge-card:hover { transform:translateY(-4px)!important; }
        .action-btn:hover { transform:translateY(-2px)!important; }
      `}</style>

      <div style={{ maxWidth:820 }}>
        <h1 style={{ fontSize:22, fontWeight:900, color:'#f0f4ff', marginBottom:28, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,rgba(236,72,153,0.2),rgba(124,58,237,0.2))', border:'1px solid rgba(236,72,153,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>👤</span>
          My Profile
        </h1>

        {/* Profile card */}
        <div style={{ padding:32, borderRadius:20, marginBottom:24, background:'rgba(6,18,40,0.8)', border:'1px solid rgba(0,212,255,0.1)', display:'flex', alignItems:'center', gap:24, animation:'fadeUp 0.4s ease', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#00d4ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:900, color:'white', boxShadow:'0 0 30px rgba(124,58,237,0.4)', overflow:'hidden' }}>
              {user?.photoURL
                ? <img src={user.photoURL} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : initials}
            </div>
            <div style={{ position:'absolute', bottom:0, right:0, width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', border:'2px solid #020408' }}>
              {level}
            </div>
          </div>

          <div style={{ flex:1, minWidth:200 }}>
            <h2 style={{ fontSize:22, fontWeight:900, color:'#f0f4ff', marginBottom:4 }}>{userProfile?.displayName || user?.displayName || 'Civic Learner'}</h2>
            <p style={{ color:'#64748b', fontSize:13, marginBottom:14 }}>{user?.email || 'demo@electionos.ai'}</p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ padding:'3px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:'rgba(0,212,255,0.12)', color:'#00d4ff', border:'1px solid rgba(0,212,255,0.25)' }}>Level {level}</span>
              <div style={{ flex:1, height:6, borderRadius:3, background:'rgba(255,255,255,0.06)', overflow:'hidden', minWidth:100 }}>
                <div style={{ height:'100%', borderRadius:3, background:'linear-gradient(90deg,#00d4ff,#7c3aed)', width:`${(xpInLevel/xpToNext)*100}%`, transition:'width 1.2s ease' }} />
              </div>
              <span style={{ fontSize:11, color:'#64748b', whiteSpace:'nowrap' }}>{xpInLevel}/{xpToNext} XP</span>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
            <span style={{ padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:700, background:'rgba(16,185,129,0.1)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)', textTransform:'capitalize' }}>
              {userProfile?.role || 'citizen'}
            </span>
            {userProfile?.isDemo && (
              <span style={{ padding:'5px 14px', borderRadius:20, fontSize:11, background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.2)' }}>Demo Mode</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24, animation:'fadeUp 0.5s ease' }}>
          {[
            { label:'Total XP', value:xp.toLocaleString(), icon:'⭐', color:'#f59e0b' },
            { label:'Quizzes', value:userProfile?.stats?.quizzesTaken||0, icon:'❓', color:'#10b981' },
            { label:'Level', value:level, icon:'🏆', color:'#00d4ff' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ padding:24, borderRadius:16, textAlign:'center', background:'rgba(6,18,40,0.7)', border:`1px solid ${color}20`, transition:'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
            >
              <div style={{ fontSize:32, marginBottom:10 }}>{icon}</div>
              <div style={{ fontSize:28, fontWeight:900, color:'#f0f4ff', marginBottom:4 }}>{value}</div>
              <div style={{ fontSize:12, color:'#64748b', fontWeight:500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ marginBottom:24, animation:'fadeUp 0.6s ease' }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'#f0f4ff', marginBottom:14 }}>🎖️ Achievements</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {BADGES.map(b => (
              <div key={b.label} className="badge-card" style={{ padding:'16px 14px', borderRadius:14, background:b.earned?'rgba(0,212,255,0.06)':'rgba(255,255,255,0.02)', border:`1px solid ${b.earned?'rgba(0,212,255,0.2)':'rgba(255,255,255,0.05)'}`, opacity:b.earned?1:0.45, textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{b.icon}</div>
                <div style={{ fontSize:12, fontWeight:700, color:b.earned?'#f0f4ff':'#64748b', marginBottom:4 }}>{b.label}</div>
                <div style={{ fontSize:11, color:'#475569' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security + Actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, animation:'fadeUp 0.7s ease' }}>
          <div style={{ padding:24, borderRadius:16, background:'rgba(6,18,40,0.7)', border:'1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#f0f4ff', marginBottom:14 }}>🔒 Security</h3>
            {[
              { label:'Email Verified', value: user?.emailVerified?'✅ Verified':'⚠️ Not verified' },
              { label:'Account Type', value: userProfile?.role||'citizen' },
              { label:'Session', value:'🔐 Active' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:13, color:'#64748b' }}>{label}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#f0f4ff', textTransform:'capitalize' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ padding:24, borderRadius:16, background:'rgba(6,18,40,0.7)', border:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', gap:10 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#f0f4ff', marginBottom:4 }}>⚡ Quick Actions</h3>
            {[
              { label:'Go to AI Tutor', icon:'🧠', path:'/tutor', color:'#7c3aed' },
              { label:'Take a Quiz', icon:'❓', path:'/quiz', color:'#10b981' },
              { label:'Run Simulation', icon:'⚡', path:'/simulator', color:'#f59e0b' },
            ].map(a => (
              <button key={a.label} className="action-btn" onClick={() => nav(a.path)} style={{ padding:'10px 14px', borderRadius:10, border:`1px solid ${a.color}20`, background:`${a.color}08`, color:'#f0f4ff', cursor:'pointer', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8, transition:'all 0.2s', textAlign:'left' }}>
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
            <button onClick={handleSignOut} disabled={signingOut} style={{ marginTop:4, padding:'10px 14px', borderRadius:10, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.06)', color:'#ef4444', cursor:'pointer', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8, transition:'all 0.2s' }}>
              🚪 {signingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
