import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">Personal Finance Tagging System</span>
        <nav className="app-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            History
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
