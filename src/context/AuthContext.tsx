import { useState, type ReactNode } from 'react'
import * as authService from '../services/authService'
import { getApiErrorMessage } from '../services/httpClient'
import { AuthContext, type LoginResult } from './contextDefinition'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authService.getToken()))
  const [username, setUsername] = useState(() => authService.getUsername())

  async function handleLogin(username: string, password: string): Promise<LoginResult> {
    try {
      const token = await authService.login(username, password)
      authService.saveToken(token)
      authService.saveUsername(username.trim())
      setIsAuthenticated(true)
      setUsername(username.trim())
      return { success: true }
    } catch (err) {
      return { success: false, error: getApiErrorMessage(err) }
    }
  }

  function handleLogout() {
    authService.clearToken()
    setIsAuthenticated(false)
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}