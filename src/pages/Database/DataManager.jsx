import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Users from '../Database/Users'

const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  green:    "#3d9c3a",
  greenL:   "#52c44f",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
}

const TABS = [
  { id: 'users', label: 'Usuarios' },
]

const DataManager = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')

  if (user?.role !== 'admin') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#e05555', fontSize: '1.2rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '.1em' }}>
          ACCESO DENEGADO
        </p>
        <p style={{ color: C.gray, fontSize: '.9rem' }}>Se requiere rol de administrador para esta sección.</p>
      </div>
    )
  }

  return (
    /*
      ─────────────────────────────────────────────────
      CLAVE: este div ocupa TODO el espacio disponible
      del Outlet y usa flex column para que la tabla
      hija pueda crecer y hacer scroll internamente.
      ─────────────────────────────────────────────────
    */
    <div style={{
      // Ocupa todo el espacio del Outlet
      flex: '1 1 0',
      minHeight: 0,
      minWidth: 0,
      width: '100%',
      height: '100%',
      // Flex column: título → tabs → tabla (tabla se estira)
      display: 'flex',
      flexDirection: 'column',
      // Padding horizontal, SIN padding inferior (la tabla llega hasta abajo)
      padding: '24px 20px 0',
      boxSizing: 'border-box',
      overflow: 'hidden',       // el scroll va DENTRO de Users
    }}>

      {/* Título */}
      <h1 style={{
        margin: '0 0 20px',
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        color: C.white,
        fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: '.08em',
        flexShrink: 0,
      }}>
        Gestión de Base de Datos
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '24px',
        borderBottom: `1px solid ${C.border}`,
        marginBottom: '20px',
        flexShrink: 0,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 4px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '.75rem',
              fontWeight: 700,
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              color: activeTab === tab.id ? C.greenL : C.gray,
              borderBottom: activeTab === tab.id ? `3px solid ${C.greenL}` : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all .2s',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/*
        Área de contenido: crece para llenar el espacio restante.
        Users maneja su propio scroll interno.
      */}
      <div style={{
        flex: '1 1 0',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn .3s ease-out',
        overflow: 'hidden',
      }}>
        {activeTab === 'users' && <Users />}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default DataManager