import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../assets/Styles/global.css"

const VALID_CODE  = "123456"  // reemplazar con validación API
const TIMER_START = 177       // 2:57 segundos

const AvisLogo = ({ size = 76 }) => (
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

const CodeBox = ({ value, focused, hasError, inputRef, onChange, onKeyDown, onFocus }) => (
  <div style={{
    width:54, height:62, flexShrink:0,
    background: hasError ? "#3a2020" : focused ? "#3a3a3a" : "#2b2b2b",
    borderRadius:10,
    border:`2px solid ${hasError ? "#d94f4f" : focused ? "#3d9c3a" : "transparent"}`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem",
    color:"#ffffff", cursor:"text",
    transition:"border-color .2s, background .2s",
    position:"relative", overflow:"hidden", userSelect:"none",
  }}>
    <span style={{ pointerEvents:"none", zIndex:1 }}>{value || "\u00a0"}</span>
    <input
      ref={inputRef}
      type="tel" maxLength={1} inputMode="numeric" autoComplete="off"
      value={value}
      onChange={onChange} onKeyDown={onKeyDown} onFocus={onFocus}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0, fontSize:"1.8rem", textAlign:"center", background:"transparent", border:"none", outline:"none", color:"transparent", caretColor:"transparent", cursor:"text" }}
    />
  </div>
)

