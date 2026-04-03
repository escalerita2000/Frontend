/*
  AVIS – Admin Panel
  AdminPanel.jsx

  Secciones:
    · APPLICATION  → Dashboard con gráficas (Stats)
    · CONFIGURATION → Tabla de usuarios con editar/eliminar
    · MY ACCOUNT   → (puedes expandir)

  Dependencias:
    npm install recharts
*/

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts"

/* ══════════════════════════════════════
   PALETA DE COLORES
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
  dot:      "#6fcf6d",
}

/* ══════════════════════════════════════
   SVG LOGO
══════════════════════════════════════ */
const AvisLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke={C.green} strokeWidth="3"/>
    <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke={C.green} strokeWidth="1.5" opacity=".5"/>
    <line x1="60"  y1="6"   x2="60"  y2="22"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="33"  x2="92"  y2="40"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="87"  x2="92"  y2="76"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="60"  y1="114" x2="60"  y2="94"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="87"  x2="28"  y2="76"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="33"  x2="28"  y2="40"  stroke={C.green} strokeWidth="1" opacity=".6"/>
    <polygon points="60,32 80,60 60,88 40,60" fill={C.green} opacity=".15"/>
    <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke={C.green} strokeWidth="2"/>
    <path d="M50 80 L60 44 L70 80" stroke={C.white} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="54" y1="69" x2="66" y2="69" stroke={C.green} strokeWidth="3.5" strokeLinecap="round"/>
    {[[60,6],[108,33],[108,87],[60,114],[12,87],[12,33]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r="3.5" fill={C.green}/>
    ))}
  </svg>
)

/* ══════════════════════════════════════
   DATOS MOCK — reemplazar con API
══════════════════════════════════════ */
const visitasData  = [{t:"Ene",v:980},{t:"Feb",v:1200},{t:"Mar",v:1050},{t:"Abr",v:1400},{t:"May",v:1750},{t:"Jun",v:1600},{t:"Jul",v:2134}]
const registrosData= [{mes:"May",a:180,b:249},{mes:"Jun",a:310,b:379},{mes:"Jul",a:280,b:421}]
const erroresData  = [{t:"L",v:3},{t:"M",v:5},{t:"X",v:2},{t:"J",v:8},{t:"V",v:6},{t:"S",v:10},{t:"D",v:12}]
const pieData      = [{name:"No reg.",value:27},{name:"Reg.",value:73}]
const PIE_COLORS   = [C.green, "#1a3a1a"]

const USERS_INIT = [
  {id:1, name:"Pepito Perez",     role:"ADMIN",      active:true,  initials:"PP", color:"#2a5a4a"},
  {id:2, name:"Joseu Lopez",      role:"USER",       active:false, initials:"JL", color:"#3a4a2a"},
  {id:3, name:"Valentina Zuarez", role:"INSTRUCTOR", active:true,  initials:"VZ", color:"#5a3a2a"},
  {id:4, name:"Mapale Morado",    role:"USER",       active:false, initials:"MM", color:"#2a3a5a"},
  {id:5, name:"Kamila Garcia",    role:"ADMIN",      active:true,  initials:"KG", color:"#4a2a5a"},
  {id:6, name:"Julyana Capera",   role:"USER",       active:false, initials:"JC", color:"#5a4a2a"},
  {id:7, name:"Johann Bohorquez", role:"USER",       active:false, initials:"JB", color:"#2a4a5a"},
  {id:8, name:"Lizet Arenas",     role:"ADMIN",      active:true,  initials:"LA", color:"#3a5a2a"},
  {id:9, name:"Laura Martinez",   role:"ADMIN",      active:true,  initials:"LM", color:"#5a2a3a"},
  {id:10,name:"Duber Leonardo",   role:"INSTRUCTOR", active:false, initials:"DL", color:"#2a5a5a"},
  {id:11,name:"Carlos Ruiz",      role:"USER",       active:true,  initials:"CR", color:"#4a3a2a"},
  {id:12,name:"Sofia Mendez",     role:"ADMIN",      active:true,  initials:"SM", color:"#2a4a3a"},
]

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
   MODAL EDITAR USUARIO
