import { apiClient } from './apiClient'

const mockCitas = [
  {
    id: 1,
    pacienteId: 1,
    profesionalId: 2,
    fecha: '2026-05-20T10:30',
    modalidad: 'PRESENCIAL',
    estado: 'PENDIENTE',
    motivo: 'Control post operatorio',
  },
  {
    id: 2,
    pacienteId: 2,
    profesionalId: 1,
    fecha: '2026-05-22T12:00',
    modalidad: 'TELEMEDICINA',
    estado: 'CONFIRMADA',
    motivo: 'Chequeo cardiologico',
  },
]

let fallbackCitas = [...mockCitas]
let nextId = 3

const shouldUseFallback = (error) =>
  !error?.response && (error?.code === 'ERR_NETWORK' || !navigator.onLine)

export const citasService = {
  async listar() {
    try {
      const response = await apiClient.get('/citas')
      return { data: response.data, source: 'api' }
    } catch (error) {
      if (shouldUseFallback(error)) {
        return { data: fallbackCitas, source: 'mock' }
      }
      throw error
    }
  },

  async crear(payload) {
    try {
      const response = await apiClient.post('/citas', payload)
      return response.data
    } catch (error) {
      if (shouldUseFallback(error)) {
        const nuevaCita = { id: nextId++, ...payload }
        fallbackCitas = [nuevaCita, ...fallbackCitas]
        return nuevaCita
      }
      throw error
    }
  },

  async actualizar(id, payload) {
    try {
      const response = await apiClient.put(`/citas/${id}`, payload)
      return response.data
    } catch (error) {
      if (shouldUseFallback(error)) {
        fallbackCitas = fallbackCitas.map((cita) =>
          cita.id === id ? { ...cita, ...payload, id } : cita,
        )
        return fallbackCitas.find((cita) => cita.id === id)
      }
      throw error
    }
  },

  async eliminar(id) {
    try {
      await apiClient.delete(`/citas/${id}`)
      return true
    } catch (error) {
      if (shouldUseFallback(error)) {
        fallbackCitas = fallbackCitas.filter((cita) => cita.id !== id)
        return true
      }
      throw error
    }
  },
}
