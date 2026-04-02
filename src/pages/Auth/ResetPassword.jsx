import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import { resetPassword } from "../../services/apiExtras"
import "../../assets/Styles/global.css"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const canvasRef = useRef(null)

  const email = location.state?.email || ""
  const code  = location.state?.code || ""

  useEffect(() => {
    if (!email || !code) {
      navigate("/RecoverPassword")
    }
  }, [email, code, navigate])

  /* ── Canvas ── */
  useEffect(() => {
    const cvs = canvasRef.current; if(!cvs) return
    const ctx = cvs.getContext("2d"); let W,H,nodes=[],raf
    const resize = ()=>{ W=cvs.width=window.innerWidth; H=cvs.height=window.innerHeight }
    const mkNode = ()=>({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()*2+1 })
    const init   = ()=>{ resize(); nodes=Array.from({length:Math.floor((W*H)/14000)},mkNode) }
    const draw   = ()=>{
      ctx.clearRect(0,0,W,H)
      nodes.forEach(n=>{ n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>W)n.vx*=-1; if(n.y<0||n.y>H)n.vy*=-1; ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle="#3d9c3a"; ctx.fill() })
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy)
        if(d<140){ ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle=`rgba(61,156,58,${1-d/140})`; ctx.lineWidth=.6; ctx.stroke() }
      }
      raf=requestAnimationFrame(draw)
    }
    const onResize=()=>{ cancelAnimationFrame(raf); init(); draw() }
    window.addEventListener("resize",onResize); init(); draw()
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onResize) }
  }, [])

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden")
      return
    }

    setError("")
    setLoading(true)
    
    try {
      await resetPassword({
        email,
        code,
        password,
        password_confirmation: passwordConfirmation
      })
      
      // Contraseña cambiada con éxito
      alert("¡Contraseña actualizada con éxito!")
      navigate("/login")
      
    } catch (err) {
      setError(err.message || "Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>  
      <style>{`
        .reset-page main { width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; background: #fafafa; font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        .reset-canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.1; pointer-events: none; z-index: 0; }
        .reset-logo { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; margin-bottom: 26px; }
        .reset-logo svg { width: 80px; height: 80px; }
        .reset-logo-text { margin-top: 8px; display: flex; flex-direction: column; align-items: center; line-height: 1; }
        .reset-logo-text .brand { font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem; letter-spacing: .06em; color: #2b2b2b; }
        .reset-logo-text .tagline { font-size: .65rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: #3d9c3a; margin-top: 2px; }
        .reset-card { position: relative; z-index: 10; width: 100%; max-width: 400px; padding: 0 24px; display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; }
        .reset-card .field { display: flex; flex-direction: column; }
        .reset-card label { font-size: .85rem; color: #4a4a4a; font-weight: 600; margin-bottom: 6px; text-align: left; }
        .reset-card input { width: 100%; padding: 14px; background: #fff; border: 1.5px solid #ccc; border-radius: 6px; font-family: 'Outfit', sans-serif; font-size: .95rem; color: #2b2b2b; outline: none; box-sizing: border-box; transition: border-color .25s, box-shadow .25s; }
        .reset-card input:focus { border-color: #3d9c3a; box-shadow: 0 0 0 3px rgba(61,156,58,.12); }
        .btn-confirm { width: 100%; padding: 18px; background: #2a6e28; color: #fff; border: none; border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: .9rem; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; cursor: pointer; box-shadow: 0 4px 20px rgba(61,156,58,.28); box-sizing: border-box; margin-top: 10px; transition: background .2s; }
        .btn-confirm:hover { background: #3d9c3a; }
        .btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div className="reset-page">
        <main>
          <canvas ref={canvasRef} className="reset-canvas"></canvas>
          <div className="reset-logo">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke="#3d9c3a" strokeWidth="3"/>
              <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke="#3d9c3a" strokeWidth="1.5" opacity=".45"/>
              <line x1="60"  y1="6"   x2="60"  y2="22"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
              <line x1="108" y1="33"  x2="92"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
              <line x1="108" y1="87"  x2="92"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
              <line x1="60"  y1="114" x2="60"  y2="94"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
              <line x1="12"  y1="87"  x2="28"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
              <line x1="12"  y1="33"  x2="28"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
              <polygon points="60,32 80,60 60,88 40,60" fill="#3d9c3a" opacity=".12"/>
              <polygon points="60,32 80,60 60,88 40,60" fill="none"    stroke="#3d9c3a" strokeWidth="2"/>
              <path d="M50 80 L60 44 L70 80" stroke="#2b2b2b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <line x1="54" y1="69" x2="66" y2="69" stroke="#3d9c3a" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="60"  cy="6"   r="3.5" fill="#3d9c3a"/>
              <circle cx="108" cy="33"  r="3.5" fill="#3d9c3a"/>
              <circle cx="108" cy="87"  r="3.5" fill="#3d9c3a"/>
              <circle cx="60"  cy="114" r="3.5" fill="#3d9c3a"/>
              <circle cx="12"  cy="87"  r="3.5" fill="#3d9c3a"/>
              <circle cx="12"  cy="33"  r="3.5" fill="#3d9c3a"/>
            </svg>
            <div className="reset-logo-text">
              <span className="brand">AVIS</span>
              <span className="tagline">El Futuro Es AVIS</span>
            </div>
          </div>
          
          <div className="reset-card">
            {error && <p style={{ color: "#d94f4f", fontSize: "0.85rem", textAlign: "center", fontWeight: "600", margin: "0" }}>{error}</p>}
            
            <div className="field">
              <label>Nueva Contraseña</label>
              <input 
                type="password" 
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Confirmar&nbsp; Contraseña</label>
              <input 
                type="password" 
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <button 
              className="btn-confirm" 
              type="button" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Confirmando..." : "Confirmar"}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}

export default ResetPassword