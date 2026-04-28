/*
  AVIS – Instructor Layout
  InstructorLayout.jsx — RESPONSIVE
  
  Breakpoints:
    mobile  : < 600px  → topbar compacto, email oculto
    tablet  : < 900px  → topbar reducido
    desktop : ≥ 900px  → layout original
*/

import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

/* ══════════════════════════════════════
   HOOK: tamaño de ventana
══════════════════════════════════════ */
function useWindowSize() {
  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth  : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  })
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return size
}

const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  green:    "#3d9c3a",
  greenL:   "#52c44f",
  greenBg:  "#1a3a1a",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
  red:      "#e05555",
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
const useToast = () => {
  const [toasts, setToasts] = useState([])
  const showToast = (type, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }
  return { toasts, showToast }
}

const ToastContainer = ({ toasts }) => (
  <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === "success" ? "#1a3a1a" : "#3a1a1a",
        border: `1px solid ${t.type === "success" ? C.greenL : C.red}`,
        color: t.type === "success" ? C.greenL : C.red,
        padding:"12px 20px", borderRadius:8,
        fontFamily:"'Outfit', sans-serif", fontSize:".85rem",
        boxShadow:"0 4px 20px rgba(0,0,0,.4)",
        animation:"slideIn .2s ease",
        maxWidth:"calc(100vw - 48px)",
      }}>
        {t.type === "success" ? "✓" : "✗"} {t.message}
      </div>
    ))}
  </div>
)

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function InstructorLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const { w } = useWindowSize()

  const isMobile = w < 600
  const isTablet = w < 900

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Email truncado para pantallas pequeñas
  const emailDisplay = (() => {
    const email = user?.email || ""
    if (isMobile && email.length > 16) return email.slice(0, 14) + "…"
    if (isTablet && email.length > 28) return email.slice(0, 26) + "…"
    return email
  })()

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      height:"100vh", background:C.black,
      fontFamily:"'Outfit', sans-serif",
      overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap');
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* Tabla del QuestionsPanel responsive dentro del InstructorLayout */
        .instructor-content table {
          min-width: 480px;
        }
        .instructor-content .questions-table-outer {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* ── Topbar ── */}
      <header style={{
        height: isMobile ? 50 : 56,
        background: C.dark,
        borderBottom: `1px solid ${C.border}`,
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        padding: isMobile ? "0 12px" : "0 28px",
        flexShrink:0,
        gap:8,
        overflow:"hidden",
      }}>

        {/* Izquierda: título + badge */}
        <div style={{
          display:"flex", alignItems:"center",
          gap: isMobile ? 8 : 12,
          minWidth:0, flexShrink:1,
          overflow:"hidden",
        }}>
          <span style={{
            fontFamily:"'Bebas Neue', sans-serif",
            fontSize: isMobile ? "1rem" : "1.3rem",
            letterSpacing:".1em",
            color:C.greenL,
            whiteSpace:"nowrap",
            flexShrink:0,
          }}>
            {isMobile ? "INSTRUCTOR" : "PANEL INSTRUCTOR"}
          </span>
          <span style={{
            background:C.greenBg,
            border:`1px solid ${C.greenL}`,
            color:C.greenL,
            fontSize: isMobile ? ".55rem" : ".6rem",
            fontWeight:700,
            letterSpacing:".1em",
            padding: isMobile ? "2px 6px" : "2px 8px",
            borderRadius:20,
            textTransform:"uppercase",
            whiteSpace:"nowrap",
            flexShrink:0,
          }}>
            Solo lectura
          </span>
        </div>

        {/* Derecha: email + botón salir */}
        <div style={{
          display:"flex", alignItems:"center",
          gap: isMobile ? 8 : 16,
          flexShrink:0,
        }}>
          {/* Email — oculto en móvil muy pequeño */}
          {w > 360 && (
            <span style={{
              color:C.gray,
              fontSize: isMobile ? ".72rem" : ".82rem",
              overflow:"hidden",
              textOverflow:"ellipsis",
              whiteSpace:"nowrap",
              maxWidth: isMobile ? 120 : isTablet ? 180 : "none",
            }}>
              {emailDisplay}
            </span>
          )}

          <button
            onClick={handleLogout}
            style={{
              background:"transparent",
              border:`1px solid rgba(224,85,85,0.4)`,
              color:C.red,
              padding: isMobile ? "5px 10px" : "6px 14px",
              borderRadius:6,
              fontSize: isMobile ? ".68rem" : ".75rem",
              fontWeight:600,
              cursor:"pointer",
              letterSpacing:".05em",
              transition:"all .2s",
              whiteSpace:"nowrap",
              flexShrink:0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(224,85,85,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            SALIR
          </button>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      {/*
        readOnly: true → QuestionsPanel oculta botones de edición
        isMobile, isTablet → para ajustes internos del panel
      */}
      <div
        className="instructor-content"
        style={{
          flex:1,
          display:"flex",
          minHeight:0,
          overflow:"hidden",
        }}
      >
        <Outlet context={{ showToast, readOnly: true, isMobile, isTablet }} />
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  )
}