import React, { useState, useEffect } from 'react';
import { generatePassword } from '../../utils/passwordGenerator';
import { useOutletContext } from 'react-router-dom';

/* ══════════════════════════════════════
   ESTILOS Y COLORES (Basados en AVIS)
   ══════════════════════════════════════ */
const C = {
  black:    "#0a0a0a",
  dark:     "#111111",
  darkCard: "#1c1c1c",
  green:    "#3d9c3a",
  greenL:   "#52c44f",
  white:    "#f0f0f0",
  gray:     "#888",
  border:   "rgba(61,156,58,0.2)",
};

const Switch = ({ active, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      width: 40, height: 20, borderRadius: 10,
      background: active ? C.green : "#333",
      position: "relative", cursor: "pointer",
      transition: "background .3s",
    }}
  >
    <div style={{
      width: 16, height: 16, borderRadius: "50%",
      background: C.white, position: "absolute",
      top: 2, left: active ? 22 : 2,
      transition: "left .3s",
      boxShadow: "0 2px 4px rgba(0,0,0,.2)"
    }} />
  </div>
);

const PasswordGenerator = () => {
  const { showToast } = useOutletContext();
  const [options, setOptions] = useState({
    length: 16,
    includeSymbols: true,
    includeNumbers: true,
    includeUppercase: true,
    includeLowercase: true,
  });
  const [password, setPassword] = useState("");

  const handleGenerate = () => {
    const pwd = generatePassword(options);
    setPassword(pwd);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    if (showToast) showToast("success", "Contraseña copiada al portapapeles");
  };

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      flex: 1, padding: "40px", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", overflowY: "auto"
    }}>
      {/* Título Estilo AVIS */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ 
          fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", 
          letterSpacing: ".1em", color: C.white, margin: 0 
        }}>
          GENERADOR DE <span style={{ color: C.green }}>LLAVES</span>
        </h1>
        <p style={{ 
          fontSize: ".75rem", fontWeight: 700, letterSpacing: ".3em", 
          textTransform: "uppercase", color: C.gray, marginTop: 5 
        }}>
          Seguridad de Grado Militar
        </p>
      </div>

      {/* Tarjeta Principal (Glassmorphism) */}
      <div style={{
        width: "100%", maxWidth: 500, background: C.darkCard,
        border: `1px solid ${C.border}`, borderRadius: 20,
        padding: "32px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
      }}>
        
        {/* Resultado */}
        <div style={{
          background: "#121212", border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "20px", marginBottom: 30,
          display: "flex", alignItems: "center", gap: 15,
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            fontSize: "1.4rem", fontFamily: "'Outfit', sans-serif",
            fontWeight: 600, color: C.greenL, flex: 1, 
            wordBreak: "break-all", textAlign: "center",
            letterSpacing: ".05em"
          }}>
            {password || "••••••••"}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button 
              onClick={handleGenerate}
              title="Regenerar"
              style={{
                all: "unset", cursor: "pointer", color: C.gray,
                transition: "color .2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.white}
              onMouseLeave={e => e.currentTarget.style.color = C.gray}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            </button>
            <button 
              onClick={copyToClipboard}
              title="Copiar"
              style={{
                all: "unset", cursor: "pointer", color: C.gray,
                transition: "color .2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.white}
              onMouseLeave={e => e.currentTarget.style.color = C.gray}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>

        {/* Controles de Configuración */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Longitud */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: ".75rem", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: ".1em" }}>Longitud</span>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: C.green }}>{options.length}</span>
            </div>
            <input 
              type="range" min="8" max="50" 
              value={options.length} 
              onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
              style={{
                width: "100%", height: 4, background: "#333",
                borderRadius: 2, appearance: "none", outline: "none",
                cursor: "pointer"
              }}
            />
          </div>

          <div style={{ height: "1px", background: C.border, margin: "10px 0" }} />

          {/* Opciones */}
          {[
            { id: "includeUppercase", label: "Mayúsculas (A-Z)" },
            { id: "includeLowercase", label: "Minúsculas (a-z)" },
            { id: "includeNumbers",   label: "Números (0-9)" },
            { id: "includeSymbols",   label: "Símbolos (!@#$)" },
          ].map(opt => (
            <div key={opt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: ".85rem", fontWeight: 600, color: C.white }}>{opt.label}</span>
              <Switch 
                active={options[opt.id]} 
                onClick={() => toggleOption(opt.id)} 
              />
            </div>
          ))}

          <button 
            onClick={handleGenerate}
            style={{
              marginTop: 20, width: "100%", padding: "16px",
              background: C.green, color: C.white, border: "none",
              borderRadius: 10, fontFamily: "'Outfit', sans-serif",
              fontSize: ".9rem", fontWeight: 700, letterSpacing: ".15em",
              textTransform: "uppercase", cursor: "pointer",
              boxShadow: "0 10px 20px rgba(61,156,58,0.2)",
              transition: "transform .2s, background .2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.greenL;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = C.green;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Generar Contraseña
          </button>
        </div>

      </div>
      
      {/* Estilos inline para el slider */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          background: #3d9c3a;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(61,156,58,0.5);
        }
      `}</style>
    </div>
  );
};

export default PasswordGenerator;
