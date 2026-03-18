// src/layouts/DashboardLayout.jsx
//
// Layout del dashboard AVIS:
// ┌─────────────────────────────────────┐
// │  [user]     ✦ AVIS      ← 1 2 3 …  │  ← Navbar top (negro)
// ├──────────────────────────┬──────────┤
// │                          │ APP      │
// │   <Outlet />             │ CONFIG   │  ← Right panel (verde oscuro)
// │                          │ ACCOUNT  │
// └──────────────────────────┴──────────┘

import { Outlet } from "react-router-dom";
import DashboardNavbar    from "../components/DashboardNavbar/DashboardNavbar";
import DashboardRightMenu from "../components/DashboardRightMenu/DashboardRightMenu";
import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="db-layout">
      {/* Top navbar: usuario | logo AVIS | paginación */}
      <DashboardNavbar />

      <div className="db-layout__body">
        {/* Contenido principal (Dashboard, Configuration, Account…) */}
        <main className="db-layout__main">
          <Outlet />
        </main>

        {/* Menú lateral derecho: Application | Configuration | My Account */}
        <DashboardRightMenu />
      </div>
    </div>
  );
}

export default DashboardLayout;