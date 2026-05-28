'use client'
import { dutyRoster } from '@/data/mockData'

export default function DutyRosterView() {
  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 p-4 rounded-xl mb-3"
        style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <span className="text-xl">ℹ️</span>
        <p className="text-sm text-blue-700">
          This roster was <strong>uploaded by the admin</strong> on Mon 26 May. Your duties are highlighted.
        </p>
      </div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📌 Duty Roster — Week 18</h3>
          <button className="btn-secondary text-xs py-1.5 px-3">⬇ Download PDF</button>
        </div>
        <div className="flex flex-col gap-2">
          {dutyRoster.map(row => (
            <div key={row.id} className="flex items-center gap-4 p-3.5 rounded-xl transition-all"
              style={row.isMyDuty
                ? { background: 'linear-gradient(135deg,#e6faf7,#b8f0e8)', border: '1px solid rgba(10,124,110,0.2)' }
                : { background: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div className="w-24 flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: row.isMyDuty ? '#0a7c6e' : '#9ca3af' }}>{row.date}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: row.isMyDuty ? '#064e44' : '#374151' }}>
                  {row.duty}
                  {row.isMyDuty && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#0a7c6e', color: 'white' }}>You</span>
                  )}
                </p>
                <p className="text-xs mt-0.5" style={{ color: row.isMyDuty ? '#0a7c6e' : '#9ca3af' }}>⏰ {row.time}</p>
              </div>
              <p className="text-xs font-medium" style={{ color: row.isMyDuty ? '#0a7c6e' : '#6b7280' }}>{row.teacher}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
