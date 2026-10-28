import { useForm } from 'react-hook-form'
import { useCategories } from '../hooks/useCategories'
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
      <label htmlFor="name">שם הפריט</label>
      <input
        id="name"
        {...register('name', {
          required: 'יש להזין שם',
          minLength: { value: 2, message: 'לפחות 2 תווים' },
          maxLength: { value: 80, message: 'עד 80 תווים' },
        })}
      />
      {errors.name && <span className="field-error">{errors.name.message}</span>}

      <label htmlFor="categoryId">קטגוריה</label>
      <select id="categoryId" disabled={categoriesLoading} {...register('categoryId', { required: 'יש לבחור קטגוריה' })}>
        <option value="">{categoriesLoading ? 'טוען קטגוריות...' : 'בחרי קטגוריה'}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      {errors.categoryId && <span className="field-error">{errors.categoryId.message}</span>}

      <label htmlFor="description">תיאור</label>
      <textarea
        id="description"
        rows={4}
        {...register('description', {
          required: 'יש להזין תיאור',
          minLength: { value: 10, message: 'לפחות 10 תווים' },
        })}
      />
      {errors.description && <span className="field-error">{errors.description.message}</span>}

      <div className="form-row">
        <div>
          <label htmlFor="dailyPrice">מחיר ליום (₪)</label>
          <input
            id="dailyPrice"
            type="number"
            step="1"
            {...register('dailyPrice', {
              valueAsNumber: true,
              required: 'יש להזין מחיר',
              min: { value: 1, message: 'המחיר חייב להיות לפחות 1' },
              max: { value: 10000, message: 'מחיר גבוה מדי' },
            })}
          />
          {errors.dailyPrice && <span className="field-error">{errors.dailyPrice.message}</span>}
        </div>

        <div>
          <label htmlFor="quantity">כמות</label>
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
          {errors.quantity && <span className="field-error">{errors.quantity.message}</span>}
        </div>

        <div>
          <label htmlFor="minRentalAmount">מינימום ימי השכרה</label>
          <input
            id="minRentalAmount"
            type="number"
            {...register('minRentalAmount', {
              valueAsNumber: true,
              min: { value: 1, message: 'לפחות יום אחד' },
              max: { value: 30, message: 'עד 30 ימים' },
            })}
          />
          {errors.minRentalAmount && <span className="field-error">{errors.minRentalAmount.message}</span>}
        </div>
      </div>

      {submitError != null && <ErrorMessage error={submitError} />}

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'שומר...' : submitText}
      </button>
    </form>
  )
}
