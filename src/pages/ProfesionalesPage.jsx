import { useEffect, useMemo, useState } from 'react'
import { profesionalesService } from '../services/profesionalesService'

const EMPTY_FORM = {
  rut: '',
  nombres: '',
  apellidos: '',
  especialidad: '',
  email: '',
  telefono: '',
}

const normalizeProfesionalPayload = (values) => ({
  rut: values.rut.trim().toUpperCase(),
  nombres: values.nombres.trim().toUpperCase(),
  apellidos: values.apellidos.trim().toUpperCase(),
  especialidad: values.especialidad.trim().toUpperCase(),
  email: values.email.trim().toUpperCase(),
  telefono: values.telefono.trim().toUpperCase(),
})

export function ProfesionalesPage() {
  const [profesionales, setProfesionales] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [sourceMode, setSourceMode] = useState('api')
  const [formValues, setFormValues] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const formTitle = useMemo(
    () => (editingId ? 'Editar profesional' : 'Nuevo profesional'),
    [editingId],
  )

  const loadProfesionales = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data, source } = await profesionalesService.listar()
      setProfesionales(data)
      setSourceMode(source)
    } catch {
      setErrorMessage('No se pudo cargar los profesionales. Inténtalo nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfesionales()
  }, [])

  const resetForm = () => {
    setFormValues(EMPTY_FORM)
    setEditingId(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }))
  }

  const handleEdit = (profesional) => {
    setFormValues({
      rut: profesional.rut || '',
      nombres: profesional.nombres || '',
      apellidos: profesional.apellidos || '',
      especialidad: profesional.especialidad || '',
      email: profesional.email || '',
      telefono: profesional.telefono || '',
    })
    setEditingId(profesional.id)
  }

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      'Esta acción eliminará el profesional. ¿Deseas continuar?',
    )
    if (!confirmation) return

    try {
      await profesionalesService.eliminar(id)
      await loadProfesionales()
      if (editingId === id) {
        resetForm()
      }
    } catch {
      setErrorMessage('No se pudo eliminar el profesional. Inténtalo nuevamente.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    try {
      const payload = normalizeProfesionalPayload(formValues)
      if (editingId) {
        await profesionalesService.actualizar(editingId, payload)
      } else {
        await profesionalesService.crear(payload)
      }
      await loadProfesionales()
      resetForm()
    } catch {
      setErrorMessage('No se pudo guardar el profesional. Revisá los datos e inténtalo nuevamente.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="module-grid">
      <article className="page-card">
        <div className="page-card__header">
          <h2>Profesionales</h2>
          <button onClick={loadProfesionales} type="button">
            Recargar
          </button>
        </div>

        <p className="page-card__hint">
          {sourceMode === 'mock'
            ? 'Mostrando datos de ejemplo.'
            : 'Información actualizada.'}
        </p>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        {isLoading ? (
          <p className="state-message">Cargando profesionales...</p>
        ) : profesionales.length === 0 ? (
          <p className="state-message">No hay profesionales registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>RUT</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Especialidad</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesionales.map((profesional) => (
                  <tr key={profesional.id}>
                    <td>{profesional.id}</td>
                    <td>{profesional.rut}</td>
                    <td>{profesional.nombres}</td>
                    <td>{profesional.apellidos}</td>
                    <td>{profesional.especialidad}</td>
                    <td>{profesional.email}</td>
                    <td>{profesional.telefono}</td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleEdit(profesional)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="danger-button"
                        onClick={() => handleDelete(profesional.id)}
                        type="button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="page-card">
        <h2>{formTitle}</h2>

        <form className="module-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="rut">RUT</label>
            <input
              id="rut"
              name="rut"
              onChange={handleChange}
              required
              value={formValues.rut}
            />
          </div>

          <div className="form-field">
            <label htmlFor="nombres">Nombres</label>
            <input
              id="nombres"
              name="nombres"
              onChange={handleChange}
              required
              value={formValues.nombres}
            />
          </div>

          <div className="form-field">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              id="apellidos"
              name="apellidos"
              onChange={handleChange}
              required
              value={formValues.apellidos}
            />
          </div>

          <div className="form-field">
            <label htmlFor="especialidad">Especialidad</label>
            <input
              id="especialidad"
              name="especialidad"
              onChange={handleChange}
              required
              value={formValues.especialidad}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formValues.email}
            />
          </div>

          <div className="form-field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              onChange={handleChange}
              required
              value={formValues.telefono}
            />
          </div>

          <div className="module-form__actions">
            <button disabled={isSaving} type="submit">
              {isSaving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button onClick={resetForm} type="button">
              Limpiar
            </button>
          </div>
        </form>
      </article>
    </section>
  )
}
