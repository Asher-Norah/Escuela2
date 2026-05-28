'use client'

/*
  components/views/AssignmentsView.jsx
  ----------------------------------------
  Interactive Assignments manager.

  Features:
  - "Create new" opens a modal form
  - Teacher fills in title, class, due date, description
  - New assignment appears at the top of the list instantly
  - Click any assignment to expand and see full details
  - Mark assignment as "Grading" or "Graded"
  - Delete assignments with confirmation
  - Toast notifications

  When backend is ready, replace handleSave with:
    await fetch('/api/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(form)
    })
*/

import { useState } from 'react'
import { teacherClasses } from '@/data/mockData'

const initialAssignments = [
  { id: 1, title: 'Algebra worksheet 4',     classId: 'form3north', classLabel: 'Form 3 North', dueDate: '2025-05-30', description: 'Complete exercises 4.1 to 4.5 from the textbook.', submitted: 24, total: 38, status: 'open'    },
  { id: 2, title: 'Quadratic equations CAT', classId: 'form2north', classLabel: 'Form 2 North', dueDate: '2025-05-27', description: 'Class Assessment Test — 40 minutes, closed book.',     submitted: 38, total: 38, status: 'grading' },
  { id: 3, title: 'KCSE revision paper 3',   classId: 'form4south', classLabel: 'Form 4 South', dueDate: '2025-06-02', description: 'Past paper 2022 — full paper, show all working.',      submitted: 38, total: 38, status: 'graded'  },
]

const statusConfig = {
  open:    { label: 'Open',    bg: '#eff6ff', text: '#1d4ed8', icon: '📬', next: 'grading', nextLabel: 'Start grading' },
  grading: { label: 'Grading', bg: '#fffbeb', text: '#d97706', icon: '✏️',  next: 'graded',  nextLabel: 'Mark as graded' },
  graded:  { label: 'Graded',  bg: '#f0fdf4', text: '#059669', icon: '✅', next: null,      nextLabel: null             },
}

const emptyForm = {
  title:       '',
  classId:     '',
  dueDate:     '',
  description: '',
  totalMarks:  '',
}

