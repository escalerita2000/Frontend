import { useState } from "react"
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts"

const visitasData = [
  { t: "Ene", v: 980  },
  { t: "Feb", v: 1200 },
  { t: "Mar", v: 1050 },
  { t: "Abr", v: 1400 },
  { t: "May", v: 1750 },
  { t: "Jun", v: 1600 },
  { t: "Jul", v: 2134 },
]

const registrosData = [
  { mes: "May", a: 180, b: 249 },
  { mes: "Jun", a: 310, b: 379 },
  { mes: "Jul", a: 280, b: 421 },
]

const erroresData = [
  { t: "L",  v: 3  },
  { t: "M",  v: 5  },
  { t: "X",  v: 2  },
  { t: "J",  v: 8  },
  { t: "V",  v: 6  },
  { t: "S",  v: 10 },
  { t: "D",  v: 12 },
]

const noRegistradosPie = [
  { name: "No registrados", value: 27 },
  { name: "Registrados",    value: 73 },
]

const PIE_COLORS = ["#3d9c3a", "#1a3a1a"]

/* ══════════════════════════════════════
   SVG LOGO AVIS
══════════════════════════════════════ */
const AvisLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke="#3d9c3a" strokeWidth="3"/>
    <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke="#3d9c3a" strokeWidth="1.5" opacity=".5"/>
    <line x1="60"  y1="6"   x2="60"  y2="22"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="33"  x2="92"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="87"  x2="92"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="60"  y1="114" x2="60"  y2="94"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="87"  x2="28"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="33"  x2="28"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <polygon points="60,32 80,60 60,88 40,60" fill="#3d9c3a" opacity=".15"/>
    <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke="#3d9c3a" strokeWidth="2"/>
    <path d="M50 80 L60 44 L70 80" stroke="#f0f0f0" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
   TOOLTIP PERSONALIZADO
══════════════════════════════════════ */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "#111", border: "1px solid rgba(61,156,58,.4)",
      borderRadius: 6, padding: "6px 12px",
      fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "#f0f0f0",
    }}>
      <p style={{ color: "#52c44f", marginBottom: 2 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i}>{p.value}</p>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════
   PANEL ITEMS — inline styles para evitar conflictos
══════════════════════════════════════ */
const panelItemBase = {
  display: "flex", alignItems: "center", gap: "14px",
  padding: "14px 20px", cursor: "pointer",
  fontSize: ".72rem", fontWeight: "700",
  letterSpacing: ".16em", textTransform: "uppercase",
  fontFamily: "'Outfit', sans-serif",
  transition: "color .2s, background .2s",
  background: "none", border: "none", width: "100%", textAlign: "left",
  outline: "none",
}

/* ══════════════════════════════════════
   COMPONENT
══════════════════════════════════════ */
function Stats() {
  const [activePage,  setActivePage]  = useState(1)
  const [activePanel, setActivePanel] = useState("app")
  const [hovPanel,    setHovPanel]    = useState(null)

  const panelStyle = (key) => ({
    ...panelItemBase,
    color: activePanel === key
      ? "#52c44f"
      : hovPanel === key ? "#f0f0f0" : "#888888",
    background: hovPanel === key ? "rgba(255,255,255,.05)" : "none",
  })

  return (
    <div className="stats-root">

      {/* ══ TOP NAV ══ */}
      <nav className="stats-topnav" style={{ position: "relative" }}>

        {/* User icon — left */}
        <svg className="stats-user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
        </svg>

        {/* Logo — center */}
        <div className="stats-topnav-center">
          <AvisLogo size={28}/>
          <span className="brand" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: ".1em", color: "#f0f0f0" }}>AVIS</span>
        </div>

        {/* Pagination — right */}
        <div className="stats-pagination" style={{ marginLeft: "auto" }}>
          <button style={{ background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:"1rem",padding:"4px 6px" }}>←</button>
          {[1,2,3].map(n => (
            <button
              key={n}
              className={activePage===n ? "active" : ""}
              onClick={() => setActivePage(n)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif", fontSize: ".85rem",
                fontWeight: "600", letterSpacing: ".06em",
                color: activePage===n ? "#52c44f" : "#888",
                padding: "4px 6px", borderRadius: "4px",
              }}
            >
              {n}
            </button>
          ))}
          <button style={{ background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:"1rem",padding:"4px 6px" }}>···</button>
        </div>
      </nav>

      {/* ══ BODY ══ */}
      <div className="stats-body">

        {/* ── MAIN CONTENT GRID ── */}
        <main className="stats-content">

          {/* 1 — Visitas de la página */}
          <div className="stats-card">
            <p className="stats-card-title">Visitas de la Página</p>
            <div className="stats-card-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitasData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradVisitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3d9c3a" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3d9c3a" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="v" stroke="#52c44f" strokeWidth={2} fill="url(#gradVisitas)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="stats-card-value">2.134</p>
          </div>

          {/* 2 — Registros de usuario */}
          <div className="stats-card">
            <p className="stats-card-title">Registros de Usuario</p>
            <div className="stats-card-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrosData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }} barGap={4}>
                  <XAxis dataKey="mes" hide />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="a" fill="#1e5c1e" radius={[3,3,0,0]}/>
                  <Bar dataKey="b" fill="#3d9c3a" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="stats-bar-labels">
              {registrosData.map(d => (
                <span key={d.mes} className="stats-bar-label">{d.b}</span>
              ))}
            </div>
          </div>

          {/* 3 — Usuarios no registrados */}
          <div className="stats-card">
            <p className="stats-card-title">Usuarios No Registrados</p>
            <div className="stats-card-pie-row">
              <div style={{ width: 110, height: 110, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={noRegistradosPie}
                      cx="50%" cy="50%"
                      innerRadius={28} outerRadius={50}
                      startAngle={90} endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {noRegistradosPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]}/>
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="stats-card-pie-value">27%</p>
            </div>
          </div>

          {/* 4 — Errores de la página */}
          <div className="stats-card">
            <p className="stats-card-title">Errores de la Página</p>
            <div className="stats-card-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={erroresData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
                  <XAxis dataKey="t" hide />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip/>}/>
                  <Line type="monotone" dataKey="v" stroke="#52c44f" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="stats-card-value">12</p>
          </div>

        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className="stats-panel">

          <button
            style={panelStyle("app")}
            onMouseEnter={() => setHovPanel("app")}
            onMouseLeave={() => setHovPanel(null)}
            onClick={() => setActivePanel("app")}
          >
            <svg style={{ width:20, height:20, flexShrink:0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Application
          </button>

          <button
            style={panelStyle("cfg")}
            onMouseEnter={() => setHovPanel("cfg")}
            onMouseLeave={() => setHovPanel(null)}
            onClick={() => setActivePanel("cfg")}
          >
            <svg style={{ width:20, height:20, flexShrink:0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configuration
          </button>

          <button
            style={panelStyle("acc")}
            onMouseEnter={() => setHovPanel("acc")}
            onMouseLeave={() => setHovPanel(null)}
            onClick={() => setActivePanel("acc")}
          >
            <svg style={{ width:20, height:20, flexShrink:0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
            </svg>
            My Account
          </button>

        </aside>
      </div>
    </div>
  )
}

export default Stats