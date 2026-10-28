import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { updateAddress } from '../api/users'
import { useAuth } from '../context/AuthContext'
import { FormField } from './FormField'
import { ErrorMessage } from './ErrorMessage'
import type { AddressValues } from '../types'

export function AddressForm() {
  const { user, updateUser } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressValues>()

  const mutation = useMutation({
    mutationFn: (values: AddressValues) => updateAddress(user!.id, values),
    onSuccess: updateUser,
  })

  return (
    <form className="form" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
      <p className="form-note">לפני הפריט הראשון צריך להזין כתובת. היא משמשת לכל הפריטים שלך, ורק העיר מוצגת לאחרות.</p>

      <FormField id="address" label="רחוב ומספר בית" error={errors.address}>
        <input id="address" {...register('address', { required: 'יש להזין רחוב ומספר' })} />
      </FormField>

      <FormField id="city" label="עיר" error={errors.city}>
        <input id="city" {...register('city', { required: 'יש להזין עיר' })} />
      </FormField>

      <div className="form-row form-row-2">
        <FormField id="addressFloor" label="קומה" error={errors.addressFloor}>
          <input id="addressFloor" {...register('addressFloor', { required: 'יש להזין קומה' })} />
        </FormField>
        <FormField id="addressApartment" label="דירה / שם משפחה" error={errors.addressApartment}>
          <input id="addressApartment" {...register('addressApartment', { required: 'שדה חובה' })} />
        </FormField>
      </div>

      {mutation.isError && <ErrorMessage error={mutation.error} />}

      <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
        {mutation.isPending ? 'שומר...' : 'שמירת כתובת'}
      </button>
    </form>
  )
}
