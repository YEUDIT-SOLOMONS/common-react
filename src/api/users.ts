import { apiRequest } from './client'
import type { AddressValues, User } from '../types'

export function updateAddress(userId: string, values: AddressValues): Promise<User> {
  return apiRequest<User>(`/users/${userId}/address`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  })
}
