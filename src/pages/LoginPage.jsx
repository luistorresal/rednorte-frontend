import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const INITIAL_CREDENTIALS = {
  username: 'admin',
  password: '1234',
}

export function LoginPage() {
  const [formValues, setFormValues] = useState(INITIAL_CREDENTIALS)
  const { isAuthenticated, isLoading, authError, login } = useAuth()
  const location = useLocation()
  const from = location.state?.from || '/app/dashboard'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(formValues)
  }

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Inicio de sesion</h2>
        <p className="auth-help">
          Ingresa con credenciales del gateway para acceder al sistema.
        </p>

        <label className="auth-label" htmlFor="username">
          Usuario
        </label>
        <input
          className="auth-input"
          id="username"
          name="username"
          onChange={handleInputChange}
          value={formValues.username}
        />

        <label className="auth-label" htmlFor="password">
          Contrasena
        </label>
        <input
          className="auth-input"
          id="password"
          name="password"
          onChange={handleInputChange}
          type="password"
          value={formValues.password}
        />

        {authError ? <p className="auth-error">{authError}</p> : null}

        <button className="auth-button" disabled={isLoading} type="submit">
          {isLoading ? 'Validando...' : 'Ingresar'}
        </button>
      </form>
    </section>
  )
}
