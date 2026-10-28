import type { VisitDay } from '../types'

function shortDate(day: string) {
  const [, month, date] = day.split('-')
  return `${Number(date)}.${Number(month)}`
}

export function VisitsChart({ days }: { days: VisitDay[] }) {
  const max = Math.max(1, ...days.map((d) => d.visits))
  const total = days.reduce((sum, d) => sum + d.visits, 0)

  return (
    <div className="panel">
      <h2>תנועת גולשים</h2>
      <p className="panel-note">{total} כניסות ב-{days.length} הימים האחרונים</p>
      <div className="visits-chart">
        {days.map((d) => (
          <div key={d.day} className="visits-column" title={`${d.visits} כניסות, ${d.newVisitors} חדשות`}>
            <span className="visits-count">{d.visits}</span>
            <div className="visits-bar" style={{ height: `${(d.visits / max) * 100}%` }}>
              <div className="visits-bar-new" style={{ height: `${d.visits ? (d.newVisitors / d.visits) * 100 : 0}%` }} />
            </div>
            <span className="visits-day">{shortDate(d.day)}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <span className="legend-dot legend-blue" /> כל הכניסות
        <span className="legend-dot legend-pink" /> גולשות חדשות
      </div>
    </div>
  )
}
