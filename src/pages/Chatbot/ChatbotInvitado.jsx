import {useState} from "react"
import { loginUser } from "../../services/authService"
import { useAuth } from "../../hooks/useAuth"
import "../../assets/Styles/global.css"

const ChatbotInvitado = () => {
    return (
        <>
        <main>
    <canvas id="help-canvas"></canvas>
    <div className="help-logo">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke="#3d9c3a" strokeWidth="3"/>
            <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke="#3d9c3a" strokeWidth="1.5" opacity=".45"/>
            <line x1="60"  y1="6"   x2="60"  y2="22"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
            <line x1="108" y1="33"  x2="92"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
            <line x1="108" y1="87"  x2="92"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
            <line x1="60"  y1="114" x2="60"  y2="94"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
            <line x1="12"  y1="87"  x2="28"  y2="76"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
            <line x1="12"  y1="33"  x2="28"  y2="40"  stroke="#3d9c3a" strokeWidth="1" opacity=".6"/>
            <polygon points="60,32 80,60 60,88 40,60" fill="#3d9c3a" opacity=".12"/>
            <polygon points="60,32 80,60 60,88 40,60" fill="none"    stroke="#3d9c3a" strokeWidth="2"/>
            <path d="M50 80 L60 44 L70 80" stroke="#2b2b2b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <line x1="54" y1="69" x2="66" y2="69" stroke="#3d9c3a" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="60"  cy="6"   r="3.5" fill="#3d9c3a"/>
            <circle cx="108" cy="33"  r="3.5" fill="#3d9c3a"/>
            <circle cx="108" cy="87"  r="3.5" fill="#3d9c3a"/>
            <circle cx="60"  cy="114" r="3.5" fill="#3d9c3a"/>
            <circle cx="12"  cy="87"  r="3.5" fill="#3d9c3a"/>
            <circle cx="12"  cy="33"  r="3.5" fill="#3d9c3a"/>
        </svg>
    <div className="help-logo-text">
        <span className="brand">AVIS</span>
        <span className="tagline">El Futuro Es AVIS</span>
    </div>
    </div>
    <h1 className="help-title">BIENVENIDOS</h1>
    <p className="help-sub">Centro de ayuda y soporte de AVIS</p>
    <div className="search-box">
        <button className="btn-close" type="button" aria-label="Cerrar">&#x2715;</button>
        <input
        className="search-input"
        type="text"
        placeholder="Escribe tu pregunta"/>
    <div className="search-actions">
        <button className="btn-mic" type="button" aria-label="Hablar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeinejoin="round">
                <rect x="9" y="2" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8"  y1="23" x2="16" y2="23"/>
            </svg>
        </button>
        <button className="btn-send-search" type="button" aria-label="Enviar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
            </svg>
        </button>
        </div>
    </div>
    <div className="quick-questions">
        <button className="btn-quick" type="button">¿Que es el sena?</button>
        <button className="btn-quick" type="button">¿cuando abren las inscripciones?</button>
        <button className="btn-quick" type="button">¿Ubicacion de instalaciones?</button>
    </div>
    </main>
        </>
    )
}

export default ChatbotInvitado