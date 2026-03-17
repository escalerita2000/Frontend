import { useState } from "react"
import { NavLink } from "react-router-dom" // 👈 IMPORTANTE

function Sidebar() {
  const [openHistory, setOpenHistory] = useState(true)

  return (
    <aside className="sidebar">

      <NavLink to="/chatbot/application" className="sidebar-item">
  APPLICATION
</NavLink>

<NavLink to="/chatbot/configuration" className="sidebar-item">
  CONFIGURATION
</NavLink>

<NavLink to="/chatbot/account" className="sidebar-item">
  MY ACCOUNT
</NavLink>

      {/* Hamburger */}
      <div className="sidebar-hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav secundaria */}
      <nav className="sidebar-nav">

        <button className="sidebar-item"> {/* 👈 mejor que <a> */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          Nuevo chat
        </button>

        <button className="sidebar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="21 8 21 21 3 21 3 8"/>
            <rect x="1" y="3" width="22" height="5"/>
          </svg>
          Archivar
        </button>

      </nav>

      {/* Historial */}
      <div 
        className="sidebar-history-header"
        onClick={() => setOpenHistory(!openHistory)}
      >
        Historial
        <span>{openHistory ? "▲" : "▼"}</span>
      </div>

      {openHistory && (
        <div className="sidebar-history-list">
          <div className="history-item">lorem</div>
          <div className="history-item">lorem</div>
          <div className="history-item">lorem</div>
        </div>
      )}

      <div className="sidebar-spacer"></div>

      {/* Usuario */}
      <div className="sidebar-user">
        <span className="sidebar-username">Usuario</span>
      </div>

    </aside>
  )
}

export default Sidebar