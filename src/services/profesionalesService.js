import { apiClient } from './apiClient'

const mockProfesionales = [
  {
    id: 1,
    rut: '13.456.789-0',
    nombres: 'Carolina',
    apellidos: 'Vega Rojas',
    especialidad: 'Cardiologia',
    email: 'carolina.vega@rednorte.cl',
    telefono: '+56 9 8456 1234',
  },
  {
    id: 2,
    rut: '11.222.333-4',
    nombres: 'Ricardo',
    apellidos: 'Salazar Mella',
    especialidad: 'Traumatologia',
    email: 'ricardo.salazar@rednorte.cl',
    telefono: '+56 9 7345 6789',
  },
]

let fallbackProfesionales = [...mockProfesionales]
let nextId = 3

const shouldUseFallback = (error) =>
  !error?.response && (error?.code === 'ERR_NETWORK' || !navigator.onLine)

export const profesionalesService = {
  async listar() {
    try {
      const response = await apiClient.get('/profesionales')
      return { data: response.data, source: 'api' }
    } catch (error) {
      if (shouldUseFallback(error)) {
        return { data: fallbackProfesionales, source: 'mock' }
      }
      throw error
    }
  },

  async crear(payload) {
    try {
      const response = await apiClient.post('/profesionales', payload)
      return response.data
    } catch (error) {
      if (shouldUseFallback(error)) {
        const nuevoProfesional = { id: nextId++, ...payload }
        fallbackProfesionales = [nuevoProfesional, ...fallbackProfesionales]
        return nuevoProfesional
      }
      throw error
    }
  },

  async actualizar(id, payload) {
    try {
      const response = await apiClient.put(`/profesionales/${id}`, payload)
      return response.data
    } catch (error) {
      if (shouldUseFallback(error)) {
        fallbackProfesionales = fallbackProfesionales.map((profesional) =>
          profesional.id === id ? { ...profesional, ...payload, id } : profesional,
        )
        return fallbackProfesionales.find((profesional) => profesional.id === id)
      }
      throw error
    }
  },

  async eliminar(id) {
    try {
      await apiClient.delete(`/profesionales/${id}`)
      return true
    } catch (error) {
      if (shouldUseFallback(error)) {
        fallbackProfesionales = fallbackProfesionales.filter(
          (profesional) => profesional.id !== id,
        )
        return true
      }
      throw error
    }
  },
}
