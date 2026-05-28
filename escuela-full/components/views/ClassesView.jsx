'use client'
import { useState } from 'react'
import { teacherClasses, studentsByClass } from '@/data/mockData'

const statusConfig = {
  good:   { label: 'Good',       bg: '#f0fdf4', text: '#059669', icon: '✅' },
  watch:  { label: 'Watch',      bg: '#fffbeb', text: '#d97706', icon: '⚠️' },
  late:   { label: 'Late often', bg: '#fffbeb', text: '#d97706', icon: '⏰' },
  atrisk: { label: 'At risk',    bg: '#fef2f2', text: '#dc2626', icon: '🚨' },
}
const gradeColors = {
  'A': { bg:'#f0fdf4',text:'#059669' }, 'B+':{ bg:'#eff6ff',text:'#1d4ed8' },
  'B': { bg:'#eff6ff',text:'#1d4ed8' }, 'B-':{ bg:'#eff6ff',text:'#1d4ed8' },
  'C+':{ bg:'#fffbeb',text:'#d97706' }, 'D+':{ bg:'#fef2f2',text:'#dc2626' },
}
const avColors = [
  {bg:'#f3f0ff',text:'#7c3aed'},{bg:'#e6faf7',text:'#064e44'},
  {bg:'#fffbeb',text:'#d97706'},{bg:'#eff6ff',text:'#1d4ed8'},{bg:'#fef2f2',text:'#dc2626'},
]

export default function ClassesView() {
  const [activeClass, setActiveClass] = useState(teacherClasses[0].id)
  const students = studentsByClass[activeClass] || []
  const cls = teacherClasses.find(c => c.id === activeClass)

  return (
    <div className="animate-fade-up">
      <div className="flex gap-2 mb-3 flex-wrap">
        {teacherClasses.map((c) => (
          <button key={c.id} onClick={() => setActiveClass(c.id)}
            className="text-xs px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
            style={activeClass === c.id
              ? { background: 'linear-gradient(135deg,#0a7c6e,#0db89f)', color: 'white', boxShadow: '0 4px 12px rgba(10,124,110,0.3)' }
              : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
            {c.isClassTeacher ? '⭐ ' : ''}{c.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🎓 {cls?.label} — {students.length} students</h3>
          <button className="btn-primary text-xs py-1.5 px-3">Export list</button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid #f0faf8' }}>
              {['#','Student','Adm No.','Avg Grade','Attendance','Status'].map(h => (
                <th key={h} className="text-xs text-gray-400 font-semibold text-left pb-3 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((stu, i) => {
              const av = avColors[i % avColors.length]
              const sc = statusConfig[stu.status]
              const gc = gradeColors[stu.avgGrade] || {bg:'#f3f4f6',text:'#374151'}
              return (
                <tr key={stu.id} className="table-row group cursor-pointer">
                  <td className="py-3 text-xs text-gray-300 font-medium">{i+1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110"
                        style={{ background: av.bg, color: av.text }}>{stu.initials}</div>
                      <span className="font-medium text-gray-800">{stu.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-gray-400">{stu.admNo}</td>
                  <td className="py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: gc.bg, color: gc.text }}>
                      {stu.avgGrade} · {stu.avgScore}%
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="progress-bar w-16"><div className="progress-fill" style={{ width: `${stu.attendance}%` }} /></div>
                      <span className="text-xs text-gray-600 font-medium">{stu.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 w-fit"
                      style={{ background: sc.bg, color: sc.text }}>
                      {sc.icon} {sc.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-3 pt-3 flex justify-between" style={{ borderTop: '1px solid #f0faf8' }}>
          <span>Showing {students.length} of {cls?.count} students</span>
          <button className="card-link font-semibold">View all →</button>
        </p>
      </div>
    </div>
  )
}
