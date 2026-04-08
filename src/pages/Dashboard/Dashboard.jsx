/*
  AVIS – Admin Panel
  Dashboard.jsx

  Secciones:
    · Dashboard con gráficas (Stats)

  Dependencias:
    npm install recharts
*/

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { getDashboardStats } from "../../services/apiExtras"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts"

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

const PIE_COLORS = [C.green, "#1a3a1a"]

/* ══════════════════════════════════════
   TOOLTIP GRÁFICAS
══════════════════════════════════════ */
const Tip = ({ active, payload, label }) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:"#111",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",fontFamily:"'Outfit',sans-serif",fontSize:".76rem",color:C.white}}>
      {label&&<p style={{color:C.greenL,marginBottom:2}}>{label}</p>}
      {payload.map((p,i)=><p key={i}>{p.value}</p>)}
    </div>
  )
}

/* ══════════════════════════════════════
   MAIN DASHBOARD COMPONENT
══════════════════════════════════════ */
export default function Dashboard() {
  const { showToast } = useOutletContext()
  const [stats, setStats] = useState({
    visitas: [],
    usuarios: [],
    no_registrados: 0,
    errores: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats()
        setStats(res)
      } catch (err) {
        console.error("Error al cargar estadísticas:", err)
        if (showToast) showToast("error", "Error al cargar estadísticas")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.white }}>
        Cargando estadísticas...
      </div>
    )
  }

  const visitasData = stats?.visitas || []
  const usuariosData = stats?.usuarios || []
  const erroresData = stats?.errores || []
  const noRegistrados = stats?.no_registrados || 0

  const pieData = [
    { name: "No reg.", value: noRegistrados },
    { name: "Reg.", value: 100 - noRegistrados }
  ]

  return (
    <div style={{flex:"1 1 0",minWidth:0,minHeight:0,background:C.greenMid,padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:18,height:"100%",boxSizing:"border-box",overflow:"hidden"}}>

      {/* Visitas */}
      <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
        <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Visitas de la Página</p>
        <div style={{flex:"1 1 0",minHeight:0,position:"relative"}}>
          <div style={{position:"absolute",inset:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitasData} margin={{top:4,right:4,left:-32,bottom:0}}>
                <defs><linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={.45}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="fecha" hide/><YAxis hide/><Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="total" stroke={C.greenL} strokeWidth={2} fill="url(#gV)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p style={{flexShrink:0,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.9rem",letterSpacing:".05em",color:C.white,marginTop:8,lineHeight:1}}>
          {visitasData.reduce((acc, curr) => acc + curr.total, 0)}
        </p>
      </div>

      {/* Registros */}
      <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
        <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Registros de Usuario</p>
        <div style={{flex:"1 1 0",minHeight:0,position:"relative"}}>
          <div style={{position:"absolute",inset:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usuariosData} margin={{top:4,right:4,left:-32,bottom:0}} barGap={4} barCategoryGap="30%">
                <XAxis dataKey="fecha" hide/><YAxis hide/><Tooltip content={<Tip/>}/>
                <Bar dataKey="total" fill={C.green} radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{flexShrink:0,display:"flex",justifyContent:"space-around",marginTop:6}}>
          {usuariosData.slice(-3).map((d, i)=><span key={i} style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".06em",color:C.white}}>{d.total}</span>)}
        </div>
      </div>

      {/* No registrados */}
      <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
        <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Usuarios No Registrados</p>
        <div style={{flex:"1 1 0",minHeight:0,display:"flex",alignItems:"center",gap:18}}>
          <div style={{flex:"0 0 110px",height:110,position:"relative"}}>
            <div style={{position:"absolute",inset:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={50} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                    {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                  </Pie>
                  <Tooltip content={<Tip/>}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.6rem",letterSpacing:".04em",color:C.white,lineHeight:1}}>{noRegistrados}%</p>
        </div>
      </div>

      {/* Errores */}
      <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
        <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Errores de la Página</p>
        <div style={{flex:"1 1 0",minHeight:0,position:"relative"}}>
          <div style={{position:"absolute",inset:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={erroresData} margin={{top:4,right:4,left:-32,bottom:0}}>
                <XAxis dataKey="fecha" hide/><YAxis hide/><Tooltip content={<Tip/>}/>
                <Line type="monotone" dataKey="total" stroke={C.greenL} strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p style={{flexShrink:0,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.9rem",letterSpacing:".05em",color:C.white,marginTop:8,lineHeight:1}}>
          {erroresData.reduce((acc, curr) => acc + curr.total, 0)}
        </p>
      </div>

    </div>
  )
}