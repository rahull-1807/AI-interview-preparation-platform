import { useContext, useState } from 'react'
import { AuthContext } from '../features/auth/auth.context.js'
import { logout } from '../features/auth/services/auth.api.js'
import { useNavigate } from 'react-router'

export default function TopBar({ onToggleSidebar, searchQuery = '', onSearchChange }) {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState('Today')
  const [filterDropdown, setFilterDropdown] = useState(false)

  const displayName = user?.username || 'Lucas Bennett'
  const displayEmail = user?.email || 'bennet02@gmail.com'

  // Format today's date like "12 July, 2024"
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
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
            <span>Welcome Guest</span>
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
            placeholder="Search..."
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            aria-label="Search dashboard"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="notification-pill"
          aria-label="Notifications"
          onClick={() => alert('You have 2 new interview questions ready to review!')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notification-badge">2</span>
        </button>

        {/* Date Display */}
        <span className="date-display">{formattedDate}</span>

        {/* Dropdown Pill ("Today ∨") */}
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
              {['Today', 'This Week', 'This Month', 'All Time'].map(p => (
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
