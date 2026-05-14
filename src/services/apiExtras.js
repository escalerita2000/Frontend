const API_URL = import.meta.env.VITE_API_URL;

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

export const getKnowledgeBase = async (status = null, search = "") => {
    let url = `${API_URL}/knowledge`;
    const params = new URLSearchParams();
    
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(false)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error obteniendo la base de conocimiento");
    }

    return await response.json();
};

export const createKnowledge = async (data) => {
    const response = await fetch(`${API_URL}/knowledge`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al crear conocimiento");
    }

    return await response.json();
};

export const updateKnowledge = async (id, data) => {
    const response = await fetch(`${API_URL}/knowledge/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al actualizar conocimiento");
    }

    return await response.json();
};

export const deleteKnowledge = async (id) => {
    const response = await fetch(`${API_URL}/knowledge/${id}`, {
        method: "DELETE",
        headers: getHeaders(false)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al eliminar conocimiento");
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

// ==========================================
// SUGERENCIAS
// ==========================================

/**
 * Enviar una sugerencia (ruta pública — sin token).
 */
export const sendSugerencia = async (data) => {
    const response = await fetch(`${API_URL}/sugerencias`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        // Laravel devuelve errores de validación en err.errors
        if (err.errors) {
            const firstError = Object.values(err.errors)[0][0];
            throw new Error(firstError);
        }
        throw new Error(err.message || "No se pudo enviar la sugerencia");
    }

    return await response.json();
};

/**
 * Listar sugerencias (solo admin).
 */
export const getSugerencias = async ({ estado = "todas", tipo = "todos", search = "", page = 1 } = {}) => {
    const params = new URLSearchParams();
    if (estado !== "todas") params.append("estado", estado);
    if (tipo !== "todos")   params.append("tipo", tipo);
    if (search)             params.append("search", search);
    params.append("page", page);

    const response = await fetch(`${API_URL}/sugerencias?${params.toString()}`, {
        method: "GET",
        headers: getHeaders(false),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al obtener sugerencias");
    }

    return await response.json();
};

/**
 * Cambiar estado de una sugerencia (solo admin).
 */
export const updateSugerenciaEstado = async (id, estado) => {
    const response = await fetch(`${API_URL}/sugerencias/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al actualizar estado");
    }

    return await response.json();
};

/**
 * Eliminar una sugerencia (solo admin).
 */
export const deleteSugerencia = async (id) => {
    const response = await fetch(`${API_URL}/sugerencias/${id}`, {
        method: "DELETE",
        headers: getHeaders(false),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al eliminar sugerencia");
    }

    return await response.json();
};
