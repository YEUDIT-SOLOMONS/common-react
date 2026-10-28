import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminRoute() {
  const { canViewDashboard } = useAuth()
  return canViewDashboard ? <Outlet /> : <Navigate to="/items" replace />
}
