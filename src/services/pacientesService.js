import { apiClient } from './apiClient'

const mockPacientes = [
  {
    id: 1,
    nombres: 'Maria Elena',
    apellidos: 'Rojas Perez',
    rut: '12.345.678-9',
    telefono: '+56 9 8123 4567',
  },
  {
    id: 2,
    nombres: 'Carlos Andres',
    apellidos: 'Molina Soto',
    rut: '16.987.654-3',
    telefono: '+56 9 9234 5678',
  },
]

let fallbackPacientes = [...mockPacientes]
let nextId = 3

const shouldUseFallback = (error) =>
  !error?.response && (error?.code === 'ERR_NETWORK' || !navigator.onLine)

export const pacientesService = {
  async listar() {
    try {
      const response = await apiClient.get('/pacientes')
      return { data: response.data, source: 'api' }
    } catch (error) {
      if (shouldUseFallback(error)) {
        return { data: fallbackPacientes, source: 'mock' }
      }
      throw error
    }
  },

  async crear(payload) {
    try {
      const response = await apiClient.post('/pacientes', payload)
      return response.data
    } catch (error) {
      if (shouldUseFallback(error)) {
        const nuevoPaciente = { id: nextId++, ...payload }
        fallbackPacientes = [nuevoPaciente, ...fallbackPacientes]
        return nuevoPaciente
      }
      throw error
    }
  },

  async actualizar(id, payload) {
    try {
      const response = await apiClient.put(`/pacientes/${id}`, payload)
      return response.data
    } catch (error) {
      if (shouldUseFallback(error)) {
        fallbackPacientes = fallbackPacientes.map((paciente) =>
          paciente.id === id ? { ...paciente, ...payload, id } : paciente,
        )
        return fallbackPacientes.find((paciente) => paciente.id === id)
      }
      throw error
    }
  },

  async eliminar(id) {
    try {
      await apiClient.delete(`/pacientes/${id}`)
      return true
    } catch (error) {
      if (shouldUseFallback(error)) {
        fallbackPacientes = fallbackPacientes.filter((paciente) => paciente.id !== id)
        return true
      }
      throw error
    }
  },
}
