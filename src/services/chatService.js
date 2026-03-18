const API_URL = "http://127.0.0.1:8000/api"

export const sendGuestMessage = async (pregunta) => {

    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            pregunta
        })
    })

    return response.json()

}

export const sendMessage = sendGuestMessage