'use client'

const NAV = [
  { section: 'Overview',    items: [
    { id:'overview',    label:'Dashboard',    icon:'ti-layout-dashboard' },
  ]},
  { section: 'Management',  items: [
    { id:'students',    label:'Students',     icon:'ti-users'            },
    { id:'staff',       label:'Staff',        icon:'ti-school'           },
  ]},
  { section: 'Academic',    items: [
    { id:'attendance',  label:'Attendance',   icon:'ti-calendar-check'  },
    { id:'performance', label:'Performance',  icon:'ti-chart-bar'       },
  ]},
  { section: 'Operations',  items: [
    { id:'fees',        label:'Fees',         icon:'ti-cash'            },
    { id:'roster',      label:'Duty Roster',  icon:'ti-clipboard-list'  },
    { id:'broadcast',   label:'Broadcast',    icon:'ti-speakerphone', badge:3 },
  ]},
]

const S = {
  sidebar:  { width:'210px', flexShrink:0, background:'#0a0f1e', display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' },
  logoArea: { padding:'16px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'10px' },
  logoIcon: { width:'34px', height:'34px', background:'linear-gradient(135deg,#1e6bff,#00c9ff)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 },
  logoText: { color:'white', fontSize:'13px', fontWeight:'500', letterSpacing:'0.12em' },
  logoSub:  { color:'rgba(255,255,255,0.35)', fontSize:'10px', marginTop:'1px' },
  nav:      { flex:1, overflowY:'auto', padding:'6px 0' },
  section:  { fontSize:'9px', fontWeight:'500', color:'rgba(255,255,255,0.25)', padding:'12px 14px 4px', letterSpacing:'0.12em', textTransform:'uppercase' },
  badge:    { marginLeft:'auto', background:'#e24b4a', color:'white', fontSize:'9px', padding:'1px 5px', borderRadius:'100px' },
  footer:   { padding:'10px 14px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px' },
  av:       { width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#1e6bff,#00c9ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'500', color:'white', flexShrink:0 },
  online:   { width:'7px', height:'7px', borderRadius:'50%', background:'#00e5a0', marginLeft:'auto', boxShadow:'0 0 6px #00e5a0' },
}

export default function AdminSidebar({ activeView, onNavigate, admin }) {
  return (
    <aside style={S.sidebar}>
      <div style={S.logoArea}>
        <div style={S.logoIcon}>🎓</div>
        <div>
          <div style={S.logoText}>ESCUELA</div>
          <div style={S.logoSub}>Admin Console</div>
        </div>
      </div>

      <nav style={S.nav}>
        {NAV.map(group => (
          <div key={group.section}>
            <div style={S.section}>{group.section}</div>
            {group.items.map(item => {
              const active = activeView === item.id
              return (
                <button key={item.id} onClick={() => onNavigate(item.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:'9px',
                    padding:'8px 14px', cursor:'pointer', fontSize:'12px',
                    borderRadius:'8px', margin:'1px 6px', width:'calc(100% - 12px)',
                    border:'none', textAlign:'left', transition:'all 0.12s',
                    background: active ? 'linear-gradient(135deg,rgba(30,107,255,0.25),rgba(0,201,255,0.12))' : 'transparent',
                    color: active ? '#00c9ff' : 'rgba(255,255,255,0.5)',
                    fontWeight: active ? '500' : '400',
                  }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize:'15px' }} aria-hidden="true" />
                  <span style={{ flex:1 }}>{item.label}</span>
                  {item.badge && <span style={S.badge}>{item.badge}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div style={S.footer}>
        <div style={S.av}>{admin?.name?.split(' ').map(w=>w[0]).join('').slice(0,2) || 'GK'}</div>
        <div>
          <div style={{ color:'white', fontSize:'11px', fontWeight:'500' }}>{admin?.name || 'Admin'}</div>
          <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px' }}>Principal</div>
        </div>
        <div style={S.online} />
      </div>
    </aside>
  )
}
