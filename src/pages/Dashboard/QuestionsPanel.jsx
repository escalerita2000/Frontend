/*
  AVIS – Panel de Preguntas Avanzado
  QuestionsPanel.jsx - Refactored for AVIS Portal Theme
*/

import { useState, useEffect } from "react"

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

const StatusBadge = ({ estado }) => {
  const isPending  = estado === "Pendiente"
  const isRevision = estado === "En Revision"
  const bg = isPending ? "rgba(224,85,85,0.15)" : isRevision ? "rgba(253,230,138,0.15)" : "rgba(82,196,79,0.15)";
  const color = isPending ? C.red : isRevision ? "#fcd34d" : C.greenL;
  
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px", borderRadius: 20,
      fontSize: ".7rem", fontWeight: 700,
      background: bg, color: color,
      border: `1px solid ${color}`,
      letterSpacing: ".04em", textTransform: "uppercase"
    }}>
      {estado}
    </span>
  )
}

const SectionDashboard = ({ stats }) => (
  <div style={{ padding: "40px" }}>
    <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", fontWeight: 400, color: C.white, letterSpacing: ".05em", marginBottom: 32 }}>
      ESTADISTICAS DE PREGUNTAS
    </h1>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
      {[
        { value: stats.registradas,  label: "Preguntas Registradas" },
        { value: stats.pendientes,   label: "PENDIENTES" },
        { value: stats.respondidas,  label: "PREGUNTAS RESPONDIDAS" },
        { value: stats.paraRevisar,  label: "PARA REVISAR" },
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

const SectionSinRespuesta = ({ questions }) => {
  const [editingId, setEditingId] = useState(null);
  
  const thStyle = {
    padding: "16px", fontSize: ".7rem", fontWeight: 700,
    letterSpacing: ".15em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)", textAlign: "left",
    background: "#161616", borderBottom: `1px solid ${C.border}`,
  }

  const tdStyle = {
    padding: "16px", fontSize: ".88rem",
    color: C.white, borderBottom: `1px solid rgba(61,156,58,0.1)`,
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: C.white, marginBottom: 24 }}>
        Preguntas sin respuesta
      </h1>

      <div style={{ background: "#161616", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "50%" }}>Pregunta</th>
              <th style={{ ...thStyle, width: "20%" }}>Fecha</th>
              <th style={{ ...thStyle, width: "30%", textAlign: "center" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td style={tdStyle}>{q.pregunta}</td>
                <td style={{ ...tdStyle, color: C.gray, fontSize: ".8rem" }}>{q.fecha}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <StatusBadge estado={q.estado}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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

export default function QuestionsPanel() {
  const [section, setSection] = useState("dashboard")
  
  const navItems = [
    { id: "dashboard",      label: "Dashboard",       icon: "📊" },
    { id: "sin-respuesta",  label: "Sin Respuesta",   icon: "🔴" },
    { id: "respondidas",    label: "Respondidas",     icon: "✅" },
    { id: "dos-respuestas", label: "Multi-Resp",      icon: "💬" },
  ]

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Sub-Sidebar */}
      <aside style={{
        flex: "0 0 160px", 
        background: "#0f0f0f",
        borderRight: `1px solid ${C.border}`,
        paddingTop: 20
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

      {/* Content Area */}
      <main style={{ flex: 1, overflow: "auto", background: C.black }}>
        {section === "dashboard"      && <SectionDashboard stats={MOCK_STATS}/>}
        {section === "sin-respuesta"  && <SectionSinRespuesta questions={MOCK_PENDING}/>}
        {/* Placeholders for other sections */}
        {(section === "respondidas" || section === "dos-respuestas") && (
          <div style={{padding:40, color:C.gray}}>Módulo en desarrollo para integración con base de datos.</div>
        )}
      </main>
    </div>
  )
}