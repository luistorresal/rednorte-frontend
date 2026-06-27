import { describe, expect, it, vi, beforeEach } from 'vitest'
import { authService } from './authService'
import { apiClient } from './apiClient'

vi.mock('./apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login envia credenciales y retorna token', async () => {
    apiClient.post.mockResolvedValue({
      data: { token: 'jwt-token-test' },
    })

    const result = await authService.login({
      username: 'admin',
      password: '1234',
    })

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      username: 'admin',
      password: '1234',
    })
    expect(result.token).toBe('jwt-token-test')
  })
})
