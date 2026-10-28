import type { CategoryOption } from '../hooks/useCategories'
import type { Item } from '../types'

export type CountRow = [string, number]

const PRICE_RANGES: [number, string][] = [
  [50, 'עד ₪50'],
  [100, '₪51-100'],
  [200, '₪101-200'],
  [Infinity, 'מעל ₪200'],
]

const dayFormat = new Intl.DateTimeFormat('he-IL', { weekday: 'short', day: 'numeric', month: 'numeric' })

export function topCounts(keys: string[], limit = 6): CountRow[] {
  const counts = new Map<string, number>()
  for (const key of keys) counts.set(key, (counts.get(key) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

function priceRange(price: number): string {
  return PRICE_RANGES.find(([max]) => price <= max)![1]
}

function byPriceRange(items: Item[]): CountRow[] {
  return PRICE_RANGES.map(([, label]): CountRow => [label, items.filter((item) => priceRange(item.dailyPrice) === label).length])
}

function byDay(items: Item[], days = 7): CountRow[] {
  const today = new Date()
  return Array.from({ length: days }, (_, i): CountRow => {
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i + 1)
    const count = items.filter((item) => {
      const created = item.createdAtUtc ? new Date(item.createdAtUtc) : null
      return created !== null && created >= start && created < end
    }).length
    return [dayFormat.format(start), count]
  })
}

export function itemStats(items: Item[], categories: CategoryOption[]) {
  const categoryNames = new Map(categories.map((c) => [c.id, c.label]))
  const totalPrice = items.reduce((sum, item) => sum + item.dailyPrice, 0)

  return {
    total: items.length,
    units: items.reduce((sum, item) => sum + item.quantity, 0),
    owners: new Set(items.map((item) => item.ownerId)).size,
    averagePrice: items.length ? Math.round(totalPrice / items.length) : 0,
    cities: new Set(items.map((item) => item.city).filter(Boolean)).size,
    categories: new Set(items.map((item) => item.categoryId).filter(Boolean)).size,
    byCategory: topCounts(items.map((item) => categoryNames.get(item.categoryId ?? '') ?? 'ללא קטגוריה')),
    byCity: topCounts(items.map((item) => item.city ?? 'לא צוין')),
    byPriceRange: byPriceRange(items),
    byDay: byDay(items),
    newest: [...items].sort((a, b) => (b.createdAtUtc ?? '').localeCompare(a.createdAtUtc ?? '')).slice(0, 6),
  }
}
