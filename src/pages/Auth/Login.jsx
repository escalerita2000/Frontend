// src/pages/Auth/Login.jsx
//
// ACTUALIZADO:
//  - Placeholders en minúscula (fix del texto en mayúsculas al escribir)
//  - Se agrega onKeyDown para submit con Enter
//  - Error visible debajo del form en lugar de alert()
//  - Todo el diseño AVIS original intacto

import { useState }          from "react"
import { useAuth }           from "../../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"

function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Completa todos los campos")
      return
    }

    setLoading(true)
    try {
      const user = await login(email, password)

      if (user.role === "aprendiz") {
        navigate("/chatbot")
      } else if (user.role === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(err.message || "Credenciales incorrectas")
    } finally {
      setLoading(false)
    }
  }

  // Permite hacer submit presionando Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <>
      <Link to="/ChatbotInvitado" className="guest-badge" style={{ textDecoration: "none", color: "inherit" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span>INVITADO</span>
      </Link>

      <main>
        <canvas id="login-canvas"></canvas>
        <div className="login-card">

          <div className="login-logo">
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
            <div className="login-logo-text">
              <span className="brand">AVIS</span>
              <span className="tagline">El Futuro Es AVIS</span>
            </div>
          </div>

          <h1 className="login-title">Inicio de Sesion</h1>

          <div className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Error visible — reemplaza el alert() */}
            {error && (
              <p style={{
                color: "#ef4444",
                fontSize: "12px",
                margin: "4px 0 0",
                textAlign: "center",
                fontFamily: "inherit",
              }}>
                {error}
              </p>
            )}

            <Link to="/RecoverPassword" className="forgot">¿Olvidaste tu contraseña?</Link>

            <button
              className="btn-login"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </div>

        </div>
      </main>
    </>
  )
}

export default Login
