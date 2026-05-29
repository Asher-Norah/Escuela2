'use client'

import { useState, useEffect } from 'react'
import { card, cardHdr, cardTtl, cardLnk, stat, grid, pill, barRow, barTrack, barFill, API, authHeaders } from '../styles'

export default function AttendanceReportView() {
  const [summary, setSummary]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${API}/api/admin/academic/attendance/summary`, { headers: authHeaders() })
      .then(r => r.json()).then(data => setSummary(Array.isArray(data) ? data : []))
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  const absentees = [
    { name:'Kevin Ochieng',  class:'Form 3 North', absences:5, risk:'r', label:'High risk' },
    { name:'Brian Kamau',    class:'Form 3 North', absences:3, risk:'a', label:'Watch'     },
    { name:'Grace Wambui',   class:'Form 3 North', absences:0, risk:'a', label:'Chronic late' },
  ]

  const mockSummary = [
    { class_name:'Form 1 North', rate:94 }, { class_name:'Form 1 South', rate:91 },
    { class_name:'Form 2 North', rate:89 }, { class_name:'Form 3 North', rate:88 },
    { class_name:'Form 3 South', rate:85 }, { class_name:'Form 4 South', rate:78 },
  ]

  const displaySummary = summary.length > 0 ? summary : mockSummary

  const getColor = (rate) => rate >= 90 ? 'linear-gradient(90deg,#1e6bff,#00c9ff)'
    : rate >= 85 ? 'linear-gradient(90deg,#ba7517,#f59e0b)'
    : 'linear-gradient(90deg,#a32d2d,#e24b4a)'

  const getTextColor = (rate) => rate >= 90 ? '#0f6e56' : rate >= 85 ? '#ba7517' : '#a32d2d'

  return (
    <div>
      <div style={grid(4,'8px')}>
        <div style={stat('blue')}><div style={{fontSize:'22px',fontWeight:'500'}}>1,092</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Present today</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>91% rate</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>112</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>Absent today</div><div style={{fontSize:'11px',color:'#a32d2d',marginTop:'2px'}}>9.3%</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>28</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>Late arrivals</div><div style={{fontSize:'11px',color:'#ba7517',marginTop:'2px'}}>2.3%</div></div>
        <div style={stat('dark')}><div style={{fontSize:'22px',fontWeight:'500'}}>4</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Chronic absentees</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>AI flagged</div></div>
      </div>

      <div style={grid(2)}>
        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-calendar-check" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Attendance rate by class</div><span style={cardLnk}>Full report →</span></div>
          {loading ? <p style={{ fontSize:'12px', color:'#7a8fb5' }}>Loading...</p> : displaySummary.map((c,i) => (
            <div key={i} style={barRow}>
              <span style={{ fontSize:'11px', color:'#7a8fb5', width:'72px', flexShrink:0 }}>{c.class_name}</span>
              <div style={barTrack}><div style={{ ...barFill(c.rate, getColor(c.rate)) }} /></div>
              <span style={{ fontSize:'11px', fontWeight:'500', width:'32px', textAlign:'right', flexShrink:0, color:getTextColor(c.rate) }}>{c.rate}%</span>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-user-x" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Chronic absentees</div><span style={cardLnk}>Notify parents →</span></div>
          {absentees.map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 0', borderBottom: i < absentees.length-1 ? '1px solid #f0f4ff' : 'none' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'12px', fontWeight:'500', color:'#0a0f1e' }}>{a.name}</div>
                <div style={{ fontSize:'11px', color:'#7a8fb5', marginTop:'1px' }}>{a.class} · {a.absences > 0 ? `${a.absences} absences` : 'Late 7x this term'}</div>
              </div>
              <span style={pill(a.risk)}>{a.label}</span>
              <button style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'6px', border:'1px solid #b0ccff', background:'#e6f1fb', color:'#185fa5', cursor:'pointer' }}>
                Contact
              </button>
            </div>
          ))}
          <div style={{ marginTop:'12px', paddingTop:'12px', borderTop:'1px solid #f0f4ff' }}>
            <button style={{ width:'100%', padding:'8px', background:'#0a0f1e', color:'white', border:'none', borderRadius:'8px', fontSize:'12px', cursor:'pointer', fontWeight:'500' }}>
              Send SMS to all parents of absentees
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
