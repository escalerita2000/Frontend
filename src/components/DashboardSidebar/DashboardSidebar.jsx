// src/components/DashboardSidebar/DashboardSidebar.jsx
//
// Sidebar del panel admin.
// Usa <NavLink> de React Router para highlight automático del ítem activo.
// Incluye enlace de regreso al chatbot.

import { NavLink } from "react-router-dom";
import "./DSidebar.css";

const NAV_ITEMS = [
  {
    to: "/dashboard/home",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/statistics",
    label: "Statistics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
        <line x1="2"  y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/errors",
    label: "Errors Panel",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/configuration",
    label: "Configuration",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/account",
    label: "My Account",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function DashboardSidebar() {
  return (
    <aside className="dash-sb">
      {/* Brand */}
      <div className="dash-sb__brand">
        <div className="dash-sb__logo">
          <svg viewBox="0 0 60 60" fill="none">
            <path d="M30 8C30 8 38 16 38 24C38 32 30 36 30 36C30 36 22 32 22 24C22 16 30 8 30 8Z"
              fill="white" opacity="0.9"/>
            <path d="M30 52C30 52 38 44 38 36C38 28 30 24 30 24C30 24 22 28 22 36C22 44 30 52 30 52Z"
              fill="white" opacity="0.5"/>
            <circle cx="30" cy="30" r="4" fill="white"/>
          </svg>
        </div>
        <div className="dash-sb__brand-text">
          <span className="dash-sb__brand-name">AVIS</span>
          <span className="dash-sb__brand-sub">Dashboard</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="dash-sb__nav">
        <p className="dash-sb__section">MENÚ</p>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `dash-sb__link${isActive ? " active" : ""}`
            }
          >
            <span className="dash-sb__icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Back to chatbot */}
      <div className="dash-sb__back-wrap">
        <NavLink to="/chatbot" className="dash-sb__back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Ir al Chatbot
        </NavLink>
      </div>

      {/* User */}
      <div className="dash-sb__footer">
        <img src="https://i.pravatar.cc/40?img=47" alt="user" className="dash-sb__avatar"/>
        <div>
          <p className="dash-sb__user-name">Usuario</p>
          <p className="dash-sb__user-role">Administrador</p>
        </div>
      </div>
    </aside>
  );
}