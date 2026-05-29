'use client'

import { useState, useEffect } from 'react'
import { card, cardHdr, cardTtl, cardLnk, stat, grid, pill, barRow, barTrack, barFill, API, authHeaders } from '../styles'

export default function FeesView() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/admin/fees/summary`, { headers: authHeaders() })
      .then(r => r.json()).then(setSummary).catch(console.error)
  }, [])

  const fees = [
    { label:'Form 1', pct:88, color:'linear-gradient(90deg,#1e6bff,#00c9ff)' },
    { label:'Form 2', pct:79, color:'linear-gradient(90deg,#1e6bff,#00c9ff)' },
    { label:'Form 3', pct:71, color:'linear-gradient(90deg,#ba7517,#f59e0b)' },
    { label:'Form 4', pct:55, color:'linear-gradient(90deg,#a32d2d,#e24b4a)' },
  ]

  const defaulters = [
    { name:'Dennis Kiptoo',  class:'Form 4S', days:'90+', amount:'KSh 42,000', risk:'r', action:'Escalate' },
    { name:'Mercy Achieng',  class:'Form 3S', days:'61–90', amount:'KSh 28,500', risk:'a', action:'Remind' },
    { name:'Collins Mwenda', class:'Form 4N', days:'61–90', amount:'KSh 21,000', risk:'a', action:'Remind' },
  ]

  return (
    <div>
      <div style={grid(4,'8px')}>
        <div style={stat('blue')}><div style={{fontSize:'22px',fontWeight:'500'}}>KSh 3.2M</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Collected</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>74% of target</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>KSh 1.1M</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>Outstanding</div><div style={{fontSize:'11px',color:'#a32d2d',marginTop:'2px'}}>187 students</div></div>
        <div style={stat('dark')}><div style={{fontSize:'22px',fontWeight:'500'}}>KSh 4.3M</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Term target</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>Due 30 Jun</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>12</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>90+ days overdue</div><div style={{fontSize:'11px',color:'#a32d2d',marginTop:'2px'}}>KSh 312K total</div></div>
      </div>

      <div style={grid(2)}>
        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-chart-bar" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Collection by form</div><span style={cardLnk}>Full report →</span></div>
          {fees.map(f => (
            <div key={f.label} style={barRow}>
              <span style={{ fontSize:'11px', color:'#7a8fb5', width:'52px', flexShrink:0 }}>{f.label}</span>
              <div style={barTrack}><div style={{ ...barFill(f.pct, f.color) }} /></div>
              <span style={{ fontSize:'11px', fontWeight:'500', width:'32px', textAlign:'right', flexShrink:0, color: f.pct>=80?'#0f6e56':f.pct>=70?'#ba7517':'#a32d2d' }}>{f.pct}%</span>
            </div>
          ))}
          <div style={{ display:'flex', gap:0, marginTop:'12px', border:'1px solid #e0e8ff', borderRadius:'10px', overflow:'hidden' }}>
            <div style={{ flex:1, padding:'10px', textAlign:'center', borderRight:'1px solid #e0e8ff' }}><div style={{fontSize:'13px',fontWeight:'500',color:'#1e6bff'}}>KSh 3.2M</div><div style={{fontSize:'10px',color:'#7a8fb5',marginTop:'2px'}}>Collected</div></div>
            <div style={{ flex:1, padding:'10px', textAlign:'center', borderRight:'1px solid #e0e8ff' }}><div style={{fontSize:'13px',fontWeight:'500',color:'#a32d2d'}}>KSh 1.1M</div><div style={{fontSize:'10px',color:'#7a8fb5',marginTop:'2px'}}>Outstanding</div></div>
            <div style={{ flex:1, padding:'10px', textAlign:'center' }}><div style={{fontSize:'13px',fontWeight:'500',color:'#0a0f1e'}}>74%</div><div style={{fontSize:'10px',color:'#7a8fb5',marginTop:'2px'}}>Rate</div></div>
          </div>
        </div>

        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-alert-circle" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Top defaulters</div><span style={cardLnk}>Send reminders →</span></div>
          {defaulters.map((d,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 0', borderBottom: i < defaulters.length-1 ? '1px solid #f0f4ff' : 'none' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'12px', fontWeight:'500', color:'#0a0f1e' }}>{d.name} · {d.class}</div>
                <div style={{ fontSize:'11px', color:'#7a8fb5', marginTop:'1px' }}>{d.days} days overdue</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'12px', fontWeight:'500', color:'#a32d2d' }}>{d.amount}</div>
                <span style={pill(d.risk)}>{d.action}</span>
              </div>
            </div>
          ))}
          <button style={{ width:'100%', marginTop:'12px', padding:'8px', background:'#0a0f1e', color:'white', border:'none', borderRadius:'8px', fontSize:'12px', cursor:'pointer', fontWeight:'500' }}>
            Send fee reminder to all defaulters
          </button>
        </div>
      </div>
    </div>
  )
}
