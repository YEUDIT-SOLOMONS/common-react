const STATUS_LABELS: Record<string, string> = {
  Available: 'זמין',
  Rented: 'מושכר',
  Maintenance: 'בתחזוקה',
}

export function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  return <span className={`badge badge-item-${status} ${className}`}>{STATUS_LABELS[status] ?? status}</span>
}
