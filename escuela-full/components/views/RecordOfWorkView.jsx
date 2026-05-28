'use client'

/*
  components/views/RecordOfWorkView.jsx
  ----------------------------------------
  Interactive Record of Work.

  Features:
  - "Log lesson" button opens a modal form
  - Teacher fills in class, topic, notes etc.
  - New entry appears at the TOP of the list instantly
  - Entries can be deleted
  - Toast notification on save

  When backend is ready, replace handleSave with:
    await fetch('/api/teacher/record-of-work', {
      method: 'POST',
      body: JSON.stringify(form)
    })
*/

import { useState } from 'react'
import { teacherClasses } from '@/data/mockData'

// Starting data — will come from API later
const initialEntries = [
  { id: 1, day: 27, month: 'May', classLabel: 'Form 3 North', time: '9:00 AM',  topic: 'Quadratic equations — completing the square',  notes: 'Students practiced 6 problems in pairs. 4 students needed extra help.' },
  { id: 2, day: 26, month: 'May', classLabel: 'Form 2 North', time: '8:00 AM',  topic: 'Simultaneous equations — introduction',          notes: 'Used board work and group exercises. Worksheet assigned as homework.'   },
  { id: 3, day: 24, month: 'May', classLabel: 'Form 4 South', time: '11:00 AM', topic: 'Statistics — standard deviation and variance',    notes: 'Revision for end-term. Past paper questions reviewed. 3 students absent.' },
]

const entryColors = [
  { bg: '#e6faf7', border: '#0a7c6e', text: '#064e44' },
  { bg: '#f3f0ff', border: '#7c3aed', text: '#3b0764' },
  { bg: '#fffbeb', border: '#f59e0b', text: '#451a03' },
  { bg: '#eff6ff', border: '#1d4ed8', text: '#1e3a8a' },
  { bg: '#fef2f2', border: '#dc2626', text: '#7f1d1d' },
]

const emptyForm = {
  classId:   '',
  date:      '',
  time:      '',
  topic:     '',
  subTopic:  '',
  notes:     '',
  present:   '',
  absent:    '',
}

export default function RecordOfWorkView() {
  const [entries, setEntries]   = useState(initialEntries)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState(null)
  const [deleteId, setDeleteId] = useState(null) // confirm before delete

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
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
  }

  function handleSave() {
    // Basic validation
    if (!form.classId || !form.topic) {
      showToast('⚠️ Please fill in class and topic', 'warning')
      return
    }

    setSaving(true)

    // Parse day/month from the date field
    const dateObj = form.date ? new Date(form.date) : new Date()
    const day     = dateObj.getDate()
    const month   = dateObj.toLocaleString('default', { month: 'short' })

    const classLabel = teacherClasses.find(c => c.id === form.classId)?.label || form.classId

    // Build new entry — prepend to list so it appears at the top
    const newEntry = {
      id:         Date.now(), // temporary ID — real ID will come from database later
      day,
      month,
      classLabel,
      time:       form.time || '—',
      topic:      form.topic,
      subTopic:   form.subTopic,
      notes:      form.notes,
      present:    form.present,
      absent:     form.absent,
    }

    // TODO: Replace with API call when backend is ready:
    // const res = await fetch('/api/teacher/record-of-work', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newEntry)
    // })
    // const saved = await res.json()
    // setEntries(prev => [saved, ...prev])

    setEntries(prev => [newEntry, ...prev])
    setSaving(false)
    closeModal()
    showToast('✅ Lesson logged successfully!')
  }

  function handleDelete(id) {
    setEntries(prev => prev.filter(e => e.id !== id))
    setDeleteId(null)
    showToast('🗑 Entry deleted', 'warning')
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

      {/* Log Lesson Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>

          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            {/* Modal header */}
            <div className="px-5 py-4 flex justify-between items-center"
              style={{ background: 'linear-gradient(135deg,#064e44,#0a7c6e)' }}>
              <div>
                <h2 className="text-white font-bold text-sm">📖 Log Lesson</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Record what was covered in this lesson
                </p>
              </div>
              <button onClick={closeModal}
                className="text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:scale-110 transition-all"
                style={{ background: 'rgba(255,255,255,0.2)' }}>✕</button>
            </div>

            {/* Modal body */}
            <div className="p-5 flex flex-col gap-3">

              {/* Class + Date + Time — row */}
              <div className="grid grid-cols-3 gap-3">
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
                  <label className="form-label">Date</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Time</label>
                  <input name="time" type="time" value={form.time} onChange={handleChange} className="form-input" />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="form-label">Topic *</label>
                <input name="topic" value={form.topic} onChange={handleChange}
                  placeholder="e.g. Quadratic equations — completing the square"
                  className="form-input" />
              </div>

              {/* Sub topic */}
              <div>
                <label className="form-label">Sub topic</label>
                <input name="subTopic" value={form.subTopic} onChange={handleChange}
                  placeholder="e.g. Word problems involving quadratics"
                  className="form-input" />
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Lesson notes / observations</label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="How did the lesson go? Any students who struggled? What to cover next?"
                  rows={3} className="form-textarea" />
              </div>

              {/* Present + Absent */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">No. present</label>
                  <input name="present" type="number" value={form.present} onChange={handleChange}
                    placeholder="e.g. 36" className="form-input" />
                </div>
                <div>
                  <label className="form-label">No. absent</label>
                  <input name="absent" type="number" value={form.absent} onChange={handleChange}
                    placeholder="e.g. 2" className="form-input" />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-3 flex justify-end gap-2"
              style={{ borderTop: '1px solid #f0faf8' }}>
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
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
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="text-4xl mb-3">🗑</div>
            <h3 className="font-bold text-gray-800 mb-1">Delete this entry?</h3>
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

      {/* Main card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📖 Record of Work — Mathematics</h3>
          <button onClick={openModal} className="btn-primary text-xs py-1.5 px-3">
            + Log lesson
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400 text-sm">No lessons logged yet.</p>
            <button onClick={openModal} className="btn-primary mt-4 mx-auto">+ Log your first lesson</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry, i) => {
              const c = entryColors[i % entryColors.length]
              return (
                <div key={entry.id} className="flex gap-4 p-4 rounded-xl group hover-lift"
                  style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}>

                  {/* Date badge */}
                  <div className="w-14 flex-shrink-0 text-center rounded-xl py-2"
                    style={{ background: c.border, color: 'white' }}>
                    <p className="text-xl font-bold leading-none">{entry.day}</p>
                    <p className="text-xs mt-0.5 opacity-80">{entry.month}</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-xs font-bold mb-1" style={{ color: c.border }}>
                      {entry.classLabel} · {entry.time}
                      {entry.present && <span className="ml-2 opacity-70">· {entry.present} present</span>}
                      {entry.absent  && <span className="ml-1 opacity-70">· {entry.absent} absent</span>}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{entry.topic}</p>
                    {entry.subTopic && <p className="text-xs mt-0.5" style={{ color: c.border }}>{entry.subTopic}</p>}
                    {entry.notes && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{entry.notes}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: 'white', color: c.border }}>✓ Done</span>
                    <button
                      onClick={() => setDeleteId(entry.id)}
                      className="text-xs opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg"
                      style={{ color: '#dc2626', background: '#fef2f2' }}>
                      🗑
                    </button>
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
