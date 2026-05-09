import { useState, useEffect } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getAuthUser, updateProfile } from "../../services/authService"
import { FiUser, FiMail, FiLock, FiShield, FiSave, FiCamera } from "react-icons/fi"

const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  darkCard: "#191919",
  green:    "#3d9c3a",
  greenD:   "#2a6e28",
  greenL:   "#52c44f",
  greenBg:  "#1a3a1a",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
  red:      "#e05555",
}

const Account = () => {
  const { showToast } = useOutletContext()
  const navigate = useNavigate()
  const { user: contextUser, setUser: setGlobalUser, logout } = useAuth()
  
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

  useEffect(() => {
    // 1. Cargar datos iniciales desde el contexto (rápido)
    if (contextUser) {
      setUser(contextUser)
      setFormData(prev => ({
        ...prev,
        name: contextUser.name || contextUser.nombre || '',
        email: contextUser.email || contextUser.correo || ''
      }))
    }

    // 2. Sincronizar con el servidor (fresco)
    const syncUser = async () => {
      try {
        const data = await getAuthUser()
        const userData = data.user || data
        setUser(userData)
        setFormData({
          name: userData.name || userData.nombre || '',
          email: userData.email || userData.correo || '',
          password: '',
          password_confirmation: ''
        })
      } catch (error) {
        console.warn("No se pudo sincronizar con el servidor, usando datos locales:", error)
        // No mostramos error al usuario aquí para no ser intrusivos si los datos locales existen
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
        showToast('error', 'La imagen no debe superar los 2MB')
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
      
      if (avatarFile) {
        data.append('avatar', avatarFile)
      }
      
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
      
      // Actualizar localStorage para persistencia
      localStorage.setItem('authUser', JSON.stringify(updatedUser))
      
      showToast('success', 'Perfil actualizado correctamente')
      setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }))
    } catch (error) {
      // Intentamos extraer el mensaje detallado del backend si existe
      const detail = error.response?.data?.message || error.message;
      showToast('error', detail || 'Error al actualizar el perfil')
      console.error("Error completo:", error);
    } finally {
      setSaving(false)
    }
  }

  // Si no hay datos ni en el contexto ni en el servidor después de cargar
  if (loading && !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.gray }}>
        <p>Cargando información...</p>
      </div>
    )
  }

  const displayName = user?.name || user?.nombre || "Administrador"
  const displayEmail = user?.email || user?.correo || "admin@avis.com"
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{
      flex: 1,
      padding: '40px 24px',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
      overflowY: 'auto'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontFamily: "'Bebas Neue', sans-serif", 
          fontSize: '2.5rem', 
          letterSpacing: '.05em', 
          color: '#fff',
          margin: 0
        }}>Mi Cuenta</h1>
        <p style={{ color: C.gray, fontSize: '14px', marginTop: '4px' }}>Información personal del administrador</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Profile Card */}
        <div style={{
          background: C.darkCard,
          borderRadius: '16px',
          border: `1px solid ${C.border}`,
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          height: 'fit-content'
        }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: C.greenBg,
              border: `3px solid ${C.green}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#fff',
              fontFamily: "'Bebas Neue', sans-serif",
              boxShadow: `0 0 20px ${C.green}33`,
              overflow: 'hidden'
            }}>
              {previewUrl || user?.avatar_url ? (
                <img 
                  src={previewUrl || user.avatar_url} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                initials
              )}
            </div>
            
            <label 
              htmlFor="avatar-upload"
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                background: C.green,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: `2px solid ${C.darkCard}`,
                color: '#fff',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FiCamera size={16} />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 4px 0' }}>{displayName}</h2>
          <p style={{ color: C.gray, fontSize: '14px', margin: '0 0 16px 0' }}>{displayEmail}</p>
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(82,196,79,.1)',
            border: `1px solid ${C.greenL}`,
            color: C.greenL,
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '24px'
          }}>
            {user?.role || 'ADMIN'}
          </span>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', width: '100%', margin: '0 0 24px 0' }} />

          <button
            onClick={() => { logout(); navigate("/login") }}
            style={{
              width:"100%", padding:"12px",
              background:"transparent",
              border:`1.5px solid ${C.red}`,
              borderRadius:8, cursor:"pointer",
              fontFamily:"'Outfit',sans-serif",
              fontSize:".8rem", fontWeight:700,
              letterSpacing:".1em", textTransform:"uppercase",
              color:C.red, display:"flex",
              alignItems:"center", justifyContent:"center",
              gap:10, transition:"background .2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(224,85,85,.12)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar Sesión
          </button>
        </div>

        {/* Edit Form */}
        <div style={{
          background: C.darkCard,
          borderRadius: '16px',
          border: `1px solid ${C.border}`,
          padding: '32px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <section>
              <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiUser size={18} color={C.greenL} /> Datos del Administrador
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: C.gray, fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Nombre</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        background: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '12px 12px 12px 40px',
                        color: '#fff',
                        outline: 'none',
                        transition: 'border-color .2s'
                      }}
                    />
                    <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: C.gray, fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        background: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '12px 12px 12px 40px',
                        color: '#fff',
                        outline: 'none',
                        transition: 'border-color .2s'
                      }}
                    />
                    <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  </div>
                </div>
              </div>
            </section>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            <section>
              <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiShield size={18} color={C.greenL} /> Seguridad
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: C.gray, fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        background: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '12px 12px 12px 40px',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                    <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: C.gray, fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Confirmar</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="password" 
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        background: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '12px 12px 12px 40px',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                    <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={saving}
              style={{
                background: C.greenD,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: saving ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all .2s',
                marginTop: '10px',
                opacity: saving ? 0.7 : 1
              }}
              onMouseEnter={e => !saving && (e.currentTarget.style.background = C.green)}
              onMouseLeave={e => !saving && (e.currentTarget.style.background = C.greenD)}
            >
              <FiSave size={18} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default Account