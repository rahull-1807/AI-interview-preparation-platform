import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthContext } from '../features/auth/auth.context.js'
import { logout } from '../features/auth/services/auth.api.js'

export default function Header() {
  const { user, setUser } = useContext(AuthContext)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function signOut() {
    setBusy(true)
    try { await logout(); setUser(null); navigate('/login') }
    catch { setError('Could not sign out. Please try again.') }
    finally { setBusy(false) }
  }
  return <>
    <header className="site-header">
      <Link className="brand" to="/"><span className="brand-mark" aria-hidden="true">i<span>↗</span></span>interview<span className="brand-light">lab</span><span className="brand-dot">.</span></Link>
      <nav aria-label="Main navigation">
        {user ? <><Link className="nav-link" to="/">Workspace</Link><span className="user-avatar" title={user.username}>{user.username?.slice(0, 1).toUpperCase()}</span><button className="text-button" onClick={signOut} disabled={busy}>{busy ? 'Signing out…' : 'Sign out'}</button></> : <><span className="header-note">A little preparation. A lot more confidence.</span><Link className="nav-link" to="/register">Get started ↗</Link></>}
      </nav>
    </header>
    {error && <p role="alert" className="notice">{error}</p>}
  </>
}
