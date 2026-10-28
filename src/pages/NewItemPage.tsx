import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCreateItem } from '../hooks/useItems'
import { ItemForm } from '../components/ItemForm'
import { AddressForm } from '../components/AddressForm'
import type { ItemFormValues } from '../types'

export function NewItemPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const createMutation = useCreateItem(user!.id)
  const hasAddress = Boolean(user?.address && user?.city)

  function handleSubmit(values: ItemFormValues) {
    createMutation.mutate(values, {
      onSuccess: (created) => navigate(`/items/${created.id}`),
    })
  }

  return (
    <section className="form-page">
      <h1>הוספת פריט</h1>
      {hasAddress ? (
        <ItemForm
          submitText="הוספה"
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
          onSubmit={handleSubmit}
        />
      ) : (
        <AddressForm />
      )}
    </section>
  )
}
