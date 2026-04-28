import { useState, useEffect } from "react"
import { getKnowledgeBase, getDashboardStats, updateKnowledge } from "../../services/apiExtras"
import { useOutletContext, useSearchParams } from "react-router-dom"
import { exportToCSV, exportToPDF_Report } from "../../utils/exportUtils"
import { FiDownload } from "react-icons/fi"

const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  darkCard: "#1c1c1c",
  green:    "#3d9c3a",
  greenD:   "#2a6e28",
  greenL:   "#52c44f",
  greenBg:  "#1a3a1a",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
  red:      "#e05555",
}

const StatusBadge = ({ estado }) => {
  const isPending  = estado === "pendiente"
  const isRevision = estado === "en_revision"
  const bg    = isPending ? "rgba(224,85,85,0.15)"   : isRevision ? "rgba(253,230,138,0.15)" : "rgba(82,196,79,0.15)"
  const color = isPending ? C.red                    : isRevision ? "#fcd34d"                : C.greenL

  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px", borderRadius: 20,
      fontSize: ".7rem", fontWeight: 700,
      background: bg, color,
      border: `1px solid ${color}`,
      letterSpacing: ".04em", textTransform: "uppercase",
      whiteSpace: "nowrap",           // ← evita que el badge rompa línea
    }}>
      {estado ? estado.replace('_', ' ') : 'N/A'}
    </span>
  )
}

