const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// 🔐 LOGIN
export const loginUser = async (data) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "Credenciales inválidas o datos incompletos");
        }

        // guardar token
        if (result.token) {
            localStorage.setItem("token", result.token);
        }

        return result;

    } catch (error) {
        throw new Error(error.message || "Error de conexión con el servidor");
    }
};


// 🚪 LOGOUT
export const logoutUser = () => {
    localStorage.removeItem("token");
};


// 📝 REGISTER
export const registerUser = async (data) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "Error en el registro o el correo ya existe");
        }

        // guardar token
        if (result.token) {
            localStorage.setItem("token", result.token);
        }

        return result;

    } catch (error) {
        throw new Error(error.message || "Error de conexión con el servidor");
    }
};


// 🔎 Obtener usuario autenticado (opcional pero recomendado)
export const getAuthUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No autenticado");

    const response = await fetch(`${API_URL}/user`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "Error al obtener usuario");
    }

    return result;
};

// 🔄 Actualizar perfil del usuario
export const updateProfile = async (data) => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No autenticado");

    const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "Error al actualizar perfil");
    }

    return result;
};