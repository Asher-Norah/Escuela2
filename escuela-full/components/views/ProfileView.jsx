'use client'
import { teacherProfile, notifications } from '@/data/mockData'

const upcomingLessons = [
  { subject: 'Mathematics', class: 'Form 3 North', time: '9:00–10:00 AM',     room: 'Room 12', status: 'now',      color: '#0a7c6e' },
  { subject: 'Mathematics', class: 'Form 4 South', time: '11:00 AM–12:00 PM', room: 'Room 12', status: 'upcoming', color: '#7c3aed' },
]

const notifColors = {
  warning: { bg: '#fffbeb', border: '#fcd34d', icon: '#f59e0b' },
  info:    { bg: '#eff6ff', border: '#93c5fd', icon: '#3b82f6' },
  success: { bg: '#f0fdf4', border: '#86efac', icon: '#22c55e' },
}

export default function ProfileView({ onNavigate }) {
  const t = teacherProfile

  const stats = [
    { label: t.isClassTeacher ? t.assignedClass : 'My students', value: t.isClassTeacher ? t.classStudents : t.totalStudents, sub: 'My class', style: 'stat-teal',   icon: '👨‍🎓' },
    { label: 'Total students', value: t.totalStudents,  sub: 'Across 3 classes',   style: 'stat-purple', icon: '🏫' },
    { label: 'Lessons today',  value: t.lessonsToday,   sub: `${t.lessonsDone} done · ${t.lessonsToday - t.lessonsDone} ahead`, style: 'stat-blue', icon: '📚' },
    { label: 'Grades pending', value: t.pendingGrades,  sub: 'F2N CAT due today',  style: 'stat-coral',  icon: '✏️' },
  ]

  return (
    <div className="animate-fade-up">

      {/* Hero */}
      <div className="rounded-2xl p-5 mb-3 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064e44 0%, #0a7c6e 60%, #0db89f 100%)', boxShadow: '0 8px 32px rgba(10,124,110,0.25)' }}>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10" style={{ background: '#FFE535' }} />
        <div className="absolute -bottom-8 right-20 w-20 h-20 rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: '#FFE535', color: '#064e44', boxShadow: '0 4px 14px rgba(255,229,53,0.5)' }}>
            {t.initials}
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">{t.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {t.subject} Department · TSC No. {t.tscNumber}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {t.isClassTeacher && (
                <span className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(255,229,53,0.2)', color: '#FFE535', border: '1px solid rgba(255,229,53,0.3)' }}>
                  🏆 Class Teacher — {t.assignedClass}
                </span>
              )}
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}>
                📅 Joined {t.joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-3 stagger">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.style}`}>
            <div className="absolute top-0 right-0 w-14 h-14 rounded-full opacity-10 -mr-3 -mt-3" style={{ background: 'white' }} />
            <div className="relative">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-semibold opacity-80 mt-0.5">{s.label}</p>
              <p className="text-xs opacity-60 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3">

        {/* Upcoming */}
        <div className="card hover-lift">
          <div className="card-header">
            <h3 className="card-title">⏰ Upcoming today</h3>
            <button onClick={() => onNavigate('timetable')} className="card-link">Full timetable →</button>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingLessons.map((lesson, i) => (
              <div key={i} className="rounded-xl p-3 relative overflow-hidden"
                style={{ background: `${lesson.color}10`, border: `1px solid ${lesson.color}25`, borderLeft: `3px solid ${lesson.color}` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: lesson.color }}>
                      {lesson.status === 'now' ? '🟢 Now' : '🔵 Upcoming'} · {lesson.time}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{lesson.subject} — {lesson.class}</p>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {lesson.room} · 38 students</p>
                  </div>
                  {lesson.status === 'now' && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white animate-pulse-soft"
                      style={{ background: '#0a7c6e' }}>LIVE</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card hover-lift">
          <div className="card-header">
            <h3 className="card-title">🔔 Notifications</h3>
            <span className="card-link">All →</span>
          </div>
          <div className="flex flex-col gap-2">
            {notifications.map((n) => {
              const c = notifColors[n.type]
              return (
                <div key={n.id} className="rounded-xl p-3 flex gap-3 items-start cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <span className="text-lg flex-shrink-0">{n.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.desc}</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: c.icon }}>{n.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
