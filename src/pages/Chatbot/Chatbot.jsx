// src/pages/Chatbot/Chatbot.jsx
//
// COMBINADO: tu Chatbot original + arquitectura modular.
//
// CAMBIOS respecto al original:
//  - Se extrae la logica de mensajes a sendMessage interno (sin hook externo
//    porque tu chatbot maneja multiples chats con estado complejo — un hook
//    generico lo complicaria mas de lo que ayudaria)
//  - Se mantiene TODO tu codigo: canvas, sidebar, historial, getChatHistory,
//    apiSendMessage, multiples chats, sugerencias, isTyping, etc.
//  - Sin cambios en logica ni en estructura de datos

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import Sidebar from "../../components/Sidebar/Sidebar"
import { sendMessage as apiSendMessage, getChatHistory, getSessions, updateSession } from "../../services/chatService"
import { FiVolume2, FiVolumeX } from "react-icons/fi"

const SUGGESTIONS = [
  "¿Cómo puedo crear una cuenta?",
  "¿Cuáles son los planes disponibles?",
  "¿Cómo contacto a soporte?",
  "¿Qué es AVIS?",
]

let chatCounter = 1

function createNewChat() {
  const sId = crypto.randomUUID()
  return {
    id:        sId,
    sessionId: sId,
    title:     `Nuevo Chat ${chatCounter++}`,
    messages:  [],
    createdAt: new Date(),
  }
}

