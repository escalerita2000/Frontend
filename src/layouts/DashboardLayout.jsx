/*
  AVIS – Admin Panel
  AdminPanel.jsx

  Secciones:
    · APPLICATION  → Dashboard con gráficas (Stats)
    · CONFIGURATION → Tabla de usuarios con editar/eliminar
    · QUESTIONS    → Panel avanzado de preguntas
    · ERRORS       → Panel de errores (placeholder)
    · MY ACCOUNT   → Perfil y ajustes

  Dependencias:
    npm install recharts
*/

import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { logoutUser } from "../services/authService"

/* ══════════════════════════════════════
   PALETA DE COLORES
══════════════════════════════════════ */
const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  darkCard: "#1c1c1c",
  green:    "#3d9c3a",
  greenD:   "#2a6e28",
  greenL:   "#52c44f",
  greenBg:  "#1a3a1a",
  greenMid: "#2a6e28",
  teal:     "#4ab8c8",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
  red:      "#e05555",
  rowBg:    "#161616",
  dot:      "#6fcf6d",
}

/* ══════════════════════════════════════
   SVG LOGO
══════════════════════════════════════ */
const AvisLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke={C.green} strokeWidth="3"/>
    <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke={C.green} strokeWidth="1.5" opacity=".5"/>
    <line x1="60"  y1="6"   x2="60"  y2="22"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="33"  x2="92"  y2="40"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="87"  x2="92"  y2="76"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="60"  y1="114" x2="60"  y2="94"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="87"  x2="28"  y2="76"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="33"  x2="28"  y2="40"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <polygon points="60,32 80,60 60,88 40,60" fill={C.green} opacity=".15"/>
    <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke={C.green} strokeWidth="2"/>
    <path d="M50 80 L60 44 L70 80" stroke={C.white} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="54" y1="69" x2="66" y2="69" stroke={C.green} strokeWidth="3.5" strokeLinecap="round"/>
    {[[60,6],[108,33],[108,87],[60,114],[12,87],[12,33]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r="3.5" fill={C.green}/>
    ))}
  </svg>
)

