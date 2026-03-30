import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext'

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
   INPUT FIELD reutilizable
══════════════════════════════════════ */
const Field = ({ label, type = "text", value, onChange, error, placeholder }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ width: "100%" }}>
      <input
        type={type}
        placeholder={placeholder || label.toUpperCase()}
        autoComplete="off"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
        style={{
          width: "100%", padding: "18px 20px",
          background: "#fff",
          border: `1.5px solid ${error ? "#d94f4f" : focused ? "#3d9c3a" : "#d0d0d0"}`,
          borderRadius: 6,
          fontFamily: "'Outfit', sans-serif",
          fontSize: ".82rem", fontWeight: 600,
          letterSpacing: ".16em", textTransform: "uppercase",
          color: "#2b2b2b", outline: "none",
          boxSizing: "border-box",
          boxShadow: focused
            ? "0 0 0 3px rgba(61,156,58,.12)"
            : error ? "0 0 0 3px rgba(217,79,79,.1)" : "none",
          transition: "border-color .25s, box-shadow .25s",
        }}
      />
      {error && (
        <p style={{ marginTop: 5, fontSize: ".72rem", fontWeight: 600, color: "#d94f4f", textAlign: "left", letterSpacing: ".04em" }}>
          {error}
        </p>
      )}
    </div>
  )
}

/* ══════════════════════════════════════
   COMPONENT — 100% inline styles
   Sin conflictos con global.css
══════════════════════════════════════ */
const Register = () => {
  const [form, setForm] = useState({
    nombre:    "",
    usuario:   "",
    email:     "",
    password:  "",
    password2: "",
  })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const { register } = useContext(AuthContext)
  const canvasRef = useRef(null)
  const navigate  = useNavigate()

  /* ── Canvas animation ── */
  useEffect(() => {
    const cvs = canvasRef.current; if (!cvs) return
    const ctx = cvs.getContext("2d"); let W, H, nodes = [], raf

    const resize = () => { W = cvs.width = cvs.offsetWidth; H = cvs.height = cvs.offsetHeight }
    const mkNode = () => ({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()*2+1 })
    const init   = () => { resize(); nodes = Array.from({ length: Math.floor((W*H)/14000) }, mkNode) }
    const draw   = () => {
      ctx.clearRect(0,0,W,H)
      nodes.forEach(n => {
        n.x+=n.vx; n.y+=n.vy
        if(n.x<0||n.x>W) n.vx*=-1; if(n.y<0||n.y>H) n.vy*=-1
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle="#3d9c3a"; ctx.fill()
      })
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy)
        if(d<140){ ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle=`rgba(61,156,58,${1-d/140})`; ctx.lineWidth=.6; ctx.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }
    const onResize = () => { cancelAnimationFrame(raf); init(); draw() }
    window.addEventListener("resize", onResize); init(); draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize) }
  }, [])

  /* ── Validación ── */
  const validate = () => {
    const e = {}
    if (!form.nombre.trim())                          e.nombre    = "Ingresa tu nombre completo"
    if (!form.usuario.trim())                         e.usuario   = "Ingresa un nombre de usuario"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email  = "Correo no válido"
    if (form.password.length < 6)                     e.password  = "Mínimo 6 caracteres"
    if (form.password !== form.password2)             e.password2 = "Las contraseñas no coinciden"
    return e
  }

  const set = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setErrors(prev => ({ ...prev, [key]: "" }))
  }

  /* ── Submit ── */
  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setLoading(true)
    try {
      /*
        ── CONECTA TU API AQUÍ ────────────────────── */
      await register(form.nombre, form.email, form.password)
      
      // Redirigir al chatbot ya que el rol por defecto en el backend es 'aprendiz'
      navigate("/chatbot")

    } catch (err) {
      setErrors({ general: err.message || "No se pudo completar el registro. Intenta de nuevo." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      width:"100vw", height:"100vh", maxHeight:"100vh",
      overflow:"hidden", position:"relative",
      display:"flex", alignItems:"center", justifyContent:"center",
      background:"#fafafa", fontFamily:"'Outfit',sans-serif",
      boxSizing:"border-box",
    }}>

      {/* Canvas de fondo */}
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.13, pointerEvents:"none", zIndex:0 }}/>

      {/* Card — scroll interno si la pantalla es pequeña */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:560,
        display:"flex", flexDirection:"column",
        alignItems:"center", textAlign:"center",
        padding:"0 24px", boxSizing:"border-box",
        maxHeight:"100vh", overflowY:"auto",
      }}>

        {/* Logo */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", margin:"32px 0 16px" }}>
          <AvisLogo size={76}/>
          <div style={{ marginTop:6, display:"flex", flexDirection:"column", alignItems:"center", lineHeight:1 }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem", letterSpacing:".06em", color:"#2b2b2b" }}>AVIS</span>
            <span style={{ fontSize:".62rem", fontWeight:700, letterSpacing:".28em", textTransform:"uppercase", color:"#3d9c3a", marginTop:2 }}>El Futuro Es AVIS</span>
          </div>
        </div>

        {/* Título */}
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.4rem,6vw,3.6rem)", letterSpacing:".04em", color:"#2b2b2b", lineHeight:1, margin:"0 0 24px" }}>
          Registro
        </h1>

        {/* Formulario */}
        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>

          <Field label="Nombre completo" value={form.nombre}   onChange={set("nombre")}   error={errors.nombre}/>
          <Field label="Usuario"         value={form.usuario}  onChange={set("usuario")}  error={errors.usuario}/>
          <Field label="Correo"          type="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="CORREO ELECTRÓNICO"/>
          <Field label="Contraseña"      type="password" value={form.password}  onChange={set("password")}  error={errors.password}/>
          <Field label="Confirmar contraseña" type="password" value={form.password2} onChange={set("password2")} error={errors.password2} placeholder="CONFIRMAR CONTRASEÑA"/>

          {/* Error general */}
          {errors.general && (
            <p style={{ fontSize:".8rem", fontWeight:600, color:"#d94f4f", textAlign:"center" }}>{errors.general}</p>
          )}

          {/* Botón registrar */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            style={{
              width:"100%", padding:18,
              background:"#2a6e28", color:"#fff",
              border:"none", borderRadius:8,
              fontFamily:"'Outfit',sans-serif",
              fontSize:".9rem", fontWeight:700,
              letterSpacing:".2em", textTransform:"uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? .75 : 1,
              boxShadow:"0 4px 20px rgba(61,156,58,.3)",
              boxSizing:"border-box",
              transition:"background .25s",
            }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background="#3d9c3a" }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.background="#2a6e28" }}
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>

        </div>

        {/* ── ¿Ya tienes cuenta? → Login ── */}
        <div style={{ marginBottom:32, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <p style={{ fontSize:".8rem", color:"#4a4a4a", fontWeight:400 }}>
            ¿Ya tienes una cuenta?
          </p>
          <Link
            to="/Login"
            style={{
              fontFamily:"'Outfit',sans-serif",
              fontSize:".78rem", fontWeight:700,
              letterSpacing:".14em", textTransform:"uppercase",
              color:"#2a6e28", textDecoration:"none",
              padding:"10px 28px",
              border:"1.5px solid #2a6e28",
              borderRadius:6,
              transition:"background .2s, color .2s",
              display:"inline-block",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="#2a6e28"; e.currentTarget.style.color="#fff" }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#2a6e28" }}
          >
            Iniciar Sesión
          </Link>
        </div>

      </div>
    </main>
  )
}

export default Register