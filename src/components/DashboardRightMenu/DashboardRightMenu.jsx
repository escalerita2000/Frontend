// src/components/DashboardRightMenu/DashboardRightMenu.jsx
import { NavLink, useLocation } from "react-router-dom";

const MENU_ITEMS = [
  {
    to: "/dashboard",
    label: "APPLICATION",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/configuration",
    label: "CONFIGURATION",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
  {
    to: "/dashboard/account",
    label: "MY ACCOUNT",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

export default function DashboardRightMenu() {
  const { pathname } = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap');
        .rm-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          text-decoration: none;
          color: rgba(255,255,255,0.5);
          border-left: 3px solid transparent;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          box-sizing: border-box;
        }
        .rm-item:hover {
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.8);
        }
        .rm-item.rm-active {
          color: white;
          background: rgba(93,170,79,0.07);
          border-left-color: #5daa4f;
        }
        .rm-label {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }
      `}</style>

      <aside style={{
        width: "190px",
        flexShrink: 0,
        height: "100%",
        backgroundColor: "#0f1e0e",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
      }}>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {MENU_ITEMS.map(({ to, label, icon }) => {
            // Lógica manual de active para mayor control
            const isActive =
              to === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                className={`rm-item${isActive ? " rm-active" : ""}`}
              >
                <span style={{ display: "flex", alignItems: "center",
                  color: "inherit", flexShrink: 0 }}>
                  {icon}
                </span>
                <span className="rm-label">{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}