══════════════════════════════════════ */
const EditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:    user.name,
    surname: user.surname || "",
    email:   user.email   || "",
    message: user.message || "",
    role:    user.role    || "USER",
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
      {/* Backdrop */}
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:200}}/>
      {/* Modal */}
      <div style={{
        position:"fixed", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        zIndex:201, width:"100%", maxWidth:480,
        background:"#1a1a1a",
        border:`1px solid #333`, borderRadius:12,
        padding:"28px 28px 24px", boxSizing:"border-box",
        fontFamily:"'Outfit',sans-serif",
      }}>
        <h2 style={{color:C.white,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",letterSpacing:".08em",marginBottom:22}}>
          Editar Usuario
        </h2>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={labelStyle}>Name</label>
            <input value={form.name} onChange={set("name")} placeholder="Value" style={inputStyle}
              onFocus={e=>e.target.style.borderColor=C.green}
              onBlur={e =>e.target.style.borderColor="#444"}
            />
          </div>
          <div>
            <label style={labelStyle}>Surname</label>
            <input value={form.surname} onChange={set("surname")} placeholder="Value" style={inputStyle}
              onFocus={e=>e.target.style.borderColor=C.green}
              onBlur={e =>e.target.style.borderColor="#444"}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={form.email} onChange={set("email")} placeholder="Value" type="email" style={inputStyle}
              onFocus={e=>e.target.style.borderColor=C.green}
              onBlur={e =>e.target.style.borderColor="#444"}
            />
          </div>

          <div>
            <label style={labelStyle}>Rol</label>
            <div style={{display:"flex",gap:10}}>
              {["ADMIN","USER","INSTRUCTOR"].map(r=>(
                <button
                  key={r}
                  type="button"
                  onClick={()=>setForm(p=>({...p,role:r}))}
                  style={{
                    flex:1, padding:"10px 0",
                    borderRadius:6, cursor:"pointer",
                    fontFamily:"'Outfit',sans-serif",
                    fontSize:".72rem", fontWeight:700,
                    letterSpacing:".12em", textTransform:"uppercase",
                    border:`1.5px solid ${form.role===r
                      ? r==="ADMIN" ? C.greenL
                      : r==="INSTRUCTOR" ? C.teal
                      : "#fff"
                      : "#444"}`,
                    background: form.role===r
                      ? r==="ADMIN" ? "rgba(82,196,79,.15)"
                      : r==="INSTRUCTOR" ? "rgba(74,184,200,.15)"
                      : "rgba(255,255,255,.1)"
                      : "#222",
                    color: form.role===r
                      ? r==="ADMIN" ? C.greenL
                      : r==="INSTRUCTOR" ? C.teal
                      : C.white
                      : C.gray,
                    transition:"all .2s",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Message</label>
            <textarea value={form.message} onChange={set("message")} placeholder="Value" rows={4} style={{...inputStyle,resize:"vertical"}}
              onFocus={e=>e.target.style.borderColor=C.green}
              onBlur={e =>e.target.style.borderColor="#444"}
            />
          </div>

          <button
            onClick={()=>onSave(form)}
            style={{
              width:"100%", padding:14,
              background:C.greenD, color:C.white,
              border:"none", borderRadius:6,
              fontFamily:"'Outfit',sans-serif",
              fontSize:".88rem", fontWeight:600,
              letterSpacing:".1em", cursor:"pointer",
              transition:"background .2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background=C.green}
            onMouseLeave={e=>e.currentTarget.style.background=C.greenD}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════
   PANEL BUTTON (right sidebar)
══════════════════════════════════════ */
const PanelBtn = ({ id, label, active, hov, setHov, setActive, icon }) => (
  <button
    style={{
      all:"unset", boxSizing:"border-box",
      display:"flex", alignItems:"center", gap:13,
      padding:"14px 20px", cursor:"pointer",
      fontSize:".7rem", fontWeight:700,
      letterSpacing:".16em", textTransform:"uppercase",
      fontFamily:"'Outfit',sans-serif",
      color: active===id ? C.greenL : hov===id ? C.white : C.gray,
      background: hov===id ? "rgba(255,255,255,.05)" : "none",
      width:"100%", textAlign:"left",
      transition:"color .2s, background .2s",
    }}
    onMouseEnter={()=>setHov(id)}
    onMouseLeave={()=>setHov(null)}
    onClick={()=>setActive(id)}
  >
    <span style={{width:20,height:20,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"inherit"}}>
      {icon}
    </span>
    {label}
  </button>
)

/* ══════════════════════════════════════
   SECTION: APPLICATION (Dashboard)
══════════════════════════════════════ */
const SectionApplication = () => (
  <div style={{flex:"1 1 0",minWidth:0,minHeight:0,background:C.greenMid,padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:18,height:"100%",boxSizing:"border-box",overflow:"hidden"}}>

    {/* Visitas */}
    <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
      <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Visitas de la Página</p>
      <div style={{flex:"1 1 0",minHeight:0,position:"relative"}}>
        <div style={{position:"absolute",inset:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitasData} margin={{top:4,right:4,left:-32,bottom:0}}>
              <defs><linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={.45}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="t" hide/><YAxis hide/><Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="v" stroke={C.greenL} strokeWidth={2} fill="url(#gV)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p style={{flexShrink:0,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.9rem",letterSpacing:".05em",color:C.white,marginTop:8,lineHeight:1}}>2.134</p>
    </div>

    {/* Registros */}
    <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
      <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Registros de Usuario</p>
      <div style={{flex:"1 1 0",minHeight:0,position:"relative"}}>
        <div style={{position:"absolute",inset:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrosData} margin={{top:4,right:4,left:-32,bottom:0}} barGap={4} barCategoryGap="30%">
              <XAxis dataKey="mes" hide/><YAxis hide/><Tooltip content={<Tip/>}/>
              <Bar dataKey="a" fill="#1e5c1e" radius={[3,3,0,0]}/>
              <Bar dataKey="b" fill={C.green} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{flexShrink:0,display:"flex",justifyContent:"space-around",marginTop:6}}>
        {registrosData.map(d=><span key={d.mes} style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".06em",color:C.white}}>{d.b}</span>)}
      </div>
    </div>

    {/* No registrados */}
    <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
      <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Usuarios No Registrados</p>
      <div style={{flex:"1 1 0",minHeight:0,display:"flex",alignItems:"center",gap:18}}>
        <div style={{flex:"0 0 110px",height:110,position:"relative"}}>
          <div style={{position:"absolute",inset:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={50} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip content={<Tip/>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.6rem",letterSpacing:".04em",color:C.white,lineHeight:1}}>27%</p>
      </div>
    </div>

    {/* Errores */}
    <div style={{background:C.greenBg,borderRadius:10,padding:"16px 18px 14px",display:"flex",flexDirection:"column",border:`1px solid rgba(61,156,58,.18)`,overflow:"hidden",minHeight:0}}>
      <p style={{flexShrink:0,fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:8}}>Errores de la Página</p>
      <div style={{flex:"1 1 0",minHeight:0,position:"relative"}}>
        <div style={{position:"absolute",inset:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={erroresData} margin={{top:4,right:4,left:-32,bottom:0}}>
              <XAxis dataKey="t" hide/><YAxis hide/><Tooltip content={<Tip/>}/>
              <Line type="monotone" dataKey="v" stroke={C.greenL} strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p style={{flexShrink:0,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.9rem",letterSpacing:".05em",color:C.white,marginTop:8,lineHeight:1}}>12</p>
    </div>

  </div>
)

/* ══════════════════════════════════════
   SECTION: CONFIGURATION (Users CRUD)
══════════════════════════════════════ */
const SectionConfiguration = ({ showToast }) => {
  const [users,   setUsers]   = useState(USERS_INIT)
  const [page,    setPage]    = useState(1)
  const [editing, setEditing] = useState(null)

  const totalPages = Math.ceil(users.length / PER_PAGE)
  const pageUsers  = users.slice((page-1)*PER_PAGE, page*PER_PAGE)

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u=>u.id!==id))
    showToast("success","Usuario eliminado correctamente")
  }

  const handleSave = (form) => {
    if(!form.name.trim()){
      showToast("error","El nombre no puede estar vacío")
      return
    }
    setUsers(prev=>prev.map(u=>u.id===editing.id
      ? {...u, name:form.name, surname:form.surname, email:form.email, message:form.message, role:form.role}
      : u
    ))
    showToast("success","Cambios al usuario exitoso")
    setEditing(null)
  }

  const roleColor = r => r==="ADMIN" ? C.greenL : r==="INSTRUCTOR" ? C.teal : C.white

  return (
    <div style={{flex:"1 1 0",minWidth:0,minHeight:0,background:C.greenMid,padding:"20px 24px",display:"flex",flexDirection:"column",overflow:"hidden",boxSizing:"border-box"}}>

      {/* Tabla */}
      <div style={{flex:"1 1 0",minHeight:0,background:"#161616",borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Name","Rol","Active","Actions"].map((h,i)=>(
                <th key={h} style={{padding:"14px 16px",fontSize:".68rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",textAlign: i>=2?"center":"left",background:"#161616",fontFamily:"'Outfit',sans-serif"}}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageUsers.map(user=>(
              <tr key={user.id} style={{borderBottom:`1px solid rgba(61,156,58,.08)`}}>

                {/* Name */}
                <td style={{padding:"10px 16px",verticalAlign:"middle"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:user.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:700,color:C.white,flexShrink:0,border:`2px solid rgba(61,156,58,.3)`}}>
                      {user.initials}
                    </div>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:".88rem",color:C.white}}>{user.name}</span>
                  </div>
                </td>

                {/* Role */}
                <td style={{padding:"10px 16px",verticalAlign:"middle"}}>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:".82rem",fontWeight:600,letterSpacing:".06em",color:roleColor(user.role)}}>{user.role}</span>
                </td>

                {/* Active */}
                <td style={{padding:"10px 16px",textAlign:"center",verticalAlign:"middle"}}>
                  {user.active
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.greenL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  }
                </td>

                {/* Actions */}
                <td style={{padding:"10px 16px",textAlign:"center",verticalAlign:"middle"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                    {/* Edit */}
                    <button onClick={()=>setEditing(user)} style={{all:"unset",cursor:"pointer",color:C.gray,padding:5,borderRadius:5,transition:"color .2s, background .2s",display:"flex"}}
                      onMouseEnter={e=>{e.currentTarget.style.color=C.greenL;e.currentTarget.style.background="rgba(61,156,58,.12)"}}
                      onMouseLeave={e=>{e.currentTarget.style.color=C.gray;e.currentTarget.style.background="none"}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    {/* Delete */}
                    <button onClick={()=>handleDelete(user.id)} style={{all:"unset",cursor:"pointer",color:C.gray,padding:5,borderRadius:5,transition:"color .2s, background .2s",display:"flex"}}
                      onMouseEnter={e=>{e.currentTarget.style.color=C.red;e.currentTarget.style.background="rgba(224,85,85,.12)"}}
                      onMouseLeave={e=>{e.currentTarget.style.color=C.gray;e.currentTarget.style.background="none"}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:6,paddingTop:14}}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
          style={{all:"unset",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:".82rem",fontWeight:600,color:C.gray,padding:"5px 10px",borderRadius:5}}>←</button>
        {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
          <button key={n} onClick={()=>setPage(n)}
            style={{all:"unset",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:".82rem",fontWeight:600,letterSpacing:".06em",color:page===n?C.white:C.gray,padding:"6px 11px",borderRadius:5,background:page===n?C.greenD:"none",border:page===n?`1px solid ${C.green}`:"1px solid transparent"}}>
            {n}
          </button>
        ))}
        <button style={{all:"unset",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:".82rem",fontWeight:600,color:C.gray,padding:"5px 10px",borderRadius:5}}>···</button>
        <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
          style={{all:"unset",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:".82rem",fontWeight:600,color:C.gray,padding:"5px 10px",borderRadius:5}}>→</button>
      </div>

      {/* Modal edición */}
      {editing && <EditModal user={editing} onClose={()=>setEditing(null)} onSave={handleSave}/>}
    </div>
  )
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function AdminPanel() {
  const [section, setSection] = useState("app")
  const [hovP,    setHovP]    = useState(null)
  const [toast,   setToast]   = useState(null)
  const toastTimer = useRef(null)
  const navigate   = useNavigate()

  const handleLogout = () => {
    /*
      ── Conecta tu lógica de cierre de sesión aquí ──
      authService.logout()
      clearTokens()
    */
    navigate("/Login")
  }

  const showToast = (type, msg) => {
    clearTimeout(toastTimer.current)
    setToast({ type, msg })
    toastTimer.current = setTimeout(()=>setToast(null), 3500)
  }

  useEffect(()=>()=>clearTimeout(toastTimer.current),[])

  const iconApp = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )
  const iconCfg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
  const iconAcc = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
    </svg>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap');
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;overflow:hidden}
      `}</style>

      <div style={{width:"100vw",height:"100vh",overflow:"hidden",background:C.black,color:C.white,fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column"}}>

        {/* ── TOP NAV ── */}
        <nav style={{flex:"0 0 48px",height:48,display:"flex",alignItems:"center",padding:"0 24px",borderBottom:`1px solid ${C.border}`,background:C.dark,position:"relative"}}>
          {/* User icon — left */}
          <button style={{all:"unset",cursor:"pointer",color:C.gray,display:"flex"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
            </svg>
          </button>

          {/* Logo center */}
          <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:9}}>
            <AvisLogo size={26}/>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.45rem",letterSpacing:".1em",color:C.white}}>AVIS</span>
          </div>

          {/* Cerrar sesión — right */}
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              all:"unset", cursor:"pointer",
              marginLeft:"auto",
              display:"flex", alignItems:"center", gap:8,
              color:C.gray, padding:"6px 10px", borderRadius:6,
              fontFamily:"'Outfit',sans-serif", fontSize:".72rem",
              fontWeight:600, letterSpacing:".12em", textTransform:"uppercase",
              transition:"color .2s, background .2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.color="#e05555";e.currentTarget.style.background="rgba(224,85,85,.1)"}}
            onMouseLeave={e=>{e.currentTarget.style.color=C.gray;e.currentTarget.style.background="transparent"}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </nav>

        {/* ── BODY ── */}
        <div style={{flex:"1 1 0",minHeight:0,display:"flex",overflow:"hidden"}}>

          {/* Left thin nav */}
          <aside style={{flex:"0 0 52px",width:52,background:C.dark,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0",gap:20}}>
            {[
              {id:"menu",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>},
              {id:"chat",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
            ].map(({id,icon})=>(
              <button key={id} style={{all:"unset",cursor:"pointer",color:C.gray,display:"flex",alignItems:"center",justifyContent:"center",padding:8,borderRadius:8,transition:"color .2s,background .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.color=C.white;e.currentTarget.style.background="rgba(255,255,255,.07)"}}
                onMouseLeave={e=>{e.currentTarget.style.color=C.gray;e.currentTarget.style.background="none"}}
              >{icon}</button>
            ))}
          </aside>

          {/* Main content — switches between sections */}
          {section === "app" && <SectionApplication/>}
          {section === "cfg" && <SectionConfiguration showToast={showToast}/>}
          {section === "acc" && (
            <div style={{flex:"1 1 0",display:"flex",alignItems:"center",justifyContent:"center",background:C.greenMid,color:C.white,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",letterSpacing:".1em",opacity:.4}}>
              MY ACCOUNT — próximamente
            </div>
          )}

          {/* Right panel */}
          <aside style={{flex:"0 0 200px",width:200,background:C.dark,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"24px 0",gap:2}}>
            <PanelBtn id="app" label="Application"   active={section} hov={hovP} setHov={setHovP} setActive={setSection} icon={iconApp}/>
            <PanelBtn id="cfg" label="Configuration" active={section} hov={hovP} setHov={setHovP} setActive={setSection} icon={iconCfg}/>
            <PanelBtn id="acc" label="My Account"    active={section} hov={hovP} setHov={setHovP} setActive={setSection} icon={iconAcc}/>
          </aside>

        </div>
      </div>

      {/* Toast */}
      <Toast toast={toast}/>
    </>
  )
}