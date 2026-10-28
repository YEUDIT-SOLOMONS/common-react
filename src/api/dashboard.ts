import { apiRequest } from './client'
import type { Dashboard } from '../types'

export function getDashboard(): Promise<Dashboard> {
  return apiRequest<Dashboard>('/dashboard')
}
