import { useState } from "react"
import { sendMessage } from "../../services/chatService"

function Chatbot() {

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")

    const handleSendMessage = async () => {

        if (!input) return

        // mensaje del usuario
        setMessages(prev => [...prev, { text: input, user: "me" }])

        try {

            const response = await sendMessage(input)

            // respuesta del bot
            setMessages(prev => [
                ...prev,
                { text: input, user: "me" },
                { text: response.respuesta, user: "bot" }
            ])

        } catch {

            setMessages(prev => [
                ...prev,
                { text: "Error conectando con el servidor", user: "bot" }
            ])

        }

        setInput("")

    }

    return (

        <div>

            <h1>Chatbot AVIS</h1>

            <div>

                {messages.map((msg, i) => (
                    <p key={i}>
                        <b>{msg.user === "me" ? "Tú:" : "AVIS:"}</b> {msg.text}
                    </p>
                ))}

            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta"
            />

            <button onClick={handleSendMessage}>
                Enviar
            </button>

        </div>

    )

}

export default Chatbot