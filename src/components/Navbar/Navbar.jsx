import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
    
    <nav>
    <a href="#" className="nav-logo">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,4 72,22 72,58 40,76 8,58 8,22"    fill="none" stroke="#3d9c3a" strokeWidth="2.5"/>
        <polygon points="40,16 62,28 62,52 40,64 18,52 18,28" fill="none" stroke="#3d9c3a" strokeWidth="1.2" opacity=".5"/>
        <polygon points="40,24 56,40 40,56 24,40" fill="#3d9c3a" opacity=".15"/>
        <polygon points="40,24 56,40 40,56 24,40" fill="none"    stroke="#3d9c3a" strokeWidth="1.8"/>
        <path d="M34 52 L40 30 L46 52" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="36.5" y1="45" x2="43.5" y2="45" stroke="#3d9c3a" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="40" cy="4"  r="2.5" fill="#3d9c3a"/>
        <circle cx="72" cy="22" r="2.5" fill="#3d9c3a"/>
        <circle cx="72" cy="58" r="2.5" fill="#3d9c3a"/>
        <circle cx="40" cy="76" r="2.5" fill="#3d9c3a"/>
        <circle cx="8"  cy="58" r="2.5" fill="#3d9c3a"/>
        <circle cx="8"  cy="22" r="2.5" fill="#3d9c3a"/>
      </svg>
      <div className="nav-logo-text">
        <span className="brand">AVIS</span>
        <span className="tagline">El Futuro Es AVIS</span>
      </div>
    </a>
 
    <ul className="nav-links">
      <li><Link to="/" className="btn-nav">Home</Link></li>
      <li><Link to="/Sugerencias" className="btn-nav">Sugerencias</Link></li>
      <li><a href="#">Errores</a></li>
      <li><Link to="/Register" className="btn-nav">Sign up</Link></li>
      <li><Link to="/login" className="btn-nav">Comienza Ahora</Link></li>
    </ul>
  </nav>

    </>
  )
}

export default Navbar