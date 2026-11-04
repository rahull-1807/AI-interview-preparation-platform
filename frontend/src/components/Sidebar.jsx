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
  const isTracker = location.pathname === '/applications'

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
      {/* Top Logo: InterviewLabs */}
      <div className="sidebar-brand">
        <Link to="/" className="brand-logo" onClick={onClose} title="InterviewLabs Home">
          <div className="brand-icon-box">
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 'i' Dot: Neon Lime Slanted Leaf */}
              <path d="M 28 14 C 28 8, 33 6, 40 6 L 47 6 L 41 26 L 24 26 C 24 21, 26 17, 28 14 Z" fill="#d4f938" />
              {/* 'i' Stem: Slanted White Bar */}
              <polygon points="27,33 41,33 26,88 12,88" fill="#ffffff" />
              {/* 'L' Stem: Tall Slanted White Bar */}
              <polygon points="53,6 67,6 45,88 31,88" fill="#ffffff" />
              {/* 'L' Foot: Neon Lime Base */}
              <polygon points="46,68 81,68 76,88 41,88" fill="#d4f938" />
            </svg>
          </div>
          <div className="brand-title-wrap">
            <span className="brand-name">Interview<span className="brand-accent">Labs</span></span>
            <span className="brand-tag">AI Studio</span>
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

        <Link
          to="/applications"
          className={`nav-item ${isTracker ? 'nav-item--active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </span>
          <span className="nav-label">Application Tracker</span>
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

      {/* Quick Action Engine Card */}
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
