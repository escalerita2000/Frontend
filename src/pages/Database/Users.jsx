// src/pages/Database/Users/Users.jsx
import { useState, useEffect } from 'react';
import { getUsersDetails, createUser } from '../../services/apiExtras';

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersDetails(1, 50);
        setData(response.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.is_active ? 'Activo' : 'Inactivo'
        })));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando usuarios...</p>;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await createUser(formData);
      const newUser = res.user;
      setData(prev => [{
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.is_active ? 'Activo' : 'Inactivo'
      }, ...prev]);
      setShowModal(false);
      setFormData({ name: '', email: '', role: 'user', password: '' });
    } catch (err) {
      setErrorMsg(err.message || "Error al crear usuario");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{data.length} usuarios registrados</p>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#111827', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
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
            {data.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < data.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
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

      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '24px', borderRadius: '8px', zIndex: 101, width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#111827' }}>Nuevo Usuario</h3>
            {errorMsg && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{errorMsg}</p>}
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Nombre</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Contraseña</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength={8} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>Rol</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="user">Usuario normal</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Crear</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default Users