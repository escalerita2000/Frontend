// src/pages/Chatbot/ChatHistory.jsx
//
// Página de historial del chatbot.
// Muestra los chats guardados como acordeones expandibles.
// Botón de regreso para volver al Chatbot.
// Icono de usuario/foto de perfil arriba a la izquierda.
// Botón de cerrar sesión arriba a la derecha.

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getChatHistory } from "../../services/chatService"

/* ══════════════════════════════════════
   SVG LOGO AVIS
══════════════════════════════════════ */
const AvisLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke="#3d9c3a" strokeWidth="3"/>
    <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke="#3d9c3a" strokeWidth="1.5" opacity=".45"/>
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
)

/* ══════════════════════════════════════
   ACORDEÓN INDIVIDUAL
══════════════════════════════════════ */
const AccordionItem = ({ title, messages, isOpen, onToggle }) => {
  const contentRef = useRef(null)

  return (
    <div style={{
      width: "100%",
      border: "1.5px solid #3d9c3a",
      borderRadius: 8,
      overflow: "hidden",
      background: "#fff",
      transition: "box-shadow .2s",
      boxShadow: isOpen ? "0 2px 16px rgba(61,156,58,.15)" : "none",
    }}>
      {/* Header del acordeón */}
      <button
        onClick={onToggle}
        style={{
          all: "unset", boxSizing: "border-box",
          width: "100%", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px", cursor: "pointer",
          background: isOpen ? "rgba(61,156,58,.06)" : "#fff",
          transition: "background .2s",
        }}
        onMouseEnter={e => { if(!isOpen) e.currentTarget.style.background = "rgba(61,156,58,.04)" }}
        onMouseLeave={e => { if(!isOpen) e.currentTarget.style.background = "#fff" }}
      >
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: ".82rem", fontWeight: 700,
          letterSpacing: ".18em", textTransform: "uppercase",
          color: "#2b2b2b",
        }}>
          {title}
        </span>
        {/* Chevron */}
        <svg
          width="20" height="20"
          viewBox="0 0 24 24" fill="none"
          stroke="#3d9c3a" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .25s", flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Contenido expandible */}
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height .35s ease",
        }}
      >
        <div style={{
          padding: "0 22px 18px",
          display: "flex", flexDirection: "column", gap: 12,
          borderTop: "1px solid rgba(61,156,58,.15)",
          paddingTop: 16,
        }}>
          {messages && messages.length > 0 ? (
            messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end", gap: 8,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  overflow: "hidden",
                  background: msg.role === "user" ? "#c7c3e8" : "#d4edda",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(61,156,58,.2)"
                }}>
                  {msg.role === "user" && msg.avatar ? (
                    <img src={msg.avatar} alt="u" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={msg.role === "user" ? "#5c5898" : "#2a6e28"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
                    </svg>
                  )}
                </div>
                {/* Burbuja */}
                <div style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? "#3d9c3a" : "#f0f4f0",
                  color: msg.role === "user" ? "#fff" : "#2b2b2b",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: ".84rem", lineHeight: 1.5,
                }}>
                  {msg.text || msg.content || msg.message || ""}
                  {msg.time && (
                    <div style={{ 
                      fontSize: ".65rem", 
                      color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "#888", 
                      marginTop: 4, 
                      textAlign: msg.role === "user" ? "right" : "left" 
                    }}>
                      {msg.time}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: ".82rem", color: "#888", textAlign: "center", padding: "8px 0" }}>
              Sin mensajes en este chat
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   DATOS DE EJEMPLO (para cuando no hay API)
══════════════════════════════════════ */
const FALLBACK_HISTORY = [
  {
    id: "h1",
    title: "HISTORIAL DE AVIS",
    messages: [
      { role: "user", text: "¿Qué es AVIS?", time: "10:30" },
      { role: "bot",  text: "AVIS es tu centro de gestión, comunicación y análisis.", time: "10:30" },
    ],
  },
  {
    id: "h2",
    title: "DURACION DE MI FORMACION",
    messages: [
      { role: "user", text: "¿Cuánto dura mi formación?", time: "11:00" },
      { role: "bot",  text: "La duración depende del programa inscrito. Puedes consultarlo en tu ficha.", time: "11:01" },
    ],
  },
  {
    id: "h3",
    title: "DURACION DEL CONTRATO DE APRENDIZAJE",
    messages: [
      { role: "user", text: "¿Cuánto dura el contrato de aprendizaje?", time: "11:20" },
      { role: "bot",  text: "El contrato de aprendizaje tiene una duración equivalente a la etapa práctica de tu formación.", time: "11:21" },
    ],
  },
  {
    id: "h4",
    title: "REALIZAR UNA PQR",
    messages: [
      { role: "user", text: "¿Cómo realizo una PQR?", time: "12:00" },
      { role: "bot",  text: "Puedes realizar una PQR ingresando al portal SENA y seleccionando la opción de peticiones.", time: "12:01" },
    ],
  },
  {
    id: "h5",
    title: "INICIO DE LA ETAPA PRACTICA",
    messages: [],
  },
]

