'use client'
import { messages } from '@/data/mockData'

const avColors = [
  {bg:'#e6faf7',text:'#064e44'},{bg:'#f3f0ff',text:'#3b0764'},{bg:'#fffbeb',text:'#451a03'},
]

export default function MessagesView() {
  return (
    <div className="animate-fade-up">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">💬 Messages from parents</h3>
          <button className="btn-primary text-xs py-1.5 px-3">+ New message</button>
        </div>
        <div className="flex flex-col gap-2">
          {messages.map((msg, i) => {
            const av = avColors[i % avColors.length]
            return (
              <div key={msg.id} className="flex gap-3 items-start p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background: msg.unread ? '#f0faf8' : '#fafafa', border: msg.unread ? '1px solid rgba(10,124,110,0.2)' : '1px solid #f3f4f6' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: av.bg, color: av.text }}>{msg.initials}</div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-800">{msg.senderName}</p>
                    <span className="text-xs text-gray-400">· {msg.re}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed truncate">{msg.preview}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{msg.time}</span>
                  {msg.unread && <span className="w-2.5 h-2.5 rounded-full animate-pulse-soft" style={{ background: '#0a7c6e' }} />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
