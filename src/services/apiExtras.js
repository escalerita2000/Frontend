const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = (isPost = false) => {
    const headers = {
        "Accept": "application/json"
    };
    if (isPost) {
        headers["Content-Type"] = "application/json";
    }
    
    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    
    const sessionId = localStorage.getItem("chat_session_id");
    if (sessionId) {
        headers["X-Session-ID"] = sessionId;
    }
    
    return headers;
};

// ==========================================
// CHAT EXTRAS
// ==========================================

export const clearChatHistory = async () => {
    const response = await fetch(`${API_URL}/chat/history`, {
        method: "DELETE",
        headers: getHeaders(false)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al eliminar el historial del chat");
    }
    
    return await response.json();
};

// ==========================================
// AUTH EXTRAS (Password Recovery)
// ==========================================

export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error enviando el correo de recuperación");
    }

    return await response.json();
};

export const verifyRecoveryCode = async (data) => {
    const response = await fetch(`${API_URL}/verify-recovery-code`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(data) // { email, code }
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Código inválido o expirado");
    }

    return await response.json();
};

export const resetPassword = async (data) => {
    // 'data' debe contener: token, email, password, password_confirmation
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al restablecer la contraseña");
    }

    return await response.json();
};

// ==========================================
// KNOWLEDGE (Base de Conocimiento)
// ==========================================

export const getKnowledgeBase = async () => {
    const response = await fetch(`${API_URL}/knowledge`, {
        method: "GET",
        headers: getHeaders(false) // Enviamos headers (token) por si acaso en el futuro se protege
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error obteniendo la base de conocimiento");
    }

    return await response.json();
};

// ==========================================
// DASHBOARD
// ==========================================

export const getDashboardStats = async () => {
    const response = await fetch(`${API_URL}/dashboard`, {
        method: "GET",
        headers: getHeaders(false) // Enviamos headers con token
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error obteniendo estadísticas del dashboard");
    }

    return await response.json();
};

// ==========================================
// USERS
// ==========================================

export const getUsersDetails = async (page = 1, perPage = 10) => {
    const response = await fetch(`${API_URL}/users?page=${page}&per_page=${perPage}`, {
        method: "GET",
        headers: getHeaders(false)
    });

    if (!response.ok) {
        throw new Error("Error obteniendo usuarios");
    }

    return await response.json();
};

export const createUser = async (data) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al crear usuario");
    }

    return await response.json();
};

export const updateUser = async (id, data) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al actualizar usuario");
    }

    return await response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(false)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al eliminar usuario");
    }

    return await response.json();
};