/* ══════════════════════════════════════
   COMPONENT PRINCIPAL
══════════════════════════════════════ */
export default function ChatHistory() {
  const { user: authUser } = useAuth()
  const [history,    setHistory]    = useState([])
  const [openId,     setOpenId]     = useState(null) 
  const [loading,    setLoading]    = useState(true)
  const [userPhoto,  setUserPhoto]  = useState(null)
  const navigate = useNavigate()

  // Sincronizar foto desde el contexto de autenticación
  useEffect(() => {
    if (authUser) {
      const avatar = authUser.avatar_url || authUser.avatar || authUser.photo || authUser.profile_photo_url
      setUserPhoto(avatar)
    }
  }, [authUser])

  /* ── Cargar historial desde API ── */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res  = await getChatHistory()
        const data = res.data || res

        if (Array.isArray(data) && data.length > 0) {
          // Si la API ya lo devuelve agrupado (futura mejora)
          if (data[0]?.messages) {
            setHistory(data.map((chat, i) => ({
              id:       chat.id || `h${i}`,
              title:    chat.title || `Chat ${i + 1}`,
              messages: chat.messages || [],
            })))
            setOpenId(data[0]?.id || "h0")
          } else {
            // AGRUPAR POR SESSION_ID (Lógica Premium)
            const sessions = {}
            const userAvatar = authUser?.avatar_url || authUser?.avatar || authUser?.photo || authUser?.profile_photo_url

            data.forEach((msg) => {
              const sId = msg.session_id || 'legacy-session'
              if (!sessions[sId]) sessions[sId] = []
              
              sessions[sId].push({
                role: msg.role === "user" ? "user" : "bot",
                text: msg.content || msg.message || msg.text || "",
                avatar: msg.role === "user" ? userAvatar : null,
                time: msg.created_at
                  ? new Date(msg.created_at).toLocaleTimeString("es-CO", { hour:"2-digit", minute:"2-digit" })
                  : "",
              })
            })

            const groupedHistory = Object.keys(sessions).map((sId) => {
              const msgs = sessions[sId]
              const firstUserMsg = msgs.find(m => m.role === 'user')?.text
              const title = firstUserMsg 
                ? firstUserMsg.slice(0, 30).toUpperCase() + (firstUserMsg.length > 30 ? "…" : "")
                : "CONSULTA SIN TÍTULO"

              return {
                id: sId,
                title: title,
                messages: msgs
              }
            }).reverse() // Mostrar los más nuevos primero

            setHistory(groupedHistory)
            if (groupedHistory.length > 0) setOpenId(groupedHistory[0].id)
          }
        } else {
          // Sin datos — usar fallback para mostrar la UI
          setHistory(FALLBACK_HISTORY)
        }
      } catch (err) {
        console.error("Error cargando historial:", err)
        setHistory(FALLBACK_HISTORY)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()

  }, [authUser])

  const toggleItem = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        @keyframes chFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{
        width: "100vw", minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "'Outfit', sans-serif",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        position: "relative",
        paddingBottom: 48,
      }}>

        {/* ── Avatar usuario — top left ── */}
        <div style={{ position: "fixed", top: 16, left: 20, zIndex: 50 }}>
          {userPhoto ? (
            <img
              src={userPhoto} alt="usuario"
              style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(61,156,58,.3)", cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />
          ) : (
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "#c7c3e8", display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", border: "2px solid rgba(61,156,58,.2)",
            }}
              onClick={() => navigate(-1)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5c5898" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
              </svg>
            </div>
          )}
        </div>

        {/* ── Botón cerrar sesión / volver — top right ── */}
        <button
          onClick={() => navigate(-1)}
          title="Volver al chat"
          style={{
            all: "unset", cursor: "pointer",
            position: "fixed", top: 16, right: 20, zIndex: 50,
            color: "#2a6e28", display: "flex", alignItems: "center",
            padding: "6px 8px", borderRadius: 8,
            transition: "background .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(61,156,58,.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          {/* Ícono de salida (igual al del Chatbot) */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>

        {/* ── Logo + Marca ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", marginTop: 48, marginBottom: 32,
          animation: "chFadeIn .7s ease both",
        }}>
          <AvisLogo size={80}/>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", letterSpacing: ".06em", color: "#2b2b2b" }}>
              AVIS
            </span>
            <span style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".28em", textTransform: "uppercase", color: "#3d9c3a", marginTop: 2 }}>
              El Futuro Es AVIS
            </span>
          </div>
        </div>

        {/* ── Lista de acordeones ── */}
        <div style={{
          width: "100%", maxWidth: 600,
          display: "flex", flexDirection: "column", gap: 12,
          padding: "0 24px",
          animation: "chFadeIn .7s .1s ease both",
        }}>
          {loading ? (
            /* Skeleton loader */
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                width: "100%", height: 58,
                background: "#e8e8e8", borderRadius: 8,
                animation: `chFadeIn .4s ${i * .08}s ease both`,
              }}/>
            ))
          ) : (
            history.map((item, i) => (
              <div key={item.id} style={{ animation: `chFadeIn .45s ${i * .07}s ease both` }}>
                <AccordionItem
                  title={item.title}
                  messages={item.messages}
                  isOpen={openId === item.id}
                  onToggle={() => toggleItem(item.id)}
                />
              </div>
            ))
          )}

          {!loading && history.length === 0 && (
            <p style={{
              textAlign: "center", color: "#888",
              fontFamily: "'Outfit', sans-serif", fontSize: ".9rem",
              marginTop: 32,
            }}>
              No hay historial disponible
            </p>
          )}
        </div>

      </div>
    </>
  )
}