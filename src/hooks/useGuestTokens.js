// src/hooks/useGuestTokens.js
//
// Maneja el sistema de tokens para ChatbotInvitado.
// Completamente independiente del chat — solo sabe contar.
//
// Persiste en localStorage para que el limite sobreviva recargas.

const STORAGE_KEY = 'avis_guest_tokens'
const MAX_TOKENS  = 5   // <-- cambia este numero segun tu negocio

import { useState, useCallback } from 'react'

export const useGuestTokens = (max = MAX_TOKENS) => {
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      const parsed = parseInt(saved, 10)
      return isNaN(parsed) ? max : parsed
    }
    return max
  })

  const isExhausted = tokens <= 0

  // Descuenta un token. Devuelve true si se pudo, false si ya no hay.
  const consumeToken = useCallback(() => {
    if (tokens <= 0) return false
    const next = tokens - 1
    setTokens(next)
    localStorage.setItem(STORAGE_KEY, String(next))
    return true
  }, [tokens])

  // Llamalo cuando el invitado inicie sesion para limpiar el limite
  const resetTokens = useCallback(() => {
    setTokens(max)
    localStorage.removeItem(STORAGE_KEY)
  }, [max])

  return { tokens, maxTokens: max, isExhausted, consumeToken, resetTokens }
}