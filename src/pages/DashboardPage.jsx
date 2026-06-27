import { useEffect, useMemo, useState } from 'react'
import { citasService } from '../services/citasService'
import { pacientesService } from '../services/pacientesService'
import { profesionalesService } from '../services/profesionalesService'

const INITIAL_SUMMARY = {
  pacientes: [],
  profesionales: [],
  citas: [],
  sources: new Set(),
}

export function DashboardPage() {
  const [summary, setSummary] = useState(INITIAL_SUMMARY)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const stats = useMemo(() => {
    const citasPendientes = summary.citas.filter(
      (cita) => cita.estado === 'PENDIENTE',
    ).length
    const citasConfirmadas = summary.citas.filter(
      (cita) => cita.estado === 'CONFIRMADA',
    ).length

    return [
      {
        label: 'Pacientes registrados',
        value: summary.pacientes.length,
        detail: 'Personas disponibles para agendar atenciones.',
      },
      {
        label: 'Profesionales activos',
        value: summary.profesionales.length,
        detail: 'Especialistas registrados en la red.',
      },
      {
        label: 'Citas totales',
        value: summary.citas.length,
        detail: `${citasPendientes} pendientes / ${citasConfirmadas} confirmadas`,
      },
    ]
  }, [summary])

  const sourceLabel = summary.sources.has('mock')
    ? 'Mostrando datos de demostración.'
    : 'Información actualizada.'

  const loadDashboard = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const [pacientesResponse, profesionalesResponse, citasResponse] =
        await Promise.all([
          pacientesService.listar(),
          profesionalesService.listar(),
          citasService.listar(),
        ])

      setSummary({
        pacientes: pacientesResponse.data,
        profesionales: profesionalesResponse.data,
        citas: citasResponse.data,
        sources: new Set([
          pacientesResponse.source,
          profesionalesResponse.source,
          citasResponse.source,
        ]),
      })
    } catch {
      setErrorMessage('No se pudo cargar el resumen. Inténtalo nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return (
    <section className="dashboard-layout">
      <article className="page-card page-card--wide">
        <div className="page-card__header">
          <div>
            <h2>Dashboard</h2>
            <p className="page-card__hint">
              Vista principal para monitorear pacientes, profesionales y citas.
            </p>
          </div>
          <button onClick={loadDashboard} type="button">
            Recargar
          </button>
        </div>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        {isLoading ? (
          <p className="state-message">Cargando resumen...</p>
        ) : (
          <>
            <p className="page-card__hint">{sourceLabel}</p>
            <div className="stats-grid">
              {stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <span className="stat-card__label">{stat.label}</span>
                  <strong className="stat-card__value">{stat.value}</strong>
                  <p>{stat.detail}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </article>
    </section>
  )
}
