// src/pages/Database/Users/Users.jsx
// Componente "tonto": solo renderiza datos que recibe o genera localmente.

const MOCK_DATA = [
  { id: '1', name: 'Admin Principal', email: 'admin@app.com', role: 'admin', status: 'Activo' },
  { id: '2', name: 'Usuario Normal', email: 'user@app.com', role: 'user', status: 'Activo' },
  { id: '3', name: 'Maria Lopez', email: 'maria@app.com', role: 'user', status: 'Inactivo' },
]

const Users = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{MOCK_DATA.length} usuarios registrados</p>
        <button style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#111827', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
          + Nuevo usuario
        </button>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Nombre', 'Email', 'Rol', 'Estado', 'Acciones'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '500', fontSize: '13px', color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < MOCK_DATA.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{u.name}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
                    background: u.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                    color: u.role === 'admin' ? '#1d4ed8' : '#374151',
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '12px', color: u.status === 'Activo' ? '#15803d' : '#9ca3af' }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button style={{ border: 'none', background: 'none', color: '#6b7280', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users