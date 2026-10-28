import type { CategoryOption } from '../hooks/useCategories'
import type { Item } from '../types'

export type CountRow = [string, number]

export function topCounts(keys: string[], limit = 6): CountRow[] {
  const counts = new Map<string, number>()
  for (const key of keys) counts.set(key, (counts.get(key) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

export function itemStats(items: Item[], categories: CategoryOption[]) {
  const categoryNames = new Map(categories.map((c) => [c.id, c.label]))
  const totalPrice = items.reduce((sum, item) => sum + item.dailyPrice, 0)

  return {
    total: items.length,
    owners: new Set(items.map((item) => item.ownerId)).size,
    averagePrice: items.length ? Math.round(totalPrice / items.length) : 0,
    byCategory: topCounts(items.map((item) => categoryNames.get(item.categoryId ?? '') ?? 'ללא קטגוריה')),
    byCity: topCounts(items.map((item) => item.city ?? 'לא צוין')),
    newest: [...items].sort((a, b) => (b.createdAtUtc ?? '').localeCompare(a.createdAtUtc ?? '')).slice(0, 6),
  }
}
