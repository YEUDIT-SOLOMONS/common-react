import { useMemo, useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useDeleteItem } from '../hooks/useItems'
import { usePermissions } from '../hooks/usePermissions'
import { ItemCard } from './ItemCard'
import { ItemFilters } from './ItemFilters'
import { ErrorMessage } from './ErrorMessage'
import type { Item, ItemFilterValues } from '../types'

const PAGE_SIZE = 20
const INITIAL_FILTERS: ItemFilterValues = { search: '', categoryId: '', city: '', sort: 'newest' }

function filterAndSort(items: Item[], filters: ItemFilterValues): Item[] {
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

export function ItemList({ items }: { items: Item[] }) {
  const [filters, setFilters] = useState<ItemFilterValues>(INITIAL_FILTERS)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { data: categories = [] } = useCategories()
  const { canEdit, canDelete } = usePermissions()
  const deleteMutation = useDeleteItem()

  const filteredItems = useMemo(() => filterAndSort(items, filters), [items, filters])
  const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.label])), [categories])
  const cities = useMemo(
    () => [...new Set(items.map((item) => item.city).filter((city): city is string => Boolean(city)))].sort(),
    [items],
  )

  function handleFiltersChange(values: ItemFilterValues) {
    setFilters(values)
    setVisibleCount(PAGE_SIZE)
  }

  function handleDelete(item: Item) {
    if (window.confirm(`למחוק את "${item.name}"?`)) {
      deleteMutation.mutate(item.id)
    }
  }

  return (
    <>
      <ItemFilters values={filters} categories={categories} cities={cities} onChange={handleFiltersChange} />
      {deleteMutation.isError && <ErrorMessage error={deleteMutation.error} />}
      <p className="results-count">{filteredItems.length} פריטים</p>
      {filteredItems.length === 0 ? (
        <p className="empty">לא נמצאו פריטים</p>
      ) : (
        <div className="item-grid">
          {filteredItems.slice(0, visibleCount).map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              categoryName={item.categoryId ? categoryNames.get(item.categoryId) : undefined}
              canEdit={canEdit(item)}
              onDelete={canDelete(item) ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
      {visibleCount < filteredItems.length && (
        <div className="load-more">
          <button type="button" className="btn btn-ghost" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            הצגת עוד פריטים
          </button>
        </div>
      )}
    </>
  )
}
