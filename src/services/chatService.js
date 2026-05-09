const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (isPost = false, sessionIdOverride = null) => {
    const headers = {
        "Accept": "application/json"
    };
    if (isPost) headers["Content-Type"] = "application/json";
    
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    // Si hay un sessionId específico para este chat, lo usamos.
    // Si no, usamos el global (para compatibilidad) o nada.
    const sessionId = sessionIdOverride || localStorage.getItem("chat_session_id");
    if (sessionId) headers["X-Session-ID"] = sessionId;
    
    return headers;
};

const handleSessionId = (responseBody) => {
    // Solo guardamos en localStorage si no teníamos uno, 
    // para mantener la sesión "por defecto" si es necesario.
    if (!localStorage.getItem("chat_session_id")) {
        if (responseBody && responseBody.session_id) {
            localStorage.setItem("chat_session_id", responseBody.session_id);
        } else if (responseBody && responseBody.data && responseBody.data.session_id) {
            localStorage.setItem("chat_session_id", responseBody.data.session_id);
        }
    }
};

export const sendMessage = async (message, sessionId = null) => {
    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: getHeaders(true, sessionId),
        body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
    }
    
    const data = await response.json();
    handleSessionId(data);
    return data;
}

export const getChatHistory = async (sessionId = null) => {
    const response = await fetch(`${API_URL}/chat/history`, {
        method: "GET",
        headers: getHeaders(false, sessionId)
    });

    if (!response.ok) {
        throw new Error("Error obteniendo el historial");
    }
    
    const data = await response.json();
    handleSessionId(data);
    return data;
}

export const getSessions = async (archived = false) => {
    const response = await fetch(`${API_URL}/chat/sessions${archived ? '?archived=1' : ''}`, {
        method: "GET",
        headers: getHeaders(false)
    });

    if (!response.ok) throw new Error("Error obteniendo sesiones");
    return await response.json();
}

export const updateSession = async (sessionId, data) => {
    const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Error actualizando sesión");
    return await response.json();
}