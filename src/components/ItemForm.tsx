import { useForm } from 'react-hook-form'
import { useCategories } from '../hooks/useCategories'
import { FormField } from './FormField'
import { ErrorMessage } from './ErrorMessage'
import type { ItemFormValues } from '../types'

const EMPTY_VALUES: ItemFormValues = {
  name: '',
  description: '',
  dailyPrice: 0,
  quantity: 1,
  minRentalAmount: 1,
  categoryId: '',
}

interface ItemFormProps {
  defaultValues?: ItemFormValues
  submitText: string
  isSubmitting: boolean
  submitError: unknown
  onSubmit: (values: ItemFormValues) => void
}

export function ItemForm({ defaultValues = EMPTY_VALUES, submitText, isSubmitting, submitError, onSubmit }: ItemFormProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormValues>({ defaultValues })

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField id="name" label="שם הפריט" error={errors.name}>
        <input
          id="name"
          {...register('name', {
            required: 'יש להזין שם',
            minLength: { value: 2, message: 'לפחות 2 תווים' },
            maxLength: { value: 80, message: 'עד 80 תווים' },
          })}
        />
      </FormField>

      <FormField id="categoryId" label="קטגוריה" error={errors.categoryId}>
        <select id="categoryId" disabled={categoriesLoading} {...register('categoryId', { required: 'יש לבחור קטגוריה' })}>
          <option value="">{categoriesLoading ? 'טוען קטגוריות...' : 'בחרי קטגוריה'}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="description" label="תיאור" error={errors.description}>
        <textarea
          id="description"
          rows={4}
          {...register('description', {
            required: 'יש להזין תיאור',
            minLength: { value: 10, message: 'לפחות 10 תווים' },
          })}
        />
      </FormField>

      <div className="form-row">
        <FormField id="dailyPrice" label="מחיר ליום (₪)" error={errors.dailyPrice}>
          <input
            id="dailyPrice"
            type="number"
            {...register('dailyPrice', {
              valueAsNumber: true,
              required: 'יש להזין מחיר',
              min: { value: 1, message: 'המחיר חייב להיות לפחות 1' },
              max: { value: 10000, message: 'מחיר גבוה מדי' },
            })}
          />
        </FormField>

        <FormField id="quantity" label="כמות" error={errors.quantity}>
          <input
            id="quantity"
            type="number"
            {...register('quantity', {
              valueAsNumber: true,
              required: 'יש להזין כמות',
              min: { value: 1, message: 'לפחות 1' },
              max: { value: 50, message: 'עד 50' },
            })}
          />
        </FormField>

        <FormField id="minRentalAmount" label="מינימום ימי השכרה" error={errors.minRentalAmount}>
          <input
            id="minRentalAmount"
            type="number"
            {...register('minRentalAmount', {
              valueAsNumber: true,
              min: { value: 1, message: 'לפחות יום אחד' },
              max: { value: 30, message: 'עד 30 ימים' },
            })}
          />
        </FormField>
      </div>

      {submitError != null && <ErrorMessage error={submitError} />}

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'שומר...' : submitText}
      </button>
    </form>
  )
}
