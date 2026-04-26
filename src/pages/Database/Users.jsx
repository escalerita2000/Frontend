import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { getUsersDetails, createUser, updateUser, deleteUser } from '../../services/apiExtras'
import { FiDownload } from 'react-icons/fi'

const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  darkCard: "#191919",
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
}

const PER_PAGE = 10   // usuarios por página

const Users = () => {
  const { showToast } = useOutletContext()
  const [data,        setData]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [showModal,   setShowModal]   = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData,    setFormData]    = useState({ name:'', email:'', role:'aprendiz', password:'', is_active:true })
  const [errorMsg,    setErrorMsg]    = useState('')

  /* ── Carga usuarios ── */
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await getUsersDetails(1, 200)   // trae todos, paginamos en cliente
      const usersList = response.data || response
      setData(usersList.map(u => ({
        ...u,
        initials: u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        color: `hsl(${(u.id * 137.5) % 360}, 50%, 40%)`,
      })))
      setPage(1)   // volver a la primera página al recargar
    } catch (error) {
      console.error("Error fetching users:", error)
      if (showToast) showToast('error', 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  /* ── Paginación en cliente ── */
  const totalPages  = Math.max(1, Math.ceil(data.length / PER_PAGE))
  const pageData    = data.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const goPage = (n) => setPage(Math.max(1, Math.min(totalPages, n)))

  /* ── Genera array de páginas a mostrar (máx 5 botones) ── */
  const pageNumbers = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const half  = 2
    let start   = Math.max(1, page - half)
    let end     = Math.min(totalPages, page + half)
    if (end - start < 4) {
      if (start === 1) end   = Math.min(5, totalPages)
      else             start = Math.max(1, end - 4)
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })()

  /* ── Modal ── */
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({ name: user.name, email: user.email, role: user.role, is_active: user.is_active, password: '' })
    } else {
      setEditingUser(null)
      setFormData({ name:'', email:'', role:'aprendiz', password:'', is_active:true })
    }
    setErrorMsg('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      if (editingUser) {
        const updateData = { ...formData }
        if (!updateData.password) delete updateData.password
        await updateUser(editingUser.id, updateData)
        if (showToast) showToast('success', 'Usuario actualizado correctamente')
      } else {
        await createUser(formData)
        if (showToast) showToast('success', 'Usuario creado correctamente')
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      setErrorMsg(err.message || "Error al procesar la solicitud")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este usuario?")) return
    try {
      await deleteUser(id)
      if (showToast) showToast('success', 'Usuario eliminado correctamente')
      fetchUsers()
    } catch (err) {
      if (showToast) showToast('error', err.message || 'Error al eliminar usuario')
    }
  }

  const roleColor = r => r === "admin" ? C.greenL : r === "instructor" ? C.teal : C.white

  /* ── Estilos reutilizables ── */
  const thStyle = {
    padding: '14px 16px',
    fontSize: '.68rem', fontWeight: 700,
    letterSpacing: '.15em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)', background: '#161616',
    borderBottom: `1px solid ${C.border}`,
    position: 'sticky', top: 0, zIndex: 1,   // ← thead fijo al hacer scroll
  }

  const btnPage = (n, label, disabled) => (
    <button
      key={label ?? n}
      onClick={() => !disabled && goPage(n)}
      disabled={disabled}
      style={{
        all: 'unset',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '.8rem', fontWeight: 600,
        letterSpacing: '.04em',
        color: page === n ? C.white : C.gray,
        padding: '6px 10px', borderRadius: 5,
        background: page === n ? C.greenD : 'none',
        border: page === n ? `1px solid ${C.green}` : '1px solid transparent',
        opacity: disabled ? .4 : 1,
        minWidth: 32, textAlign: 'center',
        transition: 'all .15s',
      }}
    >
      {label ?? n}
    </button>
  )

  if (loading && data.length === 0) {
    return <p style={{ color: C.gray, fontSize: '14px', textAlign: 'center', padding: '40px' }}>Cargando usuarios...</p>
  }

  return (
    /*
      ─────────────────────────────────────────────────
      Layout: flex column con 3 zonas
        1. Barra superior  (flexShrink:0 — no se comprime)
        2. Tabla           (flex:1 — crece y hace scroll)
        3. Paginación      (flexShrink:0 — siempre visible)
      ─────────────────────────────────────────────────
    */
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0',
      minHeight: 0,
      gap: 0,
      height: '100%',
    }}>

      {/* ── 1. Barra superior ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexShrink: 0,
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: C.gray }}>
          {data.length} usuarios registrados
          {totalPages > 1 && (
            <span style={{ marginLeft: 8, color: C.gray, opacity: .6 }}>
              — Página {page} de {totalPages}
            </span>
          )}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const excelData = data.map(u => ({
                Nombre: u.name, Email: u.email, Rol: u.role,
                Estado: u.is_active ? 'Activo' : 'Inactivo',
                Fecha_Registro: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
              }))
              import('../../utils/exportUtils').then(m => m.exportToExcel(excelData, 'Usuarios_Registrados.xlsx'))
            }}
            style={{
              padding: '9px 16px', borderRadius: '8px', border: `1px solid ${C.gray}`,
              background: 'transparent', color: C.gray, fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <FiDownload size={14}/> EXCEL
          </button>
          <button
            onClick={() => handleOpenModal()}
            style={{
              padding: '9px 16px', borderRadius: '8px', border: 'none',
              background: C.greenD, color: '#fff', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.green}
            onMouseLeave={e => e.currentTarget.style.background = C.greenD}
          >
            + Nuevo usuario
          </button>
        </div>
      </div>

      {/* ── 2. Tabla con scroll interno ── */}
      <div style={{
        flex: '1 1 0',
        minHeight: 0,
        background: '#161616',
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        // Scroll SOLO aquí, no en el contenedor padre
        overflowY: 'auto',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr>
              {['Nombre', 'Rol', 'Estado', 'Acciones'].map((h, i) => (
                <th key={h} style={{ ...thStyle, textAlign: i >= 2 ? 'center' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: C.gray, fontSize: '.88rem' }}>
                  No hay usuarios en esta página.
                </td>
              </tr>
            ) : pageData.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid rgba(61,156,58,0.06)` }}>

                {/* Nombre */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: u.color || C.greenBg, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.72rem', fontWeight: 700, color: '#fff',
                    }}>
                      {u.initials || 'U'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, color: '#fff', fontSize: '.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '.72rem', color: C.gray, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Rol */}
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '.82rem', fontWeight: 600, color: roleColor(u.role), textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    {u.role}
                  </span>
                </td>

                {/* Estado */}
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', margin: '0 auto',
                    background: u.is_active ? C.greenL : C.red,
                    boxShadow: u.is_active ? `0 0 8px ${C.greenL}` : 'none',
                  }} title={u.is_active ? "Activo" : "Inactivo"} />
                </td>

                {/* Acciones */}
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                    <button
                      onClick={() => handleOpenModal(u)}
                      title="Editar"
                      style={{ all: 'unset', cursor: 'pointer', color: C.gray, display: 'flex', transition: 'color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = C.greenL}
                      onMouseLeave={e => e.currentTarget.style.color = C.gray}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      title="Eliminar"
                      style={{ all: 'unset', cursor: 'pointer', color: C.gray, display: 'flex', transition: 'color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = C.red}
                      onMouseLeave={e => e.currentTarget.style.color = C.gray}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 3. Paginación — SIEMPRE visible, nunca se comprime ── */}
      {totalPages > 1 && (
        <div style={{
          flexShrink: 0,           // ← clave: no se comprime nunca
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: '12px 0 10px',
          flexWrap: 'wrap',
        }}>
          {/* Anterior */}
          {btnPage(page - 1, '←', page === 1)}

          {/* Primera página si no está en el rango */}
          {pageNumbers[0] > 1 && (
            <>
              {btnPage(1, 1, false)}
              {pageNumbers[0] > 2 && <span style={{ color: C.gray, padding: '0 4px' }}>…</span>}
            </>
          )}

          {/* Páginas del rango */}
          {pageNumbers.map(n => btnPage(n, n, false))}

          {/* Última página si no está en el rango */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span style={{ color: C.gray, padding: '0 4px' }}>…</span>
              )}
              {btnPage(totalPages, totalPages, false)}
            </>
          )}

          {/* Siguiente */}
          {btnPage(page + 1, '→', page === totalPages)}
        </div>
      )}

      {/* ── Modal crear / editar ── */}
      {showModal && (
        <>
          <div
            onClick={() => setShowModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100 }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1a1a1a', padding: '28px 24px',
            borderRadius: '12px', zIndex: 101,
            width: '94%', maxWidth: '440px',
            border: '1px solid #333',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h3 style={{ margin: '0 0 22px', fontSize: '1.5rem', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '.05em' }}>
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>

            {errorMsg && (
              <p style={{ color: C.red, fontSize: '13px', marginBottom: '16px', background: 'rgba(224,85,85,0.1)', padding: '10px', borderRadius: '6px' }}>
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Nombre completo', key: 'name',  type: 'text',     required: true },
                { label: 'Correo electrónico', key: 'email', type: 'email', required: true },
                { label: `Contraseña${editingUser ? ' (vacío = sin cambios)' : ''}`, key: 'password', type: 'password', required: !editingUser },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>{label}</label>
                  <input
                    required={required}
                    type={type}
                    value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    style={{
                      width: '100%', padding: '11px 12px',
                      background: '#222', border: '1px solid #444',
                      borderRadius: '8px', color: '#fff', outline: 'none',
                      fontFamily: "'Outfit', sans-serif", fontSize: '.88rem',
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Rol</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%', padding: '11px 12px',
                    background: '#222', border: '1px solid #444',
                    borderRadius: '8px', color: '#fff', outline: 'none', cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif", fontSize: '.88rem',
                  }}
                >
                  <option value="aprendiz">Aprendiz</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '11px 18px', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '11px 22px', background: C.greenD, border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = C.green}
                  onMouseLeave={e => e.currentTarget.style.background = C.greenD}
                >
                  {editingUser ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default Users