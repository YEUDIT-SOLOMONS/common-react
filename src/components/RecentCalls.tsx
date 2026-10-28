import { CALL_KIND_LABELS, CALL_STATUS_LABELS } from '../labels'
import type { DashboardCall } from '../types'

const timeFormat = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })

export function RecentCalls({ calls }: { calls: DashboardCall[] }) {
  return (
    <div className="panel">
      <h2>שיחות טלפון אחרונות</h2>
      <p className="panel-note">שיחות אוטומטיות שהמערכת מוציאה למשכירות ולשוכרות</p>
      <table className="calls-table">
        <thead>
          <tr>
            <th>מתי</th>
            <th>סוג</th>
            <th>פריט</th>
            <th>תוצאה</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call, index) => (
            <tr key={`${call.createdAtUtc}-${index}`}>
              <td>{timeFormat.format(new Date(call.createdAtUtc))}</td>
              <td>{CALL_KIND_LABELS[call.kind] ?? call.kind}</td>
              <td>{call.itemName || '—'}</td>
              <td>
                <span className={`call-status call-${call.status}`}>{CALL_STATUS_LABELS[call.status] ?? call.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
