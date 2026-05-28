'use client'

/*
  components/views/AttendanceView.jsx
  -------------------------------------
  Fully connected to the real FastAPI backend.

  Changes from mock version:
  - Students are loaded from GET /api/teacher/students?class_name=...
  - Attendance is saved to POST /api/teacher/attendance
  - Token is read from localStorage (set at login)
  - Loading and error states added
*/

import { useState, useEffect } from 'react'

const TODAY = new Date().toISOString().split('T')[0]  // e.g. "2025-05-28"
const TODAY_DISPLAY = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

// Classes this teacher teaches — will come from API later
const CLASSES = [
  { id: 'form3north', label: 'Form 3 North', isClassTeacher: true  },
  { id: 'form2north', label: 'Form 2 North', isClassTeacher: false },
  { id: 'form4south', label: 'Form 4 South', isClassTeacher: false },
]

const avatarColors = [
  { bg: '#f3f0ff', text: '#7c3aed' },
  { bg: '#e6faf7', text: '#064e44' },
  { bg: '#fffbeb', text: '#d97706' },
  { bg: '#eff6ff', text: '#1d4ed8' },
  { bg: '#fef2f2', text: '#dc2626' },
]

const MARKS = {
  P: { label: 'P', full: 'Present', active: { bg: '#059669', color: 'white' }, emoji: '✅' },
  A: { label: 'A', full: 'Absent',  active: { bg: '#dc2626', color: 'white' }, emoji: '❌' },
  L: { label: 'L', full: 'Late',    active: { bg: '#d97706', color: 'white' }, emoji: '⏰' },
}

