import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthContext } from '../features/auth/auth.context.js'
import { logout } from '../features/auth/services/auth.api.js'

export default function Sidebar({ isOpen, onClose }) {
  const { user, setUser } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  async function handleSignOut() {
    setBusy(true)
    try {
      await logout()
      setUser(null)
      navigate('/login')
    } catch {
      console.error('Sign out failed')
    } finally {
      setBusy(false)
    }
  }

  const isHome = location.pathname === '/'
  const isInterview = location.pathname.startsWith('/interview')

  const scrollToSection = (id) => {
    onClose?.()
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <aside className={`app-sidebar ${isOpen ? 'app-sidebar--open' : ''}`}>
      {/* Top Logo */}
      <div className="sidebar-brand">
        <Link to="/" className="brand-logo" onClick={onClose}>
          <svg className="brand-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6C8 4.89543 8.89543 4 10 4H14V14H6C4.89543 14 4 13.1046 4 12V10C4 7.79086 5.79086 6 8 6Z" fill="#d4f938" />
            <path d="M26 8C27.1046 8 28 8.89543 28 10V14H18V6C18 4.89543 18.8954 4 20 4H22C24.2091 4 26 5.79086 26 8Z" fill="#ffffff" />
            <path d="M6 24C4.89543 24 4 23.1046 4 22V18H14V26C14 27.1046 13.1046 28 12 28H10C7.79086 28 6 26.2091 6 24Z" fill="#ffffff" />
            <path d="M24 26C24 27.1046 23.1046 28 22 28H18V18H26C27.1046 18 28 18.8954 28 20V22C28 24.2091 26.2091 26 24 26Z" fill="#d4f938" />
          </svg>
          <div className="brand-title-wrap">
            <span className="brand-name">flux</span>
            <span className="brand-tag">prep</span>
          </div>
        </Link>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">✕</button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${isHome ? 'nav-item--active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <span className="nav-label">Dashboard</span>
          <span className="nav-badge">AI</span>
        </Link>

        <button
          type="button"
          className="nav-item"
          onClick={() => scrollToSection('plan-builder-section')}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </span>
          <span className="nav-label">Create Plan</span>
        </button>

        <button
          type="button"
          className="nav-item"
          onClick={() => scrollToSection('saved-plans-section')}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          <span className="nav-label">Saved Plans</span>
        </button>

        {isInterview && (
          <div className="nav-item nav-item--active">
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <span className="nav-label">Active Plan</span>
            <span className="nav-badge nav-badge--lime">Live</span>
          </div>
        )}
      </nav>

      {/* Quick Status Info Card (Replaces the Pro subscription card) */}
      <div className="engine-card">
        <div className="engine-card-header">
          <span className="engine-pulse-dot" />
          <span className="engine-status-text">LaTeX Engine Active</span>
        </div>
        <h4 className="engine-card-title">ATS Resume Compiler</h4>
        <p className="engine-card-sub">Export vector-sharp PDF resumes compiled locally with Tectonic.</p>
        
        <button
          type="button"
          className="engine-action-btn"
          onClick={() => scrollToSection('plan-builder-section')}
        >
          + Build Interview Plan
        </button>
      </div>

      {/* User Sign Out footer */}
      {user && (
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-signout-btn"
            onClick={handleSignOut}
            disabled={busy}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>{busy ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      )}
    </aside>
  )
}
