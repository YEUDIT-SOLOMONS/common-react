import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { usePermissions } from '../hooks/usePermissions'
import { useItem, useUpdateItem } from '../hooks/useItems'
import { ItemForm } from '../components/ItemForm'
import { Loader } from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'
import type { Item, ItemFormValues } from '../types'

function toFormValues(item: Item): ItemFormValues {
  return {
    name: item.name,
    description: item.description,
    dailyPrice: item.dailyPrice,
    quantity: item.quantity,
    minRentalAmount: item.minRentalAmount,
    categoryId: item.categoryId ?? '',
  }
}

export function EditItemPage() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isLoading, isError, error } = useItem(id!)

  return (
    <section className="form-page">
      <h1>עריכת פריט</h1>
      {isLoading && <Loader />}
      {isError && <ErrorMessage error={error} />}
      {item && <EditItemForm item={item} />}
    </section>
  )
}

function EditItemForm({ item }: { item: Item }) {
  const { canEdit } = usePermissions()
  const navigate = useNavigate()
  const updateMutation = useUpdateItem(item)

  if (!canEdit(item)) {
    return <Navigate to="/items" replace />
  }

  function handleSubmit(values: ItemFormValues) {
    updateMutation.mutate(values, {
      onSuccess: () => navigate(-1),
    })
  }

  return (
    <ItemForm
      defaultValues={toFormValues(item)}
      submitText="שמירה"
      isSubmitting={updateMutation.isPending}
      submitError={updateMutation.error}
      onSubmit={handleSubmit}
    />
  )
}
