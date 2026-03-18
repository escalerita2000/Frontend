import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar/Sidebar"

function MainLayout() {
  return (
    <div className="chatbot-root"> {/* 👈 CAMBIO AQUÍ */}

      <Sidebar />

      <main className="main">
        <Outlet />
      </main>

    </div>
  )
}

export default MainLayout