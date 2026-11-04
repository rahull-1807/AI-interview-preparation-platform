import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthContext } from '../features/auth/auth.context.js'
import { logout } from '../features/auth/services/auth.api.js'

export default function Sidebar({ isOpen, onClose }) {
  const { user, setUser } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [showProModal, setShowProModal] = useState(false)

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

  return (
    <>
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
            <span className="brand-name">flux</span>
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
            <span className="nav-badge">3</span>
          </Link>

          <Link
            to="/"
            className="nav-item"
            onClick={() => {
              onClose?.()
              const el = document.getElementById('plan-builder-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="nav-label">Home</span>
          </Link>

          <Link
            to="/"
            className="nav-item"
            onClick={() => {
              onClose?.()
              const el = document.getElementById('plan-builder-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </span>
            <span className="nav-label">Preparation</span>
          </Link>

          <Link
            to={isInterview ? location.pathname : '/'}
            className={`nav-item ${isInterview ? 'nav-item--active' : ''}`}
            onClick={() => {
              onClose?.()
              const el = document.getElementById('saved-plans-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <span className="nav-label">Reports</span>
            <span className="nav-badge nav-badge--lime">1</span>
          </Link>

          <button
            type="button"
            className="nav-item"
            onClick={() => {
              alert(`Logged in as ${user?.username || 'User'} (${user?.email || 'authenticated'})`)
            }}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="nav-label">Profile</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => {
              alert('AI Feedback: Your preparation cadence is optimal. Keep reviewing behavioral stories using STAR!')
            }}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="nav-label">Messages</span>
          </button>
        </nav>

        {/* Upgrade to Pro Card */}
        <div className="pro-card">
          <div className="pro-card-content">
            <h3 className="pro-card-title">Upgrade to Pro</h3>
            <p className="pro-card-sub">Upgrade your account for a fuller experience.</p>
            
            {/* 3D Rocket Graphic */}
            <div className="pro-card-illustration" aria-hidden="true">
              <div className="rocket-glow" />
              <svg className="rocket-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="98" rx="28" ry="12" fill="rgba(178, 175, 255, 0.4)" filter="blur(8px)" />
                {/* Propulsion flame */}
                <path d="M50 78L60 102L70 78Z" fill="#ff7a45" />
                <path d="M54 78L60 94L66 78Z" fill="#ffc069" />
                <path d="M57 78L60 88L63 78Z" fill="#ffffff" />
                {/* Rocket Body */}
                <path d="M60 20C48 38 46 68 46 76H74C74 68 72 38 60 20Z" fill="url(#rocketBody)" />
                {/* Nose Cone */}
                <path d="M60 20C54 28 50 36 49 42H71C70 36 66 28 60 20Z" fill="#ff4d6d" />
                {/* Window */}
                <circle cx="60" cy="50" r="7" fill="#131518" stroke="#d4f938" strokeWidth="2.5" />
                <circle cx="58" cy="48" r="2.5" fill="#ffffff" />
                {/* Wings */}
                <path d="M46 62L34 76H46V62Z" fill="#ff4d6d" />
                <path d="M74 62L86 76H74V62Z" fill="#ff4d6d" />
                {/* Particles */}
                <circle cx="36" cy="40" r="2" fill="#d4f938" />
                <circle cx="84" cy="48" r="2.5" fill="#b2afff" />
                <circle cx="88" cy="32" r="1.5" fill="#ffffff" />
                <circle cx="30" cy="85" r="3" fill="#b2afff" opacity="0.6" />
                <circle cx="92" cy="88" r="3.5" fill="#d4f938" opacity="0.7" />
                <defs>
                  <linearGradient id="rocketBody" x1="46" y1="20" x2="74" y2="76" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#845ec2" />
                    <stop offset="0.5" stopColor="#d65db1" />
                    <stop offset="1" stopColor="#ff6f91" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <button
              type="button"
              className="pro-upgrade-btn"
              onClick={() => setShowProModal(true)}
            >
              Upgrade Now
            </button>
          </div>
        </div>

        {/* User Signout footer button */}
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

      {/* Pro Modal */}
      {showProModal && (
        <div className="modal-backdrop" onClick={() => setShowProModal(false)}>
          <div className="pro-modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowProModal(false)}>✕</button>
            <div className="pro-badge">PRO MEMBERSHIP</div>
            <h2>Unlock Unlimited AI Mock Interviews</h2>
            <p>Get instant voice feedback, unlimited ATS resume compilations, and personalized FAANG question banks.</p>
            <ul className="pro-features-list">
              <li>✓ Unlimited AI Resume PDF Downloads</li>
              <li>✓ Priority Google Gemini 2.0 Evaluation</li>
              <li>✓ 1-on-1 Behavioral STAR Interview Coaching</li>
              <li>✓ Direct ATS Match Analysis</li>
            </ul>
            <button className="button primary-button" style={{ width: '100%', marginTop: '16px' }} onClick={() => setShowProModal(false)}>
              Start 7-Day Free Trial
            </button>
          </div>
        </div>
      )}
    </>
  )
}
