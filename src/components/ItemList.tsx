import { useMemo, useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useDeleteItem } from '../hooks/useItems'
import { usePermissions } from '../hooks/usePermissions'
import { filterAndSort, uniqueCities } from '../utils/filterItems'
import { ItemCard } from './ItemCard'
import { ItemFilters } from './ItemFilters'
import { ErrorMessage } from './ErrorMessage'
import type { Item, ItemFilterValues } from '../types'

const PAGE_SIZE = 20
const INITIAL_FILTERS: ItemFilterValues = { search: '', categoryId: '', city: '', sort: 'newest' }

export function ItemList({ items }: { items: Item[] }) {
  const [filters, setFilters] = useState<ItemFilterValues>(INITIAL_FILTERS)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { data: categories = [] } = useCategories()
  const { canEdit, canDelete } = usePermissions()
  const deleteMutation = useDeleteItem()

  const filteredItems = useMemo(() => filterAndSort(items, filters), [items, filters])
  const cities = useMemo(() => uniqueCities(items), [items])
  const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.label])), [categories])

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

      {filteredItems.length === 0 && <p className="empty">לא נמצאו פריטים</p>}

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
