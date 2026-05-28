import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect root URL to login page.
  // After login, the user is redirected to /teacher.
  redirect('/login')
}
