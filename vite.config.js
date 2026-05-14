import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET = 'http://localhost:8085'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': API_TARGET,
      '/pacientes': API_TARGET,
      '/profesionales': API_TARGET,
      '/citas': API_TARGET,
    },
  },
})
