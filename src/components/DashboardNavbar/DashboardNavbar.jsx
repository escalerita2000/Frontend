// src/components/DashboardNavbar/DashboardNavbar.jsx
import { NavLink } from "react-router-dom";

// Estilos inline para garantizar que NO sean sobreescritos por ningún CSS global
const styles = {
  nav: {
    width: "100%",
    height: "52px",
    minHeight: "52px",
    backgroundColor: "#0d0d0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    flexShrink: 0,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    zIndex: 50,
    boxSizing: "border-box",
  },
  left: {
    display: "flex",
    alignItems: "center",
    width: "80px",
  },
  userBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.7)",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
  },
  brand: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    pointerEvents: "none",
  },
  logoWrap: {
    width: "26px",
    height: "26px",
    animation: "rotateLogo 30s linear infinite",
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: "19px",
    fontWeight: 700,
    color: "white",
    letterSpacing: "0.2em",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    width: "80px",
    justifyContent: "flex-end",
  },
  pgArrow: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.45)",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
  },
  pgDots: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.3)",
  },
};

export default function DashboardNavbar() {
  return (
    <>
      {/* Keyframe para la animación del logo */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
        @keyframes rotateLogo { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .db-pg-num {
          font-family: 'Cinzel', serif;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 5px;
          transition: background 0.18s, color 0.18s;
        }
        .db-pg-num:hover { color: white; background: rgba(255,255,255,0.08); }
        .db-pg-num.active { color: white; background: rgba(255,255,255,0.12); }
      `}</style>

      <header style={styles.nav}>
        {/* Izquierda: icono usuario */}
        <div style={styles.left}>
          <button style={styles.userBtn} title="Mi cuenta">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>

        {/* Centro: logo AVIS */}
        <div style={styles.brand}>
          <div style={{ width: 26, height: 26, animation: "rotateLogo 30s linear infinite" }}>
            <svg viewBox="0 0 60 60" fill="none" width="26" height="26">
              <path d="M30 10C30 10 38 18 38 26C38 34 30 38 30 38C30 38 22 34 22 26C22 18 30 10 30 10Z"
                fill="rgba(255,255,255,0.85)"/>
              <path d="M30 50C30 50 38 42 38 34C38 26 30 22 30 22C30 22 22 26 22 34C22 42 30 50 30 50Z"
                fill="rgba(255,255,255,0.4)"/>
              <path d="M10 30C10 30 18 22 26 22C34 22 38 30 38 30C38 30 34 38 26 38C18 38 10 30 10 30Z"
                fill="rgba(255,255,255,0.55)"/>
              <path d="M50 30C50 30 42 22 34 22C26 22 22 30 22 30C22 30 26 38 34 38C42 38 50 30 50 30Z"
                fill="rgba(255,255,255,0.3)"/>
              <circle cx="30" cy="30" r="3.5" fill="white"/>
            </svg>
          </div>
          <span style={styles.title}>AVIS</span>
        </div>

        {/* Derecha: paginación */}
        <nav style={styles.pagination}>
          <button style={styles.pgArrow}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <NavLink to="/dashboard"            className={({isActive}) => `db-pg-num${isActive ? " active" : ""}`}>1</NavLink>
          <NavLink to="/dashboard/statistics" className={({isActive}) => `db-pg-num${isActive ? " active" : ""}`}>2</NavLink>
          <NavLink to="/dashboard/users"      className={({isActive}) => `db-pg-num${isActive ? " active" : ""}`}>3</NavLink>
          <span style={styles.pgDots}>…</span>
        </nav>
      </header>
    </>
  );
}