/* ══════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════ */
const Toast = ({ toast }) => {
  if(!toast) return null
  const isOk = toast.type === "success"
  return (
    <div style={{
      position:"fixed", bottom:32, right:32, zIndex:1000,
      background: C.darkCard,
      border:`1px solid ${isOk ? C.green : C.red}`,
      borderRadius:10, padding:"16px 22px",
      minWidth:220, boxShadow:"0 8px 32px rgba(0,0,0,.4)",
      animation:"toastIn .3s ease both",
      fontFamily:"'Outfit',sans-serif",
    }}>
      <p style={{fontSize:".75rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color: isOk ? C.greenL : C.red,marginBottom:4}}>
        {isOk ? "Confirmado" : "Error"}
      </p>
      <p style={{fontSize:".82rem",color:C.white}}>{toast.msg}</p>
    </div>
  )
}

/* ══════════════════════════════════════
   PANEL BUTTON (right sidebar)
══════════════════════════════════════ */
const PanelBtn = ({ id, label, active, hov, setHov, setActive, icon }) => (
  <button
    style={{
      all:"unset", boxSizing:"border-box",
      display:"flex", alignItems:"center", gap:13,
      padding:"14px 20px", cursor:"pointer",
      fontSize:".7rem", fontWeight:700,
      letterSpacing:".16em", textTransform:"uppercase",
      fontFamily:"'Outfit',sans-serif",
      color: active===id ? C.greenL : hov===id ? C.white : C.gray,
      background: hov===id ? "rgba(255,255,255,.05)" : "none",
      width:"100%", textAlign:"left",
      transition:"color .2s, background .2s",
    }}
    onMouseEnter={()=>setHov(id)}
    onMouseLeave={()=>setHov(null)}
    onClick={()=>setActive(id)}
  >
    <span style={{width:20,height:20,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"inherit"}}>
      {icon}
    </span>
    {label}
  </button>
)

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function DashboardLayout() {
  const [hovP, setHovP] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Mapeo de rutas a IDs de sección para resaltar el botón activo
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/dashboard"))     return "app";
    if (path.includes("/database") || path.includes("/configuration") || path.includes("/users")) return "cfg";
    if (path.includes("/questions"))      return "qns";
    if (path.includes("/errors"))         return "err";
    if (path.includes("/account"))        return "acc";
    if (path.includes("/password-generator")) return "pwd";
    return null;
  }

  const section = getActiveSection();

  const handleSectionChange = (id) => {
    if (id === "app")      navigate("/dashboard");
    else if (id === "cfg") navigate("/database");
    else if (id === "qns") navigate("/questions");
    else if (id === "err") navigate("/errors");
    else if (id === "acc") navigate("/account");
    else if (id === "pwd") navigate("/password-generator");
  }

  const handleLogout = () => {
    logoutUser()
    navigate("/Login")
  }

  const showToast = (type, msg) => {
    clearTimeout(toastTimer.current)
    setToast({ type, msg })
    toastTimer.current = setTimeout(()=>setToast(null), 3500)
  }

  useEffect(()=>()=>clearTimeout(toastTimer.current),[])

  const iconApp = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )
  const iconCfg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
  const iconQns = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L21 3.5v8z"/>
    </svg>
  )
  const iconErr = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
  const iconAcc = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
    </svg>
  )
  const iconPwd = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap');
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;overflow:hidden}
      `}</style>

      <div style={{width:"100vw",height:"100vh",overflow:"hidden",background:C.black,color:C.white,fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column"}}>

        {/* ── TOP NAV ── */}
        <nav style={{flex:"0 0 48px",height:48,display:"flex",alignItems:"center",padding:"0 24px",borderBottom:`1px solid ${C.border}`,background:C.dark,position:"relative"}}>
          {/* User icon — left */}
          <button style={{all:"unset",cursor:"pointer",color:C.gray,display:"flex"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
            </svg>
          </button>

          {/* Logo center */}
          <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:9}}>
            <AvisLogo size={26}/>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.45rem",letterSpacing:".1em",color:C.white}}>AVIS</span>
          </div>

          {/* Cerrar sesión — right */}
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              all:"unset", cursor:"pointer",
              marginLeft:"auto",
              display:"flex", alignItems:"center", gap:8,
              color:C.gray, padding:"6px 10px", borderRadius:6,
              fontFamily:"'Outfit',sans-serif", fontSize:".72rem",
              fontWeight:600, letterSpacing:".12em", textTransform:"uppercase",
              transition:"color .2s, background .2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.color="#e05555";e.currentTarget.style.background="rgba(224,85,85,.1)"}}
            onMouseLeave={e=>{e.currentTarget.style.color=C.gray;e.currentTarget.style.background="transparent"}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </nav>

        {/* ── BODY ── */}
        <div style={{flex:"1 1 0",minHeight:0,display:"flex",overflow:"hidden"}}>

          {/* Left thin nav */}
          <aside style={{flex:"0 0 52px",width:52,background:C.dark,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0",gap:20}}>
            {[
              {id:"menu",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>},
              {id:"chat",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
            ].map(({id,icon})=>(
              <button key={id} style={{all:"unset",cursor:"pointer",color:C.gray,display:"flex",alignItems:"center",justifyContent:"center",padding:8,borderRadius:8,transition:"color .2s,background .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.color=C.white;e.currentTarget.style.background="rgba(255,255,255,.07)"}}
                onMouseLeave={e=>{e.currentTarget.style.color=C.gray;e.currentTarget.style.background="none"}}
              >{icon}</button>
            ))}
          </aside>

          {/* Main content — renders child routes */}
          <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", overflow: "hidden", background: C.greenMid }}>
            <Outlet context={{ showToast }} />
          </div>

          {/* Right panel */}
          <aside style={{flex:"0 0 200px",width:200,background:C.dark,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"24px 0",gap:2}}>
            <PanelBtn id="app" label="Application"   active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange} icon={iconApp}/>
            <PanelBtn id="cfg" label="Configuration" active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange} icon={iconCfg}/>
            <PanelBtn id="qns" label="Questions"     active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange} icon={iconQns}/>
            <PanelBtn id="err" label="Errors Panel"  active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange} icon={iconErr}/>
            <PanelBtn id="acc" label="My Account"    active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange} icon={iconAcc}/>
            <PanelBtn id="pwd" label="Password Gen"  active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange} icon={iconPwd}/>
          </aside>

        </div>
      </div>

      {/* Toast */}
      <Toast toast={toast}/>
    </>
  )
}