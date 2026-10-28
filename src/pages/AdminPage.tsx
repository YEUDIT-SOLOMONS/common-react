import { useMemo } from 'react'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { itemStats } from '../utils/itemStats'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import { StatCard } from '../components/StatCard'
import { StatBars } from '../components/StatBars'
import { RecentItems } from '../components/RecentItems'

export function AdminPage() {
  const { data: items, isLoading, isError, error, refetch } = useItems()
  const { data: categories = [] } = useCategories()

  const stats = useMemo(() => itemStats(items ?? [], categories), [items, categories])

  if (isLoading) return <Loader text="טוען נתונים..." />
  if (isError) return <ErrorMessage error={error} onRetry={() => refetch()} />

  return (
    <section>
      <h1>לוח נתונים</h1>

      <div className="stat-cards">
        <StatCard value={stats.total} label="פריטים להשכרה" color="pink" />
        <StatCard value={stats.owners} label="משכירות עם ציוד" color="blue" />
        <StatCard value={`₪${stats.averagePrice}`} label="מחיר ממוצע ליום" color="green" />
        <StatCard value={stats.units} label="יחידות ציוד (כולל כמויות)" color="blue" />
        <StatCard value={stats.cities} label="ערים עם ציוד" color="green" />
        <StatCard value={stats.categories} label="קטגוריות בשימוש" color="pink" />
      </div>

      <div className="panel-columns">
        <div className="panel">
          <StatBars title="קטגוריות מובילות" rows={stats.byCategory} />
        </div>
        <div className="panel">
          <StatBars title="ערים מובילות" rows={stats.byCity} />
        </div>
      </div>

      <div className="panel-columns">
        <div className="panel">
          <StatBars title="פריטים לפי טווח מחיר ליום" rows={stats.byPriceRange} />
        </div>
        <div className="panel">
          <StatBars title="פריטים שנוספו בשבוע האחרון" rows={stats.byDay} />
        </div>
      </div>

      <RecentItems items={stats.newest} />
    </section>
  )
}
