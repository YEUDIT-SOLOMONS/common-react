import { useItems } from '../hooks/useItems'
import { ItemList } from '../components/ItemList'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'

export function ItemsPage() {
  const { data: items, isLoading, isError, error, refetch } = useItems()

  return (
    <section>
      <h1>כל הציוד</h1>
      {isLoading && <Loader text="טוען את הציוד..." />}
      {isError && <ErrorMessage error={error} onRetry={() => refetch()} />}
      {items && <ItemList items={items} />}
    </section>
  )
}
