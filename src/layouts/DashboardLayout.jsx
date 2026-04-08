import { useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"

/* ══════════════════════════════════════
   PALETA DE COLORES
══════════════════════════════════════ */
const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  green:    "#3d9c3a",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
}

const AvisLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke={C.green} strokeWidth="3"/>
    <path d="M50 80 L60 44 L70 80" stroke={C.white} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="54" y1="69" x2="66" y2="69" stroke={C.green} strokeWidth="3.5" strokeLinecap="round"/>
    {[[60,6],[108,33],[108,87],[60,114],[12,87],[12,33]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r="3.5" fill={C.green}/>
    ))}
  </svg>
)

export default function DashboardLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/Login")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;overflow:hidden;background:#0a0a0a}
      `}</style>

      <div style={{width:"100vw",height:"100vh",overflow:"hidden",background:C.black,color:C.white,fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column"}}>

        {/* ── TOP NAV ── */}
        <nav style={{flex:"0 0 48px",height:48,display:"flex",alignItems:"center",padding:"0 24px",borderBottom:`1px solid ${C.border}`,background:C.dark,position:"relative",zIndex:100}}>
          <button style={{all:"unset",cursor:"pointer",color:C.gray}} onClick={() => navigate("/")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8l4 4-4 4"/></svg>
          </button>

          <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:9}}>
            <AvisLogo size={24}/>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",letterSpacing:".1em",color:C.white}}>AVIS PANEL</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              all:"unset", cursor:"pointer", marginLeft:"auto",
              display:"flex", alignItems:"center", gap:8,
              color:C.gray, fontSize:".65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em"
            }}
          >
            Cerrar sesión
          </button>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1, overflow:"hidden"}}>
          <Outlet />
        </div>

      </div>
    </>
  )
}