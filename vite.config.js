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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/services/**/*.js'],
    },
  },
})
