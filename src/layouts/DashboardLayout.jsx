// src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import DashboardNavbar    from "../components/DashboardNavbar/DashboardNavbar";
import DashboardRightMenu from "../components/DashboardRightMenu/DashboardRightMenu";

function DashboardLayout() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#1c5230",  // ← verde vivo de la referencia
      boxSizing: "border-box",
    }}>
      {/* Navbar negro superior */}
      <DashboardNavbar />

      {/* Cuerpo */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        minHeight: 0,
        backgroundColor: "#1c5230",
      }}>
        {/* Contenido principal */}
        <main style={{
          flex: 1,
          overflow: "hidden",
          minWidth: 0,
          backgroundColor: "#1c5230",
          display: "flex",
          flexDirection: "column",
        }}>
          <Outlet />
        </main>

        {/* Panel derecho — negro puro como en la referencia */}
        <div style={{
          width: "200px",
          flexShrink: 0,
          alignSelf: "stretch",
          backgroundColor: "#000000",   // ← negro puro
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
        }}>
          <DashboardRightMenu />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;