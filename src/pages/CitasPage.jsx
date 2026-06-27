import { useEffect, useMemo, useState } from 'react'
import { citasService } from '../services/citasService'
import { pacientesService } from '../services/pacientesService'
import { profesionalesService } from '../services/profesionalesService'

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
  const [pacientes, setPacientes] = useState([])
  const [profesionales, setProfesionales] = useState([])
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

  const pacientesById = useMemo(
    () => new Map(pacientes.map((paciente) => [Number(paciente.id), paciente])),
    [pacientes],
  )

  const profesionalesById = useMemo(
    () =>
      new Map(
        profesionales.map((profesional) => [
          Number(profesional.id),
          profesional,
        ]),
      ),
    [profesionales],
  )

  const getPacienteName = (pacienteId) => {
    const paciente = pacientesById.get(Number(pacienteId))
    if (!paciente) return `Paciente #${pacienteId}`
    return `${paciente.nombres} ${paciente.apellidos}`.trim()
  }

  const getProfesionalName = (profesionalId) => {
    const profesional = profesionalesById.get(Number(profesionalId))
    if (!profesional) return `Profesional #${profesionalId}`
    return `${profesional.nombres} ${profesional.apellidos}`.trim()
  }

  const loadCitas = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const [citasResponse, pacientesResponse, profesionalesResponse] =
        await Promise.all([
          citasService.listar(),
          pacientesService.listar(),
          profesionalesService.listar(),
        ])

      setCitas(citasResponse.data)
      setPacientes(pacientesResponse.data)
      setProfesionales(profesionalesResponse.data)
      setSourceMode(
        [citasResponse.source, pacientesResponse.source, profesionalesResponse.source].includes(
          'mock',
        )
          ? 'mock'
          : 'api',
      )
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
      'Esta acción eliminará la cita. ¿Deseas continuar?',
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
            ? 'No se pudo conectar al servidor. Mostrando datos de ejemplo.'
            : 'Datos cargados desde el servidor.'}
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
                  <th>Paciente</th>
                  <th>Profesional</th>
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
                    <td>
                      {getPacienteName(cita.pacienteId)}
                      <span className="muted-cell">ID {cita.pacienteId}</span>
                    </td>
                    <td>
                      {getProfesionalName(cita.profesionalId)}
                      <span className="muted-cell">ID {cita.profesionalId}</span>
                    </td>
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
          <div className="form-field">
            <label htmlFor="pacienteId">Paciente</label>
            <select
              id="pacienteId"
              name="pacienteId"
              onChange={handleChange}
              required
              value={formValues.pacienteId}
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nombres} {paciente.apellidos} (ID {paciente.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="profesionalId">Profesional</label>
            <select
              id="profesionalId"
              name="profesionalId"
              onChange={handleChange}
              required
              value={formValues.profesionalId}
            >
              <option value="">Selecciona un profesional</option>
              {profesionales.map((profesional) => (
                <option key={profesional.id} value={profesional.id}>
                  {profesional.nombres} {profesional.apellidos} -{' '}
                  {profesional.especialidad} (ID {profesional.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="fecha">Fecha y hora</label>
            <input
              id="fecha"
              name="fecha"
              onChange={handleChange}
              required
              type="datetime-local"
              value={formValues.fecha}
            />
          </div>

          <div className="form-field">
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
          </div>

          <div className="form-field">
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
          </div>

          <div className="form-field">
            <label htmlFor="motivo">Motivo</label>
            <textarea
              id="motivo"
              name="motivo"
              onChange={handleChange}
              rows="3"
              value={formValues.motivo}
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
