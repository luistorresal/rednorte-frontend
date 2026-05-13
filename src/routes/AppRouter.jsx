import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layout/MainLayout'
import { CitasPage } from '../pages/CitasPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PacientesPage } from '../pages/PacientesPage'
import { ProfesionalesPage } from '../pages/ProfesionalesPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="profesionales" element={<ProfesionalesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
