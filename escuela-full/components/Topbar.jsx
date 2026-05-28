'use client'

export default function Topbar({ title, subtitle, unreadCount = 0 }) {
  return (
    <header className="bg-white px-5 py-3 flex items-center justify-between flex-shrink-0"
      style={{ borderBottom: '2px solid #f0faf8', boxShadow: '0 2px 8px rgba(10,124,110,0.06)' }}>

      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full"
          style={{ background: 'linear-gradient(180deg, #0a7c6e, #FFE535)' }} />
        <div>
          <h1 className="font-semibold text-gray-800 text-base">{title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400"
          style={{ background: '#f0faf8', border: '1px solid rgba(10,124,110,0.1)' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Search</span>
        </div>

        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: '#f0faf8', border: '1px solid rgba(10,124,110,0.1)' }}>
          <svg width="16" height="16" fill="none" stroke="#0a7c6e" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold animate-pulse-soft"
              style={{ background: '#dc2626', fontSize: '9px' }}>
              {unreadCount}
            </span>
          )}
        </button>

        <div className="px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: 'linear-gradient(135deg, #0a7c6e, #0db89f)', color: 'white' }}>
          Term 2 · 2025
        </div>
      </div>
    </header>
  )
}
