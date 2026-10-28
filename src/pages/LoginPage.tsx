import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorMessage } from '../components/ErrorMessage'
import type { LoginValues } from '../types'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<unknown>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>()

  const from = (location.state as { from?: string } | null)?.from ?? '/items'

  if (user) return <Navigate to={from} replace />

  async function onSubmit(values: LoginValues) {
    setServerError(null)
    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(error)
    }
  }

  return (
    <section className="auth-page">
      <img src="/favicon.svg" alt="" className="auth-logo" />
      <h1>התחברות</h1>
      <p className="auth-subtitle">שמחות לראות אותך שוב!</p>
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <label htmlFor="password">סיסמה</label>
        <input
          id="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          {...register('password', {
            required: 'יש להזין סיסמה',
            minLength: { value: 6, message: 'לפחות 6 תווים' },
          })}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}

        {serverError != null && <ErrorMessage error={serverError} />}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'מתחברת...' : 'התחברות'}
        </button>
      </form>
      <p className="auth-switch">
        עדיין אין לך חשבון? <Link to="/register">הצטרפות לקהילה</Link>
      </p>
    </section>
  )
}
