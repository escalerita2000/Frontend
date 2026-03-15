import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home/Home"
import Login from "../pages/Auth/Login"
import RecoverPassword from "../pages/Auth/RecoverPassword"
import ResetPassword from "../pages/Auth/ResetPassword"
import Dashboard from "../pages/Dashboard/Dashboard"
import Chatbot from "../pages/Chatbot/Chatbot"
import ChatbotInvitado from "../pages/Chatbot/ChatbotInvitado"
import Statistics from "../pages/Dashboard/Statistics"
import Users from "../pages/Database/Users"
import NotFound from "../pages/NotFound/NotFound"

function AppRoutes(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Home />} />

<Route path="/login" element={<Login />} />

<Route path="/RecoverPassword" element={<RecoverPassword />} />

<Route path="/ResetPassword" element={<ResetPassword />} />

<Route path="/dashboard" element={<Dashboard />} />

<Route path="/chatbot" element={<Chatbot />} />

<Route path="/ChatbotInvitado" element={<ChatbotInvitado />} />

<Route path="/statistics" element={<Statistics />} />

<Route path="/users" element={<Users />} />


{/* Ruta 404 */}
<Route path="*" element={<NotFound />} />

</Routes>

</BrowserRouter>

)

}

export default AppRoutes