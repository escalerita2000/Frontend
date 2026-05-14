import { useState, useEffect, useCallback } from "react"
import { useOutletContext } from "react-router-dom"
import {
  getSugerencias,
  updateSugerenciaEstado,
  deleteSugerencia,
} from "../../services/apiExtras"

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
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
  red:      "#e05555",
  yellow:   "#f5a623",
  teal:     "#4ab8c8",
  rowBg:    "#161616",
}

const ESTADO_CONFIG = {
  nueva:    { label: "Nueva",    color: C.teal,   bg: "rgba(74,184,200,0.12)"  },
  revisada: { label: "Revisada", color: C.yellow,  bg: "rgba(245,166,35,0.12)" },
  resuelta: { label: "Resuelta", color: C.greenL,  bg: "rgba(82,196,79,0.12)"  },
}

const TIPOS_ALL = ["todos", "Sugerencia de mejora", "Reporte de error", "Solicitud de ayuda", "Otra"]
const ESTADOS_ALL = ["todas", "nueva", "revisada", "resuelta"]

/* ── Badge de estado ── */
const EstadoBadge = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado] || { label: estado, color: C.gray, bg: "rgba(136,136,136,0.1)" }
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: ".7rem",
      fontWeight: 700,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.color}30`,
      whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  )
}

/* ── Card de sugerencia ── */
const SugerenciaCard = ({ item, onChangeEstado, onDelete, loadingId }) => {
  const [expanded, setExpanded] = useState(false)
  const isLoading = loadingId === item.id

  return (
    <div style={{
      background: C.darkCard,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "border-color .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(61,156,58,0.5)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: C.greenL, marginBottom: 4 }}>
            {item.tipo}
          </p>
          <h3 style={{ fontSize: ".95rem", color: C.white, margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            {item.titulo}
          </h3>
        </div>
        <EstadoBadge estado={item.estado} />
      </div>

      {/* Descripción (expandible) */}
      <p style={{
        fontSize: ".82rem",
        color: C.gray,
        lineHeight: 1.6,
        margin: 0,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: expanded ? "unset" : 2,
        WebkitBoxOrient: "vertical",
        transition: "all .3s",
      }}>
        {item.descripcion}
      </p>

      {item.descripcion.length > 120 && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ all: "unset", cursor: "pointer", fontSize: ".75rem", color: C.greenL, fontWeight: 600 }}
        >
          {expanded ? "Ver menos ▲" : "Ver más ▼"}
        </button>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {item.email && (
            <span style={{ fontSize: ".75rem", color: C.teal }}>✉ {item.email}</span>
          )}
          <span style={{ fontSize: ".7rem", color: "#555" }}>
            {new Date(item.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {/* Selector de estado */}
          <select
            value={item.estado}
            onChange={e => onChangeEstado(item.id, e.target.value)}
            disabled={isLoading}
            style={{
              background: "#1a1a1a",
              border: `1px solid ${C.border}`,
              color: C.white,
              padding: "5px 8px",
              borderRadius: 6,
              fontSize: ".75rem",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="nueva">Nueva</option>
            <option value="revisada">Revisada</option>
            <option value="resuelta">Resuelta</option>
          </select>

          {/* Eliminar */}
          <button
            onClick={() => onDelete(item.id)}
            disabled={isLoading}
            title="Eliminar"
            style={{
              background: "rgba(224,85,85,0.1)",
              border: `1px solid rgba(224,85,85,0.3)`,
              color: C.red,
              padding: "5px 10px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: ".75rem",
              fontWeight: 700,
              transition: "background .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(224,85,85,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(224,85,85,0.1)"}
          >
            {isLoading ? "..." : "✕"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function AdminSugerencias() {
  const { showToast } = useOutletContext()

  const [sugerencias, setSugerencias]   = useState([])
  const [meta, setMeta]                 = useState(null)
  const [loading, setLoading]           = useState(true)
  const [loadingId, setLoadingId]       = useState(null)
  const [page, setPage]                 = useState(1)

  // Filtros
  const [filterEstado, setFilterEstado] = useState("todas")
  const [filterTipo,   setFilterTipo]   = useState("todos")
  const [search,       setSearch]       = useState("")
  const [searchInput,  setSearchInput]  = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getSugerencias({ estado: filterEstado, tipo: filterTipo, search, page })
      setSugerencias(res.data || [])
      setMeta(res)
    } catch (err) {
      showToast?.("error", "Error al cargar sugerencias")
    } finally {
      setLoading(false)
    }
  }, [filterEstado, filterTipo, search, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleChangeEstado = async (id, nuevoEstado) => {
    setLoadingId(id)
    try {
      await updateSugerenciaEstado(id, nuevoEstado)
      setSugerencias(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s))
      showToast?.("success", "Estado actualizado")
    } catch (err) {
      showToast?.("error", err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta sugerencia?")) return
    setLoadingId(id)
    try {
      await deleteSugerencia(id)
      setSugerencias(prev => prev.filter(s => s.id !== id))
      showToast?.("success", "Sugerencia eliminada")
    } catch (err) {
      showToast?.("error", err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleFilterEstado = (v) => { setFilterEstado(v); setPage(1) }
  const handleFilterTipo   = (v) => { setFilterTipo(v);   setPage(1) }

  // Conteo por estado
  const conteo = { nueva: 0, revisada: 0, resuelta: 0 }
  sugerencias.forEach(s => { if (conteo[s.estado] !== undefined) conteo[s.estado]++ })

  return (
    <div style={{
      flex: "1 1 0",
      minWidth: 0,
      minHeight: 0,
      background: C.greenMid,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 18,
      height: "100%",
      boxSizing: "border-box",
      overflowY: "auto",
    }}>

      {/* Header */}
      <div style={{
        background: C.darkCard,
        borderRadius: 12,
        padding: "20px 24px",
        border: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: C.white, margin: 0, letterSpacing: ".05em" }}>
            PANEL DE SUGERENCIAS
          </h2>
          <p style={{ fontSize: ".8rem", color: C.gray, margin: 0 }}>
            Gestiona los reportes y sugerencias de los usuarios
          </p>
        </div>

        {/* Contadores rápidos */}
        <div style={{ display: "flex", gap: 12 }}>
          {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{
              background: cfg.bg,
              border: `1px solid ${cfg.color}40`,
              borderRadius: 8,
              padding: "8px 14px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "1.4rem", fontFamily: "'Bebas Neue', sans-serif", color: cfg.color, margin: 0, lineHeight: 1 }}>
                {meta ? (meta[`total_${key}`] ?? 0) : "—"}
              </p>
              <p style={{ fontSize: ".65rem", color: C.gray, margin: 0, letterSpacing: ".1em", textTransform: "uppercase" }}>
                {cfg.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        background: C.darkCard,
        borderRadius: 10,
        padding: "14px 18px",
        border: `1px solid ${C.border}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
      }}>

        {/* Búsqueda */}
        <div style={{ display: "flex", gap: 6, flex: "1 1 220px" }}>
          <input
            type="text"
            placeholder="Buscar por título, descripción o correo..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            style={{
              flex: 1,
              background: "#1a1a1a",
              border: `1px solid ${C.border}`,
              color: C.white,
              padding: "8px 12px",
              borderRadius: 6,
              fontSize: ".82rem",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              background: C.greenD, color: C.white, border: "none",
              padding: "8px 14px", borderRadius: 6, cursor: "pointer",
              fontWeight: 700, fontSize: ".8rem",
            }}
          >
            Buscar
          </button>
        </div>

        {/* Filtro estado */}
        <select
          value={filterEstado}
          onChange={e => handleFilterEstado(e.target.value)}
          style={{ background: "#1a1a1a", border: `1px solid ${C.border}`, color: C.white, padding: "8px 10px", borderRadius: 6, fontSize: ".8rem", outline: "none" }}
        >
          {ESTADOS_ALL.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
        </select>

        {/* Filtro tipo */}
        <select
          value={filterTipo}
          onChange={e => handleFilterTipo(e.target.value)}
          style={{ background: "#1a1a1a", border: `1px solid ${C.border}`, color: C.white, padding: "8px 10px", borderRadius: 6, fontSize: ".8rem", outline: "none", maxWidth: 200 }}
        >
          {TIPOS_ALL.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>

        {(search || filterEstado !== "todas" || filterTipo !== "todos") && (
          <button
            onClick={() => { setFilterEstado("todas"); setFilterTipo("todos"); setSearch(""); setSearchInput(""); setPage(1) }}
            style={{ all: "unset", cursor: "pointer", fontSize: ".75rem", color: C.red, fontWeight: 700 }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Listado */}
      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.gray }}>
          Cargando sugerencias...
        </div>
      ) : sugerencias.length === 0 ? (
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: C.gray,
          gap: 8,
          padding: 40,
        }}>
          <span style={{ fontSize: "3rem", opacity: .3 }}>💬</span>
          <p style={{ fontSize: ".9rem", margin: 0 }}>
            {search || filterEstado !== "todas" || filterTipo !== "todos"
              ? "No hay sugerencias que coincidan con los filtros."
              : "Aún no hay sugerencias registradas."}
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 14,
        }}>
          {sugerencias.map(item => (
            <SugerenciaCard
              key={item.id}
              item={item}
              onChangeEstado={handleChangeEstado}
              onDelete={handleDelete}
              loadingId={loadingId}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {meta && meta.last_page > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "8px 0 4px" }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: page === 1 ? C.gray : C.white,
              padding: "6px 14px",
              borderRadius: 6,
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontSize: ".8rem",
            }}
          >
            ← Anterior
          </button>
          <span style={{ fontSize: ".8rem", color: C.gray }}>
            Página <strong style={{ color: C.white }}>{page}</strong> de <strong style={{ color: C.white }}>{meta.last_page}</strong>
          </span>
          <button
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={page === meta.last_page}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: page === meta.last_page ? C.gray : C.white,
              padding: "6px 14px",
              borderRadius: 6,
              cursor: page === meta.last_page ? "not-allowed" : "pointer",
              fontSize: ".8rem",
            }}
          >
            Siguiente →
          </button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap');
        option { background: #1a1a1a; }
      `}</style>
    </div>
  )
}
