import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormField } from '../components/FormField'
import { ErrorMessage } from '../components/ErrorMessage'
import { EMAIL_RULES } from '../validation'
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
        <FormField id="email" label="אימייל" error={errors.email}>
          <input id="email" type="email" dir="ltr" autoComplete="email" {...register('email', EMAIL_RULES)} />
        </FormField>

        <FormField id="password" label="סיסמה" error={errors.password}>
          <input
            id="password"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            {...register('password', { required: 'יש להזין סיסמה' })}
          />
        </FormField>

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
