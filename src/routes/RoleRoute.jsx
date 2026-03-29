import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth()

  const hasPermission = allowedRoles.includes(user?.role)

  return hasPermission ? <Outlet /> : <Navigate to="/" replace />
}