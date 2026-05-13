import { useEffect, useMemo, useState } from 'react'
import { citasService } from '../services/citasService'

const EMPTY_FORM = {
  pacienteId: '',
  profesionalId: '',
  fecha: '',
  modalidad: 'PRESENCIAL',
  estado: 'PENDIENTE',
  motivo: '',
}

const MODALIDADES = ['PRESENCIAL', 'TELEMEDICINA']
const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ATENDIDA']

export function CitasPage() {
  const [citas, setCitas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [sourceMode, setSourceMode] = useState('api')
  const [formValues, setFormValues] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const formTitle = useMemo(
    () => (editingId ? 'Editar cita' : 'Nueva cita'),
    [editingId],
  )

  const loadCitas = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data, source } = await citasService.listar()
      setCitas(data)
      setSourceMode(source)
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || 'No se pudo cargar el listado de citas.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCitas()
  }, [])

  const resetForm = () => {
    setFormValues(EMPTY_FORM)
    setEditingId(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }))
  }

  const handleEdit = (cita) => {
    setFormValues({
      pacienteId: String(cita.pacienteId),
      profesionalId: String(cita.profesionalId),
      fecha: cita.fecha?.slice(0, 16) || '',
      modalidad: cita.modalidad,
      estado: cita.estado,
      motivo: cita.motivo || '',
    })
    setEditingId(cita.id)
  }

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      'Esta accion eliminara la cita. Deseas continuar?',
    )
    if (!confirmation) return

    try {
      await citasService.eliminar(id)
      await loadCitas()
      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          'No se pudo eliminar la cita seleccionada.',
      )
    }
  }

  const toPayload = (values) => ({
    pacienteId: Number(values.pacienteId),
    profesionalId: Number(values.profesionalId),
    fecha: values.fecha,
    modalidad: values.modalidad,
    estado: values.estado,
    motivo: values.motivo,
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    try {
      const payload = toPayload(formValues)
      if (editingId) {
        await citasService.actualizar(editingId, payload)
      } else {
        await citasService.crear(payload)
      }
      await loadCitas()
      resetForm()
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'No se pudo guardar la cita.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="module-grid">
      <article className="page-card">
        <div className="page-card__header">
          <h2>Citas</h2>
          <button onClick={loadCitas} type="button">
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
          <p>Cargando citas...</p>
        ) : citas.length === 0 ? (
          <p>No hay citas registradas.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Paciente ID</th>
                  <th>Profesional ID</th>
                  <th>Fecha</th>
                  <th>Modalidad</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => (
                  <tr key={cita.id}>
                    <td>{cita.id}</td>
                    <td>{cita.pacienteId}</td>
                    <td>{cita.profesionalId}</td>
                    <td>{new Date(cita.fecha).toLocaleString()}</td>
                    <td>{cita.modalidad}</td>
                    <td>{cita.estado}</td>
                    <td>{cita.motivo}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(cita)} type="button">
                        Editar
                      </button>
                      <button
                        className="danger-button"
                        onClick={() => handleDelete(cita.id)}
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
          <label htmlFor="pacienteId">Paciente ID</label>
          <input
            id="pacienteId"
            min="1"
            name="pacienteId"
            onChange={handleChange}
            required
            type="number"
            value={formValues.pacienteId}
          />

          <label htmlFor="profesionalId">Profesional ID</label>
          <input
            id="profesionalId"
            min="1"
            name="profesionalId"
            onChange={handleChange}
            required
            type="number"
            value={formValues.profesionalId}
          />

          <label htmlFor="fecha">Fecha y hora</label>
          <input
            id="fecha"
            name="fecha"
            onChange={handleChange}
            required
            type="datetime-local"
            value={formValues.fecha}
          />

          <label htmlFor="modalidad">Modalidad</label>
          <select
            id="modalidad"
            name="modalidad"
            onChange={handleChange}
            value={formValues.modalidad}
          >
            {MODALIDADES.map((modalidad) => (
              <option key={modalidad} value={modalidad}>
                {modalidad}
              </option>
            ))}
          </select>

          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            onChange={handleChange}
            value={formValues.estado}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>

          <label htmlFor="motivo">Motivo</label>
          <textarea
            id="motivo"
            name="motivo"
            onChange={handleChange}
            rows="3"
            value={formValues.motivo}
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
