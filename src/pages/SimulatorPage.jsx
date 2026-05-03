import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useAgentStore } from '../store/agentStore'
import toast from 'react-hot-toast'

const PRESETS = [
  { label:'Ranked Choice', text:'What if the US switched to ranked-choice voting nationwide?' },
  { label:'3-Party Race', text:'Simulate a competitive 3-party US election under winner-takes-all rules' },
  { label:'Low Turnout', text:'What happens if voter turnout drops below 40% in a presidential election?' },
  { label:'No Electoral College', text:'What if the US abolished the Electoral College and used popular vote?' },
]

function Bar({ value, color, label, delay }) {
  const [w, setW] = useState(0)
  useState(() => { const t = setTimeout(() => setW(value), 300 + delay); return () => clearTimeout(t) })
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:14, color:'#f0f4ff', fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:14, color:color, fontWeight:700 }}>{Math.round(value*100)}%</span>
      </div>
      <div style={{ height:8, borderRadius:4, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:4, background:color, width:`${w*100}%`, transition:'width 1s ease' }} />
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const [scenario, setScenario] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const { simulationResult, runSimulation } = useAgentStore()

  const run = async (text) => {
    const s = text || scenario
    if (!s.trim()) return toast.error('Please enter or select a scenario first')
    setLoading(true)
    try { await runSimulation(s); toast.success('Simulation complete!') }
    catch (e) { toast.error(e.message.includes('429') ? 'AI busy — try again in a moment' : 'Simulation failed. Please retry.') }
    setLoading(false)
  }

  const colors = ['#00d4ff','#7c3aed','#10b981','#f59e0b','#ef4444','#ec4899']

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .preset-btn:hover { transform:translateY(-2px)!important; border-color:rgba(245,158,11,0.5)!important; background:rgba(245,158,11,0.12)!important; }
        .run-btn:hover:not(:disabled) { transform:translateY(-2px)!important; box-shadow:0 8px 32px rgba(245,158,11,0.35)!important; }
      `}</style>

      <div style={{ maxWidth:900 }}>
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:'#f0f4ff', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(239,68,68,0.2))', border:'1px solid rgba(245,158,11,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>⚡</span>
            Election Simulator
          </h1>
          <p style={{ fontSize:12, color:'#64748b', marginTop:4 }}>Describe any election scenario — AI models the outcomes</p>
        </div>

        {/* Input card */}
        <div style={{ padding:26, borderRadius:20, marginBottom:24, background:'rgba(6,18,40,0.8)', border:'1px solid rgba(245,158,11,0.12)', animation:'fadeUp 0.4s ease' }}>
          <label style={{ display:'block', fontSize:12, color:'#64748b', marginBottom:8, textTransform:'uppercase', letterSpacing:1, fontWeight:600 }}>Scenario</label>
          <textarea
            value={scenario}
            onChange={e => setScenario(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. What if the US had a parliamentary system with proportional representation?"
            aria-label="Election scenario to simulate"
            rows={3}
            style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:`1px solid ${focused?'rgba(245,158,11,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'13px 16px', color:'#f0f4ff', fontSize:14, outline:'none', resize:'none', marginBottom:16, transition:'border 0.2s', boxShadow:focused?'0 0 0 3px rgba(245,158,11,0.06)':'none' }}
          />

          {/* Preset buttons */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
            {PRESETS.map(p => (
              <button key={p.label} className="preset-btn" onClick={() => { setScenario(p.text); run(p.text) }} style={{ padding:'7px 14px', borderRadius:18, fontSize:12, border:'1px solid rgba(245,158,11,0.2)', background:'rgba(245,158,11,0.05)', color:'#f59e0b', cursor:'pointer', fontWeight:600, transition:'all 0.2s' }}>
                {p.label}
              </button>
            ))}
          </div>

          <button className="run-btn" onClick={() => run()} disabled={!scenario.trim()||loading} style={{ padding:'13px 32px', borderRadius:12, border:'none', cursor:scenario.trim()&&!loading?'pointer':'not-allowed', background:scenario.trim()&&!loading?'linear-gradient(135deg,#f59e0b,#ef4444)':'rgba(255,255,255,0.06)', color:'white', fontSize:14, fontWeight:800, display:'flex', alignItems:'center', gap:10, transition:'all 0.2s', opacity:scenario.trim()&&!loading?1:0.5 }}>
            {loading ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />Simulating…</> : '▶ Run Simulation'}
          </button>
        </div>

        {/* Results */}
        {simulationResult && (
          <div style={{ padding:28, borderRadius:20, background:'rgba(6,18,40,0.8)', border:'1px solid rgba(245,158,11,0.12)', animation:'fadeUp 0.5s ease' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#f0f4ff', flex:1 }}>📊 Simulation Results</h2>
              <span style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:'rgba(16,185,129,0.12)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)' }}>
                {Math.round((simulationResult.confidence||0.75)*100)}% confidence
              </span>
            </div>

            {simulationResult.scenario && (
              <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.15)', marginBottom:22 }}>
                <p style={{ fontSize:13, color:'#f59e0b', fontWeight:600 }}>{simulationResult.scenario}</p>
              </div>
            )}

            {(simulationResult.outcomes||[]).map((o,i) => (
              <Bar key={i} label={o.name} value={o.probability||0} color={colors[i%colors.length]} delay={i*100} />
            ))}

            {simulationResult.analysis && (
              <div style={{ padding:18, borderRadius:14, background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.12)', marginTop:20 }}>
                <p style={{ fontSize:12, color:'#64748b', marginBottom:6, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>AI Analysis</p>
                <p style={{ fontSize:14, color:'#c0caf5', lineHeight:1.7 }}>{simulationResult.analysis}</p>
              </div>
            )}

            {simulationResult.keyFactors?.length > 0 && (
              <div style={{ marginTop:18 }}>
                <p style={{ color:'#64748b', fontSize:11, marginBottom:10, textTransform:'uppercase', letterSpacing:1, fontWeight:600 }}>Key Factors</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {simulationResult.keyFactors.map((f,i) => (
                    <span key={i} style={{ padding:'5px 14px', borderRadius:18, fontSize:12, background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', color:'#a78bfa' }}>{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
