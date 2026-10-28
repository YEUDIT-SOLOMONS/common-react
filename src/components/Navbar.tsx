import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-pill nav-pill-active' : 'nav-pill')

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/items" className="brand" aria-label="common">
          <img src="/favicon.svg" alt="" className="brand-icon" />
          <img src="/wordmark.svg" alt="COMMON" className="brand-wordmark" />
        </Link>
        {user && (
          <>
            <nav className="nav-links">
              <NavLink to="/items" end className={navClass}>
                כל הציוד
              </NavLink>
              <NavLink to="/my-items" className={navClass}>
                הציוד שלי
              </NavLink>
              <NavLink to="/items/new" className={navClass}>
                הוספת פריט
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navClass}>
                  ניהול
                </NavLink>
              )}
            </nav>
            <div className="navbar-user">
              <span className="navbar-name">{user.name}</span>
              {isAdmin && <span className="badge badge-admin">מנהלת</span>}
              <button type="button" className="btn btn-ghost btn-small" onClick={handleLogout}>
                יציאה
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
