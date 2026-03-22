// src/routes/PrivateRoute.jsx — ACTUALIZADO
//
// Se agrega proteccion contra el boton atras del navegador post-logout.
//
// Como funciona:
//  - logout() en AuthContext llama setUser(null) de forma sincrona
//  - Cuando el usuario presiona "atras", React re-renderiza PrivateRoute
//  - user ya es null → redirige a /login con replace:true
//  - replace:true sobreescribe la entrada del historial, asi el boton
//    atras desde /login no regresa a la ruta protegida

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth }          from '../hooks/useAuth'

export const PrivateRoute = () => {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}