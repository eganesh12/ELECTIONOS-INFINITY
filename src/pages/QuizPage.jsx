import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useAgentStore } from '../store/agentStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const TOPICS = ['Electoral Systems','Voting Rights','US Constitution','Political Parties','Global Elections','Democracy Basics','Election Process','Civic Duties']
const TOPIC_ICONS = { 'Electoral Systems':'🗳️','Voting Rights':'✊','US Constitution':'📜','Political Parties':'🏛️','Global Elections':'🌍','Democracy Basics':'🕊️','Election Process':'⚙️','Civic Duties':'🏅' }

export default function QuizPage() {
  const [topic, setTopic] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [sessionScore, setSessionScore] = useState(0)
  const [totalScore, setTotalScore] = useState({ correct:0, total:0 })
  const [streak, setStreak] = useState(0)
  const [showResults, setShowResults] = useState(false)
  
  const { generateQuiz } = useAgentStore()
  const { updateXP } = useAuthStore()

  const startSession = async (t, d = difficulty) => {
    setLoading(true); setQuestions([]); setCurrentIndex(0); setSessionScore(0); setShowResults(false); setSelected(null); setRevealed(false)
    const set = await generateQuiz(t, d)
    setQuestions(set)
    setTopic(t)
    setLoading(false)
  }

  const quiz = questions[currentIndex]

  const answer = (opt) => {
    if (revealed || !quiz) return
    setSelected(opt); setRevealed(true)
    const ok = opt.trim()[0].toUpperCase() === quiz.correct.trim()[0].toUpperCase()
    
    if (ok) {
      let pts = 10
      if (difficulty === 'hard') pts = 30
      else if (difficulty === 'medium') pts = 20
      if (streak >= 2) pts += 10
      
      setSessionScore(s => s + 1)
      setTotalScore(s => ({ correct:s.correct+1, total:s.total+1 }))
      setStreak(s => s+1)
      updateXP(pts)
      toast.success(`✅ Correct! +${pts} XP${streak >= 2 ? ' 🔥 Streak!' : ''}`)
    } else {
      setTotalScore(s => ({ ...s, total:s.total+1 }))
      setStreak(0)
      toast.error('❌ Not quite!')
    }
  }

  const nextQ = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setShowResults(true)
    }
  }

  const isCorrect = (opt) => opt.trim()[0].toUpperCase() === quiz?.correct?.trim()[0]?.toUpperCase()

  const getOptStyle = (opt) => {
    if (!revealed) return { bg: opt===selected?'rgba(0,212,255,0.12)':'rgba(255,255,255,0.03)', border: opt===selected?'rgba(0,212,255,0.5)':'rgba(255,255,255,0.08)', color: opt===selected?'#00d4ff':'#c0caf5' }
    if (isCorrect(opt)) return { bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.5)', color:'#10b981' }
    if (opt===selected) return { bg:'rgba(239,68,68,0.12)', border:'rgba(239,68,68,0.5)', color:'#ef4444' }
    return { bg:'rgba(255,255,255,0.02)', border:'rgba(255,255,255,0.04)', color:'#334155' }
  }

  return (
    <Layout>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.9);opacity:0} 100%{transform:scale(1);opacity:1} }
        .topic-btn:hover { transform:translateY(-2px)!important; }
        .opt-btn:hover:not(:disabled) { transform:translateX(4px)!important; }
        .next-btn:hover { transform:translateY(-2px)!important; box-shadow:0 8px 24px rgba(16,185,129,0.3)!important; }
      `}</style>

      <div style={{ maxWidth:800 }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:900, color:'#f0f4ff', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.2))', border:'1px solid rgba(16,185,129,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>❓</span>
              Quiz Arena
            </h1>
            <p style={{ fontSize:12, color:'#64748b', marginTop:4 }}>10-Question Master Challenges · Gemini 2.0</p>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            {streak >= 3 && <div style={{ padding:'6px 14px', borderRadius:20, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', fontSize:13, fontWeight:700 }}>🔥 {streak} Streak!</div>}
            <div style={{ padding:'6px 16px', borderRadius:20, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', color:'#f59e0b', fontWeight:700, fontSize:14 }}>
              🏆 {totalScore.correct}/{totalScore.total}
            </div>
          </div>
        </div>

        {!questions.length && !loading && (
          <>
            {/* Topic selection */}
            <div style={{ marginBottom:28 }}>
              <p style={{ color:'#64748b', fontSize:12, marginBottom:12, textTransform:'uppercase', letterSpacing:1, fontWeight:600 }}>1. Choose Topic</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {TOPICS.map(t => (
                  <button key={t} className="topic-btn" onClick={() => startSession(t)} style={{ padding:'8px 18px', borderRadius:22, cursor:'pointer', border:`1px solid ${topic===t?'rgba(16,185,129,0.5)':'rgba(255,255,255,0.08)'}`, background:topic===t?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.03)', color:topic===t?'#10b981':'#8892b0', fontSize:13, fontWeight:topic===t?700:400, transition:'all 0.2s', display:'flex', alignItems:'center', gap:6 }}>
                    <span>{TOPIC_ICONS[t]||'📚'}</span>{t}
                  </button>
                ))}
                <button className="topic-btn" onClick={() => startSession(TOPICS[Math.floor(Math.random()*TOPICS.length)])} style={{ padding:'8px 18px', borderRadius:22, cursor:'pointer', border:'1px solid rgba(0,212,255,0.3)', background:'rgba(0,212,255,0.06)', color:'#00d4ff', fontSize:13, fontWeight:600 }}>⚡ Random</button>
              </div>
            </div>

            {/* Difficulty selection */}
            <div style={{ marginBottom:28 }}>
              <p style={{ color:'#64748b', fontSize:12, marginBottom:12, textTransform:'uppercase', letterSpacing:1, fontWeight:600 }}>2. Select Intensity</p>
              <div style={{ display:'flex', gap:8 }}>
                {['easy', 'medium', 'hard'].map(d => (
                  <button key={d} className="topic-btn" onClick={() => setDifficulty(d)} style={{ padding:'8px 24px', borderRadius:12, cursor:'pointer', border:`1px solid ${difficulty===d?(d==='easy'?'#10b981':d==='medium'?'#f59e0b':'#ef4444'):'rgba(255,255,255,0.08)'}`, background:difficulty===d?(d==='easy'?'rgba(16,185,129,0.12)':d==='medium'?'rgba(245,158,11,0.12)':'rgba(239,68,68,0.12)'):'rgba(255,255,255,0.03)', color:difficulty===d?(d==='easy'?'#10b981':d==='medium'?'#f59e0b':'#ef4444'):'#8892b0', fontSize:13, fontWeight:700, textTransform:'capitalize' }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {loading && (
          <div style={{ padding:60, borderRadius:20, textAlign:'center', background:'rgba(6,18,40,0.7)', border:'1px solid rgba(16,185,129,0.1)', animation:'fadeUp 0.3s ease' }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🧠</div>
            <p style={{ color:'#10b981', fontWeight:600 }}>AI Orchestrator is generating 10 unique questions...</p>
            <p style={{ color:'#64748b', fontSize:12, marginTop:4 }}>Crafting a master challenge for {topic}</p>
          </div>
        )}

        {showResults ? (
          <div style={{ padding:40, borderRadius:20, textAlign:'center', background:'rgba(6,18,40,0.85)', border:'1px solid rgba(16,185,129,0.2)', animation:'popIn 0.4s ease' }}>
             <div style={{ fontSize:52, marginBottom:20 }}>🏆</div>
             <h2 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:8 }}>Challenge Complete!</h2>
             <p style={{ color:'#94a3b8', fontSize:16, marginBottom:24 }}>You scored <strong>{sessionScore}/10</strong> in {topic}</p>
             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32 }}>
                <div className="glass" style={{ padding:20, borderRadius:16 }}>
                   <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Accuracy</div>
                   <div style={{ fontSize:24, fontWeight:800, color:'#10b981' }}>{sessionScore*10}%</div>
                </div>
                <div className="glass" style={{ padding:20, borderRadius:16 }}>
                   <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>Level Progress</div>
                   <div style={{ fontSize:24, fontWeight:800, color:'#7c3aed' }}>+{sessionScore*20} XP</div>
                </div>
             </div>
             <button onClick={() => setQuestions([])} style={{ padding:'14px 40px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#00d4ff,#7c3aed)', color:'#fff', fontWeight:800, cursor:'pointer' }}>Start New Challenge</button>
          </div>
        ) : (
          !loading && quiz && (
            <div style={{ padding:30, borderRadius:20, background:'rgba(6,18,40,0.8)', border:'1px solid rgba(16,185,129,0.12)', animation:'popIn 0.35s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ padding:'4px 12px', borderRadius:20, fontSize:10, fontWeight:800, background:'rgba(124,58,237,0.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.3)' }}>Q{currentIndex+1}/10</span>
                  <span style={{ padding:'4px 14px', borderRadius:20, fontSize:10, fontWeight:800, textTransform:'uppercase', background:'rgba(245,158,11,0.12)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.25)' }}>{quiz.difficulty}</span>
                </div>
                <span style={{ fontSize:12, color:'#64748b' }}>{quiz.topic}</span>
              </div>

              <h2 style={{ fontSize:18, fontWeight:700, color:'#f0f4ff', lineHeight:1.6, marginBottom:22 }}>{quiz.question}</h2>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {(quiz.options||[]).map((opt,i) => {
                  const s = getOptStyle(opt)
                  const correct = revealed && isCorrect(opt)
                  const wrong = revealed && opt===selected && !correct
                  return (
                    <button key={i} className="opt-btn" onClick={() => answer(opt)} disabled={revealed} style={{ padding:'14px 20px', borderRadius:13, textAlign:'left', border:`1px solid ${s.border}`, background:s.bg, color:s.color, cursor:revealed?'default':'pointer', fontSize:14, fontWeight:500, display:'flex', alignItems:'center', gap:12, transition:'all 0.2s' }}>
                      <span style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0, border:`1px solid ${s.border}` }}>
                        {correct ? '✅' : wrong ? '❌' : opt.trim()[0]}
                      </span>
                      <span>{opt.replace(/^[A-D]\)\s*/i,'')}</span>
                    </button>
                  )
                })}
              </div>

              {revealed && (
                <div style={{ marginTop:22, padding:20, borderRadius:14, background: selected&&isCorrect(selected)?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)', border:`1px solid ${selected&&isCorrect(selected)?'rgba(16,185,129,0.25)':'rgba(239,68,68,0.25)'}`, animation:'fadeUp 0.3s ease' }}>
                  <p style={{ fontSize:15, fontWeight:700, marginBottom:8, color:selected&&isCorrect(selected)?'#10b981':'#ef4444' }}>
                    {selected&&isCorrect(selected) ? '🎉 Correct!' : `❌ Incorrect — Answer: ${quiz.correct}`}
                  </p>
                  <p style={{ fontSize:13, color:'#94a3b8', lineHeight:1.7, marginBottom:16 }}>💡 {quiz.explanation}</p>
                  <button className="next-btn" onClick={nextQ} style={{ padding:'10px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#10b981,#06b6d4)', color:'white', cursor:'pointer', fontSize:13, fontWeight:700 }}>
                    {currentIndex < 9 ? 'Next Question →' : 'See Results 🏆'}
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </Layout>
  )
}
