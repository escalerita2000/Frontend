import { useState, useEffect } from 'react';
import { getKnowledgeBase } from '../../services/apiExtras';

const Questions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getKnowledgeBase();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching knowledge base:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p style={{ color: '#6b7280' }}>Cargando conocimientos...</p>;
  }

  return (
    <div>
      <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>{data.length} preguntas registradas</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((q) => (
          <div key={q.id} style={{ padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '500' }}>{q.pregunta}</p>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{q.categoria || 'Sin categoría'}</span>
            </div>
            <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: '#f0fdf4', color: '#15803d' }}>
              Activa
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Questions