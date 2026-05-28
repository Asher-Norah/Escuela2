'use client'

/*
  components/views/TimetableView.jsx
  ------------------------------------
  Timetable grid + saved lesson plan indicators.

  New features:
  - Toast notification when a lesson plan is saved
  - Saved lesson slots show a green "Plan saved" tag
  - Lessons with saved plans have a distinct visual style
*/

import { useState } from 'react'
import { timetable, DAYS, TIMES, TODAY_INDEX } from '@/data/mockData'
import LessonPlanModal from './LessonPlanModal'

const THEMES = [
  { bg: 'linear-gradient(135deg,#e6faf7,#b8f0e8)', border: '#0a7c6e', text: '#064e44', sub: '#0a7c6e' },
  { bg: 'linear-gradient(135deg,#f3f0ff,#e4dcff)', border: '#7c3aed', text: '#3b0764', sub: '#7c3aed' },
  { bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#f59e0b', text: '#451a03', sub: '#d97706' },
  { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#1d4ed8', text: '#1e3a8a', sub: '#1d4ed8' },
]

export default function TimetableView() {
  const [selected, setSelected]   = useState(null)
  const [savedPlans, setSavedPlans] = useState({}) // { lessonId: planData }
  const [toast, setToast]         = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleClick(lesson) {
    setSelected({
      ...lesson,
      date:     `${DAYS[lesson.day]} May 2025`,
      time:     TIMES[lesson.period].split('–')[0].trim(),
      duration: '60 min',
    })
  }

  // Called when teacher saves a lesson plan inside the modal
  function handlePlanSaved(planData) {
    setSavedPlans(prev => ({ ...prev, [selected.id]: planData }))
    showToast(`✅ Lesson plan saved for ${selected.class} — ${planData.topic || 'lesson'}`)
  }

  return (
    <div className="animate-fade-up">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl animate-fade-up"
          style={{ background: 'linear-gradient(135deg,#059669,#34d399)', color: 'white' }}>
          {toast}
        </div>
      )}

      <LessonPlanModal
        lesson={selected}
        onClose={() => setSelected(null)}
        onSave={handlePlanSaved}
      />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📅 Week 18 — 26–30 May 2025</h3>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs py-1 px-3">← Prev</button>
            <button className="btn-secondary text-xs py-1 px-3">Next →</button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span>💡 Click any lesson to open the lesson preparation form</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: '#059669' }} />
            Plan saved
          </span>
        </div>

        <div className="grid gap-1.5" style={{ gridTemplateColumns: '52px repeat(5,1fr)' }}>

          {/* Header */}
          <div />
          {DAYS.map((day, i) => (
            <div key={day} className="text-center py-2 rounded-xl text-xs font-bold uppercase tracking-wide"
              style={i === TODAY_INDEX
                ? { background: 'linear-gradient(135deg,#0a7c6e,#0db89f)', color: 'white' }
                : { color: '#9ca3af' }}>
              {day}
              {i === TODAY_INDEX && <div className="text-2xs font-normal opacity-75 mt-0.5">today</div>}
            </div>
          ))}

          {/* Rows */}
          {TIMES.map((time, pi) => (
            <>
              <div key={`t${pi}`} className="text-right pr-2 pt-3 font-semibold"
                style={{ color: '#0a7c6e', fontSize: '10px' }}>
                {time.split('–')[0]}
              </div>

              {DAYS.map((_, di) => {
                const lesson  = timetable.find(l => l.day === di && l.period === pi)
                const theme   = THEMES[di % THEMES.length]
                const isToday = di === TODAY_INDEX
                const hasPlan = lesson && savedPlans[lesson.id]

                if (!lesson) {
                  return (
                    <div key={`e${di}-${pi}`}
                      className="rounded-xl mb-1 min-h-14 flex items-center justify-center text-xs"
                      style={{
                        background: isToday ? 'rgba(10,124,110,0.04)' : '#f9fafb',
                        border: `1px dashed ${isToday ? 'rgba(10,124,110,0.2)' : '#e5e7eb'}`,
                        color: '#d1d5db',
                      }}>
                      —
                    </div>
                  )
                }

                return (
                  <button key={lesson.id}
                    onClick={() => handleClick(lesson)}
                    className="rounded-xl p-2.5 mb-1 min-h-14 text-left w-full transition-all duration-200 hover:scale-105 hover:shadow-md relative"
                    style={{
                      background: theme.bg,
                      borderLeft: `3px solid ${theme.border}`,
                      border: `1px solid ${theme.border}20`,
                      borderLeftWidth: '3px',
                      outline: isToday ? `2px solid ${theme.border}40` : 'none',
                      outlineOffset: '1px',
                    }}>

                    <p className="text-xs font-bold leading-tight" style={{ color: theme.text }}>
                      {lesson.subject}
                    </p>
                    <p className="text-2xs mt-0.5" style={{ color: theme.sub }}>{lesson.class}</p>
                    <p className="text-2xs" style={{ color: theme.sub }}>{lesson.room}</p>

                    {/* Status tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lesson.done && (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(255,255,255,0.7)', color: '#059669' }}>
                          ✓ Done
                        </span>
                      )}
                      {lesson.isNow && (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full font-bold animate-pulse-soft"
                          style={{ background: '#0a7c6e', color: 'white' }}>
                          LIVE
                        </span>
                      )}
                      {/* Green dot if plan is saved */}
                      {hasPlan && (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(5,150,105,0.15)', color: '#059669' }}>
                          📝 Plan
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
