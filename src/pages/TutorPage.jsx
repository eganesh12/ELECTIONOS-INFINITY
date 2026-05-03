import React, { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAgentStore } from '../store/agentStore'
import { useAuthStore } from '../store/authStore'

const SUGGESTIONS = [
  'How does the Electoral College work?',
  'Explain proportional representation',
  'What is gerrymandering?',
  'What is ranked-choice voting?',
  'Explain primary vs general elections',
  'How are votes counted in a democracy?',
]

function TypingDots() {
  return (
    <div style={{ display:'flex', gap:4, alignItems:'center', padding:'4px 0' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#00d4ff', animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
    </div>
  )
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 30); return () => clearTimeout(t) }, [])
  return (
    <div style={{ display:'flex', justifyContent:isUser?'flex-end':'flex-start', gap:10, alignItems:'flex-end', opacity:vis?1:0, transform:vis?'none':'translateY(10px)', transition:'all 0.3s ease' }}>
      {!isUser && <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(124,58,237,0.2))', border:'1px solid rgba(0,212,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🤖</div>}
      <div style={{ maxWidth:'75%', padding:'12px 16px', borderRadius:isUser?'20px 20px 4px 20px':'20px 20px 20px 4px', background:isUser?'linear-gradient(135deg,#7c3aed,#00d4ff)':'rgba(8,20,48,0.95)', border:isUser?'none':'1px solid rgba(0,212,255,0.1)', boxShadow:isUser?'0 4px 20px rgba(124,58,237,0.3)':'none' }}>
        {!isUser && msg.agent && msg.agent !== 'system' && (
          <div style={{ fontSize:9, color:'#00d4ff', marginBottom:6, textTransform:'uppercase', letterSpacing:1.5, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', display:'inline-block' }} />
            {msg.agent} {msg.elapsed ? `· ${msg.elapsed}ms` : ''}
          </div>
        )}
        <p style={{ fontSize:14, lineHeight:1.75, color:'#f0f4ff', whiteSpace:'pre-wrap', wordBreak:'break-word', margin:0 }}>
          {typeof msg.content === 'object' ? JSON.stringify(msg.content, null, 2) : msg.content}
        </p>
      </div>
      {isUser && <div style={{ width:34, height:34, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#7c3aed,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff' }}>👤</div>}
    </div>
  )
}

export default function TutorPage() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const { messages, isThinking, send, clearMessages } = useAgentStore()
  const { user, userProfile, updateXP } = useAuthStore()
  const bottomRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, isThinking])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || isThinking) return
    await quickSend(msg)
  }

  const quickSend = async (msg) => {
    try {
      const userName = userProfile?.displayName || user?.displayName || 'Citizen'
      setInput('')
      textRef.current?.focus()
      await send(msg, { userName })
      updateXP(5)
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  return (
    <Layout>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .sug-btn:hover { background:rgba(0,212,255,0.12)!important; border-color:rgba(0,212,255,0.4)!important; transform:translateY(-2px); }
        .send-btn:hover:not(:disabled) { transform:scale(1.08); box-shadow:0 0 20px rgba(0,212,255,0.5)!important; }
        .clear-btn:hover { color:#ef4444!important; border-color:rgba(239,68,68,0.3)!important; background:rgba(239,68,68,0.08)!important; }
      `}</style>

      <div style={{ maxWidth:860, height:'calc(100vh - 64px)', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:900, color:'#f0f4ff', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(0,212,255,0.2))', border:'1px solid rgba(124,58,237,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🧠</span>
              AI Tutor
            </h1>
            <p style={{ fontSize:12, color:isThinking?'#f59e0b':'#10b981', marginTop:4 }}>
              {isThinking ? '⚡ AI agents thinking…' : '✅ 6 agents ready · Ask anything'}
            </p>
          </div>
          <button className="clear-btn" onClick={clearMessages} style={{ padding:'8px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'#475569', cursor:'pointer', fontSize:12, fontWeight:600, transition:'all 0.2s' }}>
            🗑 Clear Chat
          </button>
        </div>

        {/* Messages area */}
        <div role="log" aria-live="polite" aria-label="Chat messages" style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:16, paddingRight:6, marginBottom:16 }}>
          {messages.length === 0 && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:24, textAlign:'center' }}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,212,255,0.15))', border:'1px solid rgba(0,212,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>🧠</div>
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#f0f4ff', marginBottom:8 }}>Ask me anything about elections</h2>
                <p style={{ color:'#64748b', fontSize:14 }}>Powered by 6 specialized AI agents · Gemini 2.0</p>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', maxWidth:600 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} className="sug-btn" onClick={() => quickSend(s)} style={{ padding:'8px 16px', borderRadius:22, border:'1px solid rgba(0,212,255,0.15)', background:'rgba(0,212,255,0.04)', color:'#94a3b8', fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
          {isThinking && (
            <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(124,58,237,0.2))', border:'1px solid rgba(0,212,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>⚡</div>
              <div style={{ padding:'12px 18px', borderRadius:'20px 20px 20px 4px', background:'rgba(8,20,48,0.95)', border:'1px solid rgba(0,212,255,0.1)' }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display:'flex', gap:10, alignItems:'flex-end', padding:'14px 18px', borderRadius:20, background:'rgba(6,18,40,0.9)', border:`1px solid ${focused?'rgba(0,212,255,0.35)':'rgba(0,212,255,0.12)'}`, boxShadow:focused?'0 0 0 3px rgba(0,212,255,0.06)':'none', transition:'all 0.2s' }}>
          <textarea
            ref={textRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask about elections, voting, democracy… (Enter to send)"
            aria-label="Ask a question about elections or democracy"
            rows={1}
            style={{ flex:1, background:'none', border:'none', outline:'none', color:'#f0f4ff', fontSize:14, resize:'none', lineHeight:1.6, maxHeight:120, overflowY:'auto', paddingTop:2 }}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            aria-label="Send message"
            style={{ width:42, height:42, borderRadius:12, border:'none', cursor:input.trim()&&!isThinking?'pointer':'not-allowed', background:input.trim()&&!isThinking?'linear-gradient(135deg,#00d4ff,#7c3aed)':'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, transition:'all 0.2s', opacity:input.trim()&&!isThinking?1:0.4 }}
          >
            {isThinking ? <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> : '➤'}
          </button>
        </div>
        <p style={{ textAlign:'center', fontSize:10, color:'#1e293b', marginTop:8 }}>Powered by Gemini 2.0 Flash · Responses are AI-generated</p>
      </div>
    </Layout>
  )
}
