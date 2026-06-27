import { describe, expect, it, vi, beforeEach } from 'vitest'
import { pacientesService } from './pacientesService'
import { apiClient } from './apiClient'

vi.mock('./apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('pacientesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar retorna datos desde la API', async () => {
    const pacientes = [{ id: 1, nombres: 'Maria', apellidos: 'Rojas' }]
    apiClient.get.mockResolvedValue({ data: pacientes })

    const result = await pacientesService.listar()

    expect(apiClient.get).toHaveBeenCalledWith('/pacientes')
    expect(result.data).toEqual(pacientes)
    expect(result.source).toBe('api')
  })

  it('crear envia payload al endpoint correcto', async () => {
    const payload = {
      nombres: 'Carlos',
      apellidos: 'Molina',
      rut: '16.987.654-3',
      email: 'carlos@mail.com',
      telefono: '+56987654321',
    }
    apiClient.post.mockResolvedValue({ data: { id: 2, ...payload } })

    const result = await pacientesService.crear(payload)

    expect(apiClient.post).toHaveBeenCalledWith('/pacientes', payload)
    expect(result.id).toBe(2)
  })

  it('eliminar llama al endpoint delete', async () => {
    apiClient.delete.mockResolvedValue({})

    const result = await pacientesService.eliminar(1)

    expect(apiClient.delete).toHaveBeenCalledWith('/pacientes/1')
    expect(result).toBe(true)
  })
})
