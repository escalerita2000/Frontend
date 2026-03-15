import React from 'react'
import "../../assets/Styles/global.css"

const ResetPassword = () => {
  return (
    <>  
    
      <main>
    <canvas id="reset-canvas"></canvas>
    <div class="reset-logo">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,6 108,33 108,87 60,114 12,87 12,33"  fill="none" stroke="#3d9c3a" stroke-width="3"/>
        <polygon points="60,22 92,40 92,76 60,94 28,76 28,40"    fill="none" stroke="#3d9c3a" stroke-width="1.5" opacity=".45"/>
        <line x1="60"  y1="6"   x2="60"  y2="22"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
        <line x1="108" y1="33"  x2="92"  y2="40"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
        <line x1="108" y1="87"  x2="92"  y2="76"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
        <line x1="60"  y1="114" x2="60"  y2="94"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
        <line x1="12"  y1="87"  x2="28"  y2="76"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
        <line x1="12"  y1="33"  x2="28"  y2="40"  stroke="#3d9c3a" stroke-width="1" opacity=".6"/>
        <polygon points="60,32 80,60 60,88 40,60" fill="#3d9c3a" opacity=".12"/>
        <polygon points="60,32 80,60 60,88 40,60" fill="none"    stroke="#3d9c3a" stroke-width="2"/>
        <path d="M50 80 L60 44 L70 80" stroke="#2b2b2b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <line x1="54" y1="69" x2="66" y2="69" stroke="#3d9c3a" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="60"  cy="6"   r="3.5" fill="#3d9c3a"/>
        <circle cx="108" cy="33"  r="3.5" fill="#3d9c3a"/>
        <circle cx="108" cy="87"  r="3.5" fill="#3d9c3a"/>
        <circle cx="60"  cy="114" r="3.5" fill="#3d9c3a"/>
        <circle cx="12"  cy="87"  r="3.5" fill="#3d9c3a"/>
        <circle cx="12"  cy="33"  r="3.5" fill="#3d9c3a"/>
      </svg>
      <div class="reset-logo-text">
        <span class="brand">AVIS</span>
        <span class="tagline">El Futuro Es AVIS</span>
      </div>
    </div>
    <div class="reset-card">
      <div class="field">
        <label>Nueva Contraseña</label>
        <input type="password" autocomplete="new-password"/>
      </div>
      <div class="field">
        <label>Confirmar&nbsp; Contraseña</label>
        <input type="password" autocomplete="new-password"/>
      </div>
      <button class="btn-confirm" type="button">Confirmar</button>
    </div>
  </main>
    
    </>
  )
}

export default ResetPassword