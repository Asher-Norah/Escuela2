'use client'

import { useState, useEffect } from 'react'
import { card, cardHdr, cardTtl, cardLnk, stat, grid, pill, barFill, barRow, barTrack, API, authHeaders } from '../styles'

export default function OverviewView() {
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/admin/dashboard`, { headers: authHeaders() })
      .then(r => r.json()).then(setData).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fees = [
    { label:'Form 1', pct:88, color:'linear-gradient(90deg,#1e6bff,#00c9ff)' },
    { label:'Form 2', pct:79, color:'linear-gradient(90deg,#1e6bff,#00c9ff)' },
    { label:'Form 3', pct:71, color:'linear-gradient(90deg,#ba7517,#f59e0b)' },
    { label:'Form 4', pct:55, color:'linear-gradient(90deg,#a32d2d,#e24b4a)' },
  ]

  const alerts = [
    { bg:'#fff0f0', border:'#ffd0d0', iconBg:'#ffd0d0', iconColor:'#a32d2d', icon:'ti-user-x',          title:'4 students at dropout risk',        titleColor:'#791f1f', desc:'AI flagged: attendance + grade drop pattern', action:'Review profiles →' },
    { bg:'#fffbf0', border:'#ffe4a0', iconBg:'#ffe4a0', iconColor:'#854f0b', icon:'ti-clock',            title:'Mr. Mutua absent — no sub assigned', titleColor:'#633806', desc:'Physics F3N uncovered. Period 2 in 18 min.', action:'Assign substitute →' },
    { bg:'#f0f6ff', border:'#b0ccff', iconBg:'#b0ccff', iconColor:'#185fa5', icon:'ti-file-certificate', title:'Mid-term reports ready to publish',   titleColor:'#0c447c', desc:'1,204 reports queued. All grades submitted.', action:'Review and publish →' },
    { bg:'#f0fff9', border:'#a0f0d8', iconBg:'#a0f0d8', iconColor:'#085041', icon:'ti-check',            title:'NEMIS sync completed',               titleColor:'#085041', desc:'1,196 records synced. 8 need manual review.', action:'View exceptions →' },
  ]

  const activity = [
    { color:'#e24b4a', text:<>AI flagged <strong>Brian Kamau</strong> as dropout risk — 3 absences + failing grades</>, time:'7:58 AM' },
    { color:'#1e6bff', text:'KSh 18,000 received from Jane Kamau via M-Pesa', time:'Yesterday' },
    { color:'#7c3aed', text:'Mrs. Njoroge submitted English grades — 38 records entered', time:'Yesterday' },
    { color:'#00c9a0', text:<>New student <strong>Aisha Mohamed</strong> enrolled into Form 1 South</>, time:'Mon' },
  ]

  const pillars = [
    { val:'91%', lbl:'Attendance',      pct:91  },
    { val:'74%', lbl:'Fee collection',  pct:74  },
    { val:'B+',  lbl:'Avg grade',       pct:78  },
    { val:'61%', lbl:'Parent engage',   pct:61  },
    { val:'96%', lbl:'Staff coverage',  pct:96  },
  ]

  return (
    <div>
      {/* Health score hero */}
      <div style={{ background:'#0a0f1e', borderRadius:'12px', padding:'16px 20px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'16px' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg,#1e6bff,#00c9ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'500', color:'white', flexShrink:0, boxShadow:'0 0 20px rgba(30,107,255,0.4)' }}>78</div>
        <div>
          <div style={{ fontSize:'14px', fontWeight:'500', color:'white' }}>School health score</div>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', marginTop:'2px' }}>Good · ▲ +4 pts from last term</div>
        </div>
        <div style={{ width:'1px', height:'44px', background:'rgba(255,255,255,0.1)', flexShrink:0 }} />
        <div style={{ display:'flex', gap:'20px', flex:1 }}>
          {pillars.map(p => (
            <div key={p.lbl}>
              <div style={{ fontSize:'15px', fontWeight:'500', color:'white' }}>{p.val}</div>
              <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)', marginTop:'1px' }}>{p.lbl}</div>
              <div style={{ height:'3px', borderRadius:'100px', marginTop:'4px', background:'rgba(255,255,255,0.12)', width:'60px', overflow:'hidden' }}>
                <div style={{ width:`${p.pct}%`, height:'100%', borderRadius:'100px', background:'linear-gradient(90deg,#1e6bff,#00c9ff)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={grid(5, '8px')}>
        {[
          { v: loading ? '...' : data?.total_students || 1204, l:'Total students',   sub:'▲ 38 new this term', sv:'stat-sub-w', variant:'blue'   },
          { v:'1,092',  l:'Present today',     sub:'112 absent',        sv:'stat-sub-w', variant:'cyan'   },
          { v:'KSh 3.2M',l:'Fees collected',   sub:'1.1M outstanding',  sv:'stat-sub-w', variant:'dark'   },
          { v:'48',      l:'Teaching staff',   sub:'3 on leave today',  sv:'stat-sub-w', variant:'ink'    },
          { v:'7',       l:'Open incidents',   sub:'2 flagged urgent',  sv:'stat-sub-w', variant:'accent' },
        ].map((s,i) => (
          <div key={i} style={stat(s.variant)}>
            <div style={{ fontSize:'22px', fontWeight:'500', lineHeight:1 }}>{s.v}</div>
            <div style={{ fontSize:'11px', opacity:0.75, marginTop:'4px' }}>{s.l}</div>
            <div style={{ fontSize:'11px', marginTop:'2px', color:'rgba(255,255,255,0.55)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={grid(2)}>
        {/* Alerts */}
        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-alert-triangle" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Live alerts</div><span style={cardLnk}>All →</span></div>
          {alerts.map((a,i) => (
            <div key={i} style={{ background:a.bg, border:`1px solid ${a.border}`, borderRadius:'10px', padding:'9px 10px', marginBottom:'6px', display:'flex', gap:'8px', alignItems:'flex-start' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:a.iconBg, color:a.iconColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>
                <i className={`ti ${a.icon}`} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize:'12px', fontWeight:'500', color:a.titleColor }}>{a.title}</div>
                <div style={{ fontSize:'11px', color:'#6b7280', marginTop:'1px', lineHeight:1.4 }}>{a.desc}</div>
                <div style={{ fontSize:'10px', fontWeight:'500', color:'#1e6bff', marginTop:'3px', cursor:'pointer', textDecoration:'underline' }}>{a.action}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          {/* Fee collection */}
          <div style={{ ...card, marginBottom:'10px' }}>
            <div style={cardHdr}><div style={cardTtl}><i className="ti ti-cash" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Fee collection by form</div><span style={cardLnk}>Details →</span></div>
            {fees.map(f => (
              <div key={f.label} style={barRow}>
                <span style={{ fontSize:'11px', color:'#7a8fb5', width:'52px', flexShrink:0 }}>{f.label}</span>
                <div style={barTrack}><div style={{ ...barFill(f.pct, f.color) }} /></div>
                <span style={{ fontSize:'11px', fontWeight:'500', width:'28px', textAlign:'right', flexShrink:0, color: f.pct >= 80 ? '#0f6e56' : f.pct >= 70 ? '#ba7517' : '#a32d2d' }}>{f.pct}%</span>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div style={card}>
            <div style={cardHdr}><div style={cardTtl}><i className="ti ti-activity" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Recent activity</div></div>
            {activity.map((a,i) => (
              <div key={i} style={{ display:'flex', gap:'8px', alignItems:'flex-start', padding:'7px 0', borderBottom: i < activity.length-1 ? '1px solid #f0f4ff' : 'none' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', marginTop:'4px', flexShrink:0, background:a.color }} />
                <div style={{ fontSize:'12px', color:'#1a2744', lineHeight:1.4, flex:1 }}>{a.text}</div>
                <div style={{ fontSize:'10px', color:'#7a8fb5', flexShrink:0 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
