import axios from 'axios'
import { getApiBaseUrl } from '../config/apiUrl'
import { TOKEN_KEY, USERNAME_KEY } from '../types'

export const httpClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl()
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USERNAME_KEY)
      // window.location instead of useNavigate: this file is outside React,
      // interceptors can't use hooks. A hard redirect also guarantees any
      // stale in-memory state gets cleared along with the session.
      window.location.href = `${import.meta.env.BASE_URL}login`
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      return 'Incorrect username or password.'
    }
    const status = err.response?.status ?? 'network'
    return `Error HTTP ${status}: ${err.message}`
  }
  return err instanceof Error ? err.message : 'Unknown error'
}