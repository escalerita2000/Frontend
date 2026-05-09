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
import { FiEdit2, FiPackage, FiTrash2, FiCheck, FiX } from "react-icons/fi"
import { useTheme } from "../../context/ThemeContext"

export default function Sidebar({ 
  chats, 
  activeChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat, 
  onRenameChat,
  onArchiveChat,
  showArchived,
  onToggleArchive,
  isLoading,
  isOpen, 
  onToggle, 
  onViewHistory 
}) {
  const [hoveredId, setHoveredId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState("")
  const { theme, toggleTheme } = useTheme()

  const handleStartEdit = (chat) => {
    setEditingId(chat.id)
    setEditValue(chat.title)
  }

  const handleSaveEdit = (id) => {
    if (editValue.trim()) {
      onRenameChat(id, editValue.trim())
    }
    setEditingId(null)
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 1.5s ease-in-out infinite;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
        }
      `}</style>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Hamburger inside sidebar */}
            <button className="sidebar-toggle-inner" onClick={onToggle} title="Cerrar menú">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <button 
              onClick={toggleTheme} 
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '18px', padding: '8px 16px', transition: 'color 0.2s' }} 
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

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
          <button className={`archive-btn ${showArchived ? 'active' : ''}`} onClick={onToggleArchive}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="21 8 21 21 3 21 3 8"/>
              <rect x="1" y="3" width="22" height="5"/>
              <line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            <span>{showArchived ? "Volver a chats" : "Archivados"}</span>
          </button>

          {/* History section */}
          <div className="history-section">
            <div className="history-label">
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
              {isLoading ? (
                // Esqueleto de carga con animación premium
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="chat-item skeleton-pulse" style={{ height: 42, marginBottom: 8, pointerEvents: 'none' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', marginRight: 12 }} />
                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  </div>
                ))
              ) : chats.length === 0 ? (
                <p className="no-chats">Sin chats aún</p>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
                    onClick={() => onSelectChat(chat.id)}
                    onMouseEnter={() => setHoveredId(chat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <span className="chat-dot" />
                    
                    {editingId === chat.id ? (
                      <input 
                        autoFocus
                        className="edit-chat-input"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => handleSaveEdit(chat.id)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit(chat.id)}
                        onClick={e => e.stopPropagation()}
                        style={{
                          background: 'transparent', border: 'none', borderBottom: '1px solid #fff',
                          color: '#fff', fontSize: '13px', outline: 'none', width: '100%'
                        }}
                      />
                    ) : (
                      <span className="chat-item-title">{chat.title}</span>
                    )}

                    {hoveredId === chat.id && editingId !== chat.id && (
                      <div className="chat-actions" style={{ display: 'flex', gap: 6 }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStartEdit(chat) }} 
                          style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.5)', cursor:'pointer', padding:2 }}
                          title="Renombrar"
                        >
                          <FiEdit2 size={12}/>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onArchiveChat(chat.id) }} 
                          style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.5)', cursor:'pointer', padding:2 }}
                          title={showArchived ? "Desarchivar" : "Archivar"}
                        >
                          <FiPackage size={12}/>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id) }} 
                          style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.5)', cursor:'pointer', padding:2 }}
                          title="Eliminar"
                        >
                          <FiTrash2 size={12}/>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
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
