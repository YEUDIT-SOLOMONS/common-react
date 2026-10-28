import { useMemo } from 'react'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import { StatBars } from '../components/StatBars'
import type { Item } from '../types'

function countBy(items: Item[], getKey: (item: Item) => string): [string, number][] {
  const counts = new Map<string, number>()
  for (const item of items) {
    const key = getKey(item)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
}

export function AdminPage() {
  const { data: items = [], isLoading, isError, error } = useItems()
  const { data: categories = [] } = useCategories()

  const stats = useMemo(() => {
    const categoryNames = new Map(categories.map((c) => [c.id, c.label]))
    const owners = new Set(items.map((item) => item.ownerId))
    const totalPrice = items.reduce((sum, item) => sum + item.dailyPrice, 0)

    return {
      total: items.length,
      owners: owners.size,
      averagePrice: items.length ? Math.round(totalPrice / items.length) : 0,
      byCategory: countBy(items, (item) => categoryNames.get(item.categoryId ?? '') ?? 'ללא קטגוריה'),
      byCity: countBy(items, (item) => item.city ?? 'לא צוין'),
    }
  }, [items, categories])

  if (isLoading) return <Loader text="טוען נתונים..." />
  if (isError) return <ErrorMessage error={error} />

  return (
    <section>
      <h1>לוח ניהול</h1>
      <div className="stat-cards">
        <div className="stat-card stat-pink">
          <span className="stat-value">{stats.total}</span>
          <span>פריטים להשכרה</span>
        </div>
        <div className="stat-card stat-blue">
          <span className="stat-value">{stats.owners}</span>
          <span>משכירות</span>
        </div>
        <div className="stat-card stat-green">
          <span className="stat-value">₪{stats.averagePrice}</span>
          <span>מחיר ממוצע ליום</span>
        </div>
      </div>
      <div className="stat-columns">
        <StatBars title="קטגוריות מובילות" rows={stats.byCategory} />
        <StatBars title="ערים מובילות" rows={stats.byCity} />
      </div>
    </section>
  )
}
