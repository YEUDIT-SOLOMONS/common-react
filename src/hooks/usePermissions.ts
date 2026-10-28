import { useAuth } from '../context/AuthContext'
import type { Item } from '../types'

export function usePermissions() {
  const { user, isAdmin } = useAuth()

  return {
    canEdit: (item: Item) => isAdmin || item.ownerId === user?.id,
    canDelete: (item: Item) => item.ownerId === user?.id,
  }
}
