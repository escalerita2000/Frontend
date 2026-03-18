import { useState } from "react"
import { loginUser } from "../../services/authService"
import { useAuth } from "../../hooks/useAuth"
import { Link } from "react-router-dom"

function Login(){

const {login} = useAuth()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const handleSubmit = async(e)=>{

e.preventDefault()

try{

const response = await loginUser({

email,
password

})

login(response.user)

alert("Login exitoso")

}catch{

alert("Credenciales incorrectas")

}

}

return(

    <>
    <div className="guest-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <Link to="/ChatbotInvitado">INVITADO</Link>
    </div>

    <main>
    <canvas id="login-canvas"></canvas>
    <div className="login-card">
    
    <div className="login-logo">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="none" stroke="#3d9c3a" stroke-width="3"/>
            <polygon points="60,22 92,40 92,76 60,94 28,76 28,40" fill="none" stroke="#3d9c3a" stroke-width="1.5" opacity=".45"/>
            <line x1="60"  y1="6"   x2="60"  y2="22"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
            <line x1="108" y1="33"  x2="92"  y2="40"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
            <line x1="108" y1="87"  x2="92"  y2="76"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
            <line x1="60"  y1="114" x2="60"  y2="94"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
            <line x1="12"  y1="87"  x2="28"  y2="76"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
            <line x1="12"  y1="33"  x2="28"  y2="40"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
            <polygon points="60,32 80,60 60,88 40,60" fill="#3d9c3a" opacity=".12"/>
            <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke="#3d9c3a" stroke-width="2"/>
            <path d="M50 80 L60 44 L70 80" stroke="#2b2b2b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <line x1="54" y1="69" x2="66" y2="69" stroke="#3d9c3a" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="60"  cy="6"   r="3.5" fill="#3d9c3a"/>
            <circle cx="108" cy="33"  r="3.5" fill="#3d9c3a"/>
            <circle cx="108" cy="87"  r="3.5" fill="#3d9c3a"/>
            <circle cx="60"  cy="114" r="3.5" fill="#3d9c3a"/>
            <circle cx="12"  cy="87"  r="3.5" fill="#3d9c3a"/>
            <circle cx="12"  cy="33"  r="3.5" fill="#3d9c3a"/>
        </svg>
        <div className="login-logo-text">
            <span className="brand">AVIS</span>
            <span className="tagline">El Futuro Es AVIS</span>
        </div>
    </div>

    <h1 className="login-title">Inicio de Sesion</h1>
    <div className="login-form">
        <div className="input-group">
            <input type="text" placeholder="USUARIO" autocomplete="username" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className="input-group">
            <input type="password" placeholder="CONTRASEÑA" autocomplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <Link to="/RecoverPassword" className="forgot">¿Olvidaste tu contraseña?</Link>
        <button className="btn-login" type="button" onClick={handleSubmit}>Iniciar Sesión</button>
        </div>
    </div>
    </main>
    </>
)

}

export default Login
