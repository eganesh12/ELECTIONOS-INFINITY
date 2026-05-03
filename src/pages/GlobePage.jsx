import React, { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

const ELECTION_DATA = [
  { id: 1, lat: 37.0902, lng: -95.7129, country: 'United States', status: 'Upcoming', type: 'Presidential', date: 'Nov 2024', info: '2024 Presidential Election: A critical juncture for US democracy, involving the Presidency, Senate, and House of Representatives.', color: '#ef4444' },
  { id: 2, lat: 55.3781, lng: -3.4360, country: 'United Kingdom', status: 'Recent', type: 'Parliamentary', date: 'July 2024', info: '2024 General Election: A historic shift in power as the Labour Party secured a massive majority, ending 14 years of Conservative rule.', color: '#3b82f6' },
  { id: 3, lat: 20.5937, lng: 78.9629, country: 'India', status: 'Recent', type: 'Massive Scale', date: 'June 2024', info: '2024 General Election: The largest democratic exercise in human history. Over 640 million people voted, resulting in a third consecutive term for the BJP-led NDA coalition.', color: '#f59e0b' },
  { id: 4, lat: -25.2744, lng: 133.7751, country: 'Australia', status: 'Upcoming', type: 'Parliamentary', date: '2025', info: '2025 Federal Election: Australians will vote for all 151 seats in the House of Representatives and 40 of the 76 Senate seats.', color: '#10b981' },
  { id: 5, lat: -30.5595, lng: 22.9375, country: 'South Africa', status: 'Recent', type: 'Historic Shift', date: 'May 2024', info: '2024 General Election: A watershed moment as the ANC lost its absolute majority for the first time since 1994, leading to a Government of National Unity.', color: '#06b6d4' },
  { id: 6, lat: 23.6345, lng: -102.5528, country: 'Mexico', status: 'Recent', type: 'Major Reform', date: 'June 2024', info: '2024 General Election: Claudia Sheinbaum was elected as Mexico\'s first female president in a landslide victory.', color: '#10b981' },
  { id: 7, lat: 46.2276, lng: 2.2137, country: 'France', status: 'Recent', type: 'Presidential', date: 'July 2024', info: '2024 Legislative Elections: Snap elections resulted in a fragmented parliament with three major blocs, leading to intense coalition negotiations.', color: '#ef4444' },
]

const LEGEND = [
  { label: 'Presidential / High Polarization', color: '#ef4444' },
  { label: 'Parliamentary / Majority Shift', color: '#3b82f6' },
  { label: 'Historic Reform / Landmark Win', color: '#10b981' },
  { label: 'Massive Scale / Peak Turnout', color: '#f59e0b' },
  { label: 'Geopolitical Structural Shift', color: '#06b6d4' },
]

export default function GlobePage() {
  const globeEl = useRef()
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, [])

  return (
    <Layout>
      <style>{`
        @keyframes markerPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .marker-dot:hover { transform: translate(-50%, -50%) scale(1.8)!important; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
      <div style={{ position:'relative', height:'calc(100vh - 120px)', width:'100%', borderRadius:24, overflow:'hidden', background:'#030712', border:'1px solid rgba(0,212,255,0.1)' }}>
        
        {/* Globe Interface */}
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          htmlElementsData={ELECTION_DATA}
          htmlElement={d => {
            const el = document.createElement('div');
            el.className = 'marker-dot';
            el.innerHTML = `
              <div style="cursor:pointer; transform: translate(-50%, -50%); position:relative;">
                <div style="width:16px; height:16px; border-radius:50%; background:${d.color}; box-shadow: 0 0 20px ${d.color}; border: 2px solid #fff; animation: markerPulse 2s infinite ease-in-out;"></div>
                <div style="position:absolute; top:24px; left:50%; transform:translateX(-50%); white-space:nowrap; font-size:12px; font-weight:800; color:#fff; text-shadow:0 2px 8px #000; pointer-events:none; background:rgba(0,0,0,0.6); padding:2px 8px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">${d.country}</div>
              </div>
            `;
            el.onclick = () => {
              setSelected(d);
              globeEl.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.6 }, 1200);
            };
            el.onmouseenter = () => setHovered(d);
            el.onmouseleave = () => setHovered(null);
            return el;
          }}

          arcsData={ELECTION_DATA.map((d, i) => ({
            startLat: d.lat, startLng: d.lng,
            endLat: ELECTION_DATA[(i+1)%ELECTION_DATA.length].lat, 
            endLng: ELECTION_DATA[(i+1)%ELECTION_DATA.length].lng,
            color: d.color
          }))}
          arcColor={'color'}
          arcDashLength={0.4}
          arcDashGap={4}
          arcDashAnimateTime={1500}
          arcStroke={0.5}
        />

        {/* Hover Tooltip */}
        {hovered && !selected && (
          <div className="fade-in" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -100px)', padding:'12px 16px', borderRadius:14, background:'rgba(8,20,48,0.95)', border:`1px solid ${hovered.color}60`, boxShadow:`0 10px 30px rgba(0,0,0,0.4), 0 0 10px ${hovered.color}20`, zIndex:100, pointerEvents:'none', minWidth:180 }}>
             <div style={{ fontSize:10, fontWeight:800, color:hovered.color, textTransform:'uppercase', marginBottom:4 }}>{hovered.type}</div>
             <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>{hovered.country}</div>
             <div style={{ fontSize:11, color:'#94a3b8' }}>{hovered.status} • {hovered.date}</div>
          </div>
        )}

        {/* Info Overlay (Realistic Panel) */}
        {selected && (
          <div className="fade-in glass" style={{ position:'absolute', bottom:30, right:30, width:320, padding:24, borderRadius:20, background:'rgba(6,14,30,0.95)', border:`1px solid ${selected.color}40`, boxShadow:`0 20px 50px rgba(0,0,0,0.5), 0 0 20px ${selected.color}20`, zIndex:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:selected.color, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>{selected.status} Election</div>
                <h2 style={{ fontSize:24, fontWeight:900, color:'#f0f4ff' }}>{selected.country}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:20 }}>×</button>
            </div>
            
            <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(255,255,255,0.03)', marginBottom:16 }}>
              <div style={{ fontSize:11, color:'#64748b', marginBottom:4 }}>Date</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#f0f4ff' }}>📅 {selected.date}</div>
            </div>

            <p style={{ fontSize:14, color:'#94a3b8', lineHeight:1.6, marginBottom:20 }}>
              {selected.info}
            </p>

            <button 
              onClick={() => nav('/tutor')}
              style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:`linear-gradient(135deg, ${selected.color}, #7c3aed)`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 8px 20px ${selected.color}40` }}
            >
              Analyze with AI Tutor →
            </button>
          </div>
        )}

        {/* Legend */}
        <div style={{ position:'absolute', top:24, left:24, pointerEvents:'none' }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:8, textShadow:'0 2px 10px rgba(0,0,0,0.5)' }}>🌍 Global Intelligence</h1>
          <p style={{ fontSize:13, color:'#94a3b8', textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>Real-time monitoring of world democratic events</p>
        </div>

        <div style={{ position:'absolute', top:24, right:24, display:'flex', flexDirection:'column', gap:12 }}>
           <div className="glass" style={{ padding:'12px 20px', borderRadius:20, background:'rgba(8,20,48,0.9)', border:'1px solid rgba(255,255,255,0.1)', minWidth:240 }}>
              <div style={{ fontSize:10, fontWeight:800, color:'#64748b', letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>Intelligence Legend</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {LEGEND.map(item => (
                  <div key={item.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:item.color, boxShadow:`0 0 10px ${item.color}` }}></div>
                    <span style={{ fontSize:11, color:'#94a3b8', fontWeight:500 }}>{item.label}</span>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="glass" style={{ padding:'10px 16px', borderRadius:30, fontSize:12, color:'#fff', display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)' }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', boxShadow:'0 0 10px #ef4444' }}></div>
              High Tension Regions: 2
           </div>
        </div>

      </div>
    </Layout>
  )
}
