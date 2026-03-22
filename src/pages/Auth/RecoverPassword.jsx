import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom"
import "../../assets/Styles/global.css"

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

const RecoverPassword = () => {
  const [email,        setEmail]        = useState("")
  const [error,        setError]        = useState("")
  const [loading,      setLoading]      = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const canvasRef = useRef(null)
  const navigate  = useNavigate()

  useEffect(() => {
    const cvs = canvasRef.current; if (!cvs) return
    const ctx = cvs.getContext("2d"); let W, H, nodes = [], raf
    const resize = () => { W = cvs.width = cvs.offsetWidth; H = cvs.height = cvs.offsetHeight }
    const mkNode = () => ({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()*2+1 })
    const init   = () => { resize(); nodes = Array.from({ length: Math.floor((W*H)/14000) }, mkNode) }
    const draw   = () => {
      ctx.clearRect(0,0,W,H)
      nodes.forEach(n => { n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>W)n.vx*=-1; if(n.y<0||n.y>H)n.vy*=-1; ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle="#3d9c3a"; ctx.fill() })
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

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleSubmit = async () => {
    if (!email.trim())        { setError("Ingresa tu correo electrónico"); return }
    if (!isValidEmail(email)) { setError("El correo no tiene un formato válido"); return }

    setError(""); setLoading(true)
    try {
      // await authService.sendRecoveryCode(email)  ← tu API aquí
      await new Promise(r => setTimeout(r, 800))

      // Navega a /RecoveryPassword sin token, solo con email en state
      navigate("/RecoveryPassword", { state: { email } })

    } catch {
      setError("No se pudo enviar el código. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const borderColor = inputFocused ? "#3d9c3a" : error ? "#d94f4f" : "#ccc"
  const shadow      = inputFocused ? "0 0 0 3px rgba(61,156,58,.12)" : error ? "0 0 0 3px rgba(217,79,79,.1)" : "none"

  return (
    <main style={{ width:"100vw", height:"100vh", maxHeight:"100vh", overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", background:"#fafafa", fontFamily:"'Outfit',sans-serif", boxSizing:"border-box" }}>

      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.13, pointerEvents:"none", zIndex:0 }}/>

      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:580, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"0 24px", boxSizing:"border-box" }}>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:26 }}>
          <AvisLogo size={80}/>
          <div style={{ marginTop:8, display:"flex", flexDirection:"column", alignItems:"center", lineHeight:1 }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem", letterSpacing:".06em", color:"#2b2b2b" }}>AVIS</span>
            <span style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".28em", textTransform:"uppercase", color:"#3d9c3a", marginTop:2 }}>El Futuro Es AVIS</span>
          </div>
        </div>

        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.2rem,6vw,3.6rem)", letterSpacing:".04em", color:"#2b2b2b", lineHeight:1, margin:"0 0 10px" }}>
          ¿Olvidaste tu Contraseña?
        </h1>

        <p style={{ fontSize:"clamp(.85rem,1.6vw,1rem)", color:"#4a4a4a", marginBottom:30 }}>
          Introduce tu dirección de correo electrónico
        </p>

        <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>

          <div style={{ width:"100%" }}>
            <input
              type="email" placeholder="Correo electronico" autoComplete="email" value={email}
              style={{ width:"100%", padding:"18px 20px", background:"#fff", border:`1.5px solid ${borderColor}`, borderRadius:6, fontFamily:"'Outfit',sans-serif", fontSize:".88rem", color:"#2b2b2b", outline:"none", boxSizing:"border-box", boxShadow:shadow, transition:"border-color .25s, box-shadow .25s" }}
              onChange={e  => { setEmail(e.target.value); setError("") }}
              onFocus={() => setInputFocused(true)}
              onBlur={()  => setInputFocused(false)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            {error && <p style={{ marginTop:6, fontSize:".76rem", fontWeight:600, color:"#d94f4f", textAlign:"left" }}>{error}</p>}
          </div>

          <button
            type="button" disabled={loading} onClick={handleSubmit}
            style={{ width:"100%", padding:18, background:"#2a6e28", color:"#fff", border:"none", borderRadius:8, fontFamily:"'Outfit',sans-serif", fontSize:".9rem", fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", cursor:loading?"not-allowed":"pointer", opacity:loading?.75:1, boxShadow:"0 4px 20px rgba(61,156,58,.28)", boxSizing:"border-box" }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background="#3d9c3a" }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.background="#2a6e28" }}
          >
            {loading ? "Enviando..." : "Enviar\u00a0\u00a0Codigo"}
          </button>

          <Link to="/Login"
            style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", fontWeight:600, letterSpacing:".14em", textTransform:"uppercase", color:"#4a4a4a", textDecoration:"none", marginTop:4 }}
            onMouseEnter={e => e.currentTarget.style.color="#3d9c3a"}
            onMouseLeave={e => e.currentTarget.style.color="#4a4a4a"}
          >
            ← Volver al inicio de sesión
          </Link>

        </div>
      </div>
    </main>
  )
}

export default RecoverPassword