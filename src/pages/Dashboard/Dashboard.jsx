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
import { getKnowledgeBase, getDashboardStats } from "../../services/apiExtras"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { FiMaximize2, FiX, FiFileText, FiDownload } from "react-icons/fi"
import { exportToPDF_Report, exportToCSV } from "../../utils/exportUtils"

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
  const [expanded, setExpanded] = useState(null) // { type, title, data, color }
  
  // Report States
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showReportConfig, setShowReportConfig] = useState(false)
  const [selectedSections, setSelectedSections] = useState({
    visitas: true,
    usuarios: true,
    errores: true,
    preguntas: false
  })

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

  const handleExpand = (type, title, data, color) => {
    setExpanded({ type, title, data, color });
  };

  const handleExport = async (format) => {
    // Filtrado de datos por fecha
    const filterByDate = (data) => {
      if (!startDate && !endDate) return data;
      const start = startDate ? new Date(startDate + "T00:00:00") : new Date("2000-01-01");
      const end = endDate ? new Date(endDate + "T23:59:59") : new Date("2100-01-01");
      
      return data.filter(item => {
        const dateStr = item.fecha || item.created_at;
        // Si no hay fecha y no se ha puesto filtro, se incluye.
        // Si hay filtro pero no hay fecha, se asume que es muy antiguo.
        if (!dateStr) return !startDate; 
        
        const pureDate = dateStr.substring(0, 10);
        const itemDate = new Date(pureDate + "T12:00:00");
        return itemDate >= start && itemDate <= end;
      });
    };

    try {
      if (showToast) showToast("info", "Procesando reporte...");

      let questionsList = [];
      if (selectedSections.preguntas) {
        const resK = await getKnowledgeBase();
        questionsList = filterByDate(resK.data || resK);
      }

      const dataToExport = {
        visitas: filterByDate(visitasData),
        usuarios: filterByDate(usuariosData),
        errores: filterByDate(erroresData),
        preguntas: questionsList.map(q => ({ ...q, pregunta: q.pregunta?.replace(/\s*\([^)]*\)/g, "") }))
      };

      const config = {
        title: "REPORTE DE USO - AVIS",
        dateRange: startDate || endDate ? { start: startDate || 'Inicio', end: endDate || 'Hoy' } : null,
        sections: selectedSections
      };

      if (format === 'pdf') {
        exportToPDF_Report(config, dataToExport, `Reporte_AVIS_${new Date().getTime()}.pdf`);
      } else {
        // EXCEL MULTI-PESTAÑA: Mucho más limpio y profesional
        const sheets = [];
        
        // Hoja 1: Estadísticas de uso
        const dateMap = {};
        const addToMap = (data, key) => {
          data.forEach(item => {
            if (!dateMap[item.fecha]) dateMap[item.fecha] = { "Fecha": item.fecha, "Visitas": 0, "Registros": 0, "Errores": 0 };
            dateMap[item.fecha][key] = item.total;
          });
        };

        if (selectedSections.visitas) addToMap(dataToExport.visitas, "Visitas");
        if (selectedSections.usuarios) addToMap(dataToExport.usuarios, "Registros");
        if (selectedSections.errores) addToMap(dataToExport.errores, "Errores");

        const statsList = Object.values(dateMap).sort((a,b) => new Date(a.Fecha) - new Date(b.Fecha));
        if (statsList.length > 0) {
          sheets.push({ 
            name: "Estadísticas de Uso", 
            data: statsList.map(s => ({
              "FECHA": s.Fecha,
              "VISITAS": s.Visitas,
              "REGISTROS": s.Registros,
              "ERRORES": s.Errores
            }))
          });
        }

        // Hoja 2: Listado de Preguntas
        if (selectedSections.preguntas && questionsList.length > 0) {
          const formattedQuestions = questionsList.map(q => ({
            "Fecha": new Date(q.created_at).toLocaleDateString(),
            "Pregunta": q.pregunta?.replace(/\s*\([^)]*\)/g, ""),
            "Respuesta": q.respuesta || 'Sin respuesta',
            "Categoría": q.categoria || 'N/A',
            "Estado": q.status
          }));
          sheets.push({ name: "Listado de Preguntas", data: formattedQuestions });
        }

        if (sheets.length === 0) {
          if (showToast) showToast("warning", "No hay datos para las secciones seleccionadas");
          return;
        }

        import('../../utils/exportUtils').then(utils => {
          utils.exportToExcel_MultiSheet(sheets, `Reporte_Admin_AVIS_${new Date().getTime()}.xlsx`);
        });
      }
      if (showToast) showToast("success", "Reporte generado correctamente");
      setShowReportConfig(false);
    } catch (err) {
      console.error("Error al exportar:", err);
      if (showToast) showToast("error", "Error al generar el archivo. Revisa los filtros.");
    }
  };

  return (
    <div style={{
      flex:"1 1 0",
      minWidth:0,
      minHeight:0,
      background:C.greenMid,
      padding:24,
      display:"grid",
      gridTemplateColumns:"1fr 1fr",
      gap:18,
      height:"100%",
      boxSizing:"border-box",
      overflowY:"auto"
    }}>

      {/* Header con Generador de Reportes */}
      <div style={{
        gridColumn: "span 2",
        background: C.darkCard,
        borderRadius: 12,
        padding: "20px 24px",
        border: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }}>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: C.white, margin: 0, letterSpacing: ".05em" }}>
            PANEL DE ESTADISTICAS
          </h2>
          <p style={{ fontSize: ".8rem", color: C.gray, margin: 0 }}>Gestión de datos útiles y reportes de uso</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => setShowReportConfig(!showReportConfig)}
            style={{
              background: C.greenD, color: C.white, border: 'none',
              padding: '10px 18px', borderRadius: 8, fontSize: '.85rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              transition: 'background .2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.green}
            onMouseLeave={e => e.currentTarget.style.background = C.greenD}
          >
            <FiFileText size={16}/> GENERAR REPORTE
          </button>
        </div>
      </div>

      {/* Modal / Panel de Configuración de Reporte */}
      {showReportConfig && (
        <div style={{
          gridColumn: "span 2",
          background: "#161616",
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${C.greenL}`,
          animation: 'fadeIn .3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: C.greenL, margin: 0 }}>Configuración del Reporte</h3>
            <button onClick={() => setShowReportConfig(false)} style={{ background: 'transparent', border: 'none', color: C.gray, cursor: 'pointer' }}><FiX size={20}/></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30 }}>
            {/* Fechas */}
            <div>
              <p style={{ color: C.white, fontSize: '.8rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>Rango de Fechas</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: C.gray, fontSize: '.75rem', width: 40 }}>Desde:</span>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: '#222', border: `1px solid ${C.border}`, color: '#fff', padding: '6px', borderRadius: 4, outline: 'none', flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: C.gray, fontSize: '.75rem', width: 40 }}>Hasta:</span>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ background: '#222', border: `1px solid ${C.border}`, color: '#fff', padding: '6px', borderRadius: 4, outline: 'none', flex: 1 }} />
                </div>
              </div>
            </div>

            {/* Secciones */}
            <div>
              <p style={{ color: C.white, fontSize: '.8rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>Incluir Secciones</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.keys(selectedSections).map(key => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.gray, fontSize: '.85rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedSections[key]} 
                      onChange={() => setSelectedSections({ ...selectedSections, [key]: !selectedSections[key] })}
                      style={{ accentColor: C.greenL }}
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1).replace('preguntas', 'Preguntas/Knowledge')}
                  </label>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                onClick={() => handleExport('pdf')}
                style={{ background: C.greenL, color: C.black, border: 'none', padding: '10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <FiDownload size={14}/> EXPORTAR PDF
              </button>
                <button 
                onClick={() => handleExport('excel')}
                style={{ background: 'transparent', border: `1px solid ${C.gray}`, color: C.white, padding: '10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
              >
                EXPORTAR EXCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visitas */}
      <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0, position: 'relative'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
          <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>Visitas de la Página</p>
          <button 
            onClick={() => handleExpand('area', 'Visitas Detalladas', visitasData, C.greenL)}
            style={{background: 'transparent', border: 'none', color: C.greenL, cursor: 'pointer', display: 'flex', opacity: 0.6}}
          >
            <FiMaximize2 size={14}/>
          </button>
        </div>
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
      <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0, position: 'relative'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
          <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>Registros de Usuario</p>
          <button 
            onClick={() => handleExpand('bar', 'Usuarios Registrados', usuariosData, C.green)}
            style={{background: 'transparent', border: 'none', color: C.greenL, cursor: 'pointer', display: 'flex', opacity: 0.6}}
          >
            <FiMaximize2 size={14}/>
          </button>
        </div>
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
      <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0, position: 'relative'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
          <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>Errores de la Página</p>
          <button 
            onClick={() => handleExpand('line', 'Registro de Errores', erroresData, C.red)}
            style={{background: 'transparent', border: 'none', color: C.red, cursor: 'pointer', display: 'flex', opacity: 0.6}}
          >
            <FiMaximize2 size={14}/>
          </button>
        </div>
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

      {/* Preguntas sin Respuesta - NUEVO */}
      <div 
        onClick={() => window.location.href = '/questions?tab=sin-respuesta'}
        style={{
          background:"linear-gradient(135deg, #1a3a1a 0%, #0a0a0a 100%)",
          borderRadius:10, padding:"20px",
          display:"flex", flexDirection:"column", justifyContent:"space-between",
          border:`1px solid ${C.green}`, cursor: 'pointer',
          gridColumn: "span 2", position: 'relative', overflow: 'hidden',
          transition: 'transform .2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{position:'absolute', right: -20, top: -20, fontSize: '8rem', opacity: 0.05, color: C.greenL}}>❓</div>
        <div>
          <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:C.greenL,marginBottom:4}}>Atención Requerida</p>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.4rem",color:C.white,letterSpacing:".04em", margin: 0}}>
            {stats?.knowledge?.pendiente || 0} Preguntas sin respuesta
          </h2>
          <p style={{fontSize:".8rem", color: C.gray, marginTop: 4}}>Usuarios esperando información sobre el SENA</p>
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 8, marginTop: 12, color: C.greenL, fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em'}}>
          GESTIONAR AHORA <span>➜</span>
        </div>
      </div>

      {expanded && (
        <div style={{
          position: 'fixed', inset: 0, 
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px', animation: 'fadeIn .3s ease'
        }}>
          <div style={{
            background: C.dark, width: '100%', maxWidth: '1000px', maxHeight: '90vh',
            borderRadius: 20, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            {/* Header */}
            <div style={{padding: '24px 32px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
               <div>
                 <h2 style={{fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: C.white, margin: 0, letterSpacing: '.05em'}}>{expanded.title}</h2>
                 <p style={{fontSize: '.85rem', color: C.gray, margin: 0}}>Vista detallada de registros históricos</p>
               </div>
               <button onClick={() => setExpanded(null)} style={{background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.white}}>
                 <FiX size={20}/>
               </button>
            </div>

            {/* Content */}
            <div style={{padding: '32px', overflowY: 'auto', flex: 1}}>
              {/* Large Chart */}
              <div style={{height: '350px', width: '100%', marginBottom: 40}}>
                <ResponsiveContainer width="100%" height="100%">
                  {expanded.type === 'area' ? (
                    <AreaChart data={expanded.data}>
                      <defs><linearGradient id="gV2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={expanded.color} stopOpacity={.45}/><stop offset="95%" stopColor={expanded.color} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="fecha" stroke={C.gray} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={C.gray} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<Tip/>}/>
                      <Area type="monotone" dataKey="total" stroke={expanded.color} strokeWidth={3} fill="url(#gV2)" />
                    </AreaChart>
                  ) : expanded.type === 'bar' ? (
                    <BarChart data={expanded.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="fecha" stroke={C.gray} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={C.gray} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<Tip/>}/>
                      <Bar dataKey="total" fill={expanded.color} radius={[4,4,0,0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={expanded.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="fecha" stroke={C.gray} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={C.gray} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<Tip/>}/>
                      <Line type="monotone" dataKey="total" stroke={expanded.color} strokeWidth={3} dot={{fill: expanded.color, r: 4}} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <div style={{background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '.9rem'}}>
                  <thead>
                    <tr style={{background: 'rgba(255,255,255,0.05)'}}>
                      <th style={{padding: '12px 20px', color: C.gray, fontWeight: 600}}>Fecha</th>
                      <th style={{padding: '12px 20px', color: C.gray, fontWeight: 600}}>Registros / Total</th>
                      <th style={{padding: '12px 20px', color: C.gray, fontWeight: 600}}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expanded.data.map((row, i) => (
                      <tr key={i} style={{borderBottom: `1px solid rgba(255,255,255,0.05)`}}>
                        <td style={{padding: '12px 20px', color: C.white}}>{row.fecha}</td>
                        <td style={{padding: '12px 20px', color: expanded.color, fontWeight: 700}}>{row.total}</td>
                        <td style={{padding: '12px 20px'}}>
                          <span style={{padding: '2px 8px', background: row.total > 0 ? 'rgba(82,196,79,0.1)' : 'rgba(255,255,255,0.05)', color: row.total > 0 ? C.greenL : C.gray, borderRadius: 4, fontSize: '.75rem'}}>
                            {row.total > 0 ? 'Actividad Detectada' : 'Sin actividad'}
                          </span>
                        </td>
                      </tr>
                    )).reverse()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}