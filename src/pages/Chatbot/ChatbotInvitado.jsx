// src/pages/Chatbot/ChatbotInvitado.jsx
//
// COMBINADO: tu ChatbotInvitado original + sistema de tokens.
//
// CAMBIOS respecto al original:
//  - Se agrega useGuestTokens para limitar mensajes (5 por defecto)
//  - El input se bloquea cuando tokens === 0
//  - Aparece banner de "iniciar sesion" cuando se agotan los tokens
//  - Los mensajes ahora muestran burbujas con avatar (igual al Chatbot principal)
//  - Se mantiene tu estructura visual: canvas, logo AVIS, titulo, subtitulo,
//    search-box, botones rapidos — todo intacto
//  - Se mantiene la llamada a sendMessage de chatService (backend real)

import { useState, useRef, useEffect } from "react"
import { Link }                         from "react-router-dom"
import { sendMessage }                  from "../../services/chatService"
import { useGuestTokens }               from "../../hooks/useGuestTokens"
import "../../assets/Styles/global.css"

const QUICK_QUESTIONS = [
  "¿Que es el SENA?",
  "¿Cuando abren las inscripciones?",
  "¿Ubicacion de instalaciones?",
]

const ChatbotInvitado = () => {
  const [input,      setInput]      = useState("")
  const [messages,   setMessages]   = useState([])
  const [isTyping,   setIsTyping]   = useState(false)
  const [hasStarted, setHasStarted] = useState(false) // false = pantalla bienvenida
  const messagesEndRef = useRef(null)

  // ── Sistema de tokens ─────────────────────────────────────────────────────
  const { tokens, maxTokens, isExhausted, consumeToken } = useGuestTokens(5)

  // Auto scroll al ultimo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // ── Enviar mensaje ────────────────────────────────────────────────────────
  const handleSend = async (overrideText) => {
    const text = (overrideText ?? input).trim()
    if (!text) return

    // Bloquear si no hay tokens
    if (isExhausted) return

    // Descontar token ANTES de enviar
    const ok = consumeToken()
    if (!ok) return

    // Cambiar a vista de chat si es el primer mensaje
    if (!hasStarted) setHasStarted(true)

    // Agregar mensaje del usuario
    setMessages((prev) => [...prev, {
      id:   Date.now(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    }])
    setInput("")
    setIsTyping(true)

    try {
      const response      = await sendMessage(text)
      const respuestaBot  = response.data ? response.data.respuesta : response.respuesta
      setMessages((prev) => [...prev, {
        id:   Date.now() + 1,
        role: "bot",
        text: respuestaBot || "Sin respuesta",
        time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      }])
    } catch {
      setMessages((prev) => [...prev, {
        id:   Date.now() + 1,
        role: "bot",
        text: "Error conectando con el servidor",
        time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <main>
        <canvas id="help-canvas"></canvas>

        {/* ── Pantalla de bienvenida (antes del primer mensaje) ── */}
        {!hasStarted && (
          <>
            <div className="help-logo">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="none" stroke="#3d9c3a" strokeWidth="3"/>
                <polygon points="60,22 92,40 92,76 60,94 28,76 28,40" fill="none" stroke="#3d9c3a" strokeWidth="1.5" opacity=".45"/>
                <line x1="60"  y1="6"   x2="60"  y2="22"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
                <line x1="108" y1="33"  x2="92"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
                <line x1="108" y1="87"  x2="92"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
                <line x1="60"  y1="114" x2="60"  y2="94"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
                <line x1="12"  y1="87"  x2="28"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
                <line x1="12"  y1="33"  x2="28"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
                <polygon points="60,32 80,60 60,88 40,60" fill="#3d9c3a" opacity=".12"/>
                <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke="#3d9c3a" strokeWidth="2"/>
                <path d="M50 80 L60 44 L70 80" stroke="#2b2b2b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <line x1="54" y1="69" x2="66" y2="69" stroke="#3d9c3a" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="60"  cy="6"   r="3.5" fill="#3d9c3a"/>
                <circle cx="108" cy="33"  r="3.5" fill="#3d9c3a"/>
                <circle cx="108" cy="87"  r="3.5" fill="#3d9c3a"/>
                <circle cx="60"  cy="114" r="3.5" fill="#3d9c3a"/>
                <circle cx="12"  cy="87"  r="3.5" fill="#3d9c3a"/>
                <circle cx="12"  cy="33"  r="3.5" fill="#3d9c3a"/>
              </svg>
              <div className="help-logo-text">
                <span className="brand">AVIS</span>
                <span className="tagline">El Futuro Es AVIS</span>
              </div>
            </div>
            <h1 className="help-title">BIENVENIDOS</h1>
            <p className="help-sub">Centro de ayuda y soporte de AVIS</p>
          </>
        )}

        {/* ── Vista de mensajes (despues del primer envio) ── */}
        {hasStarted && (
          <div className="messages-area" style={{ flex: 1, overflowY: "auto", padding: "20px 24px 8px" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.role}`}>
                {msg.role === "bot" && (
                  <div className="avatar bot-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                )}
                <div className="bubble-wrap">
                  <div className={`bubble ${msg.role}`}>{msg.text}</div>
                  <span className="msg-time">{msg.time}</span>
                </div>
                {msg.role === "user" && (
                  <div className="avatar user-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message-row bot">
                <div className="avatar bot-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div className="bubble bot typing-bubble">
                  <span className="dot"/><span className="dot"/><span className="dot"/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>
        )}

        {/* ── Banner tokens agotados ── */}
        {isExhausted && (
          <div style={{
            margin: "0 24px 12px",
            padding: "14px 18px",
            background: "#fef9ec",
            border: "1px solid #fbbf24",
            borderRadius: "10px",
            textAlign: "center",
          }}>
            <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "14px", color: "#92400e" }}>
              Alcanzaste el limite de mensajes gratuitos
            </p>
            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#78350f" }}>
              Inicia sesion para continuar sin limites
            </p>
            <Link to="/login" style={{
              display: "inline-block", padding: "8px 22px",
              background: "#1a3318", color: "#fff",
              borderRadius: "8px", textDecoration: "none",
              fontSize: "13px", fontWeight: "500",
            }}>
              Iniciar sesion
            </Link>
          </div>
        )}

        {/* ── Input box (tu diseno original + tokens) ── */}
        <div className="search-box">

          {/* Contador de tokens */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "11px", marginBottom: "6px",
            color: isExhausted ? "#ef4444" : tokens <= 2 ? "#f59e0b" : "#6b7280",
          }}>
            <span>Modo invitado</span>
            <span style={{ fontWeight: isExhausted ? "600" : "400" }}>
              {isExhausted ? "Sin mensajes" : `${tokens}/${maxTokens} mensajes`}
            </span>
          </div>

          {/* Barra de progreso de tokens */}
          <div style={{
            height: "3px", background: "#e5e7eb", borderRadius: "2px", marginBottom: "10px",
          }}>
            <div style={{
              height: "100%", borderRadius: "2px",
              width: `${(tokens / maxTokens) * 100}%`,
              background: isExhausted ? "#ef4444" : tokens <= 2 ? "#f59e0b" : "#3d9c3a",
              transition: "width 0.3s ease, background 0.3s",
            }}/>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder={isExhausted ? "Inicia sesion para continuar" : "Escribe tu pregunta"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExhausted}
            style={{ cursor: isExhausted ? "not-allowed" : "text", opacity: isExhausted ? 0.6 : 1 }}
          />

          <div className="search-actions">
            <button className="btn-mic" type="button" aria-label="Hablar" disabled={isExhausted}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="2" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8"  y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <button
              className="btn-send-search"
              type="button"
              aria-label="Enviar"
              onClick={() => handleSend()}
              disabled={isExhausted || !input.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Botones rapidos (solo en pantalla de bienvenida) ── */}
        {!hasStarted && (
          <div className="quick-questions">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                className="btn-quick"
                type="button"
                onClick={() => handleSend(q)}
                disabled={isExhausted}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default ChatbotInvitado