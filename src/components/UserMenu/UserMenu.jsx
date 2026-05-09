// src/components/UserMenu/UserMenu.jsx
//
// Dropdown del usuario en la parte inferior del sidebar.
// Clic en el trigger abre el menu hacia arriba (bottom: calc(100% + 8px)).
// Clic fuera lo cierra (listener en document con cleanup).
// Tecla Escape tambien lo cierra.
//
// Uso dentro del Sidebar:
//   import UserMenu from '../UserMenu/UserMenu'
//   // Al fondo del sidebar, reemplaza tu seccion de usuario actual:
//   <UserMenu />

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


const UserMenu = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    // setTimeout evita que el mismo clic que abre lo cierre
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Cerrar con Escape
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [])

  // Logout: primero limpia (AuthContext), luego navega
  // replace:true evita que el boton atras regrese a la ruta protegida
  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  // Iniciales del avatar
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  const roleLabel = { admin: 'Administrador', aprendiz: 'Aprendiz', user: 'Usuario' }[user?.role] || 'Usuario'

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>

      {/* ── Dropdown (se abre hacia arriba) ─────────────────────────────── */}
      {open && (
        <div style={{
          position:     'absolute',
          bottom:       'calc(100% + 8px)',
          left:         '8px',
          right:        '8px',
          background:   '#1a3318',
          border:       '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px',
          overflow:     'hidden',
          boxShadow:    '0 -8px 32px rgba(0,0,0,0.4)',
          zIndex:       200,
          animation:    'slideUp 0.15s ease',
        }}>
          <style>{`
            @keyframes slideUp {
              from { opacity:0; transform:translateY(6px); }
              to   { opacity:1; transform:translateY(0); }
            }
            .um-item:hover { background: rgba(255,255,255,0.07) !important; }
            .um-item-danger:hover { background: rgba(248,113,113,0.12) !important; }
          `}</style>

          {/* Cabecera con info del usuario */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserAvatar initials={initials} size={40} src={user?.avatar_url} />
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Usuario'}
              </p>
              <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || ''}
              </p>
              <span style={{ display: 'inline-block', marginTop: '5px', padding: '2px 8px', background: 'rgba(93,170,79,0.18)', border: '1px solid rgba(93,170,79,0.3)', borderRadius: '10px', fontSize: '10px', color: '#7fd46e', fontWeight: '500' }}>
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Opciones */}
          <div style={{ padding: '6px' }}>
            <DropdownItem icon={<IcoPerfil />}  label="Mi perfil"      onClick={() => { setOpen(false); navigate('/account') }} />
            <DropdownItem icon={<IcoConfig />}  label="Configuracion"  onClick={() => { setOpen(false); navigate('/configuration') }} />
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
            <DropdownItem icon={<IcoLogout />}  label="Cerrar sesion"  onClick={handleLogout} danger />
          </div>
        </div>
      )}

      {/* ── Trigger: reemplaza tu seccion de usuario en el sidebar ──────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', padding: '10px 14px',
          background: open ? 'rgba(255,255,255,0.08)' : 'transparent',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        <UserAvatar initials={initials} size={32} src={user?.avatar_url} />
        <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em', textTransform: 'uppercase', flex: 1, textAlign: 'left' }}>
          {user?.name?.split(' ')[0] || 'Usuario'}
        </span>
        {/* Chevron que rota */}
        <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

    </div>
  )
}

// ── Componentes internos ──────────────────────────────────────────────────────

const UserAvatar = ({ initials, size, src }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: src ? 'transparent' : 'rgba(93,170,79,0.2)',
    border: '1.5px solid rgba(93,170,79,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  }}>
    {src
      ? <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : <span style={{ fontSize: size * 0.36, fontWeight: '700', color: '#7fd46e' }}>{initials}</span>
    }
  </div>
)

const DropdownItem = ({ icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={danger ? 'um-item um-item-danger' : 'um-item'}
    style={{
      width: '100%', padding: '8px 10px', background: 'transparent',
      border: 'none', borderRadius: '6px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '10px',
      fontSize: '13px', color: danger ? '#f87171' : 'rgba(255,255,255,0.78)',
      textAlign: 'left', transition: 'background 0.12s',
    }}
  >
    <span style={{ opacity: 0.65, display: 'flex', flexShrink: 0 }}>{icon}</span>
    {label}
  </button>
)

const IcoPerfil  = () => <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const IcoConfig  = () => <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
const IcoLogout  = () => <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

export default UserMenu