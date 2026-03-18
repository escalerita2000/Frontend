import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout() {
  return (
    <div className="chat-layout">
      {/* Sidebar del historial de chats — SOLO aparece en rutas del chatbot */}
      <Sidebar />

      <main className="chat-layout__main">
        {/* Aquí se renderiza: Chatbot.jsx | ChatbotInvitado.jsx | ChatHistory.jsx */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;