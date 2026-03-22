// src/pages/Home/Home.jsx
//
// COMBINADO: tu Home AVIS original + correcciones menores de React.
//
// CAMBIOS respecto al original:
//  - stroke-width → strokeWidth  (JSX requiere camelCase)
//  - stroke-linecap → strokeLinecap
//  - stroke-linejoin → strokeLinejoin  (en el SVG del hero)
//  - Se agrega cleanup del requestAnimationFrame y el resize listener
//    en el return de useEffect para evitar memory leaks
//  - Todo lo demás es exactamente tu código original

import { useEffect }   from "react"
import { Link }        from "react-router-dom"
import Navbar          from "../../components/Navbar/Navbar"
import Footer          from "../../components/Footer/Footer"

const Home = () => {

  useEffect(() => {
    const canvas = document.getElementById("hero-canvas")
    const ctx    = canvas.getContext("2d")
    let W, H, nodes = [], RAF

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function Node() {
      this.x  = Math.random() * W
      this.y  = Math.random() * H
      this.vx = (Math.random() - 0.5) * 0.4
      this.vy = (Math.random() - 0.5) * 0.4
      this.r  = Math.random() * 2 + 1
    }

    function init() {
      resize()
      nodes = []
      const count = Math.floor((W * H) / 14000)
      for (let i = 0; i < count; i++) nodes.push(new Node())
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = "#3d9c3a"
        ctx.fill()
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(61,156,58,${1 - d / 140})`
            ctx.lineWidth   = 0.6
            ctx.stroke()
          }
        }
      }

      RAF = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      cancelAnimationFrame(RAF)
      init()
      draw()
    }

    window.addEventListener("resize", handleResize)
    init()
    draw()

    // Cleanup: evita memory leaks al desmontar el componente
    return () => {
      cancelAnimationFrame(RAF)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <Navbar />

      <section className="hero">
        <canvas id="hero-canvas"></canvas>

        <div className="hero-logo">
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
            <polygon points="60,32 80,60 60,88 40,60" fill="none" stroke="#3d9c3a" strokeWidth="2"/>
            <path d="M50 80 L60 44 L70 80" stroke="#2b2b2b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <line x1="54" y1="69" x2="66" y2="69" stroke="#3d9c3a" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="60"  cy="6"   r="3.5" fill="#3d9c3a"/>
            <circle cx="108" cy="33"  r="3.5" fill="#3d9c3a"/>
            <circle cx="108" cy="87"  r="3.5" fill="#3d9c3a"/>
            <circle cx="60"  cy="114" r="3.5" fill="#3d9c3a"/>
            <circle cx="12"  cy="87"  r="3.5" fill="#3d9c3a"/>
            <circle cx="12"  cy="33"  r="3.5" fill="#3d9c3a"/>
          </svg>
        </div>

        <h1 className="hero-title">Bienvenidos a <span>AVIS</span></h1>
        <p className="hero-sub">Gestión, Comunicación y Análisis en un Solo Lugar</p>

        <div className="hero-cta">
          <Link to="/login" className="btn-cta">Comienza Tu Idea</Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Home