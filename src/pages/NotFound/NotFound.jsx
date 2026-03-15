import React from 'react'
import { Link } from 'react-router-dom'
import '../../assets/Styles/global.css'

const NotFound = () => {
    return (
    <>
    <body className="page-error">
  <canvas id="error-canvas"></canvas>
  <div className="error-card">
    <svg className="sad-face" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="88" stroke="#2b2b2b" strokeWidth="4"/>
      <circle cx="72" cy="82" r="4" fill="#2b2b2b"/>
      <circle cx="128" cy="82" r="4" fill="#2b2b2b"/>
      <path d="M68 130 Q100 110 132 130" stroke="#2b2b2b" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
    <p className="error-message">Ocurrio un error inesperado</p>
    <div className="error-divider"></div>
    <div className="error-actions">
      <Link href="/Home" className="btn-error btn-home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
          <polyline points="9 21 9 12 15 12 15 21"/>
        </svg>
        <Link to="/">Volver al inicio</Link>
      </Link>
      <Link to="/Help" className="btn-error btn-support">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
          <line x1="14.12" y1="9.88" x2="21.17" y2="2.83"/>
          <line x1="2.83" y1="21.17" x2="9.88" y2="14.12"/>
        </svg>
        Soporte técnico
      </Link>
    </div>
  </div>

</body>
    </>
    )
}

export default NotFound