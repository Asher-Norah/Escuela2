import './globals.css'

export const metadata = {
  title: 'ESCUELA — School Management System',
  description: 'Modern school management for Kenyan schools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
