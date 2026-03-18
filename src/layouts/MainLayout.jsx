import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar/Sidebar"
import Configuration from "../pages/Dashboard/Configuration"
import Account from "../pages/Dashboard/Account"

function MainLayout() {
  return (
    <div className="chatbot-root"> {/* 👈 CAMBIO AQUÍ */}

        <Sidebar/>

      <main className="main">
        <Outlet />
      </main>

    </div>
  )
}

export default MainLayout