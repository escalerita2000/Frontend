// src/components/Sidebar/Sidebar.jsx
//
// COMBINADO: tu Sidebar original + UserMenu integrado.
//
// CAMBIOS respecto al original:
//  - Import de UserMenu agregado
//  - El bloque "sidebar-bottom" con la imagen hardcodeada y "USUARIO"
//    fue reemplazado por <UserMenu /> que toma los datos del AuthContext
//  - Todo lo demas (toggle, new chat, archive, historial, chat-list) intacto

import { useState }  from "react"
import UserMenu      from "../UserMenu/UserMenu"

export default function Sidebar({ chats, 
  activeChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat, 
  isOpen, 
  onToggle, 
  onViewHistory 
}) {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <>
      {/* Toggle hamburger (always visible) */}
      <button className="sidebar-toggle" onClick={onToggle} title="Menú">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-top">
          {/* Hamburger inside sidebar */}
          <button className="sidebar-toggle-inner" onClick={onToggle} title="Cerrar menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* New chat button */}
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>Nuevo chat</span>
          </button>

          {/* Archive button */}
          <button className="archive-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="21 8 21 21 3 21 3 8"/>
              <rect x="1" y="3" width="22" height="5"/>
              <line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            <span>Archivar</span>
          </button>

          {/* History section */}
          <div className="history-section">
            <div className="history-label" onClick={() => setHistOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
              </svg>
              <span>Historial</span>
              
                          {/* Botón "ver todo" — navega a ChatHistory */}
                {onViewHistory && (
                  <button
                    onClick={onViewHistory}
                    title="Ver historial completo"
                    style={{
                      all: "unset", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 28, height: 28, borderRadius: 6,
                      color: "rgba(255,255,255,.6)",
                      transition: "color .2s, background .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.background="rgba(255,255,255,.12)" }}
                    onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,.6)"; e.currentTarget.style.background="transparent" }}>
                    {/* Ícono flecha hacia afuera / "ver más" */}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </button>
                )}
              </div>


            <div className="chat-list">
              {chats.length === 0 && (
                <p className="no-chats">Sin chats aún</p>
              )}
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
                  onClick={() => onSelectChat(chat.id)}
                  onMouseEnter={() => setHoveredId(chat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <span className="chat-dot" />
                  <span className="chat-item-title">{chat.title}</span>
                  {hoveredId === chat.id && (
                    <button
                      className="delete-chat-btn"
                      onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id) }}
                      title="Eliminar chat"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sección de usuario — reemplaza el bloque original ── */}
        {/* ANTES:
            <div className="sidebar-bottom">
              <div className="user-section">
                <div className="user-avatar-wrap">
                  <img src="https://i.pravatar.cc/40?img=47" alt="Usuario" className="user-avatar-img"/>
                </div>
                <span className="user-name">USUARIO</span>
              </div>
            </div>
        */}
        <div className="sidebar-bottom">
          <UserMenu />
        </div>

      </aside>
    </>
  )

}
