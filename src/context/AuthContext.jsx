// src/context/AuthContext.jsx — ACTUALIZADO
// logout() limpia user + localStorage ANTES de redirigir.
// Esto garantiza que PrivateRoute bloquee el boton atras del navegador.

import { createContext, useState, useEffect } from 'react'
import { mockLogin } from '../services/authMock'
import { loginUser, registerUser } from '../services/authService'

// ─── MODO DE LOGIN ────────────────────────────────────────────────────────────
// true  → usa authMock.js (sin backend, para desarrollo/pruebas)
// false → llama al backend real en http://127.0.0.1:8000
// ─────────────────────────────────────────────────────────────────────────────
const USE_MOCK_LOGIN = false  // ← cambia a false cuando conectes el backend

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('authUser')
    if (saved) {
      try { setUser(JSON.parse(saved)) }
      catch { localStorage.removeItem('authUser') }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    let userData
    if (USE_MOCK_LOGIN) {
      userData = await mockLogin(email, password)
    } else {
      const result = await loginUser({ email, password })
      userData = result.user
    }
    setUser(userData)
    localStorage.setItem('authUser', JSON.stringify(userData))
    return userData
  }

  const register = async (name, email, password) => {
    const result = await registerUser({ name, email, password })
    const userData = result.user
    setUser(userData)
    localStorage.setItem('authUser', JSON.stringify(userData))
    return userData
  }

  // Orden critico:
  // 1. setUser(null)       -> PrivateRoute ya no deja pasar (sincrono)
  // 2. limpiar storage     -> no queda sesion persistida
  // La navegacion a /login la hace el componente con navigate('/login', { replace: true })
  const logout = () => {
    setUser(null)
    localStorage.removeItem('authUser')
    localStorage.removeItem('token')
    localStorage.removeItem('avis_guest_tokens')
  }

  const isAdmin      = user?.role === 'admin'
  const isAprendiz   = user?.role === 'aprendiz'
  const isUser       = user?.role === 'user'
  const isInstructor = user?.role === 'instructor'
  const hasRole      = (role)  => user?.role === role
  const hasAnyRole   = (roles) => roles.includes(user?.role)

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAdmin, isAprendiz, isUser, isInstructor, hasRole, hasAnyRole }}>
      {children}
    </AuthContext.Provider>
  )
}