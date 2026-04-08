/*
  AVIS – Panel de Preguntas
  QuestionsPanel.jsx

  Secciones:
    · Dashboard          → Estadísticas de preguntas (4 tarjetas)
    · Preguntas de la IA → (placeholder - expandir)
    · Sin Respuesta      → Tabla con estado Pendiente/En Revisión + panel Agregar Respuesta
    · Respondidas        → Tabla de preguntas respondidas
    · Con Dos Respuestas → Tabla de preguntas con múltiples respuestas

  100% inline styles — sin conflictos con global.css
  Conectar endpoints reemplazando las funciones mock al final del archivo
*/

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

/* ══════════════════════════════════════
   DATOS MOCK — reemplazar con API real
══════════════════════════════════════ */
const MOCK_PENDING = [
  { id: 1, pregunta: "¿Cuando abren las Incripciones?",                      fecha: "2025-01-10", estado: "Pendiente" },
  { id: 2, pregunta: "¿Como de hace una PQR?",                               fecha: "2025-01-12", estado: "Pendiente" },
  { id: 3, pregunta: "¿Que beneficios ofrece el contrato de aprendizaje?",   fecha: "2025-01-14", estado: "Pendiente" },
]

const MOCK_RESPONDIDAS = [
  { id: 4, pregunta: "¿Qué es el SENA?",                 fecha: "2025-01-05", respuesta: "El SENA es el Servicio Nacional de Aprendizaje." },
  { id: 5, pregunta: "¿Cómo me inscribo a un curso?",    fecha: "2025-01-06", respuesta: "Puedes inscribirte en el portal SOFIA Plus." },
  { id: 6, pregunta: "¿Cuánto dura la etapa práctica?",  fecha: "2025-01-07", respuesta: "La duración depende del programa de formación." },
]

const MOCK_DOS_RESPUESTAS = [
  { id: 7, pregunta: "¿Qué documentos necesito?",       fecha: "2025-01-08", respuesta1: "Cédula de ciudadanía.", respuesta2: "Diploma de bachiller." },
  { id: 8, pregunta: "¿Puedo estudiar y trabajar?",     fecha: "2025-01-09", respuesta1: "Sí, con horario flexible.", respuesta2: "Depende del programa." },
]

const MOCK_STATS = {
  registradas:  140,
  pendientes:   30,
  respondidas:  90,
  paraRevisar:  15,
}

/* ══════════════════════════════════════
   COLORES
══════════════════════════════════════ */
const C = {
  green:    "#2a6e28",
  greenL:   "#3d9c3a",
  greenBg:  "#2a6e28",
  sidebar:  "#2a6e28",
  white:    "#ffffff",
  bg:       "#f5f5f0",
  dark:     "#1a1a1a",
  gray:     "#888",
  border:   "#ccc",
  pending:  "#f8a0a0",
  pendTxt:  "#b00020",
  revision: "#fde68a",
  revTxt:   "#92400e",
  editBtn:  "#d0d0c8",
  editTxt:  "#444",
}

/* ══════════════════════════════════════
   BADGE DE ESTADO
══════════════════════════════════════ */
const StatusBadge = ({ estado }) => {
  const isPending  = estado === "Pendiente"
  const isRevision = estado === "En Revision"
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 14px", borderRadius: 20,
      fontSize: ".72rem", fontWeight: 600,
      background: isPending ? C.pending : isRevision ? C.revision : "#c8e6c8",
      color: isPending ? C.pendTxt : isRevision ? C.revTxt : "#1b5e20",
      border: `1px solid ${isPending ? "#f48fb1" : isRevision ? "#fcd34d" : "#81c784"}`,
      letterSpacing: ".04em",
    }}>
      {estado}
    </span>
  )
}

