'use client'

export default function AdminTopbar({ title, subtitle }) {
  return (
    <header style={{ background:'white', borderBottom:'1px solid #e0e8ff', padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ width:'3px', height:'28px', borderRadius:'100px', background:'linear-gradient(180deg,#1e6bff,#00c9ff)' }} />
        <div>
          <h1 style={{ fontSize:'14px', fontWeight:'500', color:'#0a0f1e', margin:0 }}>{title}</h1>
          <p style={{ fontSize:'11px', color:'#7a8fb5', margin:0, marginTop:'2px' }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        <div style={{ fontSize:'11px', background:'#eef2ff', color:'#1e6bff', padding:'4px 10px', borderRadius:'100px', border:'1px solid #c7d4ff' }}>
          247 students online
        </div>
        <button style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#f5f7ff', border:'1px solid #e0e8ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#7a8fb5', fontSize:'15px', cursor:'pointer' }}>
          <i className="ti ti-bell" aria-hidden="true" />
        </button>
        <button style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#f5f7ff', border:'1px solid #e0e8ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#7a8fb5', fontSize:'15px', cursor:'pointer' }}>
          <i className="ti ti-settings" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
