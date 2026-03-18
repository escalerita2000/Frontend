import { useState } from "react"
import { sendMessage } from "../../services/chatService"

function Chatbot() {

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")

    const handleSendMessage = async () => {

        if (!input) return

        // mensaje del usuario
        setMessages(prev => [...prev, { text: input, user: "me" }])

        try {

            const response = await sendMessage(input)

            // respuesta del bot
            setMessages(prev => [
                ...prev,
                { text: input, user: "me" },
                { text: response.respuesta, user: "bot" }
            ])

        } catch {

            setMessages(prev => [
                ...prev,
                { text: "Error conectando con el servidor", user: "bot" }
            ])

        }

        setInput("")

    }

    return (

        <div>

            <h1>Chatbot AVIS</h1>

            <div>

                {messages.map((msg, i) => (
                    <p key={i}>
                        <b>{msg.user === "me" ? "Tú:" : "AVIS:"}</b> {msg.text}
                    </p>
                ))}

            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta"
            />

            <button onClick={handleSendMessage}>
                Enviar
            </button>

        </div>

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