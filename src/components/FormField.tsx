import type { ReactNode } from 'react'
import type { FieldError } from 'react-hook-form'

interface FormFieldProps {
  id: string
  label: string
  error?: FieldError
  children: ReactNode
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field-error">{error.message}</span>}
    </div>
  )
}
