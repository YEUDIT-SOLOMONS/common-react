import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="empty">
      <h1>הדף לא נמצא</h1>
      <Link to="/items" className="btn btn-primary">
        חזרה לרשימת הציוד
      </Link>
    </section>
  )
}
