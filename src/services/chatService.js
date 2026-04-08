const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (isPost = false) => {
    const headers = {
        "Accept": "application/json"
    };
    if (isPost) headers["Content-Type"] = "application/json";
    
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const sessionId = localStorage.getItem("chat_session_id");
    if (sessionId) headers["X-Session-ID"] = sessionId;
    
    return headers;
};

const handleSessionId = (responseBody) => {
    if (responseBody && responseBody.session_id) {
        localStorage.setItem("chat_session_id", responseBody.session_id);
    } else if (responseBody && responseBody.data && responseBody.data.session_id) {
        localStorage.setItem("chat_session_id", responseBody.data.session_id);
    }
};

export const sendMessage = async (message) => {
    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
    }
    
    const data = await response.json();
    handleSessionId(data);
    return data;
}

export const getChatHistory = async () => {
    const response = await fetch(`${API_URL}/chat/history`, {
        method: "GET",
        headers: getHeaders(false)
    });

    if (!response.ok) {
        throw new Error("Error obteniendo el historial");
    }
    
    const data = await response.json();
    handleSessionId(data);
    return data;
}