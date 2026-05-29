'use client'

/*
  components/views/AssignmentsView.jsx
  — Connected to real API
*/

import { useState, useEffect } from 'react'

const CLASSES = [
  { id: 'form3north', label: 'Form 3 North', count: 15 },
  { id: 'form2north', label: 'Form 2 North', count: 15 },
  { id: 'form4south', label: 'Form 4 South', count: 15 },
]

const statusConfig = {
  open:    { label: 'Open',    bg: '#eff6ff', text: '#1d4ed8', icon: '📬', next: 'grading', nextLabel: 'Start grading' },
  grading: { label: 'Grading', bg: '#fffbeb', text: '#d97706', icon: '✏️',  next: 'graded',  nextLabel: 'Mark as graded' },
  graded:  { label: 'Graded',  bg: '#f0fdf4', text: '#059669', icon: '✅', next: null,       nextLabel: null },
}

const emptyForm = { title: '', classId: '', dueDate: '', description: '', totalMarks: '' }

export default function AssignmentsView() {
  const [assignments, setAssignments] = useState([])
  const [showModal, setShowModal]     = useState(false)
  const [form, setForm]               = useState(emptyForm)
  const [saving, setSaving]           = useState(false)
  const [loading, setLoading]         = useState(true)
  const [expanded, setExpanded]       = useState(null)
  const [deleteId, setDeleteId]       = useState(null)
  const [toast, setToast]             = useState(null)

  function getToken() { return localStorage.getItem('token') }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── LOAD assignments from API ──
  useEffect(() => { loadAssignments() }, [])

  async function loadAssignments() {
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teacher/assignments', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setAssignments(Array.isArray(data) ? data : [])
    } catch { showToast('Could not load assignments', 'warning') }
    finally { setLoading(false) }
  }

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  // ── CREATE assignment ──
  async function handleSave() {
    if (!form.title || !form.classId || !form.dueDate) {
      showToast('⚠️ Please fill in title, class and due date', 'warning')
      return
    }
    setSaving(true)
    const classLabel = CLASSES.find(c => c.id === form.classId)?.label || ''
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teacher/assignments', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:       form.title,
          class_name:  classLabel,
          due_date:    form.dueDate,
          description: form.description,
          total_marks: form.totalMarks ? parseInt(form.totalMarks) : null,
        })
      })
      const created = await res.json()
      setAssignments(prev => [created, ...prev])
      setShowModal(false)
      setForm(emptyForm)
      showToast('✅ Assignment created!')
    } catch { showToast('Failed to create assignment', 'warning') }
    finally { setSaving(false) }
  }

  // ── UPDATE status ──
  async function advanceStatus(id, currentStatus) {
    const next = statusConfig[currentStatus]?.next
    if (!next) return
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/teacher/assignments/${id}`, {
        method:  'PATCH',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      })
      const updated = await res.json()
      setAssignments(prev => prev.map(a => a.id === id ? updated : a))
      showToast('✅ Status updated!')
    } catch { showToast('Failed to update status', 'warning') }
  }

  // ── DELETE assignment ──
  async function handleDelete(id) {
    try {
      await fetch(`http://127.0.0.1:8000/api/teacher/assignments/${id}`, {
        method:  'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      setAssignments(prev => prev.filter(a => a.id !== id))
      setDeleteId(null)
      setExpanded(null)
      showToast('🗑 Assignment deleted', 'warning')
    } catch { showToast('Failed to delete', 'warning') }
  }

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' })
  }

  function dueStatus(d) {
    if (!d) return null
    const today = new Date(); today.setHours(0,0,0,0)
    const due   = new Date(d); due.setHours(0,0,0,0)
    if (due < today) return 'overdue'
    if (due.getTime() === today.getTime()) return 'today'
    return 'upcoming'
  }

  return (
    <div className="animate-fade-up">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl"
          style={{ background: toast.type==='success' ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#d97706,#fbbf24)', color:'white' }}>
          {toast.msg}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}
          onClick={e => { if(e.target===e.currentTarget){ setShowModal(false); setForm(emptyForm) }}}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" style={{ boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="px-5 py-4 flex justify-between items-center" style={{ background:'linear-gradient(135deg,#064e44,#0a7c6e)' }}>
              <div><h2 className="text-white font-bold text-sm">📋 Create Assignment</h2></div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }}
                className="text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold"
                style={{ background:'rgba(255,255,255,0.2)' }}>✕</button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div><label className="form-label">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Algebra worksheet 5" className="form-input" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">Class *</label>
                  <select name="classId" value={form.classId} onChange={handleChange} className="form-input">
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select></div>
                <div><label className="form-label">Due date *</label>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="form-input" /></div>
              </div>
              <div><label className="form-label">Total marks</label>
                <input name="totalMarks" type="number" value={form.totalMarks} onChange={handleChange} placeholder="e.g. 30" className="form-input" /></div>
              <div><label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Instructions for students..." rows={3} className="form-textarea" /></div>
            </div>
            <div className="px-5 py-3 flex justify-end gap-2" style={{ borderTop:'1px solid #f0faf8' }}>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : '✅ Create assignment'}
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
            <h3 className="font-bold text-gray-800 mb-1">Delete this assignment?</h3>
            <p className="text-sm text-gray-500 mb-4">This cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-primary"
                style={{ background:'linear-gradient(135deg,#dc2626,#f87171)' }}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3 stagger">
        <div className="stat-card stat-blue"><div className="relative"><p className="text-3xl font-bold">{assignments.filter(a=>a.status==='open').length}</p><p className="text-xs font-semibold opacity-75 mt-0.5">📬 Open</p></div></div>
        <div className="stat-card stat-yellow"><div className="relative"><p className="text-3xl font-bold">{assignments.filter(a=>a.status==='grading').length}</p><p className="text-xs font-semibold opacity-75 mt-0.5">✏️ Grading</p></div></div>
        <div className="stat-card stat-teal"><div className="relative"><p className="text-3xl font-bold">{assignments.filter(a=>a.status==='graded').length}</p><p className="text-xs font-semibold opacity-75 mt-0.5">✅ Graded</p></div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📋 All Assignments</h3>
          <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-1.5 px-3">+ Create new</button>
        </div>

        {loading ? (
          <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400 text-sm">Loading...</p></div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12"><div className="text-5xl mb-3">📭</div><p className="text-gray-400 text-sm">No assignments yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-4 mx-auto">+ Create your first assignment</button></div>
        ) : (
          <div className="flex flex-col gap-2">
            {assignments.map(a => {
              const sc = statusConfig[a.status] || statusConfig.open
              const isOpen = expanded === a.id
              const ds = dueStatus(a.due_date)
              return (
                <div key={a.id} className="rounded-xl overflow-hidden transition-all"
                  style={{ border:`1px solid ${sc.text}20`, background:sc.bg }}>
                  <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : a.id)}>
                    <div className="text-2xl">{sc.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{a.title}</p>
                        {ds==='overdue' && a.status==='open' && <span className="text-2xs px-2 py-0.5 rounded-full font-bold" style={{background:'#fef2f2',color:'#dc2626'}}>Overdue</span>}
                        {ds==='today'   && a.status==='open' && <span className="text-2xs px-2 py-0.5 rounded-full font-bold animate-pulse-soft" style={{background:'#fffbeb',color:'#d97706'}}>Due today</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{a.class_name} · Due {formatDate(a.due_date)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{background:'white',color:sc.text}}>{sc.label}</span>
                      <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t animate-fade-up" style={{borderColor:`${sc.text}15`}}>
                      {a.description && <p className="text-xs text-gray-600 mb-3 leading-relaxed bg-white rounded-xl p-3">📝 {a.description}</p>}
                      {a.total_marks  && <p className="text-xs text-gray-500 mb-3">🎯 Total marks: <strong>{a.total_marks}</strong></p>}
                      <div className="flex gap-2 flex-wrap">
                        {sc.next && <button onClick={() => advanceStatus(a.id, a.status)} className="btn-primary text-xs py-1.5 px-3">{sc.nextLabel}</button>}
                        <button onClick={() => setDeleteId(a.id)} className="btn-secondary text-xs py-1.5 px-3" style={{color:'#dc2626',borderColor:'#fca5a5'}}>🗑 Delete</button>
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
