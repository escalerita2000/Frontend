import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Users from '../Database/Users'  
import Questions from './Questions'

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
  { id: 'questions', label: 'Preguntas' },
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
    <div style={{ padding: '0 8px' }}>
      <h1 style={{ 
        margin: '0 0 32px', 
        fontSize: '2rem', 
        color: C.white, 
        fontFamily: "'Bebas Neue', sans-serif", 
        letterSpacing: '.08em' 
      }}>
        Gestión de Base de Datos
      </h1>

      {/* Tabs de navegacion */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: `1px solid ${C.border}`, marginBottom: '32px', position: 'relative' }}>
        {TABS.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 4px', 
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
              fontFamily: "'Outfit', sans-serif"
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Renderiza el componente segun tab activo */}
      <div style={{ animation: 'fadeIn .4s ease-out' }}>
        {activeTab === 'users' && <Users />}
        {activeTab === 'questions' && <Questions />}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default DataManager