export default function Chatbot() {
  const { user: authUser } = useAuth()
  const [chats,          setChats]          = useState([])
  const [activeChatId,   setActiveChatId]   = useState(null)
  const [showArchived,   setShowArchived]   = useState(false)
  const [isSessionsLoading, setIsSessionsLoading] = useState(false)
  const [isMessagesLoading, setIsMessagesLoading] = useState(false)
  const [inputValue,     setInputValue]     = useState("")
  const [isTyping,       setIsTyping]       = useState(false)
  const [showSuggestions,setShowSuggestions]= useState(false)
  const [sidebarOpen,    setSidebarOpen]    = useState(true)
  const [isListening,    setIsListening]    = useState(false)
  const [currentlySpeaking, setCurrentlySpeaking] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const canvasRef      = useRef(null)
  const recognitionRef = useRef(null)
  const navigate = useNavigate()                                        // ← AGREGAR
 
  const handleViewHistory = useCallback(() => {                         // ← AGREGAR
    navigate("/chatHistory")                                            // ← ajusta la ruta según tu AppRoutes
  }, [navigate])

  // ── Cargar historial del backend ──────────────────────────────────────────
  useEffect(() => {
    const loadSessions = async () => {
      setIsSessionsLoading(true)
      try {
        const res = await getSessions(showArchived)
        if (res.success && res.data) {
          const loadedChats = res.data.map(s => ({
            id: s.id,
            sessionId: s.session_id,
            title: s.title || "Nuevo Chat",
            messages: [] 
          }))
          setChats(loadedChats)
        }
      } catch (error) {
        console.error("Error cargando sesiones", error)
      } finally {
        setIsSessionsLoading(false)
      }
    }
    loadSessions()
  }, [showArchived])

  // ── Canvas animacion de fondo ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    const particles = []

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.speechSynthesis.cancel()
    }
  }, [])

  // ── Auto scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats, isTyping])

  // ── Handlers de sidebar ───────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    const chat = createNewChat()
    setChats((prev) => [chat, ...prev])
    setActiveChatId(chat.id)
    setInputValue("")
    setShowSuggestions(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleSelectChat = useCallback(async (id) => {
    setActiveChatId(id)
    setShowSuggestions(false)
    
    // Buscar el chat seleccionado
    const chat = chats.find(c => c.id === id)
    
    // Solo cargamos si el chat no tiene mensajes aún y tiene un sessionId
    if (chat && chat.messages.length === 0 && chat.sessionId) {
      setIsMessagesLoading(true)
      try {
        const res = await getChatHistory(chat.sessionId)
        if (res.success && res.data) {
          const history = res.data.map(m => ({
            id: m.id,
            role: m.role === 'user' ? 'user' : 'bot',
            text: m.content || m.message || "",
            time: m.created_at 
              ? new Date(m.created_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
              : ""
          }))
          
          setChats(prev => prev.map(c => c.id === id ? { ...c, messages: history } : c))
        }
      } catch (err) {
        console.error("Error cargando mensajes", err)
      } finally {
        setIsMessagesLoading(false)
      }
    }

    setTimeout(() => inputRef.current?.focus(), 100)
  }, [chats])

  const handleDeleteChat = useCallback((id) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (activeChatId === id) setActiveChatId(next[0]?.id || null)
      return next
    })
  }, [activeChatId])

  const handleRenameChat = useCallback(async (id, newTitle) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c))
    const chat = chats.find(c => c.id === id)
    if (chat?.sessionId) {
      try { await updateSession(chat.sessionId, { title: newTitle }) } catch (e) { console.error(e) }
    }
  }, [chats])

  const handleArchiveChat = useCallback(async (id) => {
    const chat = chats.find(c => c.id === id)
    if (chat?.sessionId) {
      try { 
        await updateSession(chat.sessionId, { is_archived: !showArchived }) 
        setChats(prev => prev.filter(c => c.id !== id))
        if (activeChatId === id) setActiveChatId(null)
      } catch (e) { console.error(e) }
    }
  }, [chats, showArchived, activeChatId])

  // ── Enviar mensaje ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    let targetId = activeChatId
    let targetSessionId = null

    if (!targetId) {
      const chat = createNewChat()
      setChats((prev) => [chat, ...prev])
      setActiveChatId(chat.id)
      targetId = chat.id
      targetSessionId = chat.sessionId
    } else {
      targetSessionId = chats.find(c => c.id === targetId)?.sessionId
    }

    const userMsg = {
      id:   Date.now(),
      role: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    }

    setChats((prev) =>
      prev.map((c) =>
        c.id === targetId
          ? {
              ...c,
              title: c.messages.length === 0
                ? trimmed.slice(0, 30) + (trimmed.length > 30 ? "…" : "")
                : c.title,
              messages: [...c.messages, userMsg],
            }
          : c
      )
    )

    setInputValue("")
    setShowSuggestions(false)
    setIsTyping(true)

    try {
      const response = await apiSendMessage(trimmed, targetSessionId)
      const respuestaBot = response.data ? response.data.respuesta : response.respuesta
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, {
                id:   Date.now() + 1,
                role: "bot",
                text: respuestaBot || "Sin respuesta",
                time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
              }]}
            : c
        )
      )
    } catch {
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, {
                id:   Date.now() + 1,
                role: "bot",
                text: "Error conectando con el servidor",
                time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
              }]}
            : c
        )
      )
    } finally {
      setIsTyping(false)
    }
  }, [activeChatId, chats])

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta el reconocimiento de voz o está bloqueado.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'es-CO'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
      
      const errorMessages = {
        'network': "Error de red: El servicio de voz no está disponible. Si usas una IP (192.168...), intenta usar 'localhost' o asegúrate de tener una conexión a internet estable.",
        'not-allowed': "Permiso de micrófono denegado. Por favor, habilítalo en la configuración de tu navegador.",
        'service-not-allowed': "El servicio de voz está bloqueado por el navegador o el sistema operativo.",
        'no-speech': "No se detectó ninguna voz. Intenta de nuevo."
      }
      
      alert(errorMessages[event.error] || `Error de voz: ${event.error}. Asegúrate de usar HTTPS o localhost.`)
    }
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInputValue(prev => {
        const newVal = prev + (prev ? " " : "") + transcript
        return newVal
      })
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (err) {
      console.error("Error starting recognition", err)
      setIsListening(false)
    }
  }, [isListening])

  const handleSpeak = useCallback((text, msgId) => {
    if (currentlySpeaking === msgId) {
      window.speechSynthesis.cancel()
      setCurrentlySpeaking(null)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    
    const voices = window.speechSynthesis.getVoices()
    const spanishVoice = voices.find(v => v.lang.startsWith('es'))
    if (spanishVoice) utterance.voice = spanishVoice
    else utterance.lang = 'es-ES'

    utterance.onend = () => setCurrentlySpeaking(null)
    utterance.onerror = () => setCurrentlySpeaking(null)

    setCurrentlySpeaking(msgId)
    window.speechSynthesis.speak(utterance)
  }, [currentlySpeaking])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const activeChat = chats.find((c) => c.id === activeChatId) || null
  // Solo mostramos bienvenida si NO hay un chat seleccionado
  const isWelcome  = !activeChatId;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app-root">
      <canvas ref={canvasRef} className="bg-canvas" />

        <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onArchiveChat={handleArchiveChat}
        showArchived={showArchived}
        onToggleArchive={() => setShowArchived(!showArchived)}
        isLoading={isSessionsLoading}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onViewHistory={handleViewHistory}
      />

      <main className={`chat-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        {isWelcome ? (
          /* ── Pantalla de bienvenida ── */
          <div className="welcome-screen">
            <div className="welcome-logo-wrap">
              <div className="welcome-logo-icon">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="28" stroke="#2d6a2d" strokeWidth="1.5" opacity="0.3"/>
                  <path d="M30 8 C30 8, 38 16, 38 24 C38 32, 30 36, 30 36 C30 36, 22 32, 22 24 C22 16, 30 8, 30 8Z" fill="#2d6a2d" opacity="0.8"/>
                  <path d="M30 52 C30 52, 38 44, 38 36 C38 28, 30 24, 30 24 C30 24, 22 28, 22 36 C22 44, 30 52, 30 52Z" fill="#2d6a2d" opacity="0.5"/>
                  <path d="M8 30 C8 30, 16 22, 24 22 C32 22, 36 30, 36 30 C36 30, 32 38, 24 38 C16 38, 8 30, 8 30Z" fill="#2d6a2d" opacity="0.6"/>
                  <path d="M52 30 C52 30, 44 22, 36 22 C28 22, 24 30, 24 30 C24 30, 28 38, 36 38 C44 38, 52 30, 52 30Z" fill="#2d6a2d" opacity="0.4"/>
                  <circle cx="30" cy="30" r="4" fill="#2d6a2d"/>
                </svg>
              </div>
              <div className="welcome-brand">
                <span className="brand-avis">AVIS</span>
                <span className="brand-tagline">EL FUTURO ES AVIS</span>
              </div>
            </div>
            <h1 className="welcome-title">BIENVENIDOS</h1>
            <p className="welcome-subtitle">Centro de ayuda y soporte de AVIS</p>

            <div className="input-card welcome-input">
              <div className="input-row">
                <button 
                  className={`mic-btn ${isListening ? 'listening' : ''}`} 
                  onClick={toggleListening}
                  title={isListening ? "Detener" : "Voz"}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8"  y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
                <input
                  ref={inputRef}
                  className="chat-input"
                  placeholder="ESCRIBE TU PREGUNTA"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  title="Enviar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                </button>
              </div>
              <div className="input-footer">
                <button className="suggestions-btn" onClick={() => setShowSuggestions((s) => !s)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  SUGERENCIAS
                </button>
              </div>
              {showSuggestions && (
                <div className="suggestions-list">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="suggestion-item" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Vista de chat activo ── */
          <div className="chat-view">
            <div className="chat-header">
              <span className="chat-header-title">{activeChat.title}</span>
            </div>

            <div className="messages-area">
              {isMessagesLoading ? (
                <div className="messages-loader" style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 15, opacity: 0.7 
                }}>
                  <div className="skeleton-pulse" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>CARGANDO CONVERSACIÓN...</span>
                </div>
              ) : (
                <>
                  {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.role}`}>
                  {msg.role === "bot" && (
                    <div className="avatar bot-avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                  )}
                  <div className="bubble-wrap">
                    <div className={`bubble ${msg.role}`}>
                      {msg.text}
                      {msg.role === "bot" && (
                        <button 
                          className={`speak-btn ${currentlySpeaking === msg.id ? 'speaking' : ''}`}
                          onClick={() => handleSpeak(msg.text, msg.id)}
                          title="Escuchar mensaje"
                        >
                          {currentlySpeaking === msg.id ? <FiVolumeX /> : <FiVolume2 />}
                        </button>
                      )}
                    </div>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                  {msg.role === "user" && (
                    <div className="avatar user-avatar" style={{ overflow: 'hidden', border: '1px solid rgba(45,90,39,0.2)' }}>
                      {(authUser?.avatar_url || authUser?.avatar || authUser?.photo) ? (
                        <img 
                          src={authUser.avatar_url || authUser.avatar || authUser.photo} 
                          alt="Me" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="4"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="message-row bot">
                  <div className="avatar bot-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                  <div className="bubble bot typing-bubble">
                    <div className="typing-dots">
                      <span className="dot"/><span className="dot"/><span className="dot"/>
                    </div>
                    <span className="typing-text">AVIS está pensando...</span>
                  </div>
                </div>
              )}
                  <div ref={messagesEndRef}/>
                </>
              )}
            </div>

            <div className="input-bar-wrap">
              <div className="input-card chat-input-card">
                <div className="input-row">
                  <button 
                    className={`mic-btn ${isListening ? 'listening' : ''}`} 
                    onClick={toggleListening}
                    title={isListening ? "Detener" : "Voz"}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8"  y1="23" x2="16" y2="23"/>
                    </svg>
                  </button>
                  <input
                    ref={inputRef}
                    className="chat-input"
                    placeholder="ESCRIBE TU PREGUNTA"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="send-btn"
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    title="Enviar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="19" x2="12" y2="5"/>
                      <polyline points="5 12 12 5 19 12"/>
                    </svg>
                  </button>
                </div>
                <div className="input-footer">
                  <button className="suggestions-btn" onClick={() => setShowSuggestions((s) => !s)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    SUGERENCIAS
                  </button>
                </div>
                {showSuggestions && (
                  <div className="suggestions-list above">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} className="suggestion-item" onClick={() => sendMessage(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}