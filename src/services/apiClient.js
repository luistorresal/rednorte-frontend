import axios from 'axios'

const DEFAULT_API_URL = 'http://localhost:8085'
const TOKEN_STORAGE_KEY = 'rednorte_auth_token'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
