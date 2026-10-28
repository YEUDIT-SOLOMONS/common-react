import { apiRequest } from './client'
import type { Category } from '../types'

export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/categories')
}
