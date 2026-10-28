const TOKEN_KEY = 'common.token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'הפרטים שנשלחו אינם תקינים',
  401: 'יש להתחבר מחדש',
  403: 'אין לך הרשאה לפעולה הזו',
  404: 'המידע המבוקש לא נמצא',
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`/api${path}`, { ...options, headers })
  } catch {
    throw new ApiError(0, 'אין חיבור לשרת. בדקי את החיבור לאינטרנט.')
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.message || data?.title || STATUS_MESSAGES[response.status] || 'אירעה שגיאה בשרת'
    throw new ApiError(response.status, message)
  }

  return data as T
}
