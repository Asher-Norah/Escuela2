'use client'

import { card, cardHdr, cardTtl, cardLnk, stat, grid, pill, barRow, barTrack, barFill } from '../styles'

export default function PerformanceView() {
  const subjects = [
    { name:'Mathematics', pct:78 }, { name:'English',     pct:74 },
    { name:'Chemistry',   pct:71 }, { name:'Physics',     pct:68 },
    { name:'History',     pct:58 }, { name:'Kiswahili',   pct:44 },
  ]
  const getColor = p => p>=70 ? 'linear-gradient(90deg,#1e6bff,#00c9ff)' : p>=60 ? 'linear-gradient(90deg,#ba7517,#f59e0b)' : 'linear-gradient(90deg,#a32d2d,#e24b4a)'
  const getTextColor = p => p>=70 ? '#0f6e56' : p>=60 ? '#ba7517' : '#a32d2d'

  const topStudents = [
    { name:'Aisha Mohamed',   class:'Form 3 North', grade:'A', pct:94, av:{bg:'#e0edff',text:'#1e6bff'} },
    { name:'Ronald Kimani',   class:'Form 4 South', grade:'A', pct:93, av:{bg:'#e0fff5',text:'#0a7c6e'} },
    { name:'Vivian Cherotich',class:'Form 4 South', grade:'A', pct:91, av:{bg:'#f0e0ff',text:'#7c3aed'} },
    { name:'Esther Muthoni',  class:'Form 3 North', grade:'A', pct:90, av:{bg:'#ffe0e0',text:'#a32d2d'} },
  ]

  return (
    <div>
      <div style={grid(3,'8px')}>
        <div style={stat('dark')}><div style={{fontSize:'22px',fontWeight:'500'}}>B+</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>School average</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>▲ Up from B last term</div></div>
        <div style={stat('blue')}><div style={{fontSize:'22px',fontWeight:'500'}}>7th</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>County ranking</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>▲ Up 2 positions</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>94%</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>Grades submitted</div><div style={{fontSize:'11px',color:'#ba7517',marginTop:'2px'}}>3 teachers pending</div></div>
      </div>
      <div style={grid(2)}>
        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-chart-bar" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Performance by subject</div></div>
          {subjects.map((s,i) => (
            <div key={i} style={barRow}>
              <span style={{ fontSize:'11px', color:'#7a8fb5', width:'76px', flexShrink:0 }}>{s.name}</span>
              <div style={barTrack}><div style={{ ...barFill(s.pct, getColor(s.pct)) }} /></div>
              <span style={{ fontSize:'11px', fontWeight:'500', width:'32px', textAlign:'right', flexShrink:0, color:getTextColor(s.pct) }}>{s.pct}%</span>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-trending-up" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Top performers</div></div>
          {topStudents.map((s,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 0', borderBottom: i < topStudents.length-1 ? '1px solid #f0f4ff' : 'none' }}>
              <div style={{ width:'26px', height:'26px', borderRadius:'7px', background:s.av.bg, color:s.av.text, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'500', flexShrink:0 }}>
                {s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'12px', fontWeight:'500', color:'#0a0f1e' }}>{s.name}</div>
                <div style={{ fontSize:'11px', color:'#7a8fb5' }}>{s.class}</div>
              </div>
              <span style={pill('g')}>{s.grade} · {s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
