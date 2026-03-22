// src/routes/RoleRoute.jsx
//
// Guard de roles.
// Si el usuario tiene el rol requerido → renderiza la ruta hijo (Outlet)
// Si NO tiene el rol → redirige a / (home)
//
// Uso en AppRoutes.jsx (siempre DENTRO de PrivateRoute):
//   <Route element={<PrivateRoute />}>
//     <Route element={<RoleRoute allowedRoles={['admin']} />}>
//       <Route path="/database" element={<DataManager />} />
//     </Route>
//   </Route>

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth()

  const hasPermission = allowedRoles.includes(user?.role)

  return hasPermission ? <Outlet /> : <Navigate to="/" replace />
}