import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormField } from '../components/FormField'
import { ErrorMessage } from '../components/ErrorMessage'
import { EMAIL_RULES, NEW_PASSWORD_RULES, PHONE_RULES, onlyDigits } from '../validation'
import type { RegisterValues } from '../types'

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
      await registerUser({ ...values, phone: onlyDigits(values.phone) })
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
        <FormField id="name" label="שם מלא" error={errors.name}>
          <input
            id="name"
            autoComplete="name"
            {...register('name', { required: 'יש להזין שם מלא', minLength: { value: 2, message: 'לפחות 2 תווים' } })}
          />
        </FormField>

        <FormField id="email" label="אימייל" error={errors.email}>
          <input id="email" type="email" dir="ltr" autoComplete="email" {...register('email', EMAIL_RULES)} />
        </FormField>

        <FormField id="phone" label="טלפון" error={errors.phone}>
          <input id="phone" type="tel" dir="ltr" autoComplete="tel" {...register('phone', PHONE_RULES)} />
        </FormField>

        <FormField id="password" label="סיסמה" error={errors.password}>
          <input
            id="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            {...register('password', NEW_PASSWORD_RULES)}
          />
        </FormField>

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
