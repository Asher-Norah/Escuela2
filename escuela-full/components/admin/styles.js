// components/admin/styles.js
// Shared inline styles used across all admin views

export const card = {
  background:'white', border:'1px solid #e0e8ff',
  borderRadius:'12px', padding:'14px 16px', marginBottom:'10px',
}

export const cardHdr = {
  display:'flex', justifyContent:'space-between',
  alignItems:'center', marginBottom:'12px',
}

export const cardTtl = {
  fontSize:'13px', fontWeight:'500', color:'#0a0f1e',
  display:'flex', alignItems:'center', gap:'6px',
}

export const cardLnk = { fontSize:'11px', color:'#1e6bff', cursor:'pointer' }

export const pill = (variant) => {
  const map = {
    g: { background:'#e1f5ee', color:'#0f6e56' },
    a: { background:'#faeeda', color:'#854f0b' },
    r: { background:'#fcebeb', color:'#a32d2d' },
    b: { background:'#e6f1fb', color:'#185fa5' },
    p: { background:'#eeedfe', color:'#534ab7' },
    c: { background:'#e0f7ff', color:'#006b8a' },
  }
  return { fontSize:'11px', padding:'2px 8px', borderRadius:'100px', ...map[variant] }
}

export const stat = (variant) => {
  const base = { borderRadius:'12px', padding:'14px', position:'relative', overflow:'hidden' }
  const map = {
    blue:   { ...base, background:'linear-gradient(135deg,#1e6bff,#4d8dff)', color:'white' },
    cyan:   { ...base, background:'linear-gradient(135deg,#0099cc,#00c9ff)', color:'white' },
    dark:   { ...base, background:'#0a0f1e', color:'white' },
    ink:    { ...base, background:'linear-gradient(135deg,#1a2744,#2d4080)', color:'white' },
    white:  { ...base, background:'white', color:'#0a0f1e', border:'1px solid #e0e8ff' },
    accent: { ...base, background:'linear-gradient(135deg,#00c9a0,#00e5b8)', color:'#003d2e' },
  }
  return map[variant] || map.white
}

export const grid = (cols, gap='10px') => ({
  display:'grid',
  gridTemplateColumns: `repeat(${cols},1fr)`,
  gap, marginBottom:'10px',
})

export const av = (bg, text) => ({
  width:'26px', height:'26px', borderRadius:'7px',
  display:'flex', alignItems:'center', justifyContent:'center',
  fontSize:'10px', fontWeight:'500', flexShrink:0,
  background:bg, color:text,
})

export const tHdr = {
  fontSize:'11px', color:'#7a8fb5', fontWeight:'500',
  textAlign:'left', padding:'0 0 8px',
  borderBottom:'1px solid #e0e8ff',
}

export const tRow = {
  borderBottom:'1px solid #f0f4ff',
  cursor:'pointer',
}

export const barRow = { display:'flex', alignItems:'center', gap:'8px', marginBottom:'7px' }
export const barTrack = { flex:1, background:'#eef2ff', borderRadius:'100px', height:'8px', overflow:'hidden' }
export const barFill = (w, color='linear-gradient(90deg,#1e6bff,#00c9ff)') => ({
  width:`${w}%`, height:'100%', borderRadius:'100px', background:color,
})

export const actionBtn = (primary=false) => ({
  background: primary ? '#0a0f1e' : '#f5f8ff',
  color: primary ? 'white' : '#7a8fb5',
  border: primary ? 'none' : '1px solid #e0e8ff',
  borderRadius:'8px', padding:'5px 12px',
  fontSize:'11px', cursor:'pointer',
})

export const API = 'http://127.0.0.1:8000'
export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : ''
export const authHeaders = () => ({ 'Authorization':`Bearer ${getToken()}`, 'Content-Type':'application/json' })