export default function AssignmentsView() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [showModal, setShowModal]     = useState(false)
  const [form, setForm]               = useState(emptyForm)
  const [saving, setSaving]           = useState(false)
  const [expanded, setExpanded]       = useState(null)  // which assignment is expanded
  const [deleteId, setDeleteId]       = useState(null)
  const [toast, setToast]             = useState(null)
  const [file, setFile] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function handleFileChange(e) {
  const selected = e.target.files[0]
  if (selected) setFile(selected)
}

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function openModal() {
    setForm(emptyForm)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setForm(emptyForm)
    setFile(null)
  }

  function handleSave() {
    if (!form.title || !form.classId || !form.dueDate) {
      showToast('⚠️ Please fill in title, class and due date', 'warning')
      return
    }

    setSaving(true)

    const classLabel = teacherClasses.find(c => c.id === form.classId)?.label || ''
    const total = teacherClasses.find(c => c.id === form.classId)?.count || 38

    const newAssignment = {
      id:          Date.now(),
      title:       form.title,
      classId:     form.classId,
      classLabel,
      dueDate:     form.dueDate,
      description: form.description,
      totalMarks:  form.totalMarks,
      submitted:   0,
      total,
      status:      'open',
    }

    // TODO: Replace with API call when backend is ready:
    // const res = await fetch('/api/teacher/assignments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newAssignment)
    // })

    setAssignments(prev => [newAssignment, ...prev])
    setSaving(false)
    closeModal()
    showToast('✅ Assignment created successfully!')
  }

  // Advance status: open → grading → graded
  function advanceStatus(id) {
    setAssignments(prev => prev.map(a => {
      if (a.id !== id) return a
      const next = statusConfig[a.status].next
      if (!next) return a
      return { ...a, status: next }
    }))
    showToast('✅ Status updated!')
  }

  function handleDelete(id) {
    setAssignments(prev => prev.filter(a => a.id !== id))
    setDeleteId(null)
    setExpanded(null)
    showToast('🗑 Assignment deleted', 'warning')
  }

  // Format date nicely: 2025-05-30 → Fri 30 May
  function formatDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  // Is due date today or past?
  function isDueStatus(dateStr) {
    if (!dateStr) return null
    const today = new Date()
    const due   = new Date(dateStr)
    today.setHours(0,0,0,0)
    due.setHours(0,0,0,0)
    if (due < today) return 'overdue'
    if (due.getTime() === today.getTime()) return 'today'
    return 'upcoming'
  }

  return (
    <div className="animate-fade-up">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl animate-fade-up"
          style={{
            background: toast.type === 'success'
              ? 'linear-gradient(135deg,#059669,#34d399)'
              : 'linear-gradient(135deg,#d97706,#fbbf24)',
            color: 'white',
          }}>
          {toast.msg}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>

          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            <div className="px-5 py-4 flex justify-between items-center"
              style={{ background: 'linear-gradient(135deg,#064e44,#0a7c6e)' }}>
              <div>
                <h2 className="text-white font-bold text-sm">📋 Create Assignment</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Fill in the details below
                </p>
              </div>
              <button onClick={closeModal}
                className="text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:scale-110 transition-all"
                style={{ background: 'rgba(255,255,255,0.2)' }}>✕</button>
            </div>

            <div className="p-5 flex flex-col gap-3">

              <div>
                <label className="form-label">Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Algebra worksheet 5" className="form-input" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Class *</label>
                  <select name="classId" value={form.classId} onChange={handleChange} className="form-input">
                    <option value="">Select class</option>
                    {teacherClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Due date *</label>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div>
                <label className="form-label">Total marks</label>
                <input name="totalMarks" type="number" value={form.totalMarks} onChange={handleChange}
                  placeholder="e.g. 30" className="form-input" />
              </div>

                 <div>
                <label className="form-label">Attachment (optional)</label>
                <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:border-brand"
                  style={{ border: '2px dashed #e5e7eb', background: '#f9fffe' }}>
                  <input type="file" className="hidden" onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.png" />
                  <span className="text-2xl">📎</span>
                  <div>
                    {file
                      ? <p className="text-sm font-semibold" style={{ color: '#0a7c6e' }}>📄 {file.name}</p>
                      : <p className="text-sm text-gray-400">Click to attach a file</p>
                    }
                    <p className="text-xs text-gray-300 mt-0.5">PDF, Word, JPG or PNG</p>
                  </div>
                  {file && (
                    <button type="button" onClick={e => { e.preventDefault(); setFile(null) }}
                      className="ml-auto text-xs px-2 py-1 rounded-lg"
                      style={{ color: '#dc2626', background: '#fef2f2' }}>
                      ✕ Remove
                    </button>
                  )}
                </label>
              </div>
              <div>

                <label className="form-label">Description / Instructions</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="What should students do? Any special instructions?"
                  rows={3} className="form-textarea" />
              </div>
            </div>

            <div className="px-5 py-3 flex justify-end gap-2"
              style={{ borderTop: '1px solid #f0faf8' }}>
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
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
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="text-4xl mb-3">🗑</div>
            <h3 className="font-bold text-gray-800 mb-1">Delete this assignment?</h3>
            <p className="text-sm text-gray-500 mb-4">This cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg,#dc2626,#f87171)' }}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-3 stagger">
        <div className="stat-card stat-blue">
          <div className="relative">
            <p className="text-3xl font-bold">{assignments.filter(a => a.status === 'open').length}</p>
            <p className="text-xs font-semibold opacity-75 mt-0.5">📬 Open</p>
          </div>
        </div>
        <div className="stat-card stat-yellow">
          <div className="relative">
            <p className="text-3xl font-bold">{assignments.filter(a => a.status === 'grading').length}</p>
            <p className="text-xs font-semibold opacity-75 mt-0.5">✏️ Grading</p>
          </div>
        </div>
        <div className="stat-card stat-teal">
          <div className="relative">
            <p className="text-3xl font-bold">{assignments.filter(a => a.status === 'graded').length}</p>
            <p className="text-xs font-semibold opacity-75 mt-0.5">✅ Graded</p>
          </div>
        </div>
      </div>

      {/* Assignments list */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📋 All Assignments</h3>
          <button onClick={openModal} className="btn-primary text-xs py-1.5 px-3">
            + Create new
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400 text-sm">No assignments yet.</p>
            <button onClick={openModal} className="btn-primary mt-4 mx-auto">
              + Create your first assignment
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {assignments.map(a => {
              const sc       = statusConfig[a.status]
              const pct      = Math.round((a.submitted / a.total) * 100)
              const isOpen   = expanded === a.id
              const dueStatus = isDueStatus(a.dueDate)

              return (
                <div key={a.id}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{ border: `1px solid ${sc.text}20`, background: sc.bg }}>

                  {/* Main row — clickable to expand */}
                  <div className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : a.id)}>

                    <div className="text-2xl">{sc.icon}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{a.title}</p>
                        {dueStatus === 'overdue' && a.status === 'open' && (
                          <span className="text-2xs px-2 py-0.5 rounded-full font-bold"
                            style={{ background: '#fef2f2', color: '#dc2626' }}>Overdue</span>
                        )}
                        {dueStatus === 'today' && a.status === 'open' && (
                          <span className="text-2xs px-2 py-0.5 rounded-full font-bold animate-pulse-soft"
                            style={{ background: '#fffbeb', color: '#d97706' }}>Due today</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {a.classLabel} · Due {formatDate(a.dueDate)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="progress-bar w-24">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: sc.text }}>
                          {a.submitted}/{a.total} submitted
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                        style={{ background: 'white', color: sc.text }}>
                        {sc.label}
                      </span>
                      <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t animate-fade-up"
                      style={{ borderColor: `${sc.text}15` }}>
                      {a.description && (
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed bg-white rounded-xl p-3">
                          📝 {a.description}
                        </p>
                      )}
                      {a.totalMarks && (
                        <p className="text-xs text-gray-500 mb-3">
                          🎯 Total marks: <strong>{a.totalMarks}</strong>
                        </p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {sc.next && (
                          <button onClick={() => advanceStatus(a.id)} className="btn-primary text-xs py-1.5 px-3">
                            {sc.nextLabel}
                          </button>
                        )}
                        <button onClick={() => setDeleteId(a.id)}
                          className="btn-secondary text-xs py-1.5 px-3"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                          🗑 Delete
                        </button>
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
