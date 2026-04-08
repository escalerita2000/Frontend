
import { Routes, Route, Navigate } from "react-router-dom"

// Guards
import { PrivateRoute } from "./PrivateRoute"
import { RoleRoute }    from "./RoleRoute"

// Layouts
import DashboardLayout from "../layouts/DashboardLayout"
import MainLayout      from "../layouts/MainLayout"

// Páginas públicas
import Home              from "../pages/Home/Home"
import Register          from "../pages/Auth/Register"
import Login             from "../pages/Auth/Login"
import RecoverPassword   from "../pages/Auth/RecoverPassword"
import RecoveryPassword  from "../pages/Auth/RecoveryPassword"
import ResetPassword     from "../pages/Auth/ResetPassword"
import ChatbotInvitado   from "../pages/Chatbot/ChatbotInvitado"

// Páginas privadas — todos los roles autenticados
import Chatbot from "../pages/Chatbot/Chatbot"
import ChatHistory from "../pages/Chatbot/ChatHistory"

// Páginas privadas — solo admin
import Dashboard     from "../pages/Dashboard/Dashboard"
import Statistics    from "../pages/Dashboard/Statistics"
import Configuration from "../pages/Dashboard/Configuration"
import Account       from "../pages/Dashboard/Account"
import DataManager   from "../pages/Database/DataManager"
import QuestionsPanel from "../pages/Dashboard/QuestionsPanel"

// Utilidades
import NotFound from "../pages/NotFound/NotFound"

function AppRoutes() {

return (
    <Routes>

      {/* ── Rutas públicas ─────────────────────────────────────────────── */}
        <Route path="/"                element={<Home />} />
        <Route path="/Register"        element={<Register />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/RecoverPassword" element={<RecoverPassword />} />
        <Route path="/RecoveryPassword"element={<RecoveryPassword />} />
        <Route path="/ResetPassword"   element={<ResetPassword />} />
        <Route path="/ChatbotInvitado" element={<ChatbotInvitado />} />
        

      {/* ── Rutas privadas: aprendiz + admin ───────────────────────────── */}
        <Route element={<PrivateRoute />}>
        <Route element={<RoleRoute allowedRoles={['aprendiz', 'admin']} />}>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/chathistory" element={<ChatHistory />} />
        </Route>
    </Route>

      {/* ── Rutas privadas: solo admin (con DashboardLayout) ───────────── */}
        <Route element={<PrivateRoute />}>
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/statistics"    element={<Statistics />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/account"       element={<Account />} />
            <Route path="/database"      element={<DataManager />} />
            {/* /users redirige a /database para unificar la gestión */}
            <Route path="/users"         element={<Navigate to="/database" replace />} />
            <Route path="/questions" element={<QuestionsPanel />} />
            </Route>
        </Route>
    </Route>

      {/* ── 404 ────────────────────────────────────────────────────────── */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />

    </Routes>
    )
}

export default AppRoutes