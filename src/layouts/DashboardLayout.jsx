// src/layouts/DashboardLayout.jsx
//
// COMBINADO: tu layout AVIS original + Outlet del sistema de rutas anidadas.
//
// Tu layout ya usaba <Outlet /> correctamente — no hubo conflicto.
// Lo único que se mantiene exactamente igual es tu estructura:
//   DashboardNavbar (top) + main (Outlet) + DashboardRightMenu (right panel)
//
// NOTA: el logout ya no necesita estar aquí porque tu DashboardNavbar
// o DashboardRightMenu lo manejan. Si quieres agregar logout en el menú
// lateral puedes usar: const { logout } = useAuth()

import { Outlet }             from "react-router-dom"
import DashboardNavbar        from "../components/DashboardNavbar/DashboardNavbar"
import DashboardRightMenu     from "../components/DashboardRightMenu/DashboardRightMenu"
import "./DashboardLayout.css"

function DashboardLayout() {
  return (
    <div className="db-layout">
      {/* Top navbar: usuario | logo AVIS | paginación */}
      <DashboardNavbar />

      <div className="db-layout__body">
        {/* Contenido principal — Dashboard, Statistics, Configuration, Account, DataManager */}
        <main className="db-layout__main">
          <Outlet />
        </main>

        {/* Menú lateral derecho: Application | Configuration | My Account */}
        <DashboardRightMenu />
      </div>
    </div>
  )
}

export default DashboardLayout
