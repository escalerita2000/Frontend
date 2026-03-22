// src/pages/Database/Questions/Questions.jsx

const MOCK_DATA = [
  { id: '1', text: 'Que es React?', category: 'Frontend', active: true },
  { id: '2', text: 'Como funciona el Context API?', category: 'React', active: true },
  { id: '3', text: 'Que son los hooks?', category: 'React', active: false },
]

const Questions = () => {
  return (
    <div>
      <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>{MOCK_DATA.length} preguntas registradas</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {MOCK_DATA.map((q) => (
          <div key={q.id} style={{ padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '500' }}>{q.text}</p>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{q.category}</span>
            </div>
            <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: q.active ? '#f0fdf4' : '#f9fafb', color: q.active ? '#15803d' : '#9ca3af' }}>
              {q.active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Questions