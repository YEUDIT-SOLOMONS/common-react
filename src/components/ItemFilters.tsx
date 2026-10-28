import type { CategoryOption } from '../hooks/useCategories'
import type { ItemFilterValues, SortOption } from '../types'

interface ItemFiltersProps {
  values: ItemFilterValues
  categories: CategoryOption[]
  cities: string[]
  onChange: (values: ItemFilterValues) => void
}

export function ItemFilters({ values, categories, cities, onChange }: ItemFiltersProps) {
  return (
    <div className="search-filter-row">
      <input
        type="search"
        className="search-input"
        placeholder="חיפוש ציוד..."
        aria-label="חיפוש לפי שם"
        value={values.search}
        onChange={(e) => onChange({ ...values, search: e.target.value })}
      />
      <select
        aria-label="סינון לפי קטגוריה"
        value={values.categoryId}
        onChange={(e) => onChange({ ...values, categoryId: e.target.value })}
      >
        <option value="">כל הקטגוריות</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <select aria-label="סינון לפי עיר" value={values.city} onChange={(e) => onChange({ ...values, city: e.target.value })}>
        <option value="">כל הערים</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <select
        aria-label="מיון"
        value={values.sort}
        onChange={(e) => onChange({ ...values, sort: e.target.value as SortOption })}
      >
        <option value="newest">החדשים ביותר</option>
        <option value="priceAsc">מחיר: מהנמוך לגבוה</option>
        <option value="priceDesc">מחיר: מהגבוה לנמוך</option>
        <option value="name">לפי שם</option>
      </select>
    </div>
  )
}
