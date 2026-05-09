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

    const isFormData = data instanceof FormData;
    
    // Si es FormData, usamos POST + _method: PUT para que Laravel lo procese bien
    const method = isFormData ? "POST" : "PUT";
    if (isFormData) {
        data.append("_method", "PUT");
    }

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
    };

    // NO poner Content-Type si es FormData, el navegador lo hace solo
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}/user`, {
        method: method,
        headers: headers,
        body: isFormData ? data : JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "Error al actualizar perfil");
    }

    return result;
};