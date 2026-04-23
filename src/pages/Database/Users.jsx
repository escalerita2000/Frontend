import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { getUsersDetails, createUser, updateUser, deleteUser } from '../../services/apiExtras';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
import { FiDownload } from 'react-icons/fi';

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

const Users = () => {
  const { showToast } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'aprendiz', password: '', is_active: true });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersDetails(1, 100);
      // Laravel paginate returns { data: [...] }
      const usersList = response.data || response;
      setData(usersList.map(u => ({
        ...u,
        initials: u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        color: `hsl(${(u.id * 137.5) % 360}, 50%, 40%)`
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      if (showToast) showToast('error', 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        password: '' // Don't show password
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'aprendiz', password: '', is_active: true });
    }
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateUser(editingUser.id, updateData);
        if (showToast) showToast('success', 'Usuario actualizado correctamente');
      } else {
        await createUser(formData);
        if (showToast) showToast('success', 'Usuario creado correctamente');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setErrorMsg(err.message || "Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      if (showToast) showToast('success', 'Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      if (showToast) showToast('error', err.message || 'Error al eliminar usuario');
    }
  };

  const roleColor = r => r === "admin" ? C.greenL : r === "instructor" ? C.teal : C.white;

  if (loading && data.length === 0) {
    return <p style={{ color: C.gray, fontSize: '14px', textAlign: 'center', padding: '40px' }}>Cargando usuarios...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '14px', color: C.gray }}>{data.length} usuarios registrados</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => {
              const excelData = data.map(u => ({
                Nombre: u.name,
                Email: u.email,
                Rol: u.role,
                Estado: u.is_active ? 'Activo' : 'Inactivo',
                Fecha_Registro: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'
              }));
              import('../../utils/exportUtils').then(u => u.exportToExcel(excelData, 'Usuarios_Registrados.xlsx'));
            }}
            style={{
              padding: '10px 18px', borderRadius: '8px', border: `1px solid ${C.gray}`,
              background: 'transparent', color: C.gray, fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <FiDownload size={16}/> EXCEL
          </button>
          <button
            onClick={() => handleOpenModal()}
            style={{
              padding: '10px 18px', borderRadius: '8px', border: 'none',
              background: C.greenD, color: '#fff', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'background .2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.green}
            onMouseLeave={e => e.currentTarget.style.background = C.greenD}
          >
            + Nuevo usuario
          </button>
        </div>
      </div>

      <div style={{ background: '#161616', borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Nombre', 'Rol', 'Estado', 'Acciones'].map((h, i) => (
                <th key={h} style={{
                  padding: '16px', fontSize: '.7rem', fontWeight: 700,
                  letterSpacing: '.15em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)', textAlign: i >= 2 ? 'center' : 'left',
                  background: '#161616'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id} style={{ borderBottom: `1px solid rgba(61,156,58,0.06)` }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', background: u.color || C.greenBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.75rem', fontWeight: 700, color: '#fff'
                    }}>
                      {u.initials || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#fff', fontSize: '.9rem' }}>{u.name}</div>
                      <div style={{ fontSize: '.75rem', color: C.gray }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '.85rem', fontWeight: 600, color: roleColor(u.role), textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%', margin: '0 auto',
                    background: u.is_active ? C.greenL : C.red,
                    boxShadow: u.is_active ? `0 0 10px ${C.greenL}` : 'none'
                  }} title={u.is_active ? "Activo" : "Inactivo"} />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button onClick={() => handleOpenModal(u)} style={{ all: 'unset', cursor: 'pointer', color: C.gray }} title="Editar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(u.id)} style={{ all: 'unset', cursor: 'pointer', color: C.gray }} title="Eliminar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: '#1a1a1a', padding: '30px', borderRadius: '12px', zIndex: 101,
            width: '100%', maxWidth: '440px', border: `1px solid #333`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '1.5rem', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '.05em' }}>
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>
            {errorMsg && <p style={{ color: C.red, fontSize: '13px', marginBottom: '16px', background: 'rgba(224,85,85,0.1)', padding: '10px', borderRadius: '6px' }}>{errorMsg}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '6px' }}>Nombre completo</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '6px' }}>Correo electrónico</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '6px' }}>Contraseña {editingUser && "(dejar vacío para mantener)"}</label>
                <input required={!editingUser} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '6px' }}>Rol</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                  <option value="aprendiz">Aprendiz</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '12px 24px', background: C.greenD, border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  {editingUser ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
