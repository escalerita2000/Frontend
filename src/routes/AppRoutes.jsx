// src/routes/AppRoutes.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// ── Layouts ───────────────────────────────────────────────────────────────────
import MainLayout      from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// ── Páginas sin layout (standalone) ──────────────────────────────────────────
import Home            from "../pages/Home/Home";
import Login           from "../pages/Auth/Login";
import RecoverPassword from "../pages/Auth/RecoverPassword";
import ResetPassword   from "../pages/Auth/ResetPassword";
import NotFound        from "../pages/NotFound/NotFound";

// ── Páginas del Chatbot (van dentro de MainLayout) ────────────────────────────
import Chatbot         from "../pages/Chatbot/Chatbot";
import ChatbotInvitado from "../pages/Chatbot/ChatbotInvitado";

// ── Páginas del Dashboard (van dentro de DashboardLayout) ─────────────────────
import Dashboard       from "../pages/Dashboard/Dashboard";
import Configuration   from "../pages/Dashboard/Configuration";
import Account         from "../pages/Dashboard/Account";
import Statistics      from "../pages/Dashboard/Statistics";
import Users           from "../pages/Database/Users";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Páginas standalone (sin sidebar) ──────────────────────────── */}
        <Route path="/"                 element={<Home />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/reset-password"   element={<ResetPassword />} />

        {/* ── CHATBOT — usa MainLayout (sidebar historial de chats) ──────── */}
        <Route path="/chatbot" element={<MainLayout />}>
          <Route index                  element={<Chatbot />} />
          <Route path="invitado"        element={<ChatbotInvitado />} />
          {/*
            Rutas futuras del chatbot van aquí adentro:
            <Route path="history"       element={<ChatHistory />} />
          */}
        </Route>

        {/* ── DASHBOARD — usa DashboardLayout (sidebar admin) ───────────── */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index                  element={<Dashboard />} />
          <Route path="configuration"   element={<Configuration />} />
          <Route path="account"         element={<Account />} />
          <Route path="statistics"      element={<Statistics />} />
          <Route path="users"           element={<Users />} />
          {/*
            Rutas futuras del dashboard van aquí adentro:
            <Route path="errors"        element={<ErrorsPanel />} />
            <Route path="notifications" element={<Notifications />} />
          */}
        </Route>

        {/* ── 404 ────────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;