/* ══════════════════════════════════════
   PANEL AGREGAR RESPUESTA
══════════════════════════════════════ */
const AddAnswerPanel = ({ question, onSave, onClose }) => {
  const [pregunta,  setPregunta]  = useState(question?.pregunta || "")
  const [respuesta, setRespuesta] = useState("")

  const inputStyle = {
    width: "100%", padding: "8px 12px",
    border: `1px solid ${C.border}`, borderRadius: 4,
    fontFamily: "'Outfit', sans-serif", fontSize: ".86rem",
    color: C.dark, outline: "none", background: "#fff",
    boxSizing: "border-box", marginTop: 6,
    transition: "border-color .2s",
  }

  return (
    <div style={{
      position: "absolute", bottom: 24, right: 24,
      width: 320, background: "#fff",
      border: `1.5px solid ${C.border}`, borderRadius: 10,
      padding: "22px 20px 18px", boxShadow: "0 4px 24px rgba(0,0,0,.12)",
      zIndex: 100, fontFamily: "'Outfit', sans-serif",
    }}>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: C.dark, marginBottom: 16 }}>
        Agregar Respuesta
      </h3>

      <label style={{ fontSize: ".78rem", fontWeight: 600, color: C.dark }}>
        Pregunta Detectada
      </label>
      <input
        value={pregunta}
        onChange={e => setPregunta(e.target.value)}
        style={inputStyle}
        onFocus={e  => e.target.style.borderColor = C.greenL}
        onBlur={e   => e.target.style.borderColor = C.border}
      />

      <label style={{ fontSize: ".78rem", fontWeight: 600, color: C.dark, display: "block", marginTop: 12 }}>
        Respuesta Sugerida
      </label>
      <input
        value={respuesta}
        onChange={e => setRespuesta(e.target.value)}
        style={inputStyle}
        onFocus={e  => e.target.style.borderColor = C.greenL}
        onBlur={e   => e.target.style.borderColor = C.border}
      />

      <button
        onClick={() => onSave({ pregunta, respuesta })}
        style={{
          width: "100%", marginTop: 16, padding: "10px",
          background: C.green, color: "#fff", border: "none",
          borderRadius: 5, fontFamily: "'Outfit', sans-serif",
          fontSize: ".82rem", fontWeight: 700, cursor: "pointer",
          transition: "background .2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.greenL}
        onMouseLeave={e => e.currentTarget.style.background = C.green}
      >
        Guardar en la Base de Datos
      </button>
    </div>
  )
}

