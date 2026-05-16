import { useEffect, useMemo, useState } from 'react'
import { pacientesService } from '../services/pacientesService'

const EMPTY_FORM = {
  nombres: '',
  apellidos: '',
  rut: '',
  telefono: '',
  email:'',
}

export function PacientesPage() {
  const [pacientes, setPacientes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [sourceMode, setSourceMode] = useState('api')
  const [formValues, setFormValues] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const formTitle = useMemo(
    () => (editingId ? 'Editar paciente' : 'Nuevo paciente'),
    [editingId],
  )

  const loadPacientes = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data, source } = await pacientesService.listar()
      setPacientes(data)
      setSourceMode(source)
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          'No se pudo cargar el listado de pacientes.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPacientes()
  }, [])

  const resetForm = () => {
    setFormValues(EMPTY_FORM)
    setEditingId(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }))
  }

  const handleEdit = (paciente) => {
    setFormValues({
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      rut: paciente.rut,
      telefono: paciente.telefono,
      email: paciente.email
    })
    setEditingId(paciente.id)
  }

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      'Esta acción eliminará el paciente. ¿Deseas continuar?',
    )

    if (!confirmation) return

    try {
      await pacientesService.eliminar(id)
      await loadPacientes()
      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          'No se pudo eliminar el paciente seleccionado.',
      )
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    try {
      if (editingId) {
        await pacientesService.actualizar(editingId, formValues)
      } else {
        await pacientesService.crear(formValues)
      }
      await loadPacientes()
      resetForm()
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || 'No se pudo guardar el paciente.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="module-grid">
      <article className="page-card">
        <div className="page-card__header">
          <h2>Pacientes</h2>
          <button onClick={loadPacientes} type="button">
            Recargar
          </button>
        </div>

        <p className="page-card__hint">
          {sourceMode === 'mock'
            ? 'Mostrando datos mock: backend no disponible.'
            : 'Mostrando datos reales desde API.'}
        </p>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        {isLoading ? (
          <p>Cargando pacientes...</p>
        ) : pacientes.length === 0 ? (
          <p>No hay pacientes registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>RUT</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.id}</td>
                    <td>{paciente.nombres}</td>
                    <td>{paciente.apellidos}</td>
                    <td>{paciente.rut}</td>
                    <td>{paciente.telefono}</td>
                    <td>{paciente.email}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(paciente)} type="button">
                        Editar
                      </button>
                      <button
                        className="danger-button"
                        onClick={() => handleDelete(paciente.id)}
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
          <label htmlFor="nombres">Nombres</label>
          <input
            id="nombres"
            name="nombres"
            onChange={handleChange}
            required
            value={formValues.nombres}
          />

          <label htmlFor="apellidos">Apellidos</label>
          <input
            id="apellidos"
            name="apellidos"
            onChange={handleChange}
            required
            value={formValues.apellidos}
          />

          <label htmlFor="rut">RUT</label>
          <input
            id="rut"
            name="rut"
            onChange={handleChange}
            required
            value={formValues.rut}
          />

          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            onChange={handleChange}
            required
            value={formValues.telefono}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            onChange={handleChange}
            required
            value={formValues.email}
          />

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
