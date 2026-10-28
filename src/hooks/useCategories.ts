import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories'
import type { Category } from '../types'

export interface CategoryOption {
  id: string
  label: string
}

function toOptions(categories: Category[]): CategoryOption[] {
  const byId = new Map(categories.map((c) => [c.id, c]))
  return [...categories]
    .sort((a, b) => a.order - b.order)
    .map((c) => {
      const parent = c.parentId ? byId.get(c.parentId) : undefined
      return { id: c.id, label: parent ? `${parent.name} › ${c.name}` : c.name }
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'he'))
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    select: toOptions,
    staleTime: 5 * 60 * 1000,
  })
}
