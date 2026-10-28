import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { login as loginRequest, register as registerRequest } from '../api/auth'
import { getToken, setToken } from '../api/client'
import type { AuthResponse, LoginValues, RegisterValues, User } from '../types'

const USER_KEY = 'common.user'

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  canViewDashboard: boolean
  login: (values: LoginValues) => Promise<void>
  register: (values: RegisterValues) => Promise<void>
  updateUser: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

// התחברות שפג תוקפה נמחקת כבר בטעינת האתר, כדי שלא נשלח לשרת טוקן ישן
function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  const token = getToken()
  if (!raw || !token || !isTokenValid(token)) {
    localStorage.removeItem(USER_KEY)
    setToken(null)
    return null
  }
  return JSON.parse(raw) as User
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)
  const queryClient = useQueryClient()

  function saveSession(response: AuthResponse) {
    setToken(response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    setUser(response.user)
  }

  async function login(values: LoginValues) {
    saveSession(await loginRequest(values))
  }

  async function register(values: RegisterValues) {
    saveSession(await registerRequest(values))
  }

  function updateUser(updated: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  function logout() {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    queryClient.clear()
  }

  const value: AuthContextValue = {
    user,
    isAdmin: user?.role === 'Admin',
    canViewDashboard: user?.role === 'Admin' || user?.role === 'Viewer',
    login,
    register,
    updateUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
