/*
  AVIS – Admin Panel
  DashboardLayout.jsx — RESPONSIVE
  
  Breakpoints manejados internamente:
    mobile  : < 600px  → nav bottom, sin labels en botones
    tablet  : < 900px  → aside reducido a 140px
    desktop : ≥ 900px  → aside 200px (original)
*/

import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
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
   PANEL BUTTON — desktop (vertical)
══════════════════════════════════════ */
const PanelBtn = ({ id, label, active, hov, setHov, setActive, icon, mobile }) => (
  <button
    style={{
      all:"unset", boxSizing:"border-box",
      display:"flex",
      alignItems:"center",
      // En móvil: columna centrada; en desktop: fila
      flexDirection: mobile ? "column" : "row",
      justifyContent: mobile ? "center" : "flex-start",
      gap: mobile ? 3 : 13,
      padding: mobile ? "8px 4px" : "14px 20px",
      cursor:"pointer",
      fontSize: mobile ? ".52rem" : ".7rem",
      fontWeight:700,
      letterSpacing: mobile ? ".08em" : ".16em",
      textTransform:"uppercase",
      fontFamily:"'Outfit',sans-serif",
      color: active===id ? C.greenL : hov===id ? C.white : C.gray,
      background: hov===id ? "rgba(255,255,255,.05)" : "none",
      // En móvil ocupa partes iguales; en desktop ancho completo
      flex: mobile ? "1 1 0" : "none",
      width: mobile ? "auto" : "100%",
      textAlign: mobile ? "center" : "left",
      transition:"color .2s, background .2s",
      borderRadius: mobile ? 6 : 0,
    }}
    onMouseEnter={()=>setHov(id)}
    onMouseLeave={()=>setHov(null)}
    onClick={()=>setActive(id)}
  >
    <span style={{
      width: mobile ? 18 : 20,
      height: mobile ? 18 : 20,
      flexShrink:0,
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"inherit",
    }}>
      {icon}
    </span>
    {/* En móvil muy pequeño (< 360px) oculta el label */}
    {label}
  </button>
)

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function DashboardLayout() {
  const [hovP,     setHovP]  = useState(null)
  const [toast,    setToast] = useState(null)
  const toastTimer = useRef(null)
  const { user, logout } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const { w }      = useWindowSize()

  // Breakpoints
  const isMobile = w < 600   // aside abajo como bottom nav
  const isTablet = w < 900   // aside más estrecho

  const asideWidth = isMobile ? "100%" : isTablet ? 140 : 200

  const getActiveSection = () => {
    const path = location.pathname
    if (path.includes("/dashboard"))          return "app"
    if (path.includes("/database") || path.includes("/configuration") || path.includes("/users")) return "cfg"
    if (path.includes("/questions"))          return "qns"
    if (path.includes("/errors"))             return "err"
    if (path.includes("/account"))            return "acc"
    if (path.includes("/password-generator")) return "pwd"
    return null
  }

  const section = getActiveSection()

  const handleSectionChange = (id) => {
    if      (id === "app") navigate("/dashboard")
    else if (id === "cfg") navigate("/database")
    else if (id === "qns") navigate("/questions")
    else if (id === "err") navigate("/errors")
    else if (id === "acc") navigate("/account")
    else if (id === "pwd") navigate("/password-generator")
  }

  const showToast = (type, msg) => {
    clearTimeout(toastTimer.current)
    setToast({ type, msg })
    toastTimer.current = setTimeout(()=>setToast(null), 3500)
  }

  useEffect(()=>()=>clearTimeout(toastTimer.current),[])

  /* ── Íconos ── */
  const iconApp = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  const iconCfg = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  const iconQns = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L21 3.5v8z"/></svg>
  const iconErr = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  const iconAcc = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/></svg>
  const iconPwd = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

  const panels = [
    { id:"app", label:"Application",   icon:iconApp },
    { id:"cfg", label:"Config",        icon:iconCfg },
    { id:"qns", label:"Questions",     icon:iconQns },
    { id:"err", label:"Sugerencias",   icon:iconErr },
    { id:"acc", label:"My Account",    icon:iconAcc },
    { id:"pwd", label:"Password Gen",  icon:iconPwd },
  ]

  /* ── Aside: en móvil = bottom nav fijo; en desktop = derecha ── */
  const asideStyle = isMobile
    ? {
        position:"fixed", bottom:0, left:0, right:0,
        width:"100%", height:56,
        background:C.dark, borderTop:`1px solid ${C.border}`,
        display:"flex", flexDirection:"row",
        alignItems:"stretch",
        zIndex:200, padding:"0 4px",
        overflowX:"auto",
      }
    : {
        flex:`0 0 ${asideWidth}px`,
        width:asideWidth,
        background:C.dark, borderLeft:`1px solid ${C.border}`,
        display:"flex", flexDirection:"column",
        padding:"24px 0", gap:2,
        overflowY:"auto",
      }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap');
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%}
        /* Scroll en body en móvil */
        @media(max-width:599px){html,body,#root{overflow:hidden}}
        @media(min-width:600px){html,body,#root{overflow:hidden}}
        /* Tabla responsive */
        .admin-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .admin-table-wrap table{min-width:520px;}
        /* Paginacion siempre visible */
        .admin-pagination{flex-shrink:0;padding:12px 0 8px;}
      `}</style>

      <div style={{
        width:"100vw", height:"100vh",
        // En móvil, el contenido puede scrollear verticalmente pero el layout no
        overflow:"hidden",
        background:C.black, color:C.white,
        fontFamily:"'Outfit',sans-serif",
        display:"flex", flexDirection:"column",
      }}>

        {/* ══ TOP NAV ══ */}
        <nav style={{
          flex:"0 0 48px", height:48,
          display:"flex", alignItems:"center", justifyContent: "space-between",
          padding: isMobile ? "0 12px" : "0 24px",
          borderBottom:`1px solid ${C.border}`,
          background:C.dark, position:"relative",
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => handleSectionChange("acc")}
              title="Mi cuenta"
              style={{all:"unset",cursor:"pointer",color:C.gray,display:"flex",transition:"color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.white}
              onMouseLeave={e=>e.currentTarget.style.color=C.gray}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
              </svg>
            </button>
            {!isMobile && (
              <span style={{ fontSize: '.8rem', fontWeight: 600, color: C.gray, borderLeft: `1px solid ${C.border}`, paddingLeft: 12 }}>
                Hola, <span style={{ color: C.white }}>{user?.name || user?.nombre || 'Admin'}</span>
              </span>
            )}
          </div>

          <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:9}}>
            <AvisLogo size={isMobile ? 20 : 26}/>
            {/* En móvil muy pequeño oculta el texto AVIS para que no choque */}
            {w > 360 && (
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize: isMobile ? "1.2rem" : "1.45rem",letterSpacing:".1em",color:C.white}}>AVIS</span>
            )}
          </div>

          <button
            onClick={() => { logout(); navigate("/login") }}
            style={{all:"unset", cursor:"pointer", color: C.gray, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em'}}
            onMouseEnter={e=>e.currentTarget.style.color=C.red}
            onMouseLeave={e=>e.currentTarget.style.color=C.gray}
          >
            SALIR
          </button>
        </nav>

        {/* ══ BODY ══ */}
        <div style={{
          flex:"1 1 0", minHeight:0, display:"flex",
          // En móvil el aside va abajo, entonces el body es solo columna principal
          flexDirection:"row",
          overflow:"hidden",
          // En móvil dejamos padding abajo para el bottom nav
          paddingBottom: isMobile ? 56 : 0,
        }}>
          {/* Main content */}
          <div style={{
            flex:"1 1 0", display:"flex", flexDirection:"column",
            overflow:"hidden", background:C.greenMid, minWidth:0,
          }}>
            <Outlet context={{ showToast, isMobile, isTablet }}/>
          </div>

          {/* Aside — derecha en desktop, bottom en móvil */}
          {!isMobile && (
            <aside style={asideStyle}>
              {panels.map(p => (
                <PanelBtn key={p.id} id={p.id} label={isTablet ? p.label.split(" ")[0] : p.label}
                  active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange}
                  icon={p.icon} mobile={false}
                />
              ))}
            </aside>
          )}
        </div>

        {/* ══ BOTTOM NAV (solo móvil) ══ */}
        {isMobile && (
          <aside style={asideStyle}>
            {panels.map(p => (
              <PanelBtn key={p.id} id={p.id} label={p.label.split(" ")[0]}
                active={section} hov={hovP} setHov={setHovP} setActive={handleSectionChange}
                icon={p.icon} mobile={true}
              />
            ))}
          </aside>
        )}
      </div>

      <Toast toast={toast}/>
    </>
  )
}