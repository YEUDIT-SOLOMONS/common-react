import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorMessage } from '../components/ErrorMessage'
import type { RegisterValues } from '../types'

const PHONE_PATTERN = /^(?:0[57]\d{8}|0[2-489]\d{7})$/

export function RegisterPage() {
  const { user, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<unknown>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ defaultValues: { termsAccepted: false } })

  if (user) return <Navigate to="/items" replace />

  async function onSubmit(values: RegisterValues) {
    setServerError(null)
    try {
      await registerUser({ ...values, phone: values.phone.replace(/\D/g, '') })
      navigate('/items', { replace: true })
    } catch (error) {
      setServerError(error)
    }
  }

  return (
    <section className="auth-page">
      <img src="/favicon.svg" alt="" className="auth-logo" />
      <h1>הצטרפות לקהילה</h1>
      <p className="auth-subtitle">כמה פרטים ואת בפנים</p>
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="name">שם מלא</label>
        <input
          id="name"
          autoComplete="name"
          {...register('name', {
            required: 'יש להזין שם מלא',
            minLength: { value: 2, message: 'לפחות 2 תווים' },
          })}
        />
        {errors.name && <span className="field-error">{errors.name.message}</span>}

        <label htmlFor="email">אימייל</label>
        <input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          {...register('email', {
            required: 'יש להזין אימייל',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'כתובת אימייל לא תקינה' },
          })}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}

        <label htmlFor="phone">טלפון</label>
        <input
          id="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          {...register('phone', {
            required: 'יש להזין טלפון',
            validate: (value) => PHONE_PATTERN.test(value.replace(/\D/g, '')) || 'מספר לא תקין, למשל 0521234567',
          })}
        />
        {errors.phone && <span className="field-error">{errors.phone.message}</span>}

        <label htmlFor="password">סיסמה</label>
        <input
          id="password"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          {...register('password', {
            required: 'יש להזין סיסמה',
            minLength: { value: 6, message: 'לפחות 6 תווים' },
            validate: (value) => (/[a-zA-Z]/.test(value) && /\d/.test(value)) || 'הסיסמה צריכה לכלול אותיות וספרות',
          })}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}

        <label className="checkbox-label">
          <input type="checkbox" {...register('termsAccepted', { required: 'יש לאשר את תנאי השימוש' })} />
          קראתי ואני מאשרת את{' '}
          <a href="https://commonrent.web.app/terms" target="_blank" rel="noreferrer">
            תנאי השימוש
          </a>
        </label>
        {errors.termsAccepted && <span className="field-error">{errors.termsAccepted.message}</span>}

        {serverError != null && <ErrorMessage error={serverError} />}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'נרשמת...' : 'הצטרפות'}
        </button>
      </form>
      <p className="auth-switch">
        כבר יש לך חשבון? <Link to="/login">התחברות</Link>
      </p>
    </section>
  )
}
