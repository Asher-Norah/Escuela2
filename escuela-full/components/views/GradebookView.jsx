'use client'

/*
  components/views/GradebookView.jsx
  — Connected to real API.
  Saves grades to POST /api/teacher/grades
*/

import { useState, useEffect } from 'react'
import { getLetter } from '@/data/mockData'

const CLASSES = [
  { id: 'form3north', label: 'Form 3 North' },
  { id: 'form2north', label: 'Form 2 North' },
  { id: 'form4south', label: 'Form 4 South' },
]

function getLetterStyle(score) {
  if (score >= 80) return { bg:'#f0fdf4', text:'#059669' }
  if (score >= 60) return { bg:'#eff6ff', text:'#1d4ed8' }
  if (score >= 50) return { bg:'#fffbeb', text:'#d97706' }
  return { bg:'#fef2f2', text:'#dc2626' }
}

export default function GradebookView() {
  const [activeClass, setActiveClass] = useState('form3north')
  const [students, setStudents]       = useState([])
  const [grades, setGrades]           = useState({})   // { adm_no: { cat1, cat2 } }
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [toast, setToast]             = useState(null)

  function getToken() { return localStorage.getItem('token') }
  function showToast(msg, type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  // Load students when class tab changes
  useEffect(() => {
    loadStudents()
    setSaved(false)
  }, [activeClass])

  async function loadStudents() {
    setLoading(true)
    const className = CLASSES.find(c => c.id === activeClass)?.label
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/teacher/students?class_name=${encodeURIComponent(className)}`,
        { headers: { 'Authorization': `Bearer ${getToken()}` } }
      )
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : [])

      // Initialize grades for each student
      const initial = {}
      data.forEach(stu => {
        initial[stu.admission_no] = { cat1: '', cat2: '', midterm: '' }
      })
      setGrades(initial)
    } catch { showToast('Could not load students', 'warning') }
    finally { setLoading(false) }
  }

  function handleGradeChange(admNo, field, value) {
    setGrades(prev => ({
      ...prev,
      [admNo]: { ...prev[admNo], [field]: value }
    }))
    setSaved(false)
  }

  function getAvg(admNo) {
    const g = grades[admNo]
    if (!g) return null
    const scores = [g.cat1, g.cat2, g.midterm].filter(v => v !== '' && v !== null && !isNaN(v)).map(Number)
    if (scores.length === 0) return null
    return Math.round(scores.reduce((a,b) => a+b, 0) / scores.length)
  }

  async function handleSubmit() {
    setSaving(true)
    const className = CLASSES.find(c => c.id === activeClass)?.label
    try {
      const records = students.map(stu => ({
        student_name: stu.name,
        adm_no:       stu.admission_no,
        class_name:   className,
        cat1:    grades[stu.admission_no]?.cat1    || null,
        cat2:    grades[stu.admission_no]?.cat2    || null,
        midterm: grades[stu.admission_no]?.midterm || null,
      }))

      const res = await fetch('http://127.0.0.1:8000/api/teacher/grades', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_name: className, records })
      })

      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      showToast(`✅ Grades saved for ${className}!`)
    } catch { showToast('Failed to save grades', 'warning') }
    finally { setSaving(false) }
  }

  return (
    <div className="animate-fade-up">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl"
          style={{ background: toast.type==='success' ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#d97706,#fbbf24)', color:'white' }}>
          {toast.msg}
        </div>
      )}

      {/* Class tabs */}
      <div className="flex gap-2 mb-3">
        {CLASSES.map((cls, i) => (
          <button key={cls.id} onClick={() => setActiveClass(cls.id)}
            className="text-xs px-4 py-2.5 rounded-xl font-semibold transition-all"
            style={activeClass === cls.id
              ? { background:'linear-gradient(135deg,#0a7c6e,#0db89f)', color:'white', boxShadow:'0 4px 12px rgba(10,124,110,0.3)' }
              : { background:'white', color:'#6b7280', border:'1px solid #e5e7eb' }
            }>{cls.label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            ✏️ {CLASSES.find(c=>c.id===activeClass)?.label} — Grade entry
          </h3>
          {saved && (
            <span className="text-xs px-3 py-1 rounded-full font-bold"
              style={{ background:'#f0fdf4', color:'#059669', border:'1px solid #86efac' }}>
              ✅ Saved to database
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading students...</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom:'2px solid #f0faf8' }}>
                  {['Student','Adm No.','CAT 1','CAT 2','Mid-term','Average','Grade'].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-semibold text-left pb-3 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((stu, i) => {
                  const avg = getAvg(stu.admission_no)
                  const ls  = avg !== null ? getLetterStyle(avg) : { bg:'#f3f4f6', text:'#9ca3af' }
                  return (
                    <tr key={stu.admission_no} className="table-row">
                      <td className="py-2.5 font-medium text-gray-800">{stu.name}</td>
                      <td className="py-2.5 text-xs text-gray-400">{stu.admission_no}</td>
                      {['cat1','cat2','midterm'].map(field => (
                        <td key={field} className="py-2.5">
                          <input type="number" min={0} max={100}
                            value={grades[stu.admission_no]?.[field] || ''}
                            onChange={e => handleGradeChange(stu.admission_no, field, e.target.value)}
                            placeholder="—"
                            className="w-16 text-sm px-2 py-1.5 rounded-lg text-center font-semibold focus:outline-none"
                            style={{ border:'2px solid rgba(10,124,110,0.2)', background:'#f0faf8', color:'#064e44' }} />
                        </td>
                      ))}
                      <td className="py-2.5 font-bold text-gray-800">
                        {avg !== null ? `${avg}%` : '—'}
                      </td>
                      <td className="py-2.5">
                        {avg !== null
                          ? <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background:ls.bg, color:ls.text }}>
                              {getLetter(avg)}
                            </span>
                          : <span className="text-xs text-gray-300">—</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="flex gap-2 mt-4 pt-3" style={{ borderTop:'1px solid #f0faf8' }}>
              <button className="btn-secondary">Save draft</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary">
                {saving
                  ? <span className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</span>
                  : '✅ Submit to admin'
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
