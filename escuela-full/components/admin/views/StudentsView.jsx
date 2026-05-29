'use client'

import { useState, useEffect } from 'react'
import { card, cardHdr, cardTtl, stat, grid, pill, tHdr, API, authHeaders, actionBtn } from '../styles'

const AV_COLORS = [
  { bg:'#e0edff', text:'#1e6bff' }, { bg:'#e0fff5', text:'#0a7c6e' },
  { bg:'#fff3e0', text:'#ba7517' }, { bg:'#ffe0e0', text:'#a32d2d' },
  { bg:'#f0e0ff', text:'#7c3aed' }, { bg:'#e0f7ff', text:'#006b8a' },
]

const emptyForm = { name:'', admission_no:'', class_name:'', stream:'', gender:'', parent_phone:'', parent_email:'', date_of_birth:'' }

export default function StudentsView() {
  const [students, setStudents]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [filterClass, setFilterClass] = useState('')
  const [filterStream, setFilterStream] = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [saving, setSaving]         = useState(false)
  const [toast, setToast]           = useState(null)

  function showToast(msg, type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }
  function handleChange(e) { setForm(p => ({...p, [e.target.name]: e.target.value})) }

  useEffect(() => { loadStudents() }, [filterClass, filterStream])

  async function loadStudents() {
    setLoading(true)
    let url = `${API}/api/admin/students?is_active=true`
    if (filterClass)  url += `&class_name=${encodeURIComponent(filterClass)}`
    if (filterStream) url += `&stream=${encodeURIComponent(filterStream)}`
    try {
      const res  = await fetch(url, { headers: authHeaders() })
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch { showToast('Could not load students', 'warning') }
    finally { setLoading(false) }
  }

  async function handleEnrol() {
    if (!form.name || !form.admission_no || !form.class_name) {
      showToast('⚠️ Name, admission no. and class are required', 'warning'); return
    }
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/admin/students`, {
        method:'POST', headers: authHeaders(),
        body: JSON.stringify(form)
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail) }
      await loadStudents()
      setShowModal(false); setForm(emptyForm)
      showToast('✅ Student enrolled successfully!')
    } catch(e) { showToast(`❌ ${e.message}`, 'warning') }
    finally { setSaving(false) }
  }

  async function handleWithdraw(id, name) {
    if (!confirm(`Withdraw ${name}? This marks them as inactive.`)) return
    try {
      await fetch(`${API}/api/admin/students/${id}`, { method:'DELETE', headers: authHeaders() })
      setStudents(p => p.filter(s => s.id !== id))
      showToast('Student withdrawn')
    } catch { showToast('Failed to withdraw', 'warning') }
  }

  const inp = { width:'100%', padding:'7px 10px', borderRadius:'8px', border:'1px solid #e0e8ff', background:'#f8fbff', fontSize:'12px', color:'#0a0f1e', boxSizing:'border-box' }
  const lbl = { fontSize:'10px', fontWeight:'500', color:'#7a8fb5', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'4px' }

  return (
    <div>
      {toast && (
        <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:50, padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:'500', color:'white', background: toast.type==='success' ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#d97706,#fbbf24)', boxShadow:'0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </div>
      )}

      {/* Enrol modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}
          onClick={e => { if(e.target===e.currentTarget){ setShowModal(false); setForm(emptyForm) }}}>
          <div style={{ background:'white', borderRadius:'16px', width:'100%', maxWidth:'500px', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding:'14px 18px', background:'#0a0f1e', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ color:'white', fontWeight:'500', fontSize:'13px' }}>Enrol new student</div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'6px', width:'26px', height:'26px', color:'white', cursor:'pointer', fontSize:'14px' }}>✕</button>
            </div>
            <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><label style={lbl}>Full name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Aisha Mohamed" style={inp} /></div>
                <div><label style={lbl}>Admission No. *</label><input name="admission_no" value={form.admission_no} onChange={handleChange} placeholder="e.g. GFA/0120" style={inp} /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><label style={lbl}>Class *</label>
                  <select name="class_name" value={form.class_name} onChange={handleChange} style={inp}>
                    <option value="">Select class</option>
                    {['Form 1 North','Form 1 South','Form 2 North','Form 2 South','Form 3 North','Form 3 South','Form 4 North','Form 4 South'].map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label style={lbl}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} style={inp}>
                    <option value="">Select</option><option>Male</option><option>Female</option>
                  </select></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><label style={lbl}>Parent phone</label><input name="parent_phone" value={form.parent_phone} onChange={handleChange} placeholder="+254 7xx xxx xxx" style={inp} /></div>
                <div><label style={lbl}>Parent email</label><input name="parent_email" value={form.parent_email} onChange={handleChange} placeholder="parent@email.com" style={inp} /></div>
              </div>
              <div><label style={lbl}>Date of birth</label><input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} style={inp} /></div>
            </div>
            <div style={{ padding:'12px 18px', borderTop:'1px solid #f0f4ff', display:'flex', justifyContent:'flex-end', gap:'8px' }}>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} style={actionBtn()}>Cancel</button>
              <button onClick={handleEnrol} disabled={saving} style={{ ...actionBtn(true), opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : '✅ Enrol student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={grid(4, '8px')}>
        <div style={stat('blue')}><div style={{fontSize:'22px',fontWeight:'500'}}>{students.length || 1204}</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Total enrolled</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>▲ 38 new this term</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>312</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>Form 1</div><div style={{fontSize:'11px',color:'#185fa5',marginTop:'2px'}}>158 boys · 154 girls</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>298</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>Form 2</div><div style={{fontSize:'11px',color:'#185fa5',marginTop:'2px'}}>145 boys · 153 girls</div></div>
        <div style={stat('dark')}><div style={{fontSize:'22px',fontWeight:'500'}}>594</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Form 3 + 4</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.55)',marginTop:'2px'}}>Combined</div></div>
      </div>

      <div style={card}>
        <div style={cardHdr}>
          <div style={cardTtl}><i className="ti ti-users" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Student registry</div>
          <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
            <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} style={{ fontSize:'11px', padding:'5px 8px', border:'1px solid #e0e8ff', borderRadius:'8px', background:'#f5f8ff', color:'#1a2744' }}>
              <option value="">All forms</option>
              {['Form 1 North','Form 1 South','Form 2 North','Form 2 South','Form 3 North','Form 3 South','Form 4 North','Form 4 South'].map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={filterStream} onChange={e=>setFilterStream(e.target.value)} style={{ fontSize:'11px', padding:'5px 8px', border:'1px solid #e0e8ff', borderRadius:'8px', background:'#f5f8ff', color:'#1a2744' }}>
              <option value="">All streams</option><option>North</option><option>South</option>
            </select>
            <button onClick={() => setShowModal(true)} style={{ background:'#0a0f1e', color:'white', border:'none', borderRadius:'8px', padding:'5px 12px', fontSize:'11px', cursor:'pointer' }}>+ Enrol student</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding:'32px', textAlign:'center' }}>
            <div style={{ width:'28px', height:'28px', border:'2px solid #1e6bff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 8px' }} />
            <p style={{ color:'#7a8fb5', fontSize:'12px' }}>Loading students...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr><th style={tHdr}>Student</th><th style={tHdr}>Adm No.</th><th style={tHdr}>Class</th><th style={tHdr}>Gender</th><th style={tHdr}>Parent phone</th><th style={tHdr}>Status</th><th style={tHdr}>Actions</th></tr>
              </thead>
              <tbody>
                {students.slice(0,20).map((s,i) => {
                  const c = AV_COLORS[i % AV_COLORS.length]
                  const initials = s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
                  return (
                    <tr key={s.id} style={{ borderBottom:'1px solid #f0f4ff' }}>
                      <td style={{ padding:'8px 0', fontSize:'12px', color:'#0a0f1e' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                          <div style={{ width:'26px', height:'26px', borderRadius:'7px', background:c.bg, color:c.text, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'500', flexShrink:0 }}>{initials}</div>
                          {s.name}
                        </div>
                      </td>
                      <td style={{ padding:'8px 0', fontSize:'11px', color:'#7a8fb5' }}>{s.admission_no}</td>
                      <td style={{ padding:'8px 0', fontSize:'11px', color:'#7a8fb5' }}>{s.class_name}</td>
                      <td style={{ padding:'8px 0', fontSize:'11px', color:'#7a8fb5' }}>{s.gender || '—'}</td>
                      <td style={{ padding:'8px 0', fontSize:'11px', color:'#7a8fb5' }}>{s.parent_phone || '—'}</td>
                      <td style={{ padding:'8px 0' }}><span style={pill('g')}>Active</span></td>
                      <td style={{ padding:'8px 0' }}>
                        <button onClick={() => handleWithdraw(s.id, s.name)} style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'6px', border:'1px solid #fca5a5', background:'#fef2f2', color:'#dc2626', cursor:'pointer' }}>Withdraw</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div style={{ fontSize:'11px', color:'#7a8fb5', marginTop:'10px', paddingTop:'10px', borderTop:'1px solid #f0f4ff' }}>
              Showing {Math.min(20, students.length)} of {students.length} students
            </div>
          </>
        )}
      </div>
    </div>
  )
}
