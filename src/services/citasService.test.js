import { describe, expect, it, vi, beforeEach } from 'vitest'
import { citasService } from './citasService'
import { apiClient } from './apiClient'

vi.mock('./apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('citasService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar retorna datos desde la API', async () => {
    const citas = [{ id: 1, estado: 'PENDIENTE' }]
    apiClient.get.mockResolvedValue({ data: citas })

    const result = await citasService.listar()

    expect(apiClient.get).toHaveBeenCalledWith('/citas')
    expect(result.data).toEqual(citas)
    expect(result.source).toBe('api')
  })

  it('crear envia payload al endpoint correcto', async () => {
    const payload = {
      pacienteId: 1,
      profesionalId: 2,
      fecha: '2026-06-27T10:00',
      modalidad: 'PRESENCIAL',
      estado: 'PENDIENTE',
      motivo: 'Control',
    }
    apiClient.post.mockResolvedValue({ data: { id: 3, ...payload } })

    const result = await citasService.crear(payload)

    expect(apiClient.post).toHaveBeenCalledWith('/citas', payload)
    expect(result.id).toBe(3)
  })

  it('eliminar llama al endpoint delete', async () => {
    apiClient.delete.mockResolvedValue({})

    const result = await citasService.eliminar(1)

    expect(apiClient.delete).toHaveBeenCalledWith('/citas/1')
    expect(result).toBe(true)
  })
})
