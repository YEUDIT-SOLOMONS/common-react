import { apiRequest } from './client'
import type { AuthResponse, LoginValues, RegisterValues } from '../types'

export function login(values: LoginValues): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function register(values: RegisterValues): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}
