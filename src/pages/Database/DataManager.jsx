// src/pages/Database/DataManager.jsx
// Orquestador del modulo Database. Solo accesible para admin.
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Users from '../Database/Users'  
import Questions from './Questions'

const TABS = [
  { id: 'users', label: 'Usuarios' },
  { id: 'questions', label: 'Preguntas' },
]

const DataManager = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')

  // Guard extra por si alguien llega aqui directamente
  if (user?.role !== 'admin') {
    return <p style={{ color: '#dc2626' }}>Acceso denegado. Se requiere rol admin.</p>
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: '600' }}>Base de datos</h1>

      {/* Tabs de navegacion */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: activeTab === tab.id ? '500' : '400',
              color: activeTab === tab.id ? '#111827' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #111827' : '2px solid transparent',
              marginBottom: '-1px',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Renderiza el componente segun tab activo */}
      {activeTab === 'users' && <Users />}
      {activeTab === 'questions' && <Questions />}
    </div>
  )
}

export default DataManager