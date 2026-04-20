import { useState, useEffect } from "react"
import { getKnowledgeBase, getDashboardStats, updateKnowledge } from "../../services/apiExtras"
import { useOutletContext, useSearchParams } from "react-router-dom"

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
      {estado ? estado.replace('_', ' ') : 'N/A'}
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

const SectionQuestionsTable = ({ title, questions, onRefresh }) => {
  const { showToast } = useOutletContext();
  const [answeringId, setAnsweringId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const handleResponse = async (id, currentStatus) => {
    if (!responseText.trim()) return;
    try {
      // Si estamos respondiendo una pendiente, pasa a en_revision (Borrador)
      // Si ya estaba en revisión o respondida, mantenemos el estado o dejamos en respondida si se prefiere
      const nextStatus = currentStatus === 'pendiente' ? 'en_revision' : currentStatus;
      
      await updateKnowledge(id, { respuesta: responseText, status: nextStatus });
      if (showToast) showToast("success", nextStatus === 'en_revision' ? "Guardado como borrador (En Revisión)" : "Respuesta actualizada");
      setAnsweringId(null);
      setResponseText("");
      if (onRefresh) onRefresh();
    } catch (err) {
       if (showToast) showToast("error", "Error al guardar respuesta");
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateKnowledge(id, { status: 'respondida' });
      if (showToast) showToast("success", "Pregunta aprobada y publicada");
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showToast) showToast("error", "Error al aprobar pregunta");
    }
  };

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
        {title}
      </h1>

      <div style={{ background: "#161616", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "40%" }}>Pregunta</th>
              <th style={{ ...thStyle, width: "15%" }}>Categoría</th>
              <th style={{ ...thStyle, width: "15%" }}>Fecha</th>
              <th style={{ ...thStyle, width: "15%", textAlign: "center" }}>Estado</th>
              <th style={{ ...thStyle, width: "15%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr><td colSpan="5" style={{...tdStyle, textAlign: 'center', padding: '40px', color: C.gray}}>No hay registros disponibles.</td></tr>
            ) : questions.map(q => (
              <tr key={q.id}>
                <td style={tdStyle}>
                  <div>{q.pregunta}</div>
                  {q.respuesta && <div style={{fontSize: '.8rem', color: C.greenL, marginTop: 4}}>R: {q.respuesta}</div>}
                </td>
                <td style={{ ...tdStyle, color: C.gray, fontSize: ".8rem" }}>{q.categoria || 'N/A'}</td>
                <td style={{ ...tdStyle, color: C.gray, fontSize: ".8rem" }}>{new Date(q.created_at).toLocaleDateString()}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <StatusBadge estado={q.status}/>
                </td>
                 <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {answeringId === q.id ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
                          <textarea 
                            value={responseText} 
                            onChange={e => setResponseText(e.target.value)}
                            placeholder="Escribe la respuesta..."
                            style={{background: '#222', color: '#fff', border: `1px solid ${C.border}`, borderRadius: 4, padding: 5, fontSize: '.8rem', minWidth: '200px'}}
                          />
                          <div style={{display: 'flex', gap: 5}}>
                            <button onClick={() => handleResponse(q.id, q.status)} style={{background: C.green, border: 'none', color: '#fff', fontSize: '.7rem', padding: '4px 8px', borderRadius: 4, cursor: 'pointer'}}>Guardar</button>
                            <button onClick={() => setAnsweringId(null)} style={{background: 'transparent', border: `1px solid ${C.gray}`, color: C.gray, fontSize: '.7rem', padding: '4px 8px', borderRadius: 4, cursor: 'pointer'}}>X</button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setAnsweringId(q.id); setResponseText(q.respuesta || ""); }}
                          style={{all: 'unset', cursor: 'pointer', color: C.greenL, fontSize: '.8rem', fontWeight: 600}}
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
                            letterSpacing: '.05em'
                          }}
                        >
                          APROBAR
                        </button>
                      )}
                    </div>
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
  const { showToast } = useOutletContext();
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get("tab") || "dashboard";
  const [section, setSection] = useState(initialSection)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ registradas: 0, pendientes: 0, respondidas: 0, paraRevisar: 0 })
  const [questions, setQuestions] = useState([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  const navItems = [
    { id: "dashboard",      label: "Dashboard",       icon: "📊" },
    { id: "sin-respuesta",  label: "Sin Respuesta",   icon: "🔴" },
    { id: "respondidas",    label: "Respondidas",     icon: "✅" },
    { id: "en-revision",    label: "En Revisión",     icon: "⏳" },
  ]

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.knowledge) {
        setStats({
          registradas: res.knowledge.total,
          pendientes: res.knowledge.pendiente,
          respondidas: res.knowledge.respondida,
          paraRevisar: res.knowledge.en_revision
        });
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  const fetchData = async (status, query = "") => {
    try {
      setLoading(true);
      const res = await getKnowledgeBase(status, query);
      setQuestions(res.data || []);
    } catch (err) {
      if (showToast) showToast("error", "Error al cargar preguntas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (section === "dashboard") {
      fetchStats();
    } else {
      const statusMap = {
        "sin-respuesta": "pendiente",
        "respondidas": "respondida",
        "en-revision": "en_revision"
      };
      fetchData(statusMap[section], debouncedSearch);
    }
  }, [section, debouncedSearch]);

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
      <main style={{ flex: 1, overflow: "auto", background: C.black, display: 'flex', flexDirection: 'column' }}>
        {/* Barra de Búsqueda (solo si no es dashboard) */}
        {section !== "dashboard" && (
          <div style={{ padding: '24px 40px 0', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
              <input 
                type="text" 
                placeholder="Buscar pregunta..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: '#161616',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '10px 12px 10px 38px',
                  color: C.white,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '.85rem',
                  outline: 'none',
                  transition: 'border-color .2s'
                }}
              />
            </div>
          </div>
        )}

        {loading && <div style={{padding: 40, color: C.gray}}>Cargando...</div>}
        
        {!loading && section === "dashboard"      && <SectionDashboard stats={stats}/>}
        {!loading && section === "sin-respuesta"  && <SectionQuestionsTable title="Preguntas sin respuesta" questions={questions} onRefresh={() => fetchData("pendiente", debouncedSearch)}/>}
        {!loading && section === "respondidas"    && <SectionQuestionsTable title="Preguntas respondidas" questions={questions} onRefresh={() => fetchData("respondida", debouncedSearch)}/>}
        {!loading && section === "en-revision"    && <SectionQuestionsTable title="Preguntas en revisión" questions={questions} onRefresh={() => fetchData("en_revision", debouncedSearch)}/>}
      </main>
    </div>
  )
}