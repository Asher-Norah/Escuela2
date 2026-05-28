'use client'
import { useState } from 'react'
import { grades, getLetter } from '@/data/mockData'

function getLS(s) {
  if (s>=80) return {bg:'#f0fdf4',text:'#059669'}
  if (s>=60) return {bg:'#eff6ff',text:'#1d4ed8'}
  if (s>=50) return {bg:'#fffbeb',text:'#d97706'}
  return {bg:'#fef2f2',text:'#dc2626'}
}

export default function GradebookView() {
  const [data, setData] = useState(grades['form3north'] || [])

  function handleChange(id, val) {
    setData(prev => prev.map(r => r.studentId===id ? {...r, cat2: Number(val)} : r))
  }

  return (
    <div className="animate-fade-up">
      <div className="flex gap-2 mb-3">
        {['Form 3 North','Form 2 North','Form 4 South'].map((cls,i) => (
          <button key={cls} className="text-xs px-4 py-2.5 rounded-xl font-semibold transition-all"
            style={i===0
              ? {background:'linear-gradient(135deg,#0a7c6e,#0db89f)',color:'white',boxShadow:'0 4px 12px rgba(10,124,110,0.3)'}
              : {background:'white',color:'#6b7280',border:'1px solid #e5e7eb'}}>
            {cls}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">✏️ Form 3 North — CAT 2 entry</h3>
          <button className="card-link">View all CATs →</button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid #f0faf8' }}>
              {['Student','CAT 1','CAT 2 (edit)','Average','Grade','Trend'].map(h => (
                <th key={h} className="text-xs text-gray-400 font-semibold text-left pb-3 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => {
              const avg = Math.round((row.cat1+row.cat2)/2)
              const ls = getLS(avg)
              return (
                <tr key={row.studentId} className="table-row">
                  <td className="py-3 font-medium text-gray-800">{row.name}</td>
                  <td className="py-3 text-xs text-gray-400 font-medium">{row.cat1}</td>
                  <td className="py-3">
                    <input type="number" min={0} max={100} value={row.cat2}
                      onChange={e => handleChange(row.studentId, e.target.value)}
                      className="w-16 text-sm px-2 py-1.5 rounded-lg text-center font-semibold focus:outline-none focus:ring-2"
                      style={{ border: '2px solid rgba(10,124,110,0.2)', background: '#f0faf8', color: '#064e44' }} />
                  </td>
                  <td className="py-3 font-bold text-gray-800">{avg}%</td>
                  <td className="py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: ls.bg, color: ls.text }}>
                      {getLetter(avg)}
                    </span>
                  </td>
                  <td className="py-3 text-xs font-bold">
                    {row.trend>0 ? <span style={{color:'#059669'}}>▲ +{row.trend}%</span> : <span style={{color:'#dc2626'}}>▼ {row.trend}%</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="flex gap-2 mt-4 pt-3" style={{ borderTop: '1px solid #f0faf8' }}>
          <button className="btn-secondary">Save draft</button>
          <button className="btn-primary">✅ Submit to admin</button>
        </div>
      </div>
    </div>
  )
}
