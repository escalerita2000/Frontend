import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts"
import { 
  getDashboardStats, 
  getUsersDetails, 
  updateUser, 
  deleteUser,
  createUser
} from "../../services/apiExtras"

/* ══════════════════════════════════════
   PALETA DE COLORES (Premium AVIS)
══════════════════════════════════════ */
const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  darkCard: "#1c1c1c",
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
  rowBg:    "#161616",
}

const PER_PAGE = 10

/* ══════════════════════════════════════
   TOOLTIP GRÁFICAS
══════════════════════════════════════ */
const Tip = ({ active, payload, label }) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:"#111",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",fontFamily:"'Outfit',sans-serif",fontSize:".76rem",color:C.white}}>
      {label&&<p style={{color:C.greenL,marginBottom:2}}>{label}</p>}
      {payload.map((p,i)=><p key={i}>{p.value}</p>)}
    </div>
  )
}

/* ══════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════ */
const Toast = ({ toast }) => {
  if(!toast) return null
  const isOk = toast.type === "success"
  return (
    <div style={{
      position:"fixed", bottom:32, right:32, zIndex:1000,
      background: C.darkCard,
      border:`1px solid ${isOk ? C.green : C.red}`,
      borderRadius:10, padding:"16px 22px",
      minWidth:220, boxShadow:"0 8px 32px rgba(0,0,0,.4)",
      animation:"toastIn .3s ease both",
      fontFamily:"'Outfit',sans-serif",
    }}>
      <p style={{fontSize:".75rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color: isOk ? C.greenL : C.red,marginBottom:4}}>
        {isOk ? "Confirmado" : "Error"}
      </p>
      <p style={{fontSize:".82rem",color:C.white}}>{toast.msg}</p>
    </div>
  )
}

/* ══════════════════════════════════════
   MODAL EDITAR / CREAR USUARIO
══════════════════════════════════════ */
const UserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:     user?.name || "",
    email:    user?.email || "",
    role:     user?.role || "USER",
    password: "", // Solo para creación o si se desea cambiar
  })

  const set = k => e => setForm(p=>({...p,[k]:e.target.value}))

  const inputStyle = {
    width:"100%", padding:"11px 14px",
    background:"#222", border:`1px solid #444`,
    borderRadius:6, color:C.white,
    fontFamily:"'Outfit',sans-serif", fontSize:".88rem",
    outline:"none", boxSizing:"border-box",
    transition:"border-color .2s",
  }

  const labelStyle = {
    fontFamily:"'Outfit',sans-serif",
    fontSize:".82rem", color:C.white,
    marginBottom:6, display:"block",
  }

  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:200}}/>
      <div style={{
        position:"fixed", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        zIndex:201, width:"100%", maxWidth:400,
        background:"#1a1a1a", border:`1px solid #333`, borderRadius:12,
        padding:"28px", boxSizing:"border-box", fontFamily:"'Outfit',sans-serif",
      }}>
        <h2 style={{color:C.white,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",letterSpacing:".08em",marginBottom:22}}>
          {user ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={labelStyle}>Nombre</label>
            <input value={form.name} onChange={set("name")} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={form.email} onChange={set("email")} type="email" style={inputStyle} />
          </div>
          {!user && (
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input value={form.password} onChange={set("password")} type="password" style={inputStyle} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Rol</label>
            <div style={{display:"flex",gap:10}}>
              {["ADMIN","USER","INSTRUCTOR"].map(r=>(
                <button key={r} onClick={()=>setForm(p=>({...p,role:r}))}
                  style={{
                    flex:1, padding:"10px 0", borderRadius:6, cursor:"pointer",
                    fontFamily:"'Outfit',sans-serif", fontSize:".72rem", fontWeight:700,
                    textTransform:"uppercase",
                    border:`1.5px solid ${form.role===r ? C.greenL : "#444"}`,
                    background: form.role===r ? "rgba(82,196,79,.15)" : "#222",
                    color: form.role===r ? C.greenL : C.gray,
                    transition:"all .2s",
                  }}
                >{r}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>onSave(form)}
            style={{
              width:"100%", padding:14, background:C.greenD, color:C.white,
              border:"none", borderRadius:6, cursor:"pointer", fontWeight:600,
              marginTop:10
            }}
          >Guardar</button>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════
   SECTION: APPLICATION (Estadísticas Reales)
══════════════════════════════════════ */
const SectionApplication = ({ stats }) => {
  const { visitasData, registrosData, erroresData, pieData, totalVisitas, totalErrores } = stats;
  const PIE_COLORS = [C.green, "#1a3a1a"]

  return (
    <div style={{flex:"1 1 0",minWidth:0,minHeight:0,background:C.greenMid,padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:18,height:"100%",boxSizing:"border-box",overflow:"hidden"}}>
      {/* Visitas */}
      <div style={{background:C.greenBg,borderRadius:12,padding:"20px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,minHeight:0}}>
        <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:12}}>Visitas de la Página</p>
        <div style={{flex:1,minHeight:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitasData}>
              <defs><linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={.4}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient></defs>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="v" stroke={C.greenL} strokeWidth={2.5} fill="url(#gV)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:C.white,marginTop:10}}>{totalVisitas}</p>
      </div>

      {/* Registros */}
      <div style={{background:C.greenBg,borderRadius:12,padding:"20px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,minHeight:0}}>
        <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:12}}>Registros de Usuario</p>
        <div style={{flex:1,minHeight:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrosData}>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="b" fill={C.green} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:C.white,marginTop:10}}>Semana Actual</p>
      </div>

      {/* Pie Chart (Engagement) */}
      <div style={{background:C.greenBg,borderRadius:12,padding:"20px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,minHeight:0}}>
        <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:12}}>Engagement (Registrados vs Invitados)</p>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:24}}>
          <div style={{flex:1,height:"100%"}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip content={<Tip/>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.8rem",color:C.white}}>{pieData[1]?.value}%</p>
        </div>
      </div>

      {/* Errores */}
      <div style={{background:C.greenBg,borderRadius:12,padding:"20px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,minHeight:0}}>
        <p style={{fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:12}}>Errores en Producción</p>
        <div style={{flex:1,minHeight:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={erroresData}>
              <Tooltip content={<Tip/>}/>
              <Line type="monotone" dataKey="v" stroke={C.red} strokeWidth={2.5} dot={true}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:C.white,marginTop:10}}>{totalErrores}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   SECTION: DATABASE (Gestión de Usuarios Reales)
══════════════════════════════════════ */
const SectionDatabase = ({ users, page, setPage, totalPages, onEdit, onDelete, onAdd }) => {
  return (
    <div style={{flex:"1 1 0",background:C.greenMid,padding:"24px",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:C.white,letterSpacing:".05em"}}>Gestión de Usuarios</h2>
        <button onClick={onAdd} style={{all:"unset",cursor:"pointer",background:C.greenL,color:C.black,padding:"8px 16px",borderRadius:6,fontSize:".8rem",fontWeight:700,textTransform:"uppercase"}}>+ Nuevo Usuario</button>
      </div>

      <div style={{flex:1,background:"#161616",borderRadius:12,border:`1px solid ${C.border}`,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`,background:"#1a1a1a"}}>
              {["Usuario","Rol","Estado","Acciones"].map(h=><th key={h} style={{padding:16,textAlign:"left",fontSize:".7rem",color:"#777",textTransform:"uppercase"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id} style={{borderBottom:`1px solid rgba(255,255,255,.03)`}}>
                <td style={{padding:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:700}}>{u.initials}</div>
                    <div>
                      <p style={{fontSize:".88rem",fontWeight:600}}>{u.name}</p>
                      <p style={{fontSize:".72rem",color:"#666"}}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{padding:16,fontSize:".8rem",color:u.role==="ADMIN"?C.greenL:C.white}}>{u.role}</td>
                <td style={{padding:16}}>
                  <span style={{fontSize:".7rem",padding:"3px 8px",borderRadius:10,background:u.active?"rgba(82,196,79,.1)":"rgba(255,255,255,.05)",color:u.active?C.greenL:"#666"}}>
                    {u.active?"Activo":"Inactivo"}
                  </span>
                </td>
                <td style={{padding:16}}>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>onEdit(u)} style={{all:"unset",cursor:"pointer",color:"#555"}}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button onClick={()=>onDelete(u.id)} style={{all:"unset",cursor:"pointer",color:"#555"}}><svg width="16" height="16" fill="none" stroke="#e05555" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:20}}>
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)} style={{all:"unset",cursor:"pointer",color:C.gray}}>← Anterior</button>
        <span style={{color:C.white,fontSize:".9rem"}}>Pag {page} de {totalPages}</span>
        <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} style={{all:"unset",cursor:"pointer",color:C.gray}}>Siguiente →</button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   PANEL PRINCIPAL INTEGRADO
══════════════════════════════════════ */
export default function Dashboard() {
  const [section, setSection] = useState("app")
  const [hovP,    setHovP]    = useState(null)
  const [toast,   setToast]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [adding,  setAdding]  = useState(false)
  const [loading, setLoading] = useState(true)
  const toastTimer = useRef(null)
  const navigate   = useNavigate()

  // Datos
  const [stats, setStats] = useState({
    visitasData: [], registrosData: [], erroresData: [],
    pieData: [{ name: "No reg.", value: 0 }, { name: "Reg.", value: 0 }],
    totalVisitas: 0, totalErrores: 0
  })
  const [users, setUsers] = useState([])
  const [page, setPage]  = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const showToast = (type, msg) => {
    clearTimeout(toastTimer.current)
    setToast({ type, msg })
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [sResp, uResp] = await Promise.all([
        getDashboardStats(),
        getUsersDetails(page, PER_PAGE)
      ])

      // Formatear Estadísticas
      if (sResp) {
        setStats({
          visitasData: (sResp.visitas || []).map(d => ({ t: new Date(d.fecha).toLocaleDateString('es',{day:'numeric',month:'short'}), v: d.total })),
          registrosData: (sResp.usuarios || []).map(d => ({ t: new Date(d.fecha).toLocaleDateString('es',{day:'numeric'}), b: d.total })),
          erroresData: (sResp.errores || []).map(d => ({ t: new Date(d.fecha).toLocaleDateString('es',{day:'numeric'}), v: d.total })),
          pieData: [{ name: "Inv.", value: sResp.no_registrados }, { name: "Reg.", value: 100 - sResp.no_registrados }],
          totalVisitas: (sResp.visitas || []).reduce((a,b)=>a+b.total,0),
          totalErrores: (sResp.errores || []).reduce((a,b)=>a+b.total,0)
        })
      }

      // Formatear Usuarios
      if (uResp && uResp.data) {
        setUsers(uResp.data.map(u => ({
          id: u.id, name: u.name, email: u.email, role: u.role?.toUpperCase() || "USER", active: u.is_active,
          initials: u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
          color: `hsl(${u.id * 137.5 % 360}, 45%, 35%)`
        })))
        setTotalPages(uResp.last_page || 1)
      }
    } catch (err) {
      showToast("error", "Error cargando datos de la API")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAllData() }, [page])

  const handleCRUD = async (id, form, mode) => {
    try {
      if (mode === "edit") await updateUser(id, form)
      else if (mode === "create") await createUser(form)
      else if (mode === "delete") await deleteUser(id)

      showToast("success", "Operación exitosa")
      setEditing(null); setAdding(false)
      fetchAllData()
    } catch (err) {
      showToast("error", err.message)
    }
  }

  const SectionBtn = ({ id, label, icon }) => (
    <button
      style={{
        all:"unset", display:"flex", alignItems:"center", gap:12, padding:"14px 20px", cursor:"pointer",
        width:"100%", boxSizing:"border-box", transition:".2s",
        color: section===id ? C.greenL : hovP===id ? C.white : C.gray,
        background: hovP===id ? "rgba(255,255,255,.04)" : "none",
        fontSize:".7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em"
      }}
      onMouseEnter={()=>setHovP(id)} onMouseLeave={()=>setHovP(null)}
      onClick={()=>setSection(id)}
    >
      <span style={{width:20, display:"flex", justifyContent:"center"}}>{icon}</span>
      {label}
    </button>
  )

  return (
    <div style={{display:"flex", height:"100%", overflow:"hidden"}}>
      <style>{`@keyframes toastIn { from{opacity:0;translate:0 10px} to{opacity:1;translate:0 0} }`}</style>

      {/* Main View Area */}
      <div style={{flex:1, minWidth:0, position:"relative"}}>
        {loading && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center"}}>Cargando...</div>}
        {section === "app" && <SectionApplication stats={stats}/>}
        {section === "db" && (
          <SectionDatabase users={users} page={page} setPage={setPage} totalPages={totalPages}
            onEdit={setEditing} onDelete={(id)=>handleCRUD(id, null, "delete")} onAdd={()=>setAdding(true)}
          />
        )}
        {section === "acc" && <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:C.gray,fontFamily:"'Bebas Neue'"}}>Mi Cuenta - Próximamente</div>}
      </div>

      {/* Internal Navigation Sidebar (The user's favorite) */}
      <aside style={{width:200, background:C.dark, borderLeft:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"20px 0"}}>
        <SectionBtn id="app" label="Application" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>} />
        <SectionBtn id="db"  label="Database"    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>} />
        <SectionBtn id="acc" label="My Account" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/></svg>} />
        
        <div style={{marginTop:"auto", padding:"0 20px"}}>
           <p style={{fontSize:".6rem", color:"#444", textTransform:"uppercase", letterSpacing:".2em"}}>v2.0 Real Data</p>
        </div>
      </aside>

      {/* Modals & Toasts */}
      {(editing || adding) && (
        <UserModal user={editing} onClose={()=>{setEditing(null);setAdding(false)}}
          onSave={(form)=>handleCRUD(editing?.id, form, editing ? "edit" : "create")}
        />
      )}
      <Toast toast={toast}/>
    </div>
  )
}