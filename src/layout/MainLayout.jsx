import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const getNavLinkClass = ({ isActive }) =>
  isActive ? 'main-nav__link main-nav__link--active' : 'main-nav__link'

export function MainLayout() {
  const { logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>RedNorte - Gestión Hospitalaria</h1>
        <button className="logout-button" onClick={logout} type="button">
          Cerrar sesión
        </button>
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