// Componente para resaltar texto
const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>
  
  const words = highlight.split(' ').filter(w => w.trim() !== '')
  const regex = new RegExp(`(${words.join('|')})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} style={{ background: "rgba(82,196,79,0.3)", color: "#fff", borderRadius: "2px", padding: "0 2px" }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
const SectionDashboard = ({ stats }) => (
  // flexShrink:0 + overflow:auto para que el dashboard haga scroll si hace falta
  <div style={{ flex: "1 1 0", minHeight: 0, overflowY: "auto", padding: "40px" }}>
    <h1 style={{
      fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem",
      fontWeight: 400, color: C.white, letterSpacing: ".05em", marginBottom: 32,
    }}>
      ESTADISTICAS DE PREGUNTAS
    </h1>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
      {[
        { value: stats.registradas, label: "Preguntas Registradas" },
        { value: stats.pendientes,  label: "PENDIENTES" },
        { value: stats.respondidas, label: "PREGUNTAS RESPONDIDAS" },
        { value: stats.paraRevisar, label: "PARA REVISAR" },
      ].map((item, i) => (
        <div key={i} style={{
          background: C.darkCard, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "24px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,.2)",
        }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem",
            fontWeight: 700, color: C.greenL, lineHeight: 1,
          }}>
            {item.value}
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: ".72rem",
            fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: C.gray,
            marginTop: 8, textAlign: "center",
          }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </div>
)

// ─────────────────────────────────────────────
// TABLA DE PREGUNTAS  (layout de 3 zonas en flex-column)
// ─────────────────────────────────────────────
const SectionQuestionsTable = ({ title, questions, onRefresh, search = "", readOnly = false }) => {
  const { showToast } = useOutletContext()
  const [answeringId, setAnsweringId]   = useState(null)
  const [responseText, setResponseText] = useState("")

  const handleResponse = async (id, currentStatus) => {
    if (!responseText.trim()) return
    try {
      const nextStatus = currentStatus === 'pendiente' ? 'en_revision' : currentStatus
      await updateKnowledge(id, { respuesta: responseText, status: nextStatus })
      if (showToast) showToast("success", nextStatus === 'en_revision' ? "Guardado como borrador (En Revisión)" : "Respuesta actualizada")
      setAnsweringId(null)
      setResponseText("")
      if (onRefresh) onRefresh()
    } catch {
      if (showToast) showToast("error", "Error al guardar respuesta")
    }
  }

  const handleApprove = async (id) => {
    try {
      await updateKnowledge(id, { status: 'respondida' })
      if (showToast) showToast("success", "Pregunta aprobada y publicada")
      if (onRefresh) onRefresh()
    } catch {
      if (showToast) showToast("error", "Error al aprobar pregunta")
    }
  }

  const thStyle = {
    padding: "14px 16px", fontSize: ".7rem", fontWeight: 700,
    letterSpacing: ".15em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)", textAlign: "left",
    background: "#161616", borderBottom: `1px solid ${C.border}`,
    // thead sticky: los encabezados no desaparecen al hacer scroll
    position: "sticky", top: 0, zIndex: 1,
  }

  const tdStyle = {
    padding: "14px 16px", fontSize: ".88rem",
    color: C.white, borderBottom: `1px solid rgba(61,156,58,0.1)`,
    verticalAlign: "top",
  }

  return (
    // ZONA EXTERIOR: flex-column, ocupa todo el espacio disponible del <main>
    <div style={{
      display: "flex", flexDirection: "column",
      flex: "1 1 0", minHeight: 0,           // ← clave para que flex funcione
      padding: "40px",
      boxSizing: "border-box",
    }}>

      {/* ── ZONA 1: Encabezado (no se comprime) ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 24,
      }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: C.white, margin: 0 }}>
          {title}
        </h1>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => {
              const excelData = questions.map(q => ({
                Pregunta:  q.pregunta?.replace(/\s*\([^)]*\)/g, ""),
                Respuesta: q.respuesta || 'Sin respuesta',
                Categoría: q.categoria || 'N/A',
                Fecha:     new Date(q.created_at).toLocaleDateString(),
                Estado:    q.status,
              }))
              import('../../utils/exportUtils').then(u => u.exportToExcel(excelData, `Preguntas_${title}.xlsx`))
            }}
            style={{
              background: 'transparent', border: `1px solid ${C.gray}`,
              color: C.gray, padding: '6px 12px', borderRadius: 6,
              fontSize: '.75rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <FiDownload size={14}/> EXCEL
          </button>
          <button
            onClick={() => {
              const config = { title: `REPORTE: ${title.toUpperCase()}`, sections: { preguntas: true } }
              const cleanedQuestions = questions.map(q => ({ ...q, pregunta: q.pregunta?.replace(/\s*\([^)]*\)/g, "") }))
              exportToPDF_Report(config, { preguntas: cleanedQuestions }, `Reporte_${title.replace(/\s+/g, '_')}.pdf`)
            }}
            style={{
              background: 'transparent', border: `1px solid ${C.greenL}`,
              color: C.greenL, padding: '6px 12px', borderRadius: 6,
              fontSize: '.75rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <FiDownload size={14}/> PDF
          </button>
        </div>
      </div>

      {/* ── ZONA 2: Tabla con scroll interno ── */}
      <div style={{
        flex: "1 1 0", minHeight: 0,          // ← crece y hace scroll internamente
        overflowY: "auto",
        background: "#161616", borderRadius: 12,
        border: `1px solid ${C.border}`,
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: readOnly ? "45%" : "38%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: readOnly ? "28%" : "15%", textAlign: "center" }} />
            {!readOnly && <col style={{ width: "20%" }} />}
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>Pregunta</th>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Fecha</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Estado</th>
              {!readOnly && <th style={thStyle}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 4 : 5} style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: C.gray }}>
                  No hay registros disponibles.
                </td>
              </tr>
            ) : questions.map(q => (
              <tr key={q.id} style={{ transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Pregunta + respuesta */}
                <td style={tdStyle}>
                  <div style={{ wordBreak: "break-word" }}>
                    <HighlightText 
                      text={q.pregunta?.replace(/\s*\([^)]*\)/g, "")} 
                      highlight={search} 
                    />
                  </div>
                  {q.respuesta && (
                    <div style={{ fontSize: '.8rem', color: C.greenL, marginTop: 4, wordBreak: "break-word" }}>
                      R: <HighlightText text={q.respuesta} highlight={search} />
                    </div>
                  )}
                </td>

                {/* Categoría */}
                <td style={{ ...tdStyle, color: C.gray, fontSize: ".8rem", wordBreak: "break-word" }}>
                  <HighlightText text={q.categoria || 'N/A'} highlight={search} />
                </td>

                {/* Fecha */}
                <td style={{ ...tdStyle, color: C.gray, fontSize: ".8rem", whiteSpace: "nowrap" }}>
                  {new Date(q.created_at).toLocaleDateString()}
                </td>

                {/* Estado */}
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <StatusBadge estado={q.status}/>
                </td>

                {/* Acciones (solo admin) */}
                {!readOnly && (
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {answeringId === q.id ? (
                        <>
                          <textarea
                            value={responseText}
                            onChange={e => setResponseText(e.target.value)}
                            placeholder="Escribe la respuesta..."
                            rows={3}
                            style={{
                              background: '#222', color: '#fff',
                              border: `1px solid ${C.border}`, borderRadius: 4,
                              padding: 6, fontSize: '.8rem', width: '100%',
                              resize: 'vertical', boxSizing: 'border-box',
                            }}
                          />
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button
                              onClick={() => handleResponse(q.id, q.status)}
                              style={{ background: C.green, border: 'none', color: '#fff', fontSize: '.7rem', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
                            >Guardar</button>
                            <button
                              onClick={() => setAnsweringId(null)}
                              style={{ background: 'transparent', border: `1px solid ${C.gray}`, color: C.gray, fontSize: '.7rem', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
                            >✕</button>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => { setAnsweringId(q.id); setResponseText(q.respuesta || "") }}
                          style={{ all: 'unset', cursor: 'pointer', color: C.greenL, fontSize: '.8rem', fontWeight: 600 }}
                        >
                          {q.status === 'pendiente' ? 'RESPONDER' : 'EDITAR'}
                        </button>
                      )}

                      {q.status === 'en_revision' && answeringId !== q.id && (
                        <button
                          onClick={() => handleApprove(q.id)}
                          style={{
                            background: C.greenBg, border: `1px solid ${C.greenL}`,
                            color: C.greenL, fontSize: '.65rem', fontWeight: 700,
                            padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                            letterSpacing: '.05em',
                          }}
                        >APROBAR</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* No hay paginación local: los datos vienen filtrados desde el backend */}
    </div>
  )
}

// ─────────────────────────────────────────────
// SIDEBAR ITEM
// ─────────────────────────────────────────────
const SidebarItem = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    style={{
      all: "unset", boxSizing: "border-box",
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px", cursor: "pointer",
      width: "100%",
      background: active ? "rgba(82,196,79,0.15)" : "transparent",
      borderLeft: active ? `3px solid ${C.greenL}` : "3px solid transparent",
      color: active ? C.greenL : C.gray,
      transition: "all .2s",
      fontFamily: "'Outfit', sans-serif",
      fontSize: ".85rem", fontWeight: active ? 600 : 400,
    }}
  >
    <span>{icon}</span>
    {label}
  </button>
)

// ─────────────────────────────────────────────
// PANEL PRINCIPAL
// ─────────────────────────────────────────────
export default function QuestionsPanel({ readOnly = false }) {
  const { showToast } = useOutletContext()
  const [searchParams]    = useSearchParams()
  const initialSection    = searchParams.get("tab") || "dashboard"
  const [section, setSection]             = useState(initialSection)
  const [loading, setLoading]             = useState(false)
  const [stats, setStats]                 = useState({ registradas: 0, pendientes: 0, respondidas: 0, paraRevisar: 0 })
  const [questions, setQuestions]         = useState([])
  const [search, setSearch]               = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const navItems = [
    { id: "dashboard",     label: "Dashboard",     icon: "📊" },
    { id: "global",        label: "Búsq. Global",  icon: "🔍" },
    { id: "sin-respuesta", label: "Sin Respuesta",  icon: "🔴" },
    { id: "respondidas",   label: "Respondidas",    icon: "✅" },
    { id: "en-revision",   label: "En Revisión",    icon: "⏳" },
  ]

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats()
      if (res.knowledge) {
        setStats({
          registradas: res.knowledge.total,
          pendientes:  res.knowledge.pendiente,
          respondidas: res.knowledge.respondida,
          paraRevisar: res.knowledge.en_revision,
        })
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err)
    }
  }

  const fetchData = async (status, query = "") => {
    try {
      setLoading(true)
      const res = await getKnowledgeBase(status, query)
      setQuestions(res.data || [])
    } catch {
      if (showToast) showToast("error", "Error al cargar preguntas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (section === "dashboard") {
      fetchStats()
    } else {
      const statusMap = {
        "global":        "",
        "sin-respuesta": "pendiente",
        "respondidas":   "respondida",
        "en-revision":   "en_revision",
      }
      fetchData(statusMap[section], debouncedSearch)
    }
  }, [section, debouncedSearch])

  const sectionTitles = {
    "global":        "Búsqueda Global de Conocimiento",
    "sin-respuesta": "Preguntas sin respuesta",
    "respondidas":   "Preguntas respondidas",
    "en-revision":   "Preguntas en revisión",
  }

  return (
    // Contenedor raíz: flex-row, ocupa todo el espacio que le da el Outlet
    <div style={{ display: "flex", flex: "1 1 0", minHeight: 0, overflow: "hidden" }}>

      {/* ── Sub-Sidebar (ancho fijo, nunca crece) ── */}
      <aside style={{
        flexShrink: 0, width: 160,
        background: "#0f0f0f",
        borderRight: `1px solid ${C.border}`,
        paddingTop: 20,
        overflowY: "auto",             // si hay muchos ítems hace scroll
      }}>
        {navItems.map(item => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            active={section === item.id}
            onClick={setSection}
          />
        ))}
      </aside>

      {/* ── Content Area: flex-column, ocupa el resto ── */}
      <main style={{
        display: "flex", flexDirection: "column",
        flex: "1 1 0", minHeight: 0,   // ← sin esto la tabla no tiene altura
        overflow: "hidden",
        background: C.black,
      }}>
        {/* Barra de búsqueda (zona fija, no comprime la tabla) */}
        {section !== "dashboard" && (
          <div style={{
            flexShrink: 0,
            padding: '20px 40px 0',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar pregunta..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#161616', border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: '10px 12px 10px 38px',
                  color: C.white, fontFamily: "'Outfit', sans-serif",
                  fontSize: '.85rem', outline: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ flexShrink: 0, padding: 40, color: C.gray }}>Cargando...</div>
        )}

        {/* Secciones — cada una tiene flex:"1 1 0" para llenar el espacio */}
        {!loading && section === "dashboard"     && <SectionDashboard stats={stats}/>}
        {!loading && section !== "dashboard" && (
          <SectionQuestionsTable
            title={sectionTitles[section]}
            questions={questions}
            search={debouncedSearch}
            onRefresh={() => {
              const statusMap = {
                "global":        "",
                "sin-respuesta": "pendiente",
                "respondidas":   "respondida",
                "en-revision":   "en_revision",
              }
              fetchData(statusMap[section], debouncedSearch)
            }}
            readOnly={readOnly}
          />
        )}
      </main>
    </div>
  )
}