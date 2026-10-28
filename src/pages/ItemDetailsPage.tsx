import { Link, useParams } from 'react-router-dom'
import { useItem } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { usePermissions } from '../hooks/usePermissions'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import { StatusBadge } from '../components/StatusBadge'
import { ImageGallery } from '../components/ImageGallery'

export function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isLoading, isError, error } = useItem(id!)
  const { data: categories = [] } = useCategories()
  const { canEdit } = usePermissions()

  if (isLoading) return <Loader />
  if (isError || !item) return <ErrorMessage error={error} />

  const images = item.imageDataUrls.length > 0 ? item.imageDataUrls : item.imageDataUrl ? [item.imageDataUrl] : []
  const categoryName = categories.find((c) => c.id === item.categoryId)?.label ?? 'ללא קטגוריה'

  return (
    <section>
      <Link to="/items" className="back-link">
        → חזרה לכל הציוד
      </Link>

      <div className="details-grid">
        <ImageGallery images={images} alt={item.name} />

        <div className="details-info">
          <StatusBadge status={item.status} />
          <h1>{item.name}</h1>
          <p className="details-price">
            ₪{item.dailyPrice} <span className="item-price-unit">ליום</span>
          </p>
          <p className="details-description">{item.description || 'אין תיאור'}</p>

          <dl className="details-list">
            <dt>קטגוריה</dt>
            <dd>{categoryName}</dd>
            <dt>עיר</dt>
            <dd>{item.city ?? '—'}</dd>
            <dt>כמות</dt>
            <dd>{item.quantity}</dd>
            <dt>מינימום השכרה</dt>
            <dd>{item.minRentalAmount} ימים</dd>
          </dl>

          {canEdit(item) && (
            <Link to={`/items/${item.id}/edit`} className="btn btn-primary">
              עריכת הפריט
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
