const API_URL = "http://127.0.0.1:8000/api"

export const loginUser = async (data) => {

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error("Credenciales inválidas o datos incompletos");
    }

    const result = await response.json()

    // guardar token
    if (result.token) {
        localStorage.setItem("token", result.token)
    }

    return result
}

export const registerUser = async (data) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error("Error en el registro o el correo ya existe");
    }

    const result = await response.json()

    // guardar token
    if (result.token) {
        localStorage.setItem("token", result.token)
    }

    return result
}