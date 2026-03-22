// src/hooks/useAuth.js
//
// Hook personalizado para consumir AuthContext.
// Uso en cualquier componente:
//   const { user, login, logout, isAdmin } = useAuth()

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      'useAuth debe usarse dentro de <AuthProvider>. ' +
      'Asegurate de envolver tu app con <AuthProvider> en main.jsx'
    )
  }

  return ctx
}