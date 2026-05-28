'use client'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'profile',     label: 'My Profile',      emoji: '👤' },
      { id: 'classes',     label: 'My Classes',       emoji: '🎓' },
    ]
  },
  {
    label: 'Teaching',
    items: [
      { id: 'timetable',   label: 'Timetable',        emoji: '📅' },
      { id: 'attendance',  label: 'Attendance',        emoji: '📋' },
      { id: 'gradebook',   label: 'Gradebook & CATs', emoji: '✏️'  },
      { id: 'assignments', label: 'Assignments',       emoji: '📌' },
      { id: 'row',         label: 'Record of Work',   emoji: '📖' },
    ]
  },
  {
    label: 'School',
    items: [
      { id: 'roster',   label: 'Duty Roster', emoji: '🗓' },
      { id: 'messages', label: 'Messages',    emoji: '💬', badge: 3 },
    ]
  },
]

export default function Sidebar({ activeView, onNavigate, teacher }) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #064e44 0%, #0a7c6e 60%, #0db89f 100%)' }}>

      <div className="px-4 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: '#FFE535', boxShadow: '0 0 12px rgba(255,229,53,0.5)' }}>
          🎓
        </div>
        <div>
          <p className="text-white font-bold text-sm tracking-widest">ESCUELA</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>School Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-1">
            <p className="text-xs font-semibold uppercase px-3 pt-3 pb-1"
              style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
              {section.label}
            </p>
            {section.items.map((item) => {
              const active = activeView === item.id
              return (
                <button key={item.id} onClick={() => onNavigate(item.id)}
                  className="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-sm text-left transition-all duration-150"
                  style={{
                    background: active ? 'rgba(255,229,53,0.18)' : 'transparent',
                    color: active ? '#FFE535' : 'rgba(255,255,255,0.7)',
                    fontWeight: active ? '600' : '400',
                    boxShadow: active ? 'inset 0 0 0 1px rgba(255,229,53,0.3)' : 'none',
                  }}>
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: '#FFE535', color: '#064e44' }}>
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: '#FFE535' }} />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="px-2 pb-3">
        <div className="px-3 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#FFE535', color: '#064e44' }}>
              {teacher?.initials || 'JO'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-white text-xs font-semibold truncate">{teacher?.name || 'Teacher'}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{teacher?.subject}</p>
            </div>
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
          </div>
        </div>
      </div>
    </aside>
  )
}
