'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar  from '@/components/admin/AdminTopbar'
import OverviewView         from '@/components/admin/views/OverviewView'
import StudentsView         from '@/components/admin/views/StudentsView'
import StaffView            from '@/components/admin/views/StaffView'
import AttendanceReportView from '@/components/admin/views/AttendanceReportView'
import PerformanceView      from '@/components/admin/views/PerformanceView'
import FeesView             from '@/components/admin/views/FeesView'
import DutyRosterView       from '@/components/admin/views/DutyRosterView'
import BroadcastView        from '@/components/admin/views/BroadcastView'

const VIEWS = {
  overview:    { title: 'Dashboard',                 component: OverviewView         },
  students:    { title: 'Students',                  component: StudentsView         },
  staff:       { title: 'Staff Management',          component: StaffView            },
  attendance:  { title: 'Attendance Reports',        component: AttendanceReportView },
  performance: { title: 'Academic Performance',      component: PerformanceView      },
  fees:        { title: 'Fee Management',            component: FeesView             },
  roster:      { title: 'Duty Roster',               component: DutyRosterView       },
  broadcast:   { title: 'Broadcast & Communication', component: BroadcastView        },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeView, setActiveView] = useState('overview')
  const [admin, setAdmin]           = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const token   = localStorage.getItem('token')
    const teacher = JSON.parse(localStorage.getItem('teacher') || '{}')
    if (!token)                    { router.push('/login');   return }
    if (teacher.role !== 'admin')  { router.push('/teacher'); return }
    setAdmin(teacher)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4ff' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'40px', height:'40px', border:'3px solid #1e6bff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
          <p style={{ color:'#7a8fb5', fontSize:'14px' }}>Loading admin dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) }}`}</style>
      </div>
    )
  }

  const current       = VIEWS[activeView] || VIEWS.overview
  const ViewComponent = current.component

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#f0f4ff', fontFamily:'var(--font-sans)' }}>
      <AdminSidebar activeView={activeView} onNavigate={setActiveView} admin={admin} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <AdminTopbar title={current.title} subtitle="Greenfield Academy · Admin Console" />
        <main style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
          <ViewComponent />
        </main>
      </div>
    </div>
  )
}
