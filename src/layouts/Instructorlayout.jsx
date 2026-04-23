import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import QuestionsPanel from "../pages/Dashboard/QuestionsPanel"

const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  green:    "#3d9c3a",
  greenL:   "#52c44f",
  greenBg:  "#1a3a1a",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
}

// ── Toast simple (mismo estilo que el admin) ──────────────────────────────────
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
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === 'success' ? '#1a3a1a' : '#3a1a1a',
        border: `1px solid ${t.type === 'success' ? C.greenL : '#e05555'}`,
        color: t.type === 'success' ? C.greenL : '#e05555',
        padding: '12px 20px', borderRadius: 8,
        fontFamily: "'Outfit', sans-serif", fontSize: '.85rem',
        boxShadow: '0 4px 20px rgba(0,0,0,.4)',
        animation: 'slideIn .2s ease',
      }}>
        {t.type === 'success' ? '✓' : '✗'} {t.message}
      </div>
    ))}
  </div>
)

export default function InstructorLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.black, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <header style={{
        height: 56,
        background: C.dark,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        flexShrink: 0,
      }}>
        {/* Logo / título */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.3rem",
            letterSpacing: ".1em",
            color: C.greenL,
          }}>
            PANEL INSTRUCTOR
          </span>
          <span style={{
            background: C.greenBg,
            border: `1px solid ${C.greenL}`,
            color: C.greenL,
            fontSize: ".6rem",
            fontWeight: 700,
            letterSpacing: ".1em",
            padding: "2px 8px",
            borderRadius: 20,
            textTransform: "uppercase",
          }}>
            Solo lectura
          </span>
        </div>

        {/* Usuario + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: C.gray, fontSize: ".82rem" }}>
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: `1px solid rgba(224,85,85,0.4)`,
              color: "#e05555",
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: ".75rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: ".05em",
              transition: "all .2s",
            }}
            onMouseEnter={e => e.target.style.background = "rgba(224,85,85,0.1)"}
            onMouseLeave={e => e.target.style.background = "transparent"}
          >
            SALIR
          </button>
        </div>
      </header>

      {/* ── Contenido principal ────────────────────────────────────────────── */}
      {/*
        Le pasamos showToast por context (igual que el AdminLayout)
        y readOnly={true} para que QuestionsPanel deshabilite edición
      */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Outlet context={{ showToast }} />
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  )
}