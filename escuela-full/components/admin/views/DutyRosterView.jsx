'use client'

import { useState } from 'react'
import { card, cardHdr, cardTtl, pill, actionBtn } from '../styles'

const initialDuties = [
  { id:1, date:'Mon 26 May', duty:'Library supervision',   time:'1:00–2:00 PM',   teacher:'Mrs. Njoroge', mine:false, status:'published' },
  { id:2, date:'Tue 27 May', duty:'Dining hall supervision',time:'12:30–1:30 PM', teacher:'Mr. Mwangi',   mine:false, status:'published' },
  { id:3, date:'Thu 29 May', duty:'Gate duty (morning)',   time:'6:45–7:30 AM',   teacher:'Mr. Otieno',  mine:true,  status:'draft'     },
  { id:4, date:'Fri 30 May', duty:'Exam invigilation Hall B',time:'8:00–10:00 AM',teacher:'Mr. Otieno',  mine:true,  status:'draft'     },
]

const emptyForm = { date:'', duty:'', time:'', teacher:'' }

export default function DutyRosterView() {
  const [duties, setDuties]       = useState(initialDuties)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [toast, setToast]         = useState(null)

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(null),3000) }
  function handleChange(e) { setForm(p => ({...p, [e.target.name]: e.target.value})) }

  function handleAdd() {
    if (!form.duty || !form.teacher) { showToast('Fill in duty and teacher'); return }
    const newDuty = { id: Date.now(), ...form, mine:false, status:'draft' }
    setDuties(p => [...p, newDuty])
    setShowModal(false); setForm(emptyForm)
    showToast('✅ Duty added to roster!')
  }

  function handlePublish(id) {
    setDuties(p => p.map(d => d.id === id ? {...d, status:'published'} : d))
    showToast('✅ Duty published — teachers notified')
  }

  function handleDelete(id) {
    setDuties(p => p.filter(d => d.id !== id))
    showToast('Duty removed')
  }

  const inp = { width:'100%', padding:'7px 10px', borderRadius:'8px', border:'1px solid #e0e8ff', background:'#f8fbff', fontSize:'12px', color:'#0a0f1e', boxSizing:'border-box' }
  const lbl = { fontSize:'10px', fontWeight:'500', color:'#7a8fb5', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'4px' }

  return (
    <div>
      {toast && (
        <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:50, padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:'500', color:'white', background:'linear-gradient(135deg,#059669,#34d399)' }}>
          {toast}
        </div>
      )}

      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}
          onClick={e => { if(e.target===e.currentTarget){ setShowModal(false); setForm(emptyForm) }}}>
          <div style={{ background:'white', borderRadius:'16px', width:'100%', maxWidth:'420px', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding:'14px 18px', background:'#0a0f1e', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ color:'white', fontWeight:'500', fontSize:'13px' }}>Add duty to roster</div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'6px', width:'26px', height:'26px', color:'white', cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><label style={lbl}>Date</label><input name="date" value={form.date} onChange={handleChange} placeholder="e.g. Mon 2 Jun" style={inp} /></div>
                <div><label style={lbl}>Time</label><input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 7:00–8:00 AM" style={inp} /></div>
              </div>
              <div><label style={lbl}>Duty description *</label><input name="duty" value={form.duty} onChange={handleChange} placeholder="e.g. Morning gate duty" style={inp} /></div>
              <div><label style={lbl}>Assigned teacher *</label><input name="teacher" value={form.teacher} onChange={handleChange} placeholder="e.g. Mr. Kamau" style={inp} /></div>
            </div>
            <div style={{ padding:'12px 18px', borderTop:'1px solid #f0f4ff', display:'flex', justifyContent:'flex-end', gap:'8px' }}>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} style={actionBtn()}>Cancel</button>
              <button onClick={handleAdd} style={actionBtn(true)}>✅ Add duty</button>
            </div>
          </div>
        </div>
      )}

      <div style={card}>
        <div style={cardHdr}>
          <div style={cardTtl}><i className="ti ti-clipboard-list" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Duty Roster — Week 18</div>
          <div style={{ display:'flex', gap:'6px' }}>
            <button style={actionBtn()}>⬇ Export PDF</button>
            <button onClick={() => setShowModal(true)} style={{ background:'#0a0f1e', color:'white', border:'none', borderRadius:'8px', padding:'5px 12px', fontSize:'11px', cursor:'pointer' }}>+ Add duty</button>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
          {duties.map(d => (
            <div key={d.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'8px', background: d.status==='published' ? 'white' : '#f0f4ff', border: d.mine ? '1px solid #b0ccff' : '1px solid #f0f4ff', borderLeft: d.mine ? '3px solid #1e6bff' : '1px solid #f0f4ff' }}>
              <div style={{ width:'72px', flexShrink:0, fontSize:'11px', color:'#7a8fb5' }}>{d.date}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'12px', fontWeight: d.mine ? '500' : '400', color: d.mine ? '#1e6bff' : '#0a0f1e' }}>{d.duty}</div>
                <div style={{ fontSize:'11px', color:'#7a8fb5', marginTop:'1px' }}>{d.time}</div>
              </div>
              <div style={{ fontSize:'12px', fontWeight: d.mine ? '500' : '400', color: d.mine ? '#1e6bff' : '#7a8fb5', width:'90px', flexShrink:0 }}>{d.teacher}</div>
              <span style={pill(d.status === 'published' ? 'g' : 'b')}>{d.status === 'published' ? 'Published' : 'Draft'}</span>
              {d.status === 'draft' && (
                <button onClick={() => handlePublish(d.id)} style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'6px', border:'1px solid #b0ccff', background:'#e6f1fb', color:'#185fa5', cursor:'pointer' }}>Publish</button>
              )}
              <button onClick={() => handleDelete(d.id)} style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'6px', border:'1px solid #fca5a5', background:'#fef2f2', color:'#dc2626', cursor:'pointer' }}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ marginTop:'12px', paddingTop:'12px', borderTop:'1px solid #f0f4ff', display:'flex', justifyContent:'flex-end' }}>
          <button onClick={() => { setDuties(p => p.map(d => ({...d, status:'published'}))); showToast('✅ All duties published!') }}
            style={{ background:'#0a0f1e', color:'white', border:'none', borderRadius:'8px', padding:'8px 16px', fontSize:'12px', cursor:'pointer', fontWeight:'500' }}>
            Publish all & notify teachers
          </button>
        </div>
      </div>
    </div>
  )
}
