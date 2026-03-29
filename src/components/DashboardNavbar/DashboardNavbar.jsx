// src/components/DashboardNavbar/DashboardNavbar.jsx
import { NavLink } from "react-router-dom";

export default function DashboardNavbar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
        @keyframes rotateLogo {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .db-pg-num {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 5px;
          transition: background 0.18s, color 0.18s;
        }
        .db-pg-num:hover { color: white; background: rgba(255,255,255,0.08); }
        .db-pg-num.active { color: white; }
      `}</style>

      <header style={{
        width: "100%",
        height: "52px",
        minHeight: "52px",
        backgroundColor: "#000000",          // negro puro
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        boxSizing: "border-box",
      }}>

        {/* Izquierda: icono usuario */}
        <div style={{ display: "flex", alignItems: "center", width: "80px" }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.7)", padding: "6px", borderRadius: "8px",
            display: "flex", alignItems: "center",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>

        {/* Centro: logo + AVIS */}
        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: "12px",
          pointerEvents: "none",
        }}>
          {/* Logo AVIS animado */}
          <div style={{ width: 28, height: 28,
            animation: "rotateLogo 25s linear infinite" }}>
            <svg viewBox="0 0 60 60" fill="none" width="28" height="28">
              {/* Pétalo arriba */}
              <path d="M30 6 C24 6 20 12 20 18 C20 24 24 28 30 30 C36 28 40 24 40 18 C40 12 36 6 30 6Z"
                fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
              {/* Pétalo abajo */}
              <path d="M30 54 C24 54 20 48 20 42 C20 36 24 32 30 30 C36 32 40 36 40 42 C40 48 36 54 30 54Z"
                fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
              {/* Pétalo izquierda */}
              <path d="M6 30 C6 24 12 20 18 20 C24 20 28 24 30 30 C28 36 24 40 18 40 C12 40 6 36 6 30Z"
                fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
              {/* Pétalo derecha */}
              <path d="M54 30 C54 24 48 20 42 20 C36 20 32 24 30 30 C32 36 36 40 42 40 C48 40 54 36 54 30Z"
                fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
              {/* Centro */}
              <circle cx="30" cy="30" r="3" fill="white"/>
              {/* Círculo exterior decorativo */}
              <circle cx="30" cy="30" r="26" stroke="rgba(255,255,255,0.15)"
                strokeWidth="1" fill="none"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.22em",
          }}>
            AVIS
          </span>
        </div>

        {/* Derecha: paginación */}
        <nav style={{
          display: "flex", alignItems: "center", gap: "6px",
          width: "120px", justifyContent: "flex-end",
        }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.5)", padding: "4px",
            display: "flex", alignItems: "center", borderRadius: "5px",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <NavLink to="/dashboard"
            className={({isActive}) => `db-pg-num${isActive ? " active" : ""}`}>1</NavLink>
          <NavLink to="/dashboard/statistics"
            className={({isActive}) => `db-pg-num${isActive ? " active" : ""}`}>2</NavLink>
          <NavLink to="/dashboard/users"
            className={({isActive}) => `db-pg-num${isActive ? " active" : ""}`}>3</NavLink>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", padding: "0 2px" }}>
            …
          </span>
        </nav>
      </header>
    </>
  );
}