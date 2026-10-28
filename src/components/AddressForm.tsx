import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { updateAddress } from '../api/users'
import { useAuth } from '../context/AuthContext'
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
    <form className="form address-form" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
      <p className="form-note">לפני הפריט הראשון צריך להזין כתובת. היא משמשת לכל הפריטים שלך, ורק העיר מוצגת לאחרות.</p>

      <label htmlFor="address">רחוב ומספר בית</label>
      <input id="address" {...register('address', { required: 'יש להזין רחוב ומספר' })} />
      {errors.address && <span className="field-error">{errors.address.message}</span>}

      <label htmlFor="city">עיר</label>
      <input id="city" {...register('city', { required: 'יש להזין עיר' })} />
      {errors.city && <span className="field-error">{errors.city.message}</span>}

      <div className="form-row form-row-2">
        <div>
          <label htmlFor="addressFloor">קומה</label>
          <input id="addressFloor" {...register('addressFloor', { required: 'יש להזין קומה' })} />
          {errors.addressFloor && <span className="field-error">{errors.addressFloor.message}</span>}
        </div>
        <div>
          <label htmlFor="addressApartment">דירה / שם משפחה</label>
          <input id="addressApartment" {...register('addressApartment', { required: 'שדה חובה' })} />
          {errors.addressApartment && <span className="field-error">{errors.addressApartment.message}</span>}
        </div>
      </div>

      {mutation.isError && <ErrorMessage error={mutation.error} />}

      <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
        {mutation.isPending ? 'שומר...' : 'שמירת כתובת'}
      </button>
    </form>
  )
}
