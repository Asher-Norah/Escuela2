'use client'

/*
  app/login/page.js
  ------------------
  ESCUELA Login Page.

  - Background: CSS recreation of the teal gradient with floating circles
  - Logo: CSS recreation of the ESCUELA brand
  - Form: email + password → POST /api/auth/login
  - On success: saves token to localStorage, redirects to /teacher
  - No sign up link — teachers are added by admin only
*/

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPass, setShowPass] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleLogin(e) {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      /*
        POST to FastAPI backend.
        When deployed, replace localhost:8000 with your Render backend URL.
        e.g. https://escuela-api.onrender.com/api/auth/login
      */
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        // FastAPI returns { "detail": "Invalid email or password" } on failure
        setError(data.detail || 'Login failed. Please try again.')
        setLoading(false)
        return
      }

      /*
        Save the token and teacher info to localStorage.
        The dashboard pages will read this on load.
        Later we can upgrade to httpOnly cookies for better security.
      */
      localStorage.setItem('token',   data.access_token)
      localStorage.setItem('teacher', JSON.stringify(data.teacher))

      // Redirect to teacher dashboard
      const role = data.role
if (role === 'admin') {
    router.push('/admin')
} else {
    router.push('/teacher')
}

    } catch (err) {
      setError('Could not connect to the server. Please try again.')
      setLoading(false)
    }
  }

  return (
    /*
      Full screen container with the CSS background.
      Recreates the teal gradient + floating circles from the Pinterest image.
    */
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #00c9a7 0%, #00b4d8 50%, #0096c7 100%)',
    }}>

      {/* ── DECORATIVE CIRCLES (recreating the Pinterest background) ── */}

      {/* Large circle top right — filled blue */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '220px', height: '220px', borderRadius: '50%',
        background: 'rgba(0, 150, 199, 0.5)',
      }} />

      {/* Large circle outline top right */}
      <div style={{
        position: 'absolute', top: '-30px', right: '80px',
        width: '180px', height: '180px', borderRadius: '50%',
        border: '3px solid #FFE535',
        background: 'transparent',
      }} />

      {/* Small filled circle top left */}
      <div style={{
        position: 'absolute', top: '60px', left: '80px',
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'rgba(0, 100, 180, 0.7)',
      }} />

      {/* Medium circle outline top left */}
      <div style={{
        position: 'absolute', top: '20px', left: '30px',
        width: '140px', height: '140px', borderRadius: '50%',
        border: '3px solid #FFE535',
        background: 'transparent',
      }} />

      {/* Large filled circle bottom left */}
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '260px', height: '260px', borderRadius: '50%',
        background: 'rgba(0, 100, 180, 0.6)',
      }} />

      {/* Circle outline bottom left */}
      <div style={{
        position: 'absolute', bottom: '40px', left: '80px',
        width: '120px', height: '120px', borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.4)',
        background: 'transparent',
      }} />

      {/* Small yellow circle bottom center */}
      <div style={{
        position: 'absolute', bottom: '60px', left: '45%',
        width: '28px', height: '28px', borderRadius: '50%',
        border: '3px solid #FFE535',
        background: 'transparent',
      }} />

      {/* Dotted pattern overlay — subtle dots like in the original */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
      }} />

      {/* ── WHITE WAVE at bottom ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '80px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '100% 100% 0 0',
      }} />

      {/* ── LOGIN CARD ── */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '650px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* ── LOGO ── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>

          {/* Logo circle with graduation cap */}
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #00c9a7, #0096c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(0,150,199,0.35)',
          }}>
            🎓
          </div>

          {/* ESCUELA text */}
          <h1 style={{
            fontSize: '28px', fontWeight: '800',
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #0a7c6e, #0096c7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 4px',
          }}>
            ESCUELA
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            School Management System
          </p>
        </div>

        {/* ── WELCOME TEXT ── */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px' }}>
            Welcome back 👋
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Sign in with your school credentials
          </p>
        </div>

        {/* ── ERROR MESSAGE ── */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: '12px', padding: '10px 14px',
            marginBottom: '16px', fontSize: '13px',
            color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── FORM ── */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: '600',
              color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
            }}>
              Email address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. otieno@greenfield.ac.ke"
              style={{
                width: '100%', padding: '12px 14px',
                borderRadius: '12px', fontSize: '14px',
                border: '1.5px solid #e5e7eb',
                background: '#f9fffe', color: '#1f2937',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#0a7c6e'}
              onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: '600',
              color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '12px 44px 12px 14px',
                  borderRadius: '12px', fontSize: '14px',
                  border: '1.5px solid #e5e7eb',
                  background: '#f9fffe', color: '#1f2937',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#0a7c6e'}
                onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
              />
              {/* Show/hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: '16px', color: '#9ca3af',
                }}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              borderRadius: '12px', border: 'none',
              background: loading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #0a7c6e, #0096c7)',
              color: 'white', fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(10,124,110,0.35)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              marginTop: '4px',
            }}>
            {loading ? (
              <>
                <span style={{
                  width: '16px', height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              'Sign in →'
            )}
          </button>

        </form>

        {/* ── FOOTER NOTE ── */}
        <div style={{
          marginTop: '20px', paddingTop: '16px',
          borderTop: '1px solid #f3f4f6',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
            Don't have an account?{' '}
            <span style={{ color: '#0a7c6e', fontWeight: '600' }}>
              Contact your school admin
            </span>
          </p>
        </div>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