export default function AttendanceView() {
  const [activeClass, setActiveClass] = useState(CLASSES[0].id)
  const [students, setStudents]       = useState([])   // real students from API
  const [register, setRegister]       = useState([])   // register rows with marks
  const [loading, setLoading]         = useState(false)
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState({})
  const [toast, setToast]             = useState(null)
  const [error, setError]             = useState(null)

  // Get token from localStorage — set during login
  function getToken() {
    return localStorage.getItem('token')
  }

  // ── LOAD STUDENTS from API when class tab changes ──────────────
  useEffect(() => {
    loadStudents()
  }, [activeClass])

  async function loadStudents() {
    setLoading(true)
    setError(null)

    const className = CLASSES.find(c => c.id === activeClass)?.label

    try {
      /*
        GET /api/teacher/students?class_name=Form 3 North
        Returns all students in that class from the database.
      */
      const res = await fetch(
        `http://127.0.0.1:8000/api/teacher/students?class_name=${encodeURIComponent(className)}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type':  'application/json',
          }
        }
      )

      if (!res.ok) {
        throw new Error('Failed to load students')
      }

      const data = await res.json()
      setStudents(data)

      // Build register rows from the students
      setRegister(data.map(stu => ({
        ...stu,
        mark: null,
        note: '',
      })))

    } catch (err) {
      setError('Could not load students. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  // ── MARK A STUDENT ─────────────────────────────────────────────
  function markStudent(admNo, mark) {
    setRegister(prev => prev.map(r =>
      r.admission_no === admNo
        ? { ...r, mark: r.mark === mark ? null : mark }
        : r
    ))
    setSaved(prev => ({ ...prev, [activeClass]: false }))
  }

  function updateNote(admNo, note) {
    setRegister(prev => prev.map(r =>
      r.admission_no === admNo ? { ...r, note } : r
    ))
  }

  function markAllPresent() {
    setRegister(prev => prev.map(r => ({ ...r, mark: 'P', note: '' })))
    setSaved(prev => ({ ...prev, [activeClass]: false }))
  }

  function clearAll() {
    setRegister(prev => prev.map(r => ({ ...r, mark: null, note: '' })))
    setSaved(prev => ({ ...prev, [activeClass]: false }))
  }

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── SAVE REGISTER to API ───────────────────────────────────────
  async function handleSave() {
    const unmarked = register.filter(r => r.mark === null).length
    if (unmarked > 0) {
      showToast(`⚠️ ${unmarked} student(s) not yet marked`, 'warning')
      return
    }

    setSaving(true)

    const className = CLASSES.find(c => c.id === activeClass)?.label

    /*
      POST /api/teacher/attendance
      Body: {
        class_name: "Form 3 North",
        date: "2025-05-28",
        records: [
          { student_name: "Aisha Mohamed", adm_no: "GFA/0042", mark: "P", note: "" },
          ...
        ]
      }
    */
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teacher/attendance', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          class_name: className,
          date:       TODAY,
          records:    register.map(r => ({
            student_name: r.name,
            adm_no:       r.admission_no,
            mark:         r.mark,
            note:         r.note || null,
          }))
        })
      })

      if (!res.ok) throw new Error('Failed to save')

      setSaved(prev => ({ ...prev, [activeClass]: true }))
      showToast(`✅ ${className} register saved to database!`)

    } catch (err) {
      showToast('❌ Failed to save. Please try again.', 'warning')
    } finally {
      setSaving(false)
    }
  }

  // ── COUNTS ─────────────────────────────────────────────────────
  const counts = {
    P:        register.filter(r => r.mark === 'P').length,
    A:        register.filter(r => r.mark === 'A').length,
    L:        register.filter(r => r.mark === 'L').length,
    unmarked: register.filter(r => r.mark === null).length,
  }

  const cls      = CLASSES.find(c => c.id === activeClass)
  const isSaved  = saved[activeClass]
  const progress = register.length > 0
    ? Math.round(((register.length - counts.unmarked) / register.length) * 100)
    : 0

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
          {toast.message}
        </div>
      )}

      {/* Date + quick actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg,#0a7c6e,#0db89f)', color: 'white' }}>
          <span className="text-lg">📅</span>
          <div>
            <p className="text-xs opacity-75">Taking register for</p>
            <p className="font-bold text-sm">{TODAY_DISPLAY}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={markAllPresent} className="btn-secondary text-xs py-2 px-3">
            ✅ Mark all present
          </button>
          <button onClick={clearAll} className="btn-secondary text-xs py-2 px-3"
            style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
            🗑 Clear all
          </button>
        </div>
      </div>

      {/* Class tabs */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {CLASSES.map((c) => (
          <button key={c.id} onClick={() => setActiveClass(c.id)}
            className="text-xs px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
            style={activeClass === c.id
              ? { background: 'linear-gradient(135deg,#0a7c6e,#0db89f)', color: 'white', boxShadow: '0 4px 12px rgba(10,124,110,0.3)' }
              : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }
            }>
            {c.isClassTeacher ? '⭐ ' : ''}{c.label}
            {saved[c.id] && (
              <span className="w-2 h-2 rounded-full" style={{ background: '#34d399' }} />
            )}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="card p-4 mb-3 text-center"
          style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={loadStudents} className="btn-primary mt-2 mx-auto text-xs">
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading students...</p>
        </div>
      )}

      {/* Stats */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-3 stagger">
            <div className="stat-card stat-teal"><div className="relative"><p className="text-3xl font-bold">{counts.P}</p><p className="text-xs font-semibold opacity-75 mt-0.5">Present</p></div></div>
            <div className="stat-card stat-coral"><div className="relative"><p className="text-3xl font-bold">{counts.A}</p><p className="text-xs font-semibold opacity-75 mt-0.5">Absent</p></div></div>
            <div className="stat-card stat-yellow"><div className="relative"><p className="text-3xl font-bold">{counts.L}</p><p className="text-xs font-semibold opacity-75 mt-0.5">Late</p></div></div>
            <div className="stat-card stat-purple"><div className="relative"><p className="text-3xl font-bold">{counts.unmarked}</p><p className="text-xs font-semibold opacity-75 mt-0.5">Not marked</p></div></div>
          </div>

          {/* Progress bar */}
          <div className="card" style={{ padding: '12px 20px', marginBottom: '12px' }}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-gray-600">
                {register.length - counts.unmarked} of {register.length} students marked
              </p>
              <p className="text-xs font-bold" style={{ color: '#0a7c6e' }}>{progress}%</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Register table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                📋 {cls?.label} — {register.length} students
              </h3>
              {isSaved && (
                <span className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #86efac' }}>
                  ✅ Saved to database
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {register.map((row, i) => {
                const av = avatarColors[i % avatarColors.length]
                return (
                  <div key={row.admission_no}>
                    <div className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150"
                      style={{
                        background: row.mark === 'P' ? '#f0fdf4' : row.mark === 'A' ? '#fef2f2' : row.mark === 'L' ? '#fffbeb' : '#fafafa',
                        border: row.mark === 'P' ? '1px solid #86efac' : row.mark === 'A' ? '1px solid #fca5a5' : row.mark === 'L' ? '1px solid #fcd34d' : '1px solid #f3f4f6',
                      }}>

                      <span className="text-xs text-gray-300 w-5 text-center font-medium flex-shrink-0">{i + 1}</span>

                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: av.bg, color: av.text }}>
                        {row.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{row.name}</p>
                        <p className="text-xs text-gray-400">{row.admission_no}</p>
                      </div>

                      <div className="flex gap-1.5 flex-shrink-0">
                        {Object.entries(MARKS).map(([key, config]) => {
                          const isActive = row.mark === key
                          return (
                            <button key={key}
                              onClick={() => markStudent(row.admission_no, key)}
                              className="w-9 h-9 rounded-xl text-sm font-bold transition-all duration-150"
                              style={isActive
                                ? { ...config.active, transform: 'scale(1.1)' }
                                : { background: '#f3f4f6', color: '#9ca3af', border: '1px solid #e5e7eb' }
                              }>
                              {key}
                            </button>
                          )
                        })}
                      </div>

                      <div className="w-6 text-center flex-shrink-0">
                        {row.mark ? <span className="text-base">{MARKS[row.mark].emoji}</span> : <span className="text-gray-200 text-xs">—</span>}
                      </div>
                    </div>

                    {row.mark === 'A' && (
                      <div className="ml-14 mt-1 mb-1 animate-fade-up">
                        <input value={row.note} onChange={e => updateNote(row.admission_no, e.target.value)}
                          placeholder="Reason for absence (optional)..."
                          className="form-input text-xs py-2"
                          style={{ background: '#fff5f5', borderColor: '#fca5a5' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4"
              style={{ borderTop: '1px solid #f0faf8' }}>
              <p className="text-xs text-gray-400">
                {counts.unmarked > 0
                  ? <span style={{ color: '#d97706' }}>⚠️ {counts.unmarked} student(s) still unmarked</span>
                  : <span style={{ color: '#059669' }}>✅ All students marked</span>
                }
              </p>
              <button onClick={handleSave} disabled={saving}
                className="btn-primary px-6"
                style={isSaved ? { background: 'linear-gradient(135deg,#059669,#34d399)' } : {}}>
                {saving
                  ? <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  : isSaved ? '✅ Saved to database' : '💾 Save register'
                }
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
