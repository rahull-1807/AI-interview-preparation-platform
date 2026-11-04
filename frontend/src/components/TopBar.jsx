import { useContext, useState } from 'react'
import { AuthContext } from '../features/auth/auth.context.js'
import { logout } from '../features/auth/services/auth.api.js'
import { useNavigate } from 'react-router'

export default function TopBar({ onToggleSidebar, searchQuery = '', onSearchChange }) {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState('All Roles')
  const [filterDropdown, setFilterDropdown] = useState(false)

  const displayName = user?.username || 'Interview Candidate'
  const displayEmail = user?.email || 'authenticated user'

  // Format today's date like "5 November, 2026"
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date())

  async function handleLogout() {
    try {
      await logout()
      setUser(null)
      navigate('/login')
    } catch {
      console.error('Logout failed')
    }
  }

  return (
    <header className="dashboard-topbar">
      {/* Left: Mobile Toggle & User Profile */}
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {user ? (
          <div className="user-profile-capsule" onClick={() => setDropdownOpen(o => !o)}>
            <div className="avatar-wrapper">
              <span className="avatar-text">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="user-meta">
              <span className="user-name">{displayName}</span>
              <span className="user-email">{displayEmail}</span>
            </div>
            <span className={`dropdown-chevron ${dropdownOpen ? 'dropdown-chevron--open' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>

            {dropdownOpen && (
              <div className="profile-dropdown-menu" onClick={e => e.stopPropagation()}>
                <div className="dropdown-user-info">
                  <strong>{displayName}</strong>
                  <small>{displayEmail}</small>
                </div>
                <hr />
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false)
                    navigate('/')
                  }}
                >
                  Dashboard Home
                </button>
                <button
                  type="button"
                  className="dropdown-item dropdown-item--danger"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="guest-badge">
            <img src="/interviewlabs-logo.png" alt="InterviewLabs" style={{ height: '26px', width: 'auto' }} />
          </div>
        )}
      </div>

      {/* Right: Search, Notifications, Date & Filter */}
      <div className="topbar-right">
        {/* Search input pill */}
        <div className="search-pill">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search interview plans…"
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            aria-label="Search dashboard"
          />
        </div>

        {/* Notification Bell */}
        <div className="notif-wrapper" style={{ position: 'relative' }}>
          <button
            type="button"
            className="notification-pill"
            aria-label="Notifications"
            onClick={() => setNotifOpen(o => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge">AI</span>
          </button>

          {notifOpen && (
            <div className="notif-dropdown-menu">
              <div className="notif-header">
                <strong>AI Interview Updates</strong>
              </div>
              <ul className="notif-list">
                <li>
                  <span className="notif-dot" />
                  <div>
                    <p><strong>Gemini 2.0 Ready:</strong> Prompt models loaded for instant gap evaluations.</p>
                    <small>Today</small>
                  </div>
                </li>
                <li>
                  <span className="notif-dot notif-dot--lime" />
                  <div>
                    <p><strong>LaTeX Compiler:</strong> Tectonic typesetting engine ready for resume exports.</p>
                    <small>Active</small>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Date Display */}
        <span className="date-display">{formattedDate}</span>

        {/* Filter Period Pill */}
        <div className="period-pill-wrapper">
          <button
            type="button"
            className="period-pill"
            onClick={() => setFilterDropdown(o => !o)}
          >
            <span>{filterPeriod}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {filterDropdown && (
            <div className="period-dropdown-menu">
              {['All Roles', 'Recent Month', 'Saved Plans'].map(p => (
                <button
                  key={p}
                  type="button"
                  className={`period-item ${filterPeriod === p ? 'period-item--active' : ''}`}
                  onClick={() => {
                    setFilterPeriod(p)
                    setFilterDropdown(false)
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
