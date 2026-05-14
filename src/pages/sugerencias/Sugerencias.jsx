import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./sugerencias.css"

const TIPOS = [
  "Sugerencia de mejora",
  "Reporte de error",
  "Solicitud de ayuda",
  "Otra",
]

const AvisLogo = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <polygon
      points="60,6 108,33 108,87 60,114 12,87 12,33"
      fill="none"
      stroke="#3d9c3a"
      strokeWidth="3"
    />

    <polygon
      points="60,22 92,40 92,76 60,94 28,76 28,40"
      fill="none"
      stroke="#3d9c3a"
      strokeWidth="1.5"
      opacity=".45"
    />

    <polygon
      points="60,32 80,60 60,88 40,60"
      fill="rgba(61,156,58,.12)"
      stroke="#3d9c3a"
      strokeWidth="2"
    />

    <path
      d="M50 80 L60 44 L70 80"
      stroke="#2b2b2b"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    <line
      x1="54"
      y1="69"
      x2="66"
      y2="69"
      stroke="#3d9c3a"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
)

export default function Sugerencias() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const [hoverTipo, setHoverTipo] = useState(null)

  const [form, setForm] = useState({
    tipo: "",
    titulo: "",
    descripcion: "",
    email: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext("2d")

    let width
    let height
    let particles = []
    let animationFrame

    const resizeCanvas = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
    })

    const init = () => {
      resizeCanvas()

      particles = Array.from(
        { length: Math.floor((width * height) / 16000) },
        createParticle
      )
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = "#3d9c3a"
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y

          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 130) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(61,156,58,${1 - distance / 130})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationFrame = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      cancelAnimationFrame(animationFrame)
      init()
      draw()
    }

    window.addEventListener("resize", handleResize)

    init()
    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const updateField = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.tipo) {
      newErrors.tipo = "Selecciona un tipo"
    }

    if (!form.titulo.trim()) {
      newErrors.titulo = "Ingresa un título"
    }

    if (form.descripcion.trim().length < 20) {
      newErrors.descripcion = "La descripción debe tener mínimo 20 caracteres"
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Correo inválido"
    }

    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))

      setSent(true)
    } catch (error) {
      setErrors({
        general: "No se pudo enviar la sugerencia",
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="avis-sg-success-page">
        <canvas ref={canvasRef} className="avis-sg-canvas" />

        <div className="avis-sg-success-box">
          <div className="avis-sg-success-icon">
            ✓
          </div>

          <h1>¡Gracias por tu aporte!</h1>

          <p>
            Tu sugerencia fue enviada correctamente.
            El equipo AVIS revisará tu mensaje.
          </p>

          <div className="avis-sg-success-actions">
            <button
              onClick={() => {
                setSent(false)

                setForm({
                  tipo: "",
                  titulo: "",
                  descripcion: "",
                  email: "",
                })
              }}
            >
              ENVIAR OTRA
            </button>

            <button
              className="avis-sg-primary-btn"
              onClick={() => navigate("/")}
            >
              VOLVER AL HOME
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="avis-sg-page">
      <canvas ref={canvasRef} className="avis-sg-canvas" />

      <button
        className="avis-sg-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <div className="avis-sg-container">
        <div className="avis-sg-logo-area">
          <AvisLogo size={72} />

          <h2>AVIS</h2>

          <span>EL FUTURO ES AVIS</span>
        </div>

        <div className="avis-sg-header">
          <h1>SUGERENCIAS</h1>

          <p>
            Reporta errores, comparte ideas o solicita ayuda
            para mejorar AVIS.
          </p>
        </div>

        <div className="avis-sg-card">
          <div>
            <label>TIPO</label>

            <div className="avis-sg-tags">
              {TIPOS.map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  className={`avis-sg-tag ${form.tipo === tipo ? "active" : ""}`}
                  onMouseEnter={() => setHoverTipo(tipo)}
                  onMouseLeave={() => setHoverTipo(null)}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      tipo,
                    }))
                  }}
                >
                  {tipo}
                </button>
              ))}
            </div>

            {errors.tipo && (
              <p className="avis-sg-error">{errors.tipo}</p>
            )}
          </div>

          <div>
            <label>TÍTULO</label>

            <input
              type="text"
              placeholder="Resumen breve"
              value={form.titulo}
              onChange={updateField("titulo")}
            />

            {errors.titulo && (
              <p className="avis-sg-error">{errors.titulo}</p>
            )}
          </div>

          <div>
            <label>DESCRIPCIÓN</label>

            <textarea
              rows="6"
              placeholder="Describe el error, sugerencia o ayuda que necesitas..."
              value={form.descripcion}
              onChange={updateField("descripcion")}
            />

            <div className="avis-sg-textarea-footer">
              {errors.descripcion ? (
                <p className="avis-sg-error">{errors.descripcion}</p>
              ) : (
                <span />
              )}

              <small>
                {form.descripcion.length} caracteres
              </small>
            </div>
          </div>

          <div>
            <label>
              CORREO ELECTRÓNICO
              <span> (Opcional)</span>
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={updateField("email")}
            />

            {errors.email && (
              <p className="avis-sg-error">{errors.email}</p>
            )}
          </div>

          {errors.general && (
            <p className="avis-sg-error avis-sg-center">
              {errors.general}
            </p>
          )}

          <button
            className="avis-sg-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "ENVIANDO..." : "ENVIAR SUGERENCIA"}
          </button>
        </div>
      </div>
    </div>
  )
}