const RecoveryPassword = () => {
  const [digits,    setDigits]    = useState(Array(6).fill(""))
  const [focused,   setFocused]   = useState(0)
  const [hasError,  setHasError]  = useState(false)
  const [shaking,   setShaking]   = useState(false)
  const [seconds,   setSeconds]   = useState(TIMER_START)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef([])
  const canvasRef = useRef(null)
  const timerRef  = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Email recibido desde RecoverPassword via navigate state
  const email = location.state?.email || ""

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

  useEffect(() => { setTimeout(()=>inputRefs.current[0]?.focus(), 400) }, [])

  /* ── Timer ── */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current); setSeconds(TIMER_START); setCanResend(false)
    timerRef.current = setInterval(()=>{
      setSeconds(s=>{ if(s<=1){ clearInterval(timerRef.current); setCanResend(true); return 0 } return s-1 })
    }, 1000)
  }, [])
  useEffect(()=>{ startTimer(); return ()=>clearInterval(timerRef.current) }, [startTimer])
  const fmtTime = s=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`

  /* ── Input handlers ── */
  const handleChange = (idx,e)=>{
    const val=[...digits]; val[idx]=e.target.value.replace(/\D/g,"").slice(-1); setDigits(val)
    setHasError(false)
    if(val[idx]&&idx<5){ inputRefs.current[idx+1]?.focus(); setFocused(idx+1) }
  }
  const handleKeyDown=(idx,e)=>{
    if(e.key==="Backspace"){
      if(digits[idx]){const n=[...digits];n[idx]="";setDigits(n)}
      else if(idx>0){const n=[...digits];n[idx-1]="";setDigits(n);inputRefs.current[idx-1]?.focus();setFocused(idx-1)}
    }
    if(e.key==="ArrowLeft" &&idx>0){inputRefs.current[idx-1]?.focus();setFocused(idx-1)}
    if(e.key==="ArrowRight"&&idx<5){inputRefs.current[idx+1]?.focus();setFocused(idx+1)}
  }
  const handlePaste=(e)=>{
    e.preventDefault()
    const t=(e.clipboardData||window.clipboardData).getData("text").replace(/\D/g,"").slice(0,6)
    const n=[...digits]; t.split("").forEach((c,i)=>{ if(i<6)n[i]=c }); setDigits(n)
    const nf=Math.min(t.length,5); inputRefs.current[nf]?.focus(); setFocused(nf)
  }

  /* ── Submit ── */
  const handleSubmit = async () => {
    const code = digits.join("")
    if(code.length<6){ inputRefs.current[digits.findIndex(d=>!d)]?.focus(); return }

    try {
      // await authService.verifyRecoveryCode({ email, code })  ← tu API
      if(code !== VALID_CODE) throw new Error("incorrect")

      // ✅ Código correcto → ir a cambiar contraseña
      navigate("/ResetPassword", { state: { email } })

    } catch {
      // ❌ Incorrecto
      setHasError(true); setShaking(true)
      setTimeout(()=>setShaking(false), 450)
      setDigits(Array(6).fill(""))
      setTimeout(()=>{ inputRefs.current[0]?.focus(); setFocused(0) }, 50)
    }
  }

  const handleResend = () => {
    if(!canResend) return
    setDigits(Array(6).fill("")); setHasError(false); startTimer()
    setTimeout(()=>{ inputRefs.current[0]?.focus(); setFocused(0) }, 50)
  }

  return (
    <>
      <style>{`@keyframes rpShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>

      <div style={{ width:"100vw", height:"100vh", maxHeight:"100vh", overflow:"hidden", background:"#fafafa", fontFamily:"'Outfit',sans-serif", display:"grid", placeItems:"center", position:"relative", boxSizing:"border-box" }}>

        <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100%", height:"100%", opacity:.1, pointerEvents:"none", zIndex:0 }}/>

        <div onPaste={handlePaste} style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"0 24px", width:"100%", maxWidth:640, boxSizing:"border-box" }}>

          {/* Logo */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:22 }}>
            <AvisLogo size={76}/>
            <div style={{ marginTop:6, display:"flex", flexDirection:"column", alignItems:"center", lineHeight:1 }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem", letterSpacing:".06em", color:"#2b2b2b" }}>AVIS</span>
              <span style={{ fontSize:".62rem", fontWeight:700, letterSpacing:".26em", textTransform:"uppercase", color:"#3d9c3a", marginTop:2 }}>El Futuro Es AVIS</span>
            </div>
          </div>

          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.6rem,6vw,4rem)", letterSpacing:".04em", color:"#2b2b2b", margin:"0 0 10px" }}>Recuperacion</h1>

          <p style={{ fontSize:"clamp(.82rem,1.4vw,.96rem)", color:"#4a4a4a", lineHeight:1.55, marginBottom:6 }}>
            Ingresa el codigo de recuperacion que<br/>se le envio al correo vinculado
            {email && <><br/><strong style={{ color:"#3d9c3a", fontSize:".85em" }}>{email}</strong></>}
          </p>

          {/* Error */}
          <p style={{ fontSize:".95rem", fontWeight:500, color:"#d94f4f", minHeight:"1.5em", marginBottom:6, opacity:hasError?1:0, transition:"opacity .2s" }}>
            codigo incorrecto
          </p>

          {/* Cajas */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:24, animation:shaking?"rpShake .4s ease both":"none" }}>
            {[0,1,2].map(idx=>(
              <CodeBox key={idx} value={digits[idx]} focused={focused===idx} hasError={hasError}
                inputRef={el=>inputRefs.current[idx]=el}
                onChange={e=>handleChange(idx,e)} onKeyDown={e=>handleKeyDown(idx,e)} onFocus={()=>setFocused(idx)}
              />
            ))}
            <div style={{ width:22, flexShrink:0 }}/>
            {[3,4,5].map(idx=>(
              <CodeBox key={idx} value={digits[idx]} focused={focused===idx} hasError={hasError}
                inputRef={el=>inputRefs.current[idx]=el}
                onChange={e=>handleChange(idx,e)} onKeyDown={e=>handleKeyDown(idx,e)} onFocus={()=>setFocused(idx)}
              />
            ))}
          </div>

          {/* Reenvío */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:24 }}>
            <span style={{ fontSize:".7rem", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", color:"#4a4a4a" }}>Reenviar Codigo</span>
            <span style={{ fontSize:".78rem", fontWeight:700, color:"#4a4a4a", minWidth:32 }}>{fmtTime(seconds)}</span>
            <button disabled={!canResend} onClick={handleResend} style={{ padding:"8px 18px", background:canResend?"#3d9c3a":"#8ab88a", color:"#fff", border:"none", borderRadius:20, fontFamily:"'Outfit',sans-serif", fontSize:".74rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", cursor:canResend?"pointer":"not-allowed", opacity:canResend?1:.55 }}>
              Renviar
            </button>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} style={{ width:"100%", maxWidth:500, padding:20, background:"#2a6e28", color:"#fff", border:"none", borderRadius:12, fontFamily:"'Outfit',sans-serif", fontSize:"1rem", fontWeight:600, cursor:"pointer", boxShadow:"0 4px 20px rgba(61,156,58,.3)", marginBottom:14, boxSizing:"border-box" }}
            onMouseEnter={e=>e.currentTarget.style.background="#3d9c3a"}
            onMouseLeave={e=>e.currentTarget.style.background="#2a6e28"}
          >
            recuperar contraseña
          </button>

          <Link to="/RecoverPassword"
            style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", fontWeight:600, letterSpacing:".14em", textTransform:"uppercase", color:"#4a4a4a", textDecoration:"none" }}
            onMouseEnter={e=>e.currentTarget.style.color="#3d9c3a"}
            onMouseLeave={e=>e.currentTarget.style.color="#4a4a4a"}
          >
            ← Volver
          </Link>

        </div>
      </div>
    </>
  )
}

export default RecoveryPassword