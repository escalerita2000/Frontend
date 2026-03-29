// src/pages/Dashboard/Dashboard.jsx
// Recharts — colores actualizados para coincidir con la imagen de referencia

import {
  AreaChart, Area,
  BarChart,  Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie,
} from "recharts";

// ── Datos ─────────────────────────────────────────────────────────────────────
const visitasData = [
  { x: 1,  v: 80  }, { x: 2,  v: 72  }, { x: 3,  v: 78  },
  { x: 4,  v: 68  }, { x: 5,  v: 75  }, { x: 6,  v: 82  },
  { x: 7,  v: 79  }, { x: 8,  v: 90  }, { x: 9,  v: 95  },
  { x: 10, v: 92  }, { x: 11, v: 105 }, { x: 12, v: 112 },
  { x: 13, v: 108 }, { x: 14, v: 120 }, { x: 15, v: 128 },
];

const registrosData = [
  { label: "249", v: 249 },
  { label: "379", v: 379 },
  { label: "421", v: 421 },
];

const donutData = [
  { name: "No registrados", value: 27 },
  { name: "Registrados",    value: 73 },
];

const erroresData = [
  { x: 1, v: 4  }, { x: 2, v: 3  }, { x: 3, v: 5  },
  { x: 4, v: 4  }, { x: 5, v: 6  }, { x: 6, v: 5  },
  { x: 7, v: 7  }, { x: 8, v: 6  }, { x: 9, v: 8  },
  { x: 10, v: 9 }, { x: 11, v: 10 }, { x: 12, v: 12 },
];

// ── Tooltip oscuro sin fondo blanco ───────────────────────────────────────────
const DarkTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(0,0,0,0.8)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 4,
        padding: "4px 10px",
        fontSize: 11,
        color: "rgba(255,255,255,0.85)",
        fontFamily: "'Cinzel', serif",
      }}>
        {payload[0].value}
      </div>
    );
  }
  return null;
};

// ── Colores de referencia ─────────────────────────────────────────────────────
const C = {
  bgPage:      "#1c5230",   // fondo verde vivo (toda la página)
  bgCard:      "#1a4a2a",   // fondo de cada tarjeta (verde medio)
  cardBorder:  "rgba(255,255,255,0.08)",
  chartLine:   "#5abf8a",   // línea verde claro / teal
  chartFill:   "rgba(90,191,138,0.25)",
  barBase:     "#2e8b57",   // barra base
  barMid:      "#3aaa6a",   // barra media
  barTop:      "#48c878",   // barra más alta
  donutFill:   "#4aaa6a",   // sector relleno del donut
  donutEmpty:  "rgba(255,255,255,0.08)",
  labelColor:  "rgba(255,255,255,0.55)",
  valueColor:  "rgba(255,255,255,0.9)",
  titleColor:  "rgba(255,255,255,0.7)",
};

export default function Dashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

        .dash-home {
          width: 100%;
          height: 100%;
          padding: 20px 24px;
          background: ${C.bgPage};
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          animation: dashFade 0.35s ease both;
        }
        @keyframes dashFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Grid 2x2 que llena todo el espacio disponible */
        .dash-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
          min-height: 0;
        }

        /* Cada tarjeta */
        .dash-card {
          background: ${C.bgCard};
          border: 1px solid ${C.cardBorder};
          border-radius: 6px;
          padding: 16px 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
          min-height: 0;
          box-sizing: border-box;
        }

        /* Título de cada tarjeta */
        .dash-card__title {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: ${C.titleColor};
          text-transform: uppercase;
          flex-shrink: 0;
        }

        /* Área del chart — crece para llenar la tarjeta */
        .dash-card__chart {
          flex: 1;
          min-height: 0;
        }

        /* Valor grande (2.134 / 12) */
        .dash-card__value {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 700;
          color: ${C.valueColor};
          letter-spacing: 0.02em;
          flex-shrink: 0;
          line-height: 1;
        }

        /* Fila del donut */
        .dash-donut-row {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 20px;
          min-height: 0;
        }

        .dash-donut-pct {
          font-family: 'Cinzel', serif;
          font-size: 30px;
          font-weight: 700;
          color: ${C.valueColor};
          letter-spacing: 0.02em;
        }
      `}</style>

      <div className="dash-home">
        <div className="dash-grid">

          {/* ── Visitas de la página ── */}
          <div className="dash-card">
            <p className="dash-card__title">VISITAS DE LA PAGINA</p>
            <div className="dash-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitasData}
                  margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradVisitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.chartLine} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={C.chartLine} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="x" hide />
                  <YAxis hide />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="v"
                    stroke={C.chartLine} strokeWidth={2.5}
                    fill="url(#gradVisitas)"
                    dot={false}
                    activeDot={{ r: 4, fill: C.chartLine, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="dash-card__value">2.134</p>
          </div>

          {/* ── Registros de usuario ── */}
          <div className="dash-card">
            <p className="dash-card__title">REGISTROS DE USUARIO</p>
            <div className="dash-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrosData}
                  margin={{ top: 4, right: 4, left: -30, bottom: 18 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fill: C.labelColor, fontSize: 11,
                      fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="v" radius={[3, 3, 0, 0]} maxBarSize={80}>
                    <Cell fill={C.barBase}/>
                    <Cell fill={C.barMid}/>
                    <Cell fill={C.barTop}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Usuarios no registrados ── */}
          <div className="dash-card">
            <p className="dash-card__title">USUARIOS NO REGISTRADOS</p>
            <div className="dash-donut-row">
              <ResponsiveContainer width={120} height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius="52%" outerRadius="78%"
                    startAngle={90} endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill={C.donutFill}/>
                    <Cell fill={C.donutEmpty}/>
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <span className="dash-donut-pct">27%</span>
            </div>
          </div>

          {/* ── Errores de la página ── */}
          <div className="dash-card">
            <p className="dash-card__title">ERRORES DE LA PAGINA</p>
            <div className="dash-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={erroresData}
                  margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <XAxis dataKey="x" hide />
                  <YAxis hide />
                  <Tooltip content={<DarkTooltip />} />
                  <Line
                    type="monotone" dataKey="v"
                    stroke={C.chartLine} strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: C.chartLine, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="dash-card__value">12</p>
          </div>

        </div>
      </div>
    </>
  );
}