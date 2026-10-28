interface StatBarsProps {
  title: string
  rows: [string, number][]
}

export function StatBars({ title, rows }: StatBarsProps) {
  const max = Math.max(1, ...rows.map(([, count]) => count))

  return (
    <div className="stat-bars">
      <h2>{title}</h2>
      {rows.map(([label, count]) => (
        <div key={label} className="stat-bar-row">
          <span className="stat-bar-label">{label}</span>
          <div className="stat-bar-track">
            <div className="stat-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <span className="stat-bar-count">{count}</span>
        </div>
      ))}
    </div>
  )
}
