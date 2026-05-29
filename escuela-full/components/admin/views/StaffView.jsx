'use client'

import { useState, useEffect } from 'react'
import { card, cardHdr, cardTtl, stat, grid, pill, tHdr, API, authHeaders, actionBtn } from '../styles'

const AV_COLORS = [
  { bg:'#e0edff', text:'#1e6bff' }, { bg:'#e0fff5', text:'#0a7c6e' },
  { bg:'#fff3e0', text:'#ba7517' }, { bg:'#ffe0e0', text:'#a32d2d' },
  { bg:'#f0e0ff', text:'#7c3aed' }, { bg:'#e0f7ff', text:'#006b8a' },
]

const emptyForm = { name:'', email:'', password:'', tsc_number:'', subject:'', is_class_teacher:false, assigned_class:'' }

export default function StaffView() {
  const [staff, setStaff]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState(emptyForm)
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [rowData, setRowData]   = useState({})

  function showToast(msg, type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }
  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({...p, [e.target.name]: val}))
  }

  useEffect(() => { loadStaff() }, [])

  async function loadStaff() {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/admin/staff`, { headers: authHeaders() })
      const data = await res.json()
      setStaff(Array.isArray(data) ? data : [])
    } catch { showToast('Could not load staff', 'warning') }
    finally { setLoading(false) }
  }

  async function handleAdd() {
    if (!form.name || !form.email || !form.password) {
      showToast('⚠️ Name, email and password are required', 'warning'); return
    }
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/admin/staff`, {
        method:'POST', headers: authHeaders(), body: JSON.stringify(form)
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail) }
      await loadStaff()
      setShowModal(false); setForm(emptyForm)
      showToast('✅ Teacher added successfully!')
    } catch(e) { showToast(`❌ ${e.message}`, 'warning') }
    finally { setSaving(false) }
  }

  async function loadTeacherROW(id) {
    if (rowData[id]) return
    try {
      const res  = await fetch(`${API}/api/admin/staff/${id}/records-of-work`, { headers: authHeaders() })
      const data = await res.json()
      setRowData(p => ({...p, [id]: data}))
    } catch {}
  }

  async function handleRemove(id, name) {
    if (!confirm(`Remove ${name} from staff? This marks them as inactive.`)) return
    try {
      await fetch(`${API}/api/admin/staff/${id}`, { method:'DELETE', headers: authHeaders() })
      setStaff(p => p.filter(t => t.id !== id))
      showToast('Staff member removed')
    } catch { showToast('Failed to remove', 'warning') }
  }

  const inp = { width:'100%', padding:'7px 10px', borderRadius:'8px', border:'1px solid #e0e8ff', background:'#f8fbff', fontSize:'12px', color:'#0a0f1e', boxSizing:'border-box' }
  const lbl = { fontSize:'10px', fontWeight:'500', color:'#7a8fb5', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:'4px' }

  return (
    <div>
      {toast && (
        <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:50, padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:'500', color:'white', background: toast.type==='success' ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#d97706,#fbbf24)' }}>
          {toast.msg}
        </div>
      )}

      {/* Add teacher modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}
          onClick={e => { if(e.target===e.currentTarget){ setShowModal(false); setForm(emptyForm) }}}>
          <div style={{ background:'white', borderRadius:'16px', width:'100%', maxWidth:'480px', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding:'14px 18px', background:'#0a0f1e', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ color:'white', fontWeight:'500', fontSize:'13px' }}>Add new teacher</div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'6px', width:'26px', height:'26px', color:'white', cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><label style={lbl}>Full name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Mr. John Kamau" style={inp} /></div>
                <div><label style={lbl}>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@greenfield.ac.ke" style={inp} /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><label style={lbl}>Temp password *</label><input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Temporary password" style={inp} /></div>
                <div><label style={lbl}>TSC number</label><input name="tsc_number" value={form.tsc_number} onChange={handleChange} placeholder="TSC-XXXXXXX" style={inp} /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><label style={lbl}>Subject</label><input name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Mathematics" style={inp} /></div>
                <div><label style={lbl}>Assigned class</label>
                  <select name="assigned_class" value={form.assigned_class} onChange={handleChange} style={inp}>
                    <option value="">None</option>
                    {['Form 1 North','Form 1 South','Form 2 North','Form 2 South','Form 3 North','Form 3 South','Form 4 North','Form 4 South'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <input type="checkbox" name="is_class_teacher" checked={form.is_class_teacher} onChange={handleChange} id="is_ct" />
                <label htmlFor="is_ct" style={{ fontSize:'12px', color:'#1a2744', cursor:'pointer' }}>Class teacher</label>
              </div>
            </div>
            <div style={{ padding:'12px 18px', borderTop:'1px solid #f0f4ff', display:'flex', justifyContent:'flex-end', gap:'8px' }}>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} style={actionBtn()}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{ ...actionBtn(true), opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : '✅ Add teacher'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={grid(3, '8px')}>
        <div style={stat('dark')}><div style={{fontSize:'22px',fontWeight:'500'}}>{staff.length}</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Total teachers</div></div>
        <div style={stat('white')}><div style={{fontSize:'22px',fontWeight:'500',color:'#0a0f1e'}}>3</div><div style={{fontSize:'11px',color:'#7a8fb5',marginTop:'4px'}}>On leave today</div></div>
        <div style={stat('blue')}><div style={{fontSize:'22px',fontWeight:'500'}}>96%</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>Coverage rate</div></div>
      </div>

      <div style={card}>
        <div style={cardHdr}>
          <div style={cardTtl}><i className="ti ti-school" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Teaching staff</div>
          <button onClick={() => setShowModal(true)} style={{ background:'#0a0f1e', color:'white', border:'none', borderRadius:'8px', padding:'5px 12px', fontSize:'11px', cursor:'pointer' }}>+ Add teacher</button>
        </div>

        {loading ? (
          <div style={{ padding:'32px', textAlign:'center' }}>
            <div style={{ width:'28px', height:'28px', border:'2px solid #1e6bff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 8px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <div>
            {staff.map((t, i) => {
              const c = AV_COLORS[i % AV_COLORS.length]
              const initials = t.name.split(' ').filter(w=>w.length>1).map(w=>w[0]).join('').slice(0,2).toUpperCase()
              const isExpanded = expanded === t.id
              return (
                <div key={t.id} style={{ borderBottom:'1px solid #f0f4ff' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 0', cursor:'pointer' }} onClick={() => { setExpanded(isExpanded ? null : t.id); loadTeacherROW(t.id) }}>
                    <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:c.bg, color:c.text, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'500', flexShrink:0 }}>{initials}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'12px', fontWeight:'500', color:'#0a0f1e' }}>{t.name}</div>
                      <div style={{ fontSize:'11px', color:'#7a8fb5' }}>{t.subject} · {t.tsc_number || 'No TSC'}</div>
                    </div>
                    <div style={{ fontSize:'11px', color:'#7a8fb5' }}>{t.assigned_class || '—'}</div>
                    <span style={pill(t.is_active ? 'g' : 'r')}>{t.is_active ? 'Active' : 'Inactive'}</span>
                    <span style={{ fontSize:'12px', color:'#7a8fb5' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  {isExpanded && (
                    <div style={{ paddingBottom:'12px', paddingLeft:'40px' }}>
                      <div style={{ fontSize:'12px', fontWeight:'500', color:'#1a2744', marginBottom:'6px' }}>Records of Work this term</div>
                      {(rowData[t.id] || []).length === 0 ? (
                        <p style={{ fontSize:'11px', color:'#7a8fb5' }}>No records logged yet.</p>
                      ) : (
                        (rowData[t.id] || []).slice(0,3).map(r => (
                          <div key={r.id} style={{ fontSize:'11px', color:'#1a2744', padding:'4px 0', borderBottom:'1px solid #f0f4ff' }}>
                            <strong>{r.topic}</strong> — {r.class_name} · {r.date}
                          </div>
                        ))
                      )}
                      <div style={{ display:'flex', gap:'6px', marginTop:'8px' }}>
                        <button onClick={e => { e.stopPropagation(); handleRemove(t.id, t.name) }} style={{ fontSize:'10px', padding:'3px 8px', borderRadius:'6px', border:'1px solid #fca5a5', background:'#fef2f2', color:'#dc2626', cursor:'pointer' }}>Remove</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
