import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const SUGGESTIONS = [
  "¿Cómo puedo crear una cuenta?",
  "¿Cuáles son los planes disponibles?",
  "¿Cómo contacto a soporte?",
  "¿Qué es AVIS?",
];

const BOT_RESPONSES = [
  "Gracias por tu pregunta. Nuestro equipo de soporte AVIS está aquí para ayudarte con lo que necesites.",
  "Entiendo tu consulta. En AVIS trabajamos para darte la mejor experiencia posible.",
  "Esa es una excelente pregunta. Permíteme buscarte la información más actualizada sobre ese tema.",
  "Claro, con gusto te ayudo. El futuro es AVIS y estamos contigo en cada paso.",
];

let chatCounter = 1;

function createNewChat() {
  return {
    id: `chat-${Date.now()}`,
    title: `Chat ${chatCounter++}`,
    messages: [],
    createdAt: new Date(),
  };
}

export default function Chatbot() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isTyping]);

  const handleNewChat = useCallback(() => {
    const chat = createNewChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setInputValue("");
    setShowSuggestions(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSelectChat = useCallback((id) => {
    setActiveChatId(id);
    setShowSuggestions(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleDeleteChat = useCallback(
    (id) => {
      setChats((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeChatId === id) {
          setActiveChatId(next[0]?.id || null);
        }
        return next;
      });
    },
    [activeChatId]
  );

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      let targetId = activeChatId;

      // If no active chat, create one
      if (!targetId) {
        const chat = createNewChat();
        setChats((prev) => [chat, ...prev]);
        setActiveChatId(chat.id);
        targetId = chat.id;
      }

      const userMsg = {
        id: Date.now(),
        role: "user",
        text: trimmed,
        time: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? {
                ...c,
                title:
                  c.messages.length === 0
                    ? trimmed.slice(0, 30) + (trimmed.length > 30 ? "…" : "")
                    : c.title,
                messages: [...c.messages, userMsg],
              }
            : c
        )
      );

      setInputValue("");
      setShowSuggestions(false);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          role: "bot",
          text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
          time: new Date().toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? { ...c, messages: [...c.messages, botMsg] }
              : c
          )
        );
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    },
    [activeChatId]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const isWelcome = !activeChat || activeChat.messages.length === 0;

  return (
    <div className="app-root">
      <canvas ref={canvasRef} className="bg-canvas" />

      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <main className={`chat-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        {isWelcome ? (
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
                <button className="mic-btn" title="Voz">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
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
                <button
                  className="suggestions-btn"
                  onClick={() => setShowSuggestions((s) => !s)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  SUGERENCIAS
                </button>
              </div>
              {showSuggestions && (
                <div className="suggestions-list">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="suggestion-item"
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="chat-view">
            <div className="chat-header">
              <span className="chat-header-title">{activeChat.title}</span>
            </div>

            <div className="messages-area">
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
                    <div className={`bubble ${msg.role}`}>{msg.text}</div>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                  {msg.role === "user" && (
                    <div className="avatar user-avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
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
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-bar-wrap">
              <div className="input-card chat-input-card">
                <div className="input-row">
                  <button className="mic-btn" title="Voz">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
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
                  <button
                    className="suggestions-btn"
                    onClick={() => setShowSuggestions((s) => !s)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    SUGERENCIAS
                  </button>
                </div>
                {showSuggestions && (
                  <div className="suggestions-list above">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        className="suggestion-item"
                        onClick={() => sendMessage(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}