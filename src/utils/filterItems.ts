import type { Item, ItemFilterValues } from '../types'

export function filterAndSort(items: Item[], filters: ItemFilterValues): Item[] {
  const search = filters.search.trim().toLowerCase()
  const result = items.filter(
    (item) =>
      (!search || item.name.toLowerCase().includes(search)) &&
      (!filters.categoryId || item.categoryId === filters.categoryId) &&
      (!filters.city || item.city === filters.city),
  )

  switch (filters.sort) {
    case 'priceAsc':
      return result.sort((a, b) => a.dailyPrice - b.dailyPrice)
    case 'priceDesc':
      return result.sort((a, b) => b.dailyPrice - a.dailyPrice)
    case 'name':
      return result.sort((a, b) => a.name.localeCompare(b.name, 'he'))
    default:
      return result.sort((a, b) => (b.createdAtUtc ?? '').localeCompare(a.createdAtUtc ?? ''))
  }
}

export function uniqueCities(items: Item[]): string[] {
  const cities = items.map((item) => item.city).filter((city): city is string => Boolean(city))
  return [...new Set(cities)].sort()
}
