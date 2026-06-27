import { createContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { TOKEN_STORAGE_KEY } from '../services/apiClient'
import { authService } from '../services/authService'
const DEMO_TOKEN = 'demo-mode-token'
const DEMO_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true'
const AuthContext = createContext(null)

function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const isAuthenticated = Boolean(token)

  const login = async ({ username, password }) => {
    setIsLoading(true)
    setAuthError('')

    try {
      const loginResponse = await authService.login({ username, password })
      const nextToken = loginResponse?.token

      if (!nextToken) {
        throw new Error('No fue posible iniciar sesión. Inténtalo de nuevo.')
      }

      window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
      setToken(nextToken)
      return true
    } catch (error) {
      if (DEMO_LOGIN_ENABLED && error?.code === 'ERR_NETWORK') {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, DEMO_TOKEN)
        setToken(DEMO_TOKEN)
        setAuthError('')
        return true
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.'
      setAuthError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setAuthError('')
  }

  const contextValue = useMemo(
    () => ({
      token,
      isAuthenticated,
      isLoading,
      authError,
      login,
      logout,
    }),
    [token, isAuthenticated, isLoading, authError],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export { AuthContext }

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
