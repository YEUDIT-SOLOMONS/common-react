import { Link } from 'react-router-dom'
import type { Item } from '../types'

const dateFormat = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric', year: '2-digit' })

export function RecentItems({ items }: { items: Item[] }) {
  return (
    <div className="panel">
      <h2>פריטים שנוספו לאחרונה</h2>
      <ul className="recent-items">
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/items/${item.id}`}>
              {item.imageDataUrl ? <img src={item.imageDataUrl} alt="" /> : <span className="recent-items-noimage" />}
              <span className="recent-items-name">{item.name}</span>
              <span className="recent-items-meta">
                ₪{item.dailyPrice} · {item.city ?? ''} · {item.createdAtUtc ? dateFormat.format(new Date(item.createdAtUtc)) : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
