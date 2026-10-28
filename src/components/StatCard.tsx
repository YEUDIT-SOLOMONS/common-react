interface StatCardProps {
  value: string | number
  label: string
  color: 'pink' | 'blue' | 'green'
}

export function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className={`stat-card stat-${color}`}>
      <span className="stat-value">{value}</span>
      <span>{label}</span>
    </div>
  )
}
