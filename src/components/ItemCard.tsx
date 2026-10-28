import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'
import type { Item } from '../types'

interface ItemCardProps {
  item: Item
  categoryName?: string
  canEdit: boolean
  onDelete?: (item: Item) => void
}

export function ItemCard({ item, categoryName, canEdit, onDelete }: ItemCardProps) {
  return (
    <article className="item-card">
      <Link to={`/items/${item.id}`} className="item-card-link">
        <div className="item-card-media">
          {item.imageDataUrl ? (
            <img src={item.imageDataUrl} alt={item.name} loading="lazy" />
          ) : (
            <span className="item-card-noimage">אין תמונה</span>
          )}
          <StatusBadge status={item.status} className="item-card-status" />
        </div>
        <h3 className="item-card-title">{item.name}</h3>
        <p className="item-card-desc">
          {categoryName ?? 'ללא קטגוריה'}
          {item.city && ` · ${item.city}`}
        </p>
      </Link>
      <div className="item-card-footer">
        <span className="item-price">
          ₪{item.dailyPrice} <span className="item-price-unit">ליום</span>
        </span>
        {canEdit && (
          <div className="item-card-actions">
            <Link to={`/items/${item.id}/edit`} className="btn btn-ghost btn-small">
              עריכה
            </Link>
            {onDelete && (
              <button type="button" className="btn btn-danger btn-small" onClick={() => onDelete(item)}>
                מחיקה
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
