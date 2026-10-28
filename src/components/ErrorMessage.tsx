interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = error instanceof Error ? error.message : 'אירעה שגיאה'

  return (
    <div className="error-box" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-light" onClick={onRetry}>
          נסי שוב
        </button>
      )}
    </div>
  )
}
