import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMyItems } from '../hooks/useItems'
import { ItemList } from '../components/ItemList'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'

export function MyItemsPage() {
  const { user } = useAuth()
  const { data: items, isLoading, isError, error, refetch } = useMyItems(user!.id)

  return (
    <section>
      <div className="page-header">
        <h1>הציוד שלי</h1>
        <Link to="/items/new" className="btn btn-primary">
          + הוספת פריט
        </Link>
      </div>
      {isLoading && <Loader />}
      {isError && <ErrorMessage error={error} onRetry={() => refetch()} />}
      {items && <ItemList items={items} />}
    </section>
  )
}
