'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar  from '@/components/Topbar'
import ProfileView      from '@/components/views/ProfileView'
import ClassesView      from '@/components/views/ClassesView'
import TimetableView    from '@/components/views/TimetableView'
import AttendanceView   from '@/components/views/AttendanceView'
import GradebookView    from '@/components/views/GradebookView'
import AssignmentsView  from '@/components/views/AssignmentsView'
import RecordOfWorkView from '@/components/views/RecordOfWorkView'
import DutyRosterView   from '@/components/views/DutyRosterView'
import MessagesView     from '@/components/views/MessagesView'
import { teacherProfile } from '@/data/mockData'

const VIEWS = {
  profile:     { title: 'My Profile',               component: ProfileView      },
  classes:     { title: 'My Classes',               component: ClassesView      },
  timetable:   { title: 'Timetable & Lesson Plans', component: TimetableView    },
  attendance:  { title: 'Attendance Register',      component: AttendanceView   },
  gradebook:   { title: 'Gradebook & CATs',         component: GradebookView    },
  assignments: { title: 'Assignments',               component: AssignmentsView  },
  row:         { title: 'Record of Work',           component: RecordOfWorkView },
  roster:      { title: 'Duty Roster',              component: DutyRosterView   },
  messages:    { title: 'Messages',                  component: MessagesView     },
}

export default function TeacherDashboard() {
  const [activeView, setActiveView] = useState('profile')
  const current = VIEWS[activeView] || VIEWS.profile
  const ViewComponent = current.component

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0faf8' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} teacher={teacherProfile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title={current.title}
          subtitle="Tuesday, 27 May 2025 · Greenfield Academy"
          unreadCount={3}
        />
        <main className="flex-1 overflow-y-auto p-5">
          <ViewComponent onNavigate={setActiveView} />
        </main>
      </div>
    </div>
  )
}
