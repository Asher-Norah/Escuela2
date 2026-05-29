'use client'

import { useState } from 'react'
import { card, cardHdr, cardTtl, API, authHeaders } from '../styles'

const RECIPIENTS = [
  { key:'send_to_teachers', label:'All teachers' },
  { key:'send_to_parents',  label:'All parents'  },
  { key:'send_to_students', label:'All students' },
]

const CHANNELS = [
  { key:'send_sms',   label:'SMS'       },
  { key:'send_email', label:'Email'     },
]

const QUICK = [
  { label:'Emergency alert', icon:'ti-alert-triangle', color:'#ffe0e0', iconColor:'#a32d2d', msg:'URGENT: This is an emergency alert from Greenfield Academy.' },
  { label:'Fee reminder',    icon:'ti-cash',            color:'#fff3e0', iconColor:'#ba7517', msg:'Dear parent, this is a reminder that school fees are due. Please make payment at your earliest convenience.' },
  { label:'Event notice',    icon:'ti-calendar',        color:'#e0f7ff', iconColor:'#006b8a', msg:'Dear parent/student, please be informed of an upcoming school event.' },
  { label:'Results out',     icon:'ti-file-certificate',color:'#e0fff5', iconColor:'#0a7c6e', msg:'Dear parent, your child\'s examination results are now available. Please visit the school to collect the report form.' },
]

export default function BroadcastView() {
  const [subject, setSubject]   = useState('')
  const [message, setMessage]   = useState('')
  const [recipients, setRecipients] = useState({ send_to_teachers:false, send_to_parents:false, send_to_students:false })
  const [channels, setChannels] = useState({ send_sms:false, send_email:false })
  const [sending, setSending]   = useState(false)
  const [toast, setToast]       = useState(null)

  const history = [
    { color:'#1e6bff', text:'Sports Day reminder — all parents · 1,204 delivered',  time:'Yesterday' },
    { color:'#7c3aed', text:'Fee deadline notice — Form 4 parents · 278 delivered', time:'Mon'       },
    { color:'#00c9a0', text:'Staff meeting — all teachers · 48 delivered',          time:'Fri'       },
    { color:'#ba7517', text:'Mid-term results — all parents · 1,196 delivered',     time:'2 wks ago' },
  ]

  function showToast(msg, type='success') { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  function toggleR(key) { setRecipients(p => ({...p, [key]:!p[key]})) }
  function toggleC(key) { setChannels(p => ({...p, [key]:!p[key]})) }

  async function handleSend() {
    if (!message.trim()) { showToast('⚠️ Please write a message', 'warning'); return }
    if (!Object.values(recipients).some(Boolean)) { showToast('⚠️ Select at least one recipient group', 'warning'); return }
    setSending(true)
    try {
      const res = await fetch(`${API}/api/admin/communication/broadcast`, {
        method:'POST', headers: authHeaders(),
        body: JSON.stringify({ subject, message, ...recipients, ...channels })
      })
      const data = await res.json()
      showToast(`✅ Broadcast sent to ${data.total_recipients} recipients!`)
      setSubject(''); setMessage('')
      setRecipients({ send_to_teachers:false, send_to_parents:false, send_to_students:false })
    } catch { showToast('Failed to send broadcast', 'warning') }
    finally { setSending(false) }
  }

  const totalRecipients = [
    recipients.send_to_teachers ? 48   : 0,
    recipients.send_to_parents  ? 1204 : 0,
    recipients.send_to_students ? 1204 : 0,
  ].reduce((a,b) => a+b, 0)

  const inp = { width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #e0e8ff', background:'#f8fbff', fontSize:'12px', color:'#0a0f1e', boxSizing:'border-box', fontFamily:'var(--font-sans)' }

  return (
    <div>
      {toast && (
        <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:50, padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:'500', color:'white', background: toast.type==='success' ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#d97706,#fbbf24)' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
        {/* Compose */}
        <div style={card}>
          <div style={cardHdr}><div style={cardTtl}><i className="ti ti-speakerphone" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Compose broadcast</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <div>
              <div style={{ fontSize:'10px', fontWeight:'500', color:'#7a8fb5', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>Subject</div>
              <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. End-term exam schedule" style={inp} />
            </div>
            <div>
              <div style={{ fontSize:'10px', fontWeight:'500', color:'#7a8fb5', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>Send to</div>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {RECIPIENTS.map(r => (
                  <button key={r.key} onClick={() => toggleR(r.key)}
                    style={{ fontSize:'11px', padding:'5px 12px', borderRadius:'100px', border:`1px solid ${recipients[r.key] ? '#1e6bff' : '#e0e8ff'}`, background: recipients[r.key] ? '#1e6bff' : '#f5f8ff', color: recipients[r.key] ? 'white' : '#7a8fb5', cursor:'pointer' }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'10px', fontWeight:'500', color:'#7a8fb5', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>Channel</div>
              <div style={{ display:'flex', gap:'6px' }}>
                {CHANNELS.map(c => (
                  <button key={c.key} onClick={() => toggleC(c.key)}
                    style={{ fontSize:'11px', padding:'5px 12px', borderRadius:'100px', border:`1px solid ${channels[c.key] ? '#1e6bff' : '#e0e8ff'}`, background: channels[c.key] ? '#1e6bff' : '#f5f8ff', color: channels[c.key] ? 'white' : '#7a8fb5', cursor:'pointer' }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'10px', fontWeight:'500', color:'#7a8fb5', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>Message</div>
              <textarea value={message} onChange={e=>setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={5} style={{ ...inp, resize:'none' }} />
            </div>
            <button onClick={handleSend} disabled={sending}
              style={{ background: sending ? '#7a8fb5' : '#0a0f1e', color:'white', border:'none', borderRadius:'9px', padding:'10px', fontSize:'12px', fontWeight:'500', cursor: sending ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              <i className="ti ti-send" aria-hidden="true" />
              {sending ? 'Sending...' : `Send to ${totalRecipients.toLocaleString()} recipients`}
            </button>
          </div>
        </div>

        <div>
          {/* History */}
          <div style={{ ...card, marginBottom:'10px' }}>
            <div style={cardHdr}><div style={cardTtl}><i className="ti ti-history" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Recent broadcasts</div></div>
            {history.map((h,i) => (
              <div key={i} style={{ display:'flex', gap:'8px', alignItems:'flex-start', padding:'7px 0', borderBottom: i < history.length-1 ? '1px solid #f0f4ff' : 'none' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', marginTop:'4px', flexShrink:0, background:h.color }} />
                <div style={{ fontSize:'12px', color:'#1a2744', lineHeight:1.4, flex:1 }}>{h.text}</div>
                <div style={{ fontSize:'10px', color:'#7a8fb5', flexShrink:0 }}>{h.time}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={card}>
            <div style={cardHdr}><div style={cardTtl}><i className="ti ti-bolt" style={{fontSize:'15px',color:'#7a8fb5'}} aria-hidden="true" />Quick actions</div></div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'8px' }}>
              {QUICK.map((q,i) => (
                <button key={i} onClick={() => setMessage(q.msg)}
                  style={{ background:'#f5f8ff', border:'1px solid #e0e8ff', borderRadius:'10px', padding:'10px 8px', textAlign:'center', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:q.color, color:q.iconColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>
                    <i className={`ti ${q.icon}`} aria-hidden="true" />
                  </div>
                  <div style={{ fontSize:'11px', fontWeight:'500', color:'#1a2744' }}>{q.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
