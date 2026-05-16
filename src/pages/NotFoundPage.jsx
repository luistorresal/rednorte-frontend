import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page-card">
      <h2>404 - Ruta no encontrada</h2>
      <p>La página que buscas no existe.</p>
      <Link to="/app/dashboard">Ir al dashboard</Link>
    </section>
  )
}
