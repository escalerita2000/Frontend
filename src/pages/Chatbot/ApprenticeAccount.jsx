import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getAuthUser, updateProfile } from "../../services/authService"
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft, FiSave } from "react-icons/fi"
import Swal from "sweetalert2"

const ApprenticeAccount = () => {
  const navigate = useNavigate()
  const { user: contextUser, setUser: setGlobalUser } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  
  const [avatarFile, setAvatarFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const C = {
    primary: '#3d9c3a',
    primaryDark: '#1a3318',
    text: '#222',
    textLight: '#666',
    bgLight: 'rgba(255, 255, 255, 0.85)',
    inputBg: 'rgba(0, 0, 0, 0.04)',
    inputBorder: 'rgba(0, 0, 0, 0.08)'
  }

  useEffect(() => {
    if (contextUser) {
      setUser(contextUser)
      setFormData(prev => ({
        ...prev,
        name: contextUser.name || contextUser.nombre || '',
        email: contextUser.email || contextUser.correo || ''
      }))
      setLoading(false)
    }
    
    const syncUser = async () => {
      try {
        const data = await getAuthUser()
        const userData = data.user || data
        setUser(userData)
        setFormData(prev => ({
          ...prev,
          name: userData.name || userData.nombre || '',
          email: userData.email || userData.correo || ''
        }))
      } catch (error) {
        console.warn("Error sincronizando usuario:", error)
      } finally {
        setLoading(false)
      }
    }
    syncUser()
  }, [contextUser])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'La imagen no debe superar los 2MB', confirmButtonColor: C.primary })
        return
      }
      setAvatarFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      
      if (avatarFile) data.append('avatar', avatarFile)
      
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          throw new Error("Las contraseñas no coinciden")
        }
        data.append('password', formData.password)
        data.append('password_confirmation', formData.password_confirmation)
      }

      const result = await updateProfile(data)
      const updatedUser = result.user || result
      
      setUser(updatedUser)
      setGlobalUser(updatedUser)
      setPreviewUrl(null)
      setAvatarFile(null)
      
      localStorage.setItem('authUser', JSON.stringify(updatedUser))
      
      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Tus cambios se han guardado correctamente.',
        confirmButtonColor: C.primary
      })
      
      setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }))
    } catch (error) {
      const detail = error.response?.data?.message || error.message;
      Swal.fire({ icon: 'error', title: 'Error', text: detail, confirmButtonColor: C.primary })
    } finally {
      setSaving(false)
    }
  }

  if (loading && !user) return <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:C.text}}>Cargando...</div>

  const initials = (user?.name || "U").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      background: 'linear-gradient(135deg, #f5f7f5 0%, #e8ebe8 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        background: C.bgLight,
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
        position: 'relative'
      }}>
        <button 
          onClick={() => navigate('/chatbot')}
          style={{
            position: 'absolute', top: '24px', left: '24px',
            background: 'rgba(0,0,0,0.04)', border: 'none',
            borderRadius: '10px', padding: '8px 12px', color: C.primaryDark,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'
          }}
        >
          <FiArrowLeft /> Volver
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: '#fff', padding: '3px', border: `2px solid ${C.primary}`,
              boxShadow: '0 10px 25px rgba(61, 156, 58, 0.15)',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: '#f0f0f0', overflow: 'hidden', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                fontWeight: '700', color: C.primary, fontFamily: "'Bebas Neue', sans-serif"
              }}>
                {previewUrl || user?.avatar_url ? (
                  <img src={previewUrl || user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : initials}
              </div>
            </div>
            <label htmlFor="avatar-upload" style={{
              position: 'absolute', bottom: '0', right: '0',
              background: C.primary, width: '36px', height: '36px',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', border: '3px solid #fff',
              color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <FiCamera size={16} />
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>
          <h1 style={{ color: C.primaryDark, fontSize: '1.6rem', margin: '15px 0 2px', fontWeight: '800' }}>{user?.name || 'Mi Perfil'}</h1>
          <p style={{ color: C.textLight, fontSize: '13px', fontWeight: '500' }}>{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <label style={{ fontSize: '11px', fontWeight: '700', color: C.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '5px' }}>Información Personal</label>
             <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: C.primary }} />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre"
                  style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: '12px', padding: '14px 15px 14px 45px', color: C.text, outline: 'none', fontSize: '14px' }}
                />
             </div>
             <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: C.primary }} />
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Tu correo"
                  style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: '12px', padding: '14px 15px 14px 45px', color: C.text, outline: 'none', fontSize: '14px' }}
                />
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '5px' }}>
             <label style={{ fontSize: '11px', fontWeight: '700', color: C.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '5px' }}>Seguridad</label>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                   <FiLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: C.primary }} />
                   <input 
                     type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nueva clave"
                     style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: '12px', padding: '14px 15px 14px 42px', color: C.text, outline: 'none', fontSize: '13px' }}
                   />
                </div>
                <div style={{ position: 'relative' }}>
                   <FiLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: C.primary }} />
                   <input 
                     type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Confirmar"
                     style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderRadius: '12px', padding: '14px 15px 14px 42px', color: C.text, outline: 'none', fontSize: '13px' }}
                   />
                </div>
             </div>
          </div>

          <button 
            type="submit" disabled={saving}
            style={{
              width: '100%', background: C.primary, color: '#fff',
              border: 'none', borderRadius: '12px', padding: '15px',
              fontSize: '15px', fontWeight: '700', cursor: saving ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(61, 156, 58, 0.2)',
              marginTop: '15px', opacity: saving ? 0.7 : 1
            }}
          >
            <FiSave size={18} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApprenticeAccount
