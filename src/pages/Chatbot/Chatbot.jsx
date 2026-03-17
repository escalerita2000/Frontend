import { useState, useEffect, useRef } from "react"
import "../../assets/Styles/global.css"

/* ══════════════════════════════════════
   ESTILOS INLINE DEL SIDEBAR
   (inline style = nunca lo sobreescribe ningún framework)
══════════════════════════════════════ */
const S = {
  sidebar: {
    flex: "0 0 260px", width: "260px", height: "100vh",
    background: "#2a6e28", display: "flex", flexDirection: "column",
    padding: "28px 0 0", overflow: "hidden", boxSizing: "border-box",
  },
  ham: {
    display: "flex", flexDirection: "column", gap: "5px",
    padding: "0 24px", marginBottom: "32px", cursor: "pointer",
    width: "fit-content",
  },
  hamSpan: {
    display: "block", width: "26px", height: "3px",
    background: "#ffffff", borderRadius: "2px",
  },
  nav: {
    display: "flex", flexDirection: "column", gap: "2px", padding: "0 12px",
  },
  item: {
    display: "flex", alignItems: "center", gap: "16px",
    padding: "13px 14px", borderRadius: "8px", cursor: "pointer",
    color: "#ffffff", fontSize: "0.92rem", fontWeight: "400",
    fontFamily: "'Outfit', sans-serif", textDecoration: "none",
    background: "transparent", border: "none", width: "100%",
    textAlign: "left", outline: "none", WebkitAppearance: "none",
    boxSizing: "border-box", transition: "background 0.2s",
  },
  histHeader: {
    display: "flex", alignItems: "center", gap: "16px",
    padding: "13px 14px", margin: "0 12px", borderRadius: "8px",
    cursor: "pointer", color: "#ffffff", fontSize: "0.92rem",
    fontWeight: "400", fontFamily: "'Outfit', sans-serif",
    background: "transparent", border: "none",
    width: "calc(100% - 24px)", textAlign: "left",
    outline: "none", WebkitAppearance: "none",
    boxSizing: "border-box", transition: "background 0.2s",
  },
  histList: (open) => ({
    padding: "4px 12px 0 50px", display: "flex",
    flexDirection: "column", gap: "2px", overflow: "hidden",
    maxHeight: open ? "300px" : "0px", transition: "max-height 0.3s ease",
  }),
  histItem: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "7px 8px", borderRadius: "6px", cursor: "pointer",
    color: "rgba(255,255,255,0.85)", fontSize: "0.82rem",
    fontFamily: "'Outfit', sans-serif", transition: "background 0.2s",
    boxSizing: "border-box",
  },
  histDot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "#6fcf6d", flexShrink: "0",
  },
  spacer: { flex: 1 },
  userRow: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px 24px", cursor: "pointer",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    transition: "background 0.2s", boxSizing: "border-box",
  },
  avatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)", flexShrink: "0",
    background: "#c7c3e8", display: "flex",
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  username: {
    fontSize: "0.85rem", fontWeight: "700", letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#ffffff",
    fontFamily: "'Outfit', sans-serif",
  },
  iconSvg: { width: "24px", height: "24px", flexShrink: "0", color: "#ffffff" },
  chevron: (open) => ({
    marginLeft: "4px", width: "14px", height: "14px", flexShrink: "0",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.25s", color: "#ffffff",
  }),
}

/* ── SVG Logo AVIS ── */
const AvisLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke="#3d9c3a" strokeWidth="3"/>
    <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke="#3d9c3a" strokeWidth="1.5" opacity=".45"/>
    <line x1="60"  y1="6"   x2="60"  y2="22"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="33"  x2="92"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="108" y1="87"  x2="92"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="60"  y1="114" x2="60"  y2="94"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="87"  x2="28"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <line x1="12"  y1="33"  x2="28"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
    <polygon points="60,32 80,60 60,88 40,60" fill="#3d9c3a" opacity=".12"/>
    <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke="#3d9c3a" strokeWidth="2"/>
    <path d="M50 80 L60 44 L70 80" stroke="#2b2b2b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="54" y1="69" x2="66" y2="69" stroke="#3d9c3a" strokeWidth="3.5" strokeLinecap="round"/>
    <circle cx="60"  cy="6"   r="3.5" fill="#3d9c3a"/>
    <circle cx="108" cy="33"  r="3.5" fill="#3d9c3a"/>
    <circle cx="108" cy="87"  r="3.5" fill="#3d9c3a"/>
    <circle cx="60"  cy="114" r="3.5" fill="#3d9c3a"/>
    <circle cx="12"  cy="87"  r="3.5" fill="#3d9c3a"/>
    <circle cx="12"  cy="33"  r="3.5" fill="#3d9c3a"/>
  </svg>
)

/* ── Respuestas del bot ── */
const BOT_REPLIES = [
  "¡Hola! Soy el asistente AVIS. ¿En qué puedo ayudarte hoy?",
  "Entiendo tu consulta. Déjame verificar esa información.",
  "Gracias por contactar a AVIS. Estamos aquí para ayudarte.",
  "Puedo orientarte con eso. ¿Tienes más detalles?",
  "Excelente pregunta. El equipo AVIS te brindará soporte completo.",
  "He registrado tu solicitud. ¿Hay algo más en lo que pueda ayudarte?",
]

function Chatbot() {
  const [messages,    setMessages]    = useState([])
  const [input,       setInput]       = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [screen,      setScreen]      = useState("welcome")
  const [histOpen,    setHistOpen]    = useState(true)
  const [isTyping,    setIsTyping]    = useState(false)
  const [replyIdx,    setReplyIdx]    = useState(0)

  const canvasRef  = useRef(null)
  const messagesEl = useRef(null)

  /* ── Canvas animation ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let W, H, nodes = [], raf

    const resize    = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    const mkNode    = () => ({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4, r: Math.random()*2+1 })
    const init      = () => { resize(); nodes = Array.from({ length: Math.floor((W*H)/14000) }, mkNode) }

    const draw = () => {
      ctx.clearRect(0,0,W,H)
      nodes.forEach(n => {
        n.x+=n.vx; n.y+=n.vy
        if(n.x<0||n.x>W) n.vx*=-1
        if(n.y<0||n.y>H) n.vy*=-1
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2)
        ctx.fillStyle="#3d9c3a"; ctx.fill()
      })
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy)
        if(d<140){ ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle=`rgba(61,156,58,${1-d/140})`; ctx.lineWidth=.6; ctx.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }

    const onResize = () => { cancelAnimationFrame(raf); init(); draw() }
    window.addEventListener("resize", onResize)
    init(); draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize) }
  }, [])

  /* ── Scroll ── */
  useEffect(() => {
    if (messagesEl.current) messagesEl.current.scrollTop = messagesEl.current.scrollHeight
  }, [messages, isTyping])

  /* ── Mensajes ── */
  const addMessage = (text, who) =>
    setMessages(prev => [...prev, { text, who, id: Date.now() + Math.random() }])

  const triggerBotReply = () => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setReplyIdx(prev => { addMessage(BOT_REPLIES[prev % BOT_REPLIES.length], "bot"); return prev+1 })
    }, 900 + Math.random()*700)
  }

  const sendMessage = () => {
    const val = input.trim(); if(!val) return
    addMessage(val,"me"); setInput(""); triggerBotReply()
  }

  const sendFromWelcome = () => {
    const val = searchInput.trim(); if(!val) return
    setSearchInput(""); setScreen("chat")
    setTimeout(() => { addMessage(val,"me"); triggerBotReply() }, 50)
  }

  const startNewChat = (e) => { e?.preventDefault(); setMessages([]); setScreen("welcome") }

  /* ── Hover helpers (inline hover via state) ── */
  const [hovItem, setHovItem] = useState(null)

  return (
    <>
      <canvas ref={canvasRef} className="chatbot-canvas"/>

      {/* WELCOME */}
      <div className={`welcome${screen !== "welcome" ? " hidden" : ""}`}>
        <div className="logo-wrap">
          <AvisLogo size={80}/>
          <div className="logo-text">
            <span className="brand">AVIS</span>
            <span className="tagline">El Futuro Es AVIS</span>
          </div>
        </div>

        <h1 className="welcome-title">BIENVENIDOS</h1>
      </div>

      {/* CHAT */}
      <div className={`chat-screen${screen==="chat" ? " active" : ""}`}>
        ...
      </div>
    </>
  )
}


export default Chatbot