import { useMemo } from 'react'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { useDashboard } from '../hooks/useDashboard'
import { itemStats } from '../utils/itemStats'
import { CALL_STATUS_LABELS } from '../labels'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import { StatCard } from '../components/StatCard'
import { StatBars } from '../components/StatBars'
import { VisitsChart } from '../components/VisitsChart'
import { RecentCalls } from '../components/RecentCalls'
import { RecentItems } from '../components/RecentItems'

export function AdminPage() {
  const itemsQuery = useItems()
  const dashboardQuery = useDashboard()
  const { data: categories = [] } = useCategories()

  const stats = useMemo(() => itemStats(itemsQuery.data ?? [], categories), [itemsQuery.data, categories])

  if (itemsQuery.isLoading || dashboardQuery.isLoading) return <Loader text="טוען נתונים..." />
  if (itemsQuery.isError) return <ErrorMessage error={itemsQuery.error} onRetry={() => itemsQuery.refetch()} />
  if (dashboardQuery.isError) return <ErrorMessage error={dashboardQuery.error} onRetry={() => dashboardQuery.refetch()} />

  const dashboard = dashboardQuery.data!
  const callResults = Object.entries(dashboard.callResultsLast30Days)
    .map(([status, count]): [string, number] => [CALL_STATUS_LABELS[status] ?? status, count])
    .sort((a, b) => b[1] - a[1])

  return (
    <section>
      <h1>לוח נתונים</h1>

      <div className="stat-cards">
        <StatCard value={dashboard.members} label={`חברות בקהילה (${dashboard.newMembersLast30Days} חדשות החודש)`} color="pink" />
        <StatCard value={dashboard.activeRentals} label="השכרות פעילות עכשיו" color="blue" />
        <StatCard value={dashboard.rentalsLast30Days} label="השכרות ב-30 הימים האחרונים" color="green" />
        <StatCard value={stats.total} label="פריטים להשכרה" color="blue" />
        <StatCard value={stats.owners} label="משכירות עם ציוד" color="green" />
        <StatCard value={`₪${stats.averagePrice}`} label="מחיר ממוצע ליום" color="pink" />
      </div>

      <VisitsChart days={dashboard.visits} />

      <div className="panel-columns">
        <RecentCalls calls={dashboard.recentCalls} />
        <div className="panel">
          <StatBars title="תוצאות שיחות (30 יום)" rows={callResults} />
        </div>
      </div>

      <div className="panel-columns">
        <div className="panel">
          <StatBars title="קטגוריות מובילות" rows={stats.byCategory} />
        </div>
        <div className="panel">
          <StatBars title="ערים מובילות" rows={stats.byCity} />
        </div>
      </div>

      <RecentItems items={stats.newest} />
    </section>
  )
}
