'use client'

/*
  components/views/RecordOfWorkView.jsx
  — Connected to real API
*/

import { useState, useEffect } from 'react'

const CLASSES = [
  { id: 'form3north', label: 'Form 3 North' },
  { id: 'form2north', label: 'Form 2 North' },
  { id: 'form4south', label: 'Form 4 South' },
]

const entryColors = [
  { bg:'#e6faf7', border:'#0a7c6e', text:'#064e44' },
  { bg:'#f3f0ff', border:'#7c3aed', text:'#3b0764' },
  { bg:'#fffbeb', border:'#f59e0b', text:'#451a03' },
  { bg:'#eff6ff', border:'#1d4ed8', text:'#1e3a8a' },
  { bg:'#fef2f2', border:'#dc2626', text:'#7f1d1d' },
]

const emptyForm = { classId:'', date:'', time:'', topic:'', subTopic:'', notes:'', present:'', absent:'' }

export default function RecordOfWorkView() {
  const [entries, setEntries]     = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)
  const [deleteId, setDeleteId]   = useState(null)
  const [toast, setToast]         = useState(null)

  function getToken() { return localStorage.getItem('token') }
  function showToast(msg, type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }
  function handleChange(e) { setForm(prev => ({...prev, [e.target.name]: e.target.value})) }

  useEffect(() => { loadEntries() }, [])

  async function loadEntries() {
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teacher/record-of-work', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setEntries(Array.isArray(data) ? data : [])
    } catch { showToast('Could not load records', 'warning') }
    finally { setLoading(false) }
  }

  async function handleSave() {
    if (!form.classId || !form.topic) { showToast('⚠️ Please fill in class and topic', 'warning'); return }
    setSaving(true)
    const classLabel = CLASSES.find(c => c.id === form.classId)?.label || ''
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teacher/record-of-work', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_name: classLabel,
          date:       form.date || new Date().toISOString().split('T')[0],
          time:       form.time || null,
          topic:      form.topic,
          sub_topic:  form.subTopic || null,
          notes:      form.notes || null,
          present:    form.present ? parseInt(form.present) : null,
          absent:     form.absent  ? parseInt(form.absent)  : null,
        })
      })
      const created = await res.json()
      setEntries(prev => [created, ...prev])
      setShowModal(false)
      setForm(emptyForm)
      showToast('✅ Lesson logged successfully!')
    } catch { showToast('Failed to save', 'warning') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://127.0.0.1:8000/api/teacher/record-of-work/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      setEntries(prev => prev.filter(e => e.id !== id))
      setDeleteId(null)
      showToast('🗑 Entry deleted', 'warning')
    } catch { showToast('Failed to delete', 'warning') }
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return { day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }) }
  }

  return (
    <div className="animate-fade-up">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl"
          style={{ background: toast.type==='success' ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#d97706,#fbbf24)', color:'white' }}>
          {toast.msg}
        </div>
      )}

      {/* Log lesson modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}
          onClick={e => { if(e.target===e.currentTarget){ setShowModal(false); setForm(emptyForm) }}}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" style={{ boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="px-5 py-4 flex justify-between items-center" style={{ background:'linear-gradient(135deg,#064e44,#0a7c6e)' }}>
              <h2 className="text-white font-bold text-sm">📖 Log Lesson</h2>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }}
                className="text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold"
                style={{ background:'rgba(255,255,255,0.2)' }}>✕</button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div><label className="form-label">Class *</label>
                  <select name="classId" value={form.classId} onChange={handleChange} className="form-input">
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select></div>
                <div><label className="form-label">Date</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} className="form-input" /></div>
                <div><label className="form-label">Time</label>
                  <input name="time" type="time" value={form.time} onChange={handleChange} className="form-input" /></div>
              </div>
              <div><label className="form-label">Topic *</label>
                <input name="topic" value={form.topic} onChange={handleChange} placeholder="e.g. Quadratic equations" className="form-input" /></div>
              <div><label className="form-label">Sub topic</label>
                <input name="subTopic" value={form.subTopic} onChange={handleChange} placeholder="e.g. Word problems" className="form-input" /></div>
              <div><label className="form-label">Notes / observations</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="How did the lesson go?" rows={3} className="form-textarea" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">No. present</label>
                  <input name="present" type="number" value={form.present} onChange={handleChange} placeholder="e.g. 36" className="form-input" /></div>
                <div><label className="form-label">No. absent</label>
                  <input name="absent" type="number" value={form.absent} onChange={handleChange} placeholder="e.g. 2" className="form-input" /></div>
              </div>
            </div>
            <div className="px-5 py-3 flex justify-end gap-2" style={{ borderTop:'1px solid #f0faf8' }}>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : '💾 Log lesson'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center" style={{ boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="text-4xl mb-3">🗑</div>
            <h3 className="font-bold text-gray-800 mb-1">Delete this entry?</h3>
            <p className="text-sm text-gray-500 mb-4">This cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-primary"
                style={{ background:'linear-gradient(135deg,#dc2626,#f87171)' }}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📖 Record of Work — Mathematics</h3>
          <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-1.5 px-3">+ Log lesson</button>
        </div>

        {loading ? (
          <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400 text-sm">Loading...</p></div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12"><div className="text-5xl mb-3">📭</div><p className="text-gray-400 text-sm">No lessons logged yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-4 mx-auto">+ Log your first lesson</button></div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry, i) => {
              const c = entryColors[i % entryColors.length]
              const d = formatDate(entry.date)
              return (
                <div key={entry.id} className="flex gap-4 p-4 rounded-xl group hover-lift"
                  style={{ background:c.bg, borderLeft:`3px solid ${c.border}` }}>
                  <div className="w-14 flex-shrink-0 text-center rounded-xl py-2" style={{ background:c.border, color:'white' }}>
                    <p className="text-xl font-bold leading-none">{d.day || '—'}</p>
                    <p className="text-xs mt-0.5 opacity-80">{d.month || ''}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold mb-1" style={{ color:c.border }}>
                      {entry.class_name} · {entry.time || ''}
                      {entry.present ? ` · ${entry.present} present` : ''}
                      {entry.absent  ? ` · ${entry.absent} absent`  : ''}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{entry.topic}</p>
                    {entry.sub_topic && <p className="text-xs mt-0.5" style={{ color:c.border }}>{entry.sub_topic}</p>}
                    {entry.notes && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{entry.notes}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background:'white', color:c.border }}>✓ Done</span>
                    <button onClick={() => setDeleteId(entry.id)}
                      className="text-xs opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg"
                      style={{ color:'#dc2626', background:'#fef2f2' }}>🗑</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
