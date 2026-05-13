import { NavLink, Outlet } from 'react-router-dom'

const getNavLinkClass = ({ isActive }) =>
  isActive ? 'main-nav__link main-nav__link--active' : 'main-nav__link'

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>RedNorte - Gestion Hospitalaria</h1>
      </header>

      <nav className="main-nav">
        <NavLink className={getNavLinkClass} to="/app/dashboard">
          Dashboard
        </NavLink>
        <NavLink className={getNavLinkClass} to="/app/pacientes">
          Pacientes
        </NavLink>
        <NavLink className={getNavLinkClass} to="/app/profesionales">
          Profesionales
        </NavLink>
        <NavLink className={getNavLinkClass} to="/app/citas">
          Citas
        </NavLink>
      </nav>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
