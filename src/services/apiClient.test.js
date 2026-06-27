import { describe, expect, it, beforeEach } from 'vitest'
import { TOKEN_STORAGE_KEY } from './apiClient'

describe('apiClient', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('define la clave de almacenamiento del token', () => {
    expect(TOKEN_STORAGE_KEY).toBe('rednorte_auth_token')
  })
})
