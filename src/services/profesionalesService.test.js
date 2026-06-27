import { describe, expect, it, vi, beforeEach } from 'vitest'
import { profesionalesService } from './profesionalesService'
import { apiClient } from './apiClient'

vi.mock('./apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('profesionalesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar retorna datos desde la API', async () => {
    const profesionales = [{ id: 1, especialidad: 'Cardiologia' }]
    apiClient.get.mockResolvedValue({ data: profesionales })

    const result = await profesionalesService.listar()

    expect(apiClient.get).toHaveBeenCalledWith('/profesionales')
    expect(result.data).toEqual(profesionales)
    expect(result.source).toBe('api')
  })

  it('crear envia payload al endpoint correcto', async () => {
    const payload = {
      rut: '11.222.333-4',
      nombres: 'Ana',
      apellidos: 'Lopez',
      especialidad: 'Medicina General',
      email: 'ana@mail.com',
      telefono: '+56911112222',
    }
    apiClient.post.mockResolvedValue({ data: { id: 2, ...payload } })

    const result = await profesionalesService.crear(payload)

    expect(apiClient.post).toHaveBeenCalledWith('/profesionales', payload)
    expect(result.id).toBe(2)
  })

  it('eliminar llama al endpoint delete', async () => {
    apiClient.delete.mockResolvedValue({})

    const result = await profesionalesService.eliminar(1)

    expect(apiClient.delete).toHaveBeenCalledWith('/profesionales/1')
    expect(result).toBe(true)
  })
})