/* ══════════════════════════════════════
   SECCIÓN: DASHBOARD (Estadísticas)
══════════════════════════════════════ */
const SectionDashboard = ({ stats }) => (
  <div style={{ padding: "32px 40px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", fontWeight: 400, color: C.dark }}>
        ESTADISTICAS DE PREGUNTAS
      </h1>
      {/* Logo pequeño */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: .7 }}>
        <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
          <polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="none" stroke={C.greenL} strokeWidth="3"/>
          <polygon points="60,32 80,60 60,88 40,60" fill={C.greenL} opacity=".3"/>
          <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke={C.greenL} strokeWidth="2"/>
          <path d="M50 80 L60 44 L70 80" stroke="#333" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          <line x1="54" y1="69" x2="66" y2="69" stroke={C.greenL} strokeWidth="3.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", letterSpacing: ".08em", color: C.dark }}>AVIS</span>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 560 }}>
      {[
        { value: stats.registradas,  label: "Preguntas Registradas" },
        { value: stats.pendientes,   label: "PENDIENTES" },
        { value: stats.respondidas,  label: "PREGUNTAS RESPONDIDAS" },
        { value: stats.paraRevisar,  label: "PARA REVISAR" },
      ].map((item, i) => (
        <div key={i} style={{
          background: "#fff", border: `1.5px solid ${C.border}`,
          borderRadius: 10, padding: "24px 20px 18px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 8px rgba(0,0,0,.06)",
          minHeight: 120,
        }}>
          <span style={{
            fontFamily: "Georgia, serif", fontSize: "3.2rem",
            fontWeight: 700, color: C.dark, lineHeight: 1,
          }}>
            {item.value}
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: ".72rem",
            fontWeight: 600, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#555",
            marginTop: 8, textAlign: "center",
          }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </div>
)

/* ══════════════════════════════════════
   SECCIÓN: PREGUNTAS SIN RESPUESTA
══════════════════════════════════════ */
const SectionSinRespuesta = ({ questions, onSaveAnswer }) => {
  const [editingId,    setEditingId]    = useState(null)
  const [localQuestions, setLocalQuestions] = useState(questions)

  const handleEdit = (q) => {
    // Si ya está editando esta pregunta, cerrar
    if (editingId === q.id) { setEditingId(null); return }
    setEditingId(q.id)
    // Cambiar estado a "En Revision"
    setLocalQuestions(prev => prev.map(p => p.id === q.id ? { ...p, estado: "En Revision" } : p))
  }

  const handleSave = ({ pregunta, respuesta }) => {
    setLocalQuestions(prev => prev.map(p =>
      p.id === editingId ? { ...p, estado: "Respondida", respuesta } : p
    ))
    onSaveAnswer?.({ id: editingId, pregunta, respuesta })
    setEditingId(null)
  }

  const thStyle = {
    padding: "10px 16px", fontSize: ".68rem", fontWeight: 700,
    letterSpacing: ".14em", textTransform: "uppercase",
    color: "#555", textAlign: "left", background: "#f5f5f0",
    fontFamily: "'Outfit', sans-serif",
  }

  const tdStyle = {
    padding: "12px 16px", fontSize: ".86rem",
    color: C.dark, fontFamily: "'Outfit', sans-serif",
    verticalAlign: "middle", borderBottom: `1px solid #ececec`,
  }

  return (
    <div style={{ padding: "32px 40px", position: "relative", height: "100%" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.7rem", fontWeight: 400, color: C.dark, marginBottom: 24 }}>
        Preguntas sin respuesta detectadas
      </h1>

      <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              <th style={{ ...thStyle, width: "42%" }}>Preguna Detectada</th>
              <th style={{ ...thStyle, width: "18%" }}>Fecha</th>
              <th style={{ ...thStyle, width: "18%", textAlign: "center" }}>Estado</th>
              <th style={{ ...thStyle, width: "22%", textAlign: "center" }}>Edicion</th>
            </tr>
          </thead>
          <tbody>
            {localQuestions.map(q => (
              <tr key={q.id}>
                <td style={tdStyle}>{q.pregunta}</td>
                <td style={{ ...tdStyle, color: C.gray, fontSize: ".78rem" }}>{q.fecha}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <StatusBadge estado={editingId === q.id ? "En Revision" : q.estado}/>
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(q)}
                    style={{
                      padding: "5px 14px",
                      background: editingId === q.id ? "#b0b0a8" : C.editBtn,
                      color: C.editTxt, border: "none", borderRadius: 20,
                      fontSize: ".72rem", fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif", letterSpacing: ".06em",
                      transition: "background .2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#b8b8b0"}
                    onMouseLeave={e => e.currentTarget.style.background = editingId === q.id ? "#b0b0a8" : C.editBtn}
                  >
                    {editingId === q.id ? "Editando" : "Agregar Respuesta"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel flotante de edición */}
      {editingId && (
        <AddAnswerPanel
          question={localQuestions.find(q => q.id === editingId)}
          onSave={handleSave}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  )
}

/* ══════════════════════════════════════
   SECCIÓN: PREGUNTAS RESPONDIDAS
══════════════════════════════════════ */
const SectionRespondidas = ({ questions }) => {
  const thStyle = {
    padding: "10px 16px", fontSize: ".68rem", fontWeight: 700,
    letterSpacing: ".14em", textTransform: "uppercase",
    color: "#555", textAlign: "left", background: "#f5f5f0",
    fontFamily: "'Outfit', sans-serif",
  }
  const tdStyle = {
    padding: "12px 16px", fontSize: ".86rem",
    color: "#2b2b2b", fontFamily: "'Outfit', sans-serif",
    verticalAlign: "middle", borderBottom: "1px solid #ececec",
  }

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.7rem", fontWeight: 400, color: "#2b2b2b", marginBottom: 24 }}>
        Preguntas Respondidas
      </h1>
      <div style={{ border: "1.5px solid #ccc", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={{ ...thStyle, width: "35%" }}>Pregunta</th>
              <th style={{ ...thStyle, width: "15%" }}>Fecha</th>
              <th style={{ ...thStyle, width: "50%" }}>Respuesta</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td style={tdStyle}>{q.pregunta}</td>
                <td style={{ ...tdStyle, color: "#888", fontSize: ".78rem" }}>{q.fecha}</td>
                <td style={{ ...tdStyle, color: "#444" }}>{q.respuesta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   SECCIÓN: PREGUNTAS CON DOS RESPUESTAS
══════════════════════════════════════ */
const SectionDosRespuestas = ({ questions }) => {
  const thStyle = {
    padding: "10px 16px", fontSize: ".68rem", fontWeight: 700,
    letterSpacing: ".14em", textTransform: "uppercase",
    color: "#555", textAlign: "left", background: "#f5f5f0",
    fontFamily: "'Outfit', sans-serif",
  }
  const tdStyle = {
    padding: "12px 16px", fontSize: ".86rem",
    color: "#2b2b2b", fontFamily: "'Outfit', sans-serif",
    verticalAlign: "middle", borderBottom: "1px solid #ececec",
  }

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.7rem", fontWeight: 400, color: "#2b2b2b", marginBottom: 24 }}>
        Preguntas con Dos Respuestas
      </h1>
      <div style={{ border: "1.5px solid #ccc", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={{ ...thStyle, width: "30%" }}>Pregunta</th>
              <th style={{ ...thStyle, width: "14%" }}>Fecha</th>
              <th style={{ ...thStyle, width: "28%" }}>Respuesta 1</th>
              <th style={{ ...thStyle, width: "28%" }}>Respuesta 2</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td style={tdStyle}>{q.pregunta}</td>
                <td style={{ ...tdStyle, color: "#888", fontSize: ".78rem" }}>{q.fecha}</td>
                <td style={{ ...tdStyle, color: "#444" }}>{q.respuesta1}</td>
                <td style={{ ...tdStyle, color: "#444" }}>{q.respuesta2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   SECCIÓN: PREGUNTAS DE LA IA
══════════════════════════════════════ */
const SectionIA = () => (
  <div style={{ padding: "32px 40px" }}>
    <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.7rem", fontWeight: 400, color: "#2b2b2b", marginBottom: 24 }}>
      Preguntas de la IA
    </h1>
    <div style={{ border: "1.5px solid #ccc", borderRadius: 8, padding: "32px", background: "#fff", textAlign: "center" }}>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: ".9rem", color: "#888" }}>
        Sección en desarrollo — conectar con el endpoint de preguntas generadas por IA
      </p>
    </div>
  </div>
)

/* ══════════════════════════════════════
   ITEM DEL SIDEBAR
══════════════════════════════════════ */
const SidebarItem = ({ id, label, icon, active, onClick }) => {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        all: "unset", boxSizing: "border-box",
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px", cursor: "pointer",
        width: "100%", textAlign: "left",
        background: active
          ? "rgba(255,255,255,.18)"
          : hov ? "rgba(255,255,255,.09)" : "transparent",
        borderLeft: active ? "3px solid #fff" : "3px solid transparent",
        transition: "background .18s",
        fontFamily: "Georgia, serif",
        fontSize: ".88rem", fontWeight: active ? 600 : 400,
        color: active ? "#fff" : "rgba(255,255,255,.85)",
        lineHeight: 1.3,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span style={{ flexShrink: 0, fontSize: "1rem", lineHeight: 1 }}>{icon}</span>
      {label}
    </button>
  )
}

/* ══════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════ */
export default function QuestionsPanel() {
  const [section,       setSection]       = useState("dashboard")
  const [pendingQ,      setPendingQ]      = useState(MOCK_PENDING)
  const [respondedQ,    setRespondedQ]    = useState(MOCK_RESPONDIDAS)
  const [twoAnswersQ,   setTwoAnswersQ]   = useState(MOCK_DOS_RESPUESTAS)
  const [stats,         setStats]         = useState(MOCK_STATS)

  /* ── Cargar datos desde API ──
     Descomenta y reemplaza con tus servicios reales:

  useEffect(() => {
    questionService.getPending().then(r => setPendingQ(r.data))
    questionService.getAnswered().then(r => setRespondedQ(r.data))
    questionService.getTwoAnswers().then(r => setTwoAnswersQ(r.data))
    questionService.getStats().then(r => setStats(r.data))
  }, [])
  ── */

  const handleSaveAnswer = ({ id, pregunta, respuesta }) => {
    // Aquí conectas con tu API:
    // await questionService.saveAnswer({ id, pregunta, respuesta })
    console.log("Guardar respuesta:", { id, pregunta, respuesta })

    // Actualizar stats localmente
    setStats(prev => ({
      ...prev,
      pendientes:  Math.max(0, prev.pendientes - 1),
      respondidas: prev.respondidas + 1,
    }))
  }

  const navItems = [
    { id: "dashboard",      label: "Dashboard",                    icon: "📊" },
    { id: "ia",             label: "Preguntas de la IA",            icon: "🔮" },
    { id: "sin-respuesta",  label: <span>Preguntas sin<br/>Respuesta</span>, icon: "🔴" },
    { id: "respondidas",    label: <span>Preguntas<br/>Respondidas</span>,   icon: "✅" },
    { id: "dos-respuestas", label: <span>PREGUNTAS CON<br/>DOS RESPUESTAS</span>, icon: "💬" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; overflow: hidden; }
      `}</style>

      <div style={{
        width: "100vw", height: "100vh", display: "flex",
        overflow: "hidden", fontFamily: "'Outfit', sans-serif",
        background: C.bg,
      }}>

        {/* ── SIDEBAR IZQUIERDO ── */}
        <aside style={{
          flex: "0 0 168px", width: 168,
          height: "100vh", background: C.sidebar,
          display: "flex", flexDirection: "column",
          paddingTop: 12, overflow: "hidden",
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

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main style={{
          flex: "1 1 0", minWidth: 0,
          height: "100vh", overflow: "auto",
          position: "relative", background: C.bg,
        }}>
          {section === "dashboard"      && <SectionDashboard    stats={stats}/>}
          {section === "ia"             && <SectionIA/>}
          {section === "sin-respuesta"  && <SectionSinRespuesta questions={pendingQ} onSaveAnswer={handleSaveAnswer}/>}
          {section === "respondidas"    && <SectionRespondidas  questions={respondedQ}/>}
          {section === "dos-respuestas" && <SectionDosRespuestas questions={twoAnswersQ}/>}
        </main>

      </div>
    </>